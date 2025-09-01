import React from 'react';
import { Receipt, ExternalLink } from 'lucide-react';
import { FormatAddress, FormatTime } from '../utils/Helpers';

const ReceiptsTab = ({ transactions }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Swap Receipts (NFTs)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Receipt className="w-8 h-8 text-purple-400" />
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                NFT Receipt
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Amount:</span>
                <span className="text-white font-semibold">{tx.amount} SUI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Date:</span>
                <span className="text-white">{FormatTime(tx.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">TX Hash:</span>
                <span className="text-white">{FormatAddress(tx.txHash)}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReceiptsTab;