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

    const session = await mongoose.startSession();
    try {
        let mpesaResponse;
        await session.withTransaction(async () => {
            //check if the digest already processed
            const existing = await ProcessedSwap.findOne({ txDigest }).session(session);
            if (existing) {
                throw new Error('Transaction already processed');
            }

            //creaate a reacord in processed swaps
            const newSwap = new ProcessedSwap({
                txDigest,
                phoneNumber: phone,
                amountKsh,
                amountSui,
                status: 'pending',
            });
            await newSwap.save({ session });

            //initiate b2c payment
            mpesaResponse = await initiateB2CPayment(phone, amountKsh, txDigest);

            //log the mpesa response
            const newLog = new MpesaPaymentLog({
                txDigest,
                mpesaTransactionId: mpesaResponse.TransactionID || 'N/A',
                responseCode: mpesaResponse.ResponseCode,
                responseDescription: mpesaResponse.ResponseDescription,
                resultStatus: mpesaResponse.ResponseCode === '0' ? 'mpesa_initiated' : 'mpesa_failed',
                rawResponse: mpesaResponse,
            });
            await newLog.save({ session });

            //update the processed swap status
            const updatedStatus = (mpesaResponse.ResponseCode == '0' || mpesaResponse.Status == 'Success') ? 'mpesa_initiated' : 'mpesa_failed';
            newSwap.status = updatedStatus;
            await newSwap.save({ session });
        });

        return res.json({ success: true, mpesaResponse });
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
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