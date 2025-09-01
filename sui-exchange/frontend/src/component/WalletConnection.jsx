import React from 'react';
import { Wallet } from 'lucide-react';
import { ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

const WalletConnection = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Connect your Sui wallet to start swapping</p>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;