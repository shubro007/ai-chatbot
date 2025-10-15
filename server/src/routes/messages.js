const express = require('express');
const router = express.Router();
const { db } = require('../services/db');
const { getRecentMessages, appendMessage } = require('../services/memory');
const { readPrompt, generateAssistantReply, summarizeConversation } = require('../services/llm');

const respondSystem = readPrompt('respondSystem.txt');
const summarizeSystem = readPrompt('summarizeSystem.txt');

function findBestFaqMatch(question, faqs) {
	const q = question.toLowerCase();
	let best = null;
	for (const f of faqs) {
		const score =
			(f.question.toLowerCase().includes(q) ? 2 : 0) +
			(f.answer.toLowerCase().includes(q) ? 1 : 0);
		if (!best || score > best.score) best = { faq: f, score };
	}
	return best && best.score > 0 ? best : null;
}

router.post('/', async (req, res) => {
	try {
		const { sessionId, text } = req.body || {};
		if (!sessionId || !text) return res.status(400).json({ error: 'sessionId and text are required' });

		const { data: session } = await db.from('sessions').select('*').eq('id', sessionId).single();
		if (!session || session.status !== 'open') return res.status(400).json({ error: 'Invalid or closed session' });

		await appendMessage(sessionId, 'user', text);
		const history = await getRecentMessages(sessionId, 20);

		const { data: faqs } = await db.from('faqs').select('*').limit(1000);
		const match = findBestFaqMatch(text, faqs || []);
		let escalated = false;
		let assistantText;

		if (match && match.score >= 2) {
			assistantText = match.faq.answer;
		} else {
			const topFaqs = (faqs || []).slice(0, 5).map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
			const userPrompt = `Customer question: ${text}\n\nRelevant FAQs:\n${topFaqs}\n\nIf helpful, use the FAQs. If unknown, say you will escalate.`;
			assistantText = await generateAssistantReply({ systemText: respondSystem, history, userText: userPrompt });
			if (/escalate|cannot answer|not sure|connect you to/i.test(assistantText)) {
				escalated = true;
				assistantText += '\n\nI have escalated your request to a human agent. You will hear back shortly.';
			}
		}

		await appendMessage(sessionId, 'assistant', assistantText);

		if ((history.length + 1) % 6 === 0) {
			const transcript = history.map(m => `${m.role}: ${m.content}`).join('\n');
			const summary = await summarizeConversation({ systemText: summarizeSystem, transcript });
			await db.from('sessions').update({ summary }).eq('id', sessionId);
		}

		return res.json({ reply: assistantText, escalated });
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

module.exports = router;

