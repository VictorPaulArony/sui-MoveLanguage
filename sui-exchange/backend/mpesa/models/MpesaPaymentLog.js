import mongoose from 'mongoose';
const { Schema } = mongoose;

//mpesa payment log model
const MpesaPaymentLogSchema = new Schema({
    txDigest: { type: String, unique: true, required: true },
    mpesaTransactionId: { type: String, required: true },
    responseCode: String,
    responseDescription: String,
    resultStatus: String, //pending, mpesa_initiated, mpesa_failed, completed
    rawResponse: {type: Schema.Types.Mixed},
    createdAt: { type: Date, default: Date.now },
});

const MpesaPaymentLog = mongoose.model('MpesaPaymentLog', MpesaPaymentLogSchema);
export default MpesaPaymentLog;