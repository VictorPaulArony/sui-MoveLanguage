import { useState } from 'react';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const PACKAGE_ID = '0x7bff7cec7656378f7b4cf38c83c9f05523d3b6f1c27ce530b887d62053f94ccc';
const MODULE_NAME = 'swap1';
const FUNCTION_NAME = 'swap';
const SWAP_STATE_ID = '0xe956f406b371ff76e229b1ce435d28feedaa23cb4e55ef15911c88243887b590';

export default function Swap({ wallet }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [swapEvent, setSwapEvent] = useState(null);

  const handleSwap = async () => {
    if (!wallet?.signAndExecuteTransactionBlock) {
      alert('Wallet not connected');
      return;
    }

    setLoading(true);
    try {
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount)]);
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

      console.log("All emitted events:", result);
      setTxResult(result);

      //Parse SwapEvent from emitted events
      const emittedSwapEvent = result.events?.find(
        (e) =>
          e.type === `${PACKAGE_ID}::${MODULE_NAME}::SwapEvent`
      );

      if (emittedSwapEvent) {
        setSwapEvent(emittedSwapEvent.parsedJson);
        console.log("swap event: ", emittedSwapEvent);
      } else {
        setSwapEvent(null);
      }
    } catch (error) {
      console.error('Swap failed', error);
      alert('Swap failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Swap SUI for KSH</h2>
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Amount in SUI"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
      />
      <button
        onClick={handleSwap}
        disabled={loading || !amount}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400"
      >
        {loading ? 'Swapping...' : 'Swap Now'}
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
            {console.log("Event: ", swapEvent)}
            View on Explorer
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
