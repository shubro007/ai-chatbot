const express = require('express');
const router = express.Router();
const { db } = require('../services/db');

router.post('/', async (req, res) => {
	try {
		const { customerId, metadata } = req.body || {};
		const { data, error } = await db
			.from('sessions')
			.insert([{ customer_id: customerId || null, metadata: metadata || {}, status: 'open' }])
			.select('*')
			.single();
		if (error) return res.status(500).json({ error: error.message });
		return res.json(data);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const { data, error } = await db.from('sessions').select('*').eq('id', req.params.id).single();
		if (error || !data) return res.status(404).json({ error: 'Session not found' });
		return res.json(data);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

router.post('/:id/close', async (req, res) => {
	try {
		const { data, error } = await db
			.from('sessions')
			.update({ status: 'closed' })
			.eq('id', req.params.id)
			.select('*')
			.single();
		if (error) return res.status(500).json({ error: error.message });
		return res.json(data);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

module.exports = router;

