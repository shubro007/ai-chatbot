const express = require('express');
const router = express.Router();
const { db } = require('../services/db');

router.get('/', async (_req, res) => {
	try {
		const { data, error } = await db.from('faqs').select('*').order('updated_at', { ascending: false });
		if (error) return res.status(500).json({ error: error.message });
		return res.json(data || []);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

module.exports = router;

