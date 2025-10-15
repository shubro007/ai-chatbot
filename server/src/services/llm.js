const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function readPrompt(file) {
	const p = path.join(__dirname, '..', 'prompts', file);
	return fs.readFileSync(p, 'utf8');
}

async function generateAssistantReply({ systemText, history, userText }) {
	const conversation = [
		{ role: 'user', content: systemText },
		...history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content })),
		{ role: 'user', content: userText }
	];
	
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash-exp",
		contents: conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')
	});
	return response.text;
}

async function summarizeConversation({ systemText, transcript }) {
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash-exp",
		contents: `${systemText}\n\n${transcript}`
	});
	return response.text;
}

module.exports = { readPrompt, generateAssistantReply, summarizeConversation };
