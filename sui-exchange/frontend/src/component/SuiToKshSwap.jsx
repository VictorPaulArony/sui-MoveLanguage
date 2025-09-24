import React, { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from '@mysten/sui.js/transactions';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_NAME = import.meta.env.VITE_MODULE_NAME;
const FUNCTION_NAME = import.meta.env.VITE_FUNCTION_NAME;
const SWAP_STATE_ID = import.meta.env.VITE_SWAP_STATE_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SuiToKshSwap() {
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [txResult, setTxResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [swapEvent, setSwapEvent] = useState(null);

    const wallet = useWallet();

    const handleSwap = async () => {
        if (!wallet.connected || !wallet.signAndExecuteTransactionBlock) {
            setError("Please connect your wallet to initiate an exchange.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError("Please enter a valid amount.");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setError(null);
        setLoading(true);
        try {

            // validate phone number via backend
            const phoneValidationResponse = await fetch(`${BACKEND_URL}/api/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const phoneValidationData = await phoneValidationResponse.json();
            if (!phoneValidationResponse.ok) {
                throw new Error(phoneValidationData.error || 'Phone number validation failed');
            }
             //validate amount
            const amountValidationResponse = await fetch(`${BACKEND_URL}/api/validate-amount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: amount }),
            });

            const amountValidationData = await amountValidationResponse.json();
            if (!amountValidationResponse.ok) {
                throw new Error(amountValidationData.error || 'Amount validation failed');
            }

            // Convert SUI to MIST (smallest unit)
            const mistAmount = BigInt(Math.round(Number(amount) * 1_000_000_000));
            const tx = new TransactionBlock(); // Create a new transaction block
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(mistAmount)]); // Split the gas coin to get the amount to swap
            const clock = tx.object('0x6'); // System clock object on Sui

            // Create the move call to the swap function
            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
                arguments: [
                    tx.object(SWAP_STATE_ID),
                    coin,
                    clock,
                ],
            });
            // Sign and execute the transaction
            const result = await wallet.signAndExecuteTransactionBlock({
                transactionBlock: tx,
                options: {
                    showEffects: true,
                    showEvents: true,
                },
            });
            setTxResult(result);

            // Parse SwapEvent from emitted events
            const emittedSwapEvent = result.events?.find(
                (e) =>
                    e.type === `${PACKAGE_ID}::${MODULE_NAME}::SwapEvent`
            );
            setSwapEvent(emittedSwapEvent ? emittedSwapEvent.parsedJson : null);
            // After successful swap, initiate B2C payment
            const amountInKsh = Math.round(Number(amount) * 100); // Convert to smallest currency unit
            await initiateB2CPayment(phoneNumber, amountInKsh, amount, result.digest);

            setAmount(""); // Clear input after transaction
            setPhoneNumber("");

        } catch (error) {
            console.error('Swap failed', error);
            setError('Swap failed: ' + error.message);
            setTimeout(() => setError(""), 5000);
            setLoading(false);
            return;
        } finally {
            setLoading(false);
        }
    }

    // Function to initiate B2C payment via backend
    const initiateB2CPayment = async (phone, amountKsh, amountSui, txDigest) => {
        setLoading(true);
        try {  
            const response = await fetch(`${BACKEND_URL}/api/b2c/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone,
                    amountKsh: amountKsh,
                    amountSui: amountSui,
                    txDigest: txDigest,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Payment initiated successfully!");
                setTimeout(() => setSuccessMessage(null), 5000);
            } else {
                throw new Error(data.error || 'B2C Payment initiation failed');
            }
        } catch (error) {
            setError('B2C Payment failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">SUI to KSH Swap</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{successMessage}</div>}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount in SUI:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter amount in SUI"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone Number:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter phone number"
                />
            </div>
            <button
                onClick={handleSwap}
                disabled={loading || !amount || !phoneNumber}
                className="w-full bg-blue-500 text-white p-2 rounded"
            >
                {loading ? "Processing..." : "Swap"}
            </button>
            {txResult && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
                    <p className="text-green-700 font-semibold">Swap successful!</p>
                    <a
                        className="text-blue-700 underline"
                        href={`https://testnet.suivision.xyz/txblock/${txResult.digest}?network=testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Transaction on Sui Explorer
                    </a>
                </div>
            )}
            {swapEvent && (
                <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
                    <h3 className="text-blue-700 font-semibold mb-2">Swap Event Details:</h3>
                    <p><strong>Sender:</strong> {swapEvent.sender}</p>
                    <p><strong>LP Address:</strong> {swapEvent.lp_address}</p>
                    <p><strong>Amount:</strong> {swapEvent.amount}</p>
                    <p><strong>Timestamp:</strong> {new Date(Number(swapEvent.timestamp)).toLocaleString()}</p>
                    <p><strong>Tx Digest:</strong> {swapEvent.tx_digest}</p>
                </div>
            )}
        </div>
    );
}
