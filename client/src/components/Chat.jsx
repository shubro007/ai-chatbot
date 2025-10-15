import { useEffect, useState } from 'react';
import { createSession, sendMessage, listFaqs } from '../api';
import Message from './Message';

export default function Chat() {
	const [session, setSession] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [faqs, setFaqs] = useState([]);
	const [sending, setSending] = useState(false);
	const [expandedFaq, setExpandedFaq] = useState(null);

	useEffect(() => {
		(async () => {
			const s = await createSession(null);
			setSession(s);
			const f = await listFaqs();
			setFaqs(f);
		})();
	}, []);

	async function onSend(e) {
		e.preventDefault();
		if (!input.trim() || !session || sending) return;
		setSending(true);
		const userMsg = { role: 'user', content: input };
		setMessages(prev => [...prev, userMsg]);
		setInput('');
		try {
			const res = await sendMessage(session.id, userMsg.content);
			const asstMsg = { role: 'assistant', content: res.reply };
			setMessages(prev => [...prev, asstMsg]);
		} finally {
			setSending(false);
		}
	}

	function toggleFaq(faqId) {
		setExpandedFaq(expandedFaq === faqId ? null : faqId);
	}

	return (
		<div style={{ maxWidth: 960, margin: '0 auto', padding: 16, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
			<h2>AI Customer Support</h2>
			<div style={{ display: 'flex', gap: 16 }}>
				<div style={{ flex: 2, border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, height: 520, overflowY: 'auto' }}>
					{messages.length === 0 && (
						<div style={{ color: '#64748b' }}>Ask a question to get started…</div>
					)}
					{messages.map((m, i) => <Message key={i} role={m.role} content={m.content} />)}
				</div>
				<div style={{ flex: 1 }}>
					<h4>FAQs</h4>
					<div style={{ maxHeight: 480, overflowY: 'auto' }}>
						{faqs.map(f => (
							<div key={f.id} style={{ marginBottom: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}>
								<button
									onClick={() => toggleFaq(f.id)}
									style={{
										width: '100%',
										padding: '12px',
										textAlign: 'left',
										background: 'white',
										border: 'none',
										cursor: 'pointer',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										fontWeight: 'bold',
										fontSize: 14
									}}
								>
									<span>{f.question}</span>
									<span style={{ fontSize: 18, color: '#64748b' }}>
										{expandedFaq === f.id ? '−' : '+'}
									</span>
								</button>
								{expandedFaq === f.id && (
									<div style={{
										padding: '12px',
										background: '#f8fafc',
										borderTop: '1px solid #e2e8f0',
										color: '#475569',
										fontSize: 14,
										lineHeight: 1.5
									}}>
										{f.answer}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
			<form onSubmit={onSend} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
				<input
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder="Type your message"
					style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }}
				/>
				<button type="submit" disabled={sending} style={{ padding: '10px 16px', borderRadius: 6, background: '#2563eb', color: 'white', border: 0 }}>
					{sending ? 'Sending…' : 'Send'}
				</button>
			</form>
		</div>
	);
}
