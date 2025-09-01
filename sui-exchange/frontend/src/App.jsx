import WalletConnection from './component/WalletConnection';
import Swap from './component/Swap';

import { useWallet } from "@suiet/wallet-kit";

const SuiSwapApp = () => {
   const wallet = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            SUI-KSH Swap
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Decentralized token swap on the Sui blockchain
          </p>
        </div>
          <div className="max-w-6xl mx-auto">
            <WalletConnection />
        <Swap wallet={ wallet } />
          
          </div>
      </div>
    </div>
  );
};

export default SuiSwapApp;