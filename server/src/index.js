const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

const routes = require('./routes');
app.use('/api', routes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server listening on :${port}`);
});

