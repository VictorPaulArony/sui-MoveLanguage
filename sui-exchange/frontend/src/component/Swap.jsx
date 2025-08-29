import React, { useState } from 'react';
import { ArrowRightLeft, ChevronDown, Coins } from 'lucide-react';


const SUIKESSwapWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sui-to-ksh');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SUI-KES</span>
          </div>
        </div>
      </nav>

      {/* Exchange Preview */}
      <section id="exchange" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Experience The Exchange</h2>
            <p className="text-xl text-gray-300">Simple, secure, and lightning-fast swaps</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
            <div className="flex justify-center mb-6">
              <div className="bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('sui-to-ksh')}
                  className={`px-6 py-2 rounded-md transition-all ${activeTab === 'sui-to-ksh' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'}`}
                >
                  SUI → KSH
                </button>
                <button
                  onClick={() => setActiveTab('ksh-to-sui')}
                  className={`px-6 py-2 rounded-md transition-all ${activeTab === 'ksh-to-sui' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'}`}
                >
                  KSH → SUI
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">You Pay</span>
                  <span className="text-gray-400">Balance: 1,234.56</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="bg-transparent text-white text-2xl font-semibold flex-1 outline-none"
                  />
                  <div className="flex items-center space-x-2 bg-slate-600 px-4 py-2 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <span className="text-white font-semibold">
                      {activeTab === 'sui-to-ksh' ? 'SUI' : 'KSH'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 transition-colors">
                  <ArrowRightLeft className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">You Receive</span>
                  <span className="text-gray-400">≈ $125.50</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="bg-transparent text-white text-2xl font-semibold flex-1 outline-none"
                    readOnly
                  />
                  <div className="flex items-center space-x-2 bg-slate-600 px-4 py-2 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    <span className="text-white font-semibold">
                      {activeTab === 'sui-to-ksh' ? 'KSH' : 'SUI'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-400 text-sm">
                1 SUI = 125.45 KSH • Fee: 0.1% • Slippage: 0.5%
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                {activeTab === 'sui-to-ksh' ? 'Swap SUI for KSH' : 'Swap KSH for SUI'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SUI-KES</span>
              </div>
              <p className="text-gray-400">
                The future of hybrid crypto-fiat exchanges, bridging SUI and KSH seamlessly.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Exchange</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liquidity</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SUI-KES Swap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SUIKESSwapWebsite;