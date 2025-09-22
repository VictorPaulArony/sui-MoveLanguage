import express, { json } from 'express';

import { configDotenv } from 'dotenv'
import { initiateMpesaPayment } from './daraja.js';
import { initiateB2CPayment } from './endpoints/B2CQuery.js';
configDotenv({ path: './.env' });

const app = express();
app.use(json());

// STK Push Endpoint
app.post('/api/pay', async (req, res) => {
    const { phone, amount } = req.body;

    try {
        const response = await initiateMpesaPayment(phone, amount);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// B2C Payment Endpoint
app.post('/api/b2c/pay', async (req, res) => {
    const { phone, amount } = req.body;

    try {
        const response = await initiateB2CPayment(phone, amount);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ResultURL endpoint for B2C callbac
app.post('/api/b2c/result', (req, res) => {
    console.log('B2C Result received:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

// TimeoutURL endpoint for B2C timeout
app.post('/api/b2c/timeout', (req, res) => {
    console.log('B2C Timeout received:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});