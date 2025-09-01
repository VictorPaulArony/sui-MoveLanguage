import React from 'react';
import { TrendingUp, Wallet, Settings, Copy } from 'lucide-react';
import { CONTRACT_ADDRESS, SWAP_STATE_ID } from '../utils/Blockchain';
import { FormatAddress, CopyToClipboard } from '../utils/Helpers';

const AnalyticsTab = ({ contractState }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Contract Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{contractState.totalSwaps || 0}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Total Swaps</h3>
          <p className="text-gray-300">All-time swap count</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{contractState.lpBalance || '0'}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">LP Balance</h3>
          <p className="text-gray-300">Total SUI locked</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Settings className="w-8 h-8 text-purple-400" />
            <span className="text-sm font-mono text-white">{FormatAddress(contractState.lpAddress)}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">LP Address</h3>
          <p className="text-gray-300">Liquidity provider</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Contract Information</h3>
        <div className="bg-white/10 rounded-lg p-6 border border-white/10">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Contract Address:</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono">{FormatAddress(CONTRACT_ADDRESS)}</span>
                <button
                  onClick={() => CopyToClipboard(CONTRACT_ADDRESS)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Swap State ID:</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono">{FormatAddress(SWAP_STATE_ID)}</span>
                <button
                  onClick={() => CopyToClipboard(SWAP_STATE_ID)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsTab;