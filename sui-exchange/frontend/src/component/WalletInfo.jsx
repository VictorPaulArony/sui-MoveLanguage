import React from 'react';
import { Wallet, Copy } from 'lucide-react';
import { FormatAddress, CopyToClipboard } from '../utils/Helpers';

const WalletInfo = ({ 
  walletAddress, 
  suiBalance, 
  contractState 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold">{FormatAddress(walletAddress)}</span>
              <button
                onClick={() => CopyToClipboard(walletAddress)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-300">Balance: {suiBalance} SUI</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{contractState.totalSwaps || 0}</p>
            <p className="text-gray-300 text-sm">Total Swaps</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{contractState.lpBalance || '0'}</p>
            <p className="text-gray-300 text-sm">LP Balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WalletInfo;