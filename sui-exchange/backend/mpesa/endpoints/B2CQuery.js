import axios from 'axios'
// import express from 'express'
import { configDotenv } from 'dotenv'
configDotenv('./.env');


const baseURL = process.env.BASE_URL;
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;


// function to get accestoken
const getAccessToken = async () => {
    try {
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const response = await axios.get(`${baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`,
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);
        throw new Error('Failed to obtain access token');
    }
};

//function to enable and iniatiate b2c payment
const initiateB2CPayment = async (phoneNumber, amount) => {
    const accessToken = await getAccessToken();

    const payload = {
        InitiatorName: process.env.INITIATOR_NAME,
        SecurityCredential: process.env.SECURITY_CREDENTIAL,
        CommandID: 'BusinessPayment', 
        Amount: amount,
        PartyA: process.env.SENDER_SHORT_CODE, 
        PartyB: phoneNumber,
        Remarks: 'B2C Payment',
        QueueTimeOutURL: process.env.TIMEOUT_URL,
        ResultURL: process.env.RESULT_URL,
        Occasion: 'TestPayout',
    };

     try {
        const response = await axios.post(`${baseURL}/mpesa/b2c/v1/paymentrequest`, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        console.log('B2C API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('B2C API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.errorMessage || 'B2C Payment failed');
    }
};

export { initiateB2CPayment };