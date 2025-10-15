const { db } = require('./db');

async function getRecentMessages(sessionId, limit = 12) {
	const { data, error } = await db
		.from('messages')
		.select('*')
		.eq('session_id', sessionId)
		.order('created_at', { ascending: true })
		.limit(limit);
	if (error) throw error;
	return data || [];
}

async function appendMessage(sessionId, role, content) {
	const { data, error } = await db
		.from('messages')
		.insert([{ session_id: sessionId, role, content }])
		.select('*')
		.single();
	if (error) throw error;
	return data;
}

module.exports = { getRecentMessages, appendMessage };


