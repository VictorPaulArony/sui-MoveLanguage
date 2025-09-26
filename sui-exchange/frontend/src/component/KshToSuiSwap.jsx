import React, { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from '@mysten/sui.js/transactions';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_NAME = import.meta.env.VITE_MODULE_NAME;
const FUNCTION_NAME_KSH_TO_SUI = import.meta.env.VITE_FUNCTION_NAME_KSH_TO_SUI;
const SWAP_STATE_ID = import.meta.env.VITE_SWAP_STATE_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function KshToSuiSwap() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [suiAddress, setSuiAddress] = useState("");
    const [amountKsh, setAmountKsh] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // ✅ Moved here
    const { signAndExecuteTransactionBlock, connected } = useWallet();

    const handleSwap = async () => {
        setError(null);
        setSuccessMessage(null);

        if (!phoneNumber || !amountKsh || !suiAddress) {
            setError("Please fill in all fields.");
            return;
        }

        const amountNum = Number(amountKsh);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError("Please enter a valid amount in KSH.");
            return;
        }

        if (!connected) {
            setError("Please connect your SUI wallet.");
            return;
        }

        setLoading(true);
        try {
            console.log("Initiating STK Push for phone:", phoneNumber, "amount KSH:", amountKsh, "to SUI address:", suiAddress);
            // Send M-Pesa STK push
            const response = await fetch(`${BACKEND_URL}/api/pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    amount: amountKsh,
                    suiAddress,
                }),
            });
            console.log("STK Push response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                throw new Error(data.error || "Payment failed.");
            }

            // STK push was successful (user still needs to approve on their phone)
            setSuccessMessage("STK Push sent! Complete it on your phone to receive SUI.");

            // You may want to wait for backend confirmation (webhook or polling)
            // For now, proceed immediately with on-chain call

            const amountSui = Number(amountKsh) / 100;
            const amountMist = BigInt(Math.round(amountSui * 1_000_000_000));

            const tx = new TransactionBlock();
            const clock = tx.object("0x6");
            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME_KSH_TO_SUI}`,
                arguments: [
                    tx.object(SWAP_STATE_ID),
                    tx.pure(suiAddress),
                    tx.pure(String(amountMist)),
                    clock,
                ],
            });

            const result = await signAndExecuteTransactionBlock({
                transactionBlock: tx,
                options: {
                    showEffects: true,
                    showEvents: true,
                },
            });

            console.log("On-chain result:", result);
            setSuccessMessage("KSH payment complete. SUI sent to your wallet!");

        } catch (err) {
            console.error("Error:", err);
            const errorMessage = err?.message || JSON.stringify(err) || "Something went wrong";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Swap KSH to SUI</h2>

            {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{successMessage}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone Number (M-Pesa):</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="07XXXXXXXX"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your SUI Wallet Address:</label>
                <input
                    type="text"
                    value={suiAddress}
                    onChange={(e) => setSuiAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="0x..."
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount in KSH:</label>
                <input
                    type="number"
                    value={amountKsh}
                    onChange={(e) => setAmountKsh(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter amount in KSH"
                />
            </div>

            <button
                onClick={handleSwap}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded"
            >
                {loading ? "Processing..." : "Swap KSH → SUI"}
            </button>
        </div>
    );
}
