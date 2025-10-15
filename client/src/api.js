const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export async function createSession(customerId) {
	const r = await fetch(`${API_BASE}/sessions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ customerId })
	});
	return r.json();
}

export async function sendMessage(sessionId, text) {
	const r = await fetch(`${API_BASE}/messages`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ sessionId, text })
	});
	return r.json();
}

export async function listFaqs() {
	const r = await fetch(`${API_BASE}/faqs`);
	return r.json();
}


