import React from 'react';
import { ArrowDownUp, Copy } from 'lucide-react';
import { FormatAddress, FormatTime, CopyToClipboard } from '../utils/Helpers';

const TransactionHistory = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No transactions found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white/10 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <ArrowDownUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">Swap</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : tx.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{FormatTime(tx.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{tx.amount} SUI</p>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400 text-sm">{FormatAddress(tx.txHash)}</span>
                  <button
                    onClick={() => CopyToClipboard(tx.txHash)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TransactionHistory;