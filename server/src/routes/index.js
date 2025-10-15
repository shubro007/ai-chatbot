const express = require('express');
const router = express.Router();

router.get('/health', (_req, res) => res.json({ ok: true }));

router.use('/sessions', require('./sessions'));
router.use('/messages', require('./messages'));
router.use('/faqs', require('./faqs'));

module.exports = router;

