import express, { json } from 'express';

import { configDotenv } from 'dotenv'
import { initiateMpesaPayment } from './daraja.js';
import { initiateB2CPayment } from './endpoints/B2CQuery.js';
configDotenv({ path: './.env' });
import cors from 'cors';

import mongoose from 'mongoose';
import MpesaPaymentLog from './models/MpesaPaymentLog.js';
import ProcessedSwap from './models/ProcessedSwap.js';

const app = express();
app.use(json());

const BACKEND_URL = process.env.BACKEND_URL;

//enable CORS for all routes (for development purposes)
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin === BACKEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
}))

// connect MongoDB
mongoose.connect(process.env.MONGODB_URI,)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


// STK Push Endpoint
app.post('/api/pay', async (req, res) => {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
        return res.status(400).json({ error: 'Phone number and amount are required' });
    }

    try {
        const response = await initiateMpesaPayment(phone, amount);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// B2C Payment Endpoint
app.post('/api/b2c/pay', async (req, res) => {
    const { phone, amountKsh, amountSui, txDigest } = req.body;

    if (!phone || !amountKsh || !txDigest || !amountSui) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // Check if already processed
        const existing = await ProcessedSwap.findOne({ txDigest });
        if (existing) {
            return res.status(400).json({ error: 'Transaction already processed' });
        }

        // Create swap record
        const newSwap = new ProcessedSwap({
            txDigest,
            phoneNumber: phone,
            amountKsh,
            amountSui,
            status: 'pending',
        });
        await newSwap.save();

        // Initiate B2C payment
        const mpesaResponse = await initiateB2CPayment(phone, amountKsh, txDigest);

        // Log Mpesa response
        const newLog = new MpesaPaymentLog({
            txDigest,
            mpesaTransactionId: mpesaResponse.TransactionID || 'N/A',
            responseCode: mpesaResponse.ResponseCode,
            responseDescription: mpesaResponse.ResponseDescription,
            resultStatus: mpesaResponse.ResponseCode === '0' ? 'mpesa_initiated' : 'mpesa_failed',
            rawResponse: mpesaResponse,
        });
        await newLog.save();

        // Update status
        const updatedStatus = (mpesaResponse.ResponseCode == '0' || mpesaResponse.Status == 'Success') ? 'mpesa_initiated' : 'mpesa_failed';
        newSwap.status = updatedStatus;
        await newSwap.save();

        return res.json({ success: true, mpesaResponse });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Phone number validation endpoint
app.post('/api/validate', async (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^254\d{9}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    return res.json({ success: true });
});

app.post('/api/validate-amount', async (req, res) => {
 const { amount } = req.body;
    if (!amount || isNaN(amount) || amount < 0.01) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
     return res.json({ success: true });
});

// ResultURL endpoint for B2C callback
app.post('/api/b2c/result', (req, res ) => {
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