import React, { useState } from "react"
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useWallet } from '@suiet/wallet-kit';

const PACKAGE_ID = '0xbd759b33812ba356760e6ffc5d8955615ac4965d7849d5ab505b60101cd12393';
const MODULE_NAME = 'contract';
const FUNCTION_NAME = 'swap';
const SWAP_STATE_ID = '0xfcb7bb07e195d50d5b18f21aa70be39af5fcefa966d1b9083d3c25450a23b2aa';

const Exchange = () => {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("SUI");
  const toCurrency = fromCurrency === "SUI" ? "KSH" : "SUI";
  const [tempMpesaNumber, setTempMpesaNumber] = useState("")
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [swapEvent, setSwapEvent] = useState(null);
  const [walletError, setWalletError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const wallet = useWallet();

  const handleSwap = async () => {
    if (!wallet.connected || !wallet.signAndExecuteTransactionBlock) {
      setWalletError("Please connect your wallet to initiate an exchange.");
      setTimeout(() => setWalletError(""), 3000);
      return;
    }
    setWalletError("");
    setLoading(true);
    try {
      // Convert SUI to MIST (smallest unit)
      const mistAmount = BigInt(Math.round(Number(amount) * 1_000_000_000));
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(mistAmount)]);
      const clock = tx.object('0x6'); // System clock object on Sui
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
        arguments: [
          tx.object(SWAP_STATE_ID),
          coin,
          clock,
        ],
      });
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
      setTxResult(result);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 6000); // Show success for 6 seconds
      //Parse SwapEvent from emitted events
      const emittedSwapEvent = result.events?.find(
        (e) =>
          e.type === `${PACKAGE_ID}::${MODULE_NAME}::SwapEvent`
      );
      if (emittedSwapEvent) {
        setSwapEvent(emittedSwapEvent.parsedJson);
      } else {
        setSwapEvent(null);
      }
      setAmount(""); // Clear input after transaction
    } catch (error) {
      console.error('Swap failed', error);
      alert('Swap failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl shadow-xl border border-blue-700">
      <h1 className="text-4xl font-bold text-white mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Exchange</h1>
      <div className="bg-white/90 rounded-xl border border-gray-200 shadow-lg p-8">
        <div className="space-y-8">
          <div>
            <label htmlFor="from-amount" className="block text-lg font-semibold mb-2 text-blue-900">You Send</label>
            <div className="flex gap-2">
              <input
                id="from-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className="input w-full px-4 py-3 rounded-lg border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="input px-4 py-3 rounded-lg border border-blue-300 bg-blue-50 text-blue-900 font-semibold"
              >
                <option value="SUI">SUI</option>
                <option value="KSH">KSH</option>
              </select>
            </div>
            {fromCurrency === "SUI" ? (
              <div className="mt-2">
              </div>
            ) : (
              <div className="mt-2">
                <input
                  type="text"
                  value={tempMpesaNumber}
                  onChange={(e) => setTempMpesaNumber(e.target.value)}
                  placeholder="254XXXXXXXXX"
                  className="input w-full px-4 py-3 rounded-lg border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
                />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="to-amount" className="block text-lg font-semibold mb-2 text-blue-900">You Receive</label>
            <div className="flex gap-2">
              <input
                id="to-amount"
                type="text"
                value={amount}
                readOnly
                placeholder="0.00"
                className="input w-full px-4 py-3 rounded-lg border border-purple-300 bg-purple-50 text-purple-900 font-semibold"
              />
              <div className="input px-4 py-3 rounded-lg border border-purple-300 bg-purple-50 text-purple-900 font-semibold flex items-center">
                {toCurrency}
              </div>
            </div>
          </div>
          <button
            onClick={handleSwap}
            disabled={loading || !amount}
            className={`w-full py-4 text-lg font-bold rounded-xl transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${amount ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white opacity-70 cursor-not-allowed'}`}
          >
            {loading ? 'Swapping...' : 'Exchange Now'}
          </button>
          {walletError && (
            <div className="mt-2 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-center font-semibold">
              {walletError}
            </div>
          )}
          {showSuccess && txResult && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded text-center">
              <p className="text-green-700 font-bold text-lg">Swap successful!</p>
              <a
                className="text-blue-700 underline font-semibold"
                href={`https://testnet.suivision.xyz/txblock/${txResult.digest}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Explorer
              </a>
            </div>
          )}
          {swapEvent && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-400 rounded">
              <h3 className="text-blue-700 font-bold mb-2">Swap Event Details:</h3>
              <p><strong>Sender:</strong> {swapEvent.sender}</p>
              <p><strong>LP Address:</strong> {swapEvent.lp_address}</p>
              <p><strong>Amount:</strong> {swapEvent.amount}</p>
              <p><strong>Timestamp:</strong> {new Date(Number(swapEvent.timestamp)).toLocaleString()}</p>
              <p><strong>Tx Digest:</strong> {swapEvent.tx_digest}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Exchange
