//swap records model
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProcessedSwapSchema = new Schema({
    txDigest: { type: String, unique: true, required: true },
    phoneNumber: { type: String, required: true },
    amountKsh: { type: Number, required: true },
    amountSui: { type: String, required: true },
    swapEvent: { type: Schema.Types.Mixed, default: null },
    status: { type: String, enum: ['pending', 'mpesa_initiated', 'mpesa_failed', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const ProcessedSwap = mongoose.model('ProcessedSwap', ProcessedSwapSchema);
export default ProcessedSwap;
