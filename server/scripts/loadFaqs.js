require('dotenv').config();
const { db } = require('../src/services/db');
const fs = require('fs');
const path = require('path');

async function main() {
	const seedPath = path.join(__dirname, 'faqs.json');
	const items = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
	
	// Clear existing FAQs first
	await db.from('faqs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
	
	// Insert new FAQs
	const { error } = await db.from('faqs').insert(items.map(it => ({
		question: it.question,
		answer: it.answer,
		tags: it.tags || []
	})));
	
	if (error) {
		console.error('FAQ insert error:', error.message);
	} else {
		console.log('FAQs loaded:', items.length);
	}
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
