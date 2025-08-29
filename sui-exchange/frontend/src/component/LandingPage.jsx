import React, { useState } from 'react';
import { ArrowRightLeft, Shield, Zap, Globe, ChevronDown, Menu, X, ArrowRight, Coins, Smartphone, TrendingUp } from 'lucide-react';


const SUIKESSwapWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sui-to-ksh');

  const features = [
    {
      icon: <ArrowRightLeft className="w-8 h-8" />,
      title: "Seamless Two-Way Exchange",
      description: "Exchange SUI tokens to KSH and vice versa with our hybrid on-chain/off-chain architecture"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Smart Contracts",
      description: "Built on SUI blockchain with AMM pricing models and comprehensive security features"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "MPESA Integration", 
      description: "Direct KSH transfers via MPESA for instant fiat settlements"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AMM Pricing",
      description: "Automated market maker ensures fair pricing based on liquidity pool reserves"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Hybrid Architecture",
      description: "Combines on-chain security with off-chain efficiency for optimal user experience"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Live transaction monitoring with event-driven off-chain triggers"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Connect Wallet",
      description: "Connect your SUI wallet to start trading"
    },
    {
      step: "2", 
      title: "Select Exchange Direction",
      description: "Choose SUI→KSH or KSH→SUI exchange"
    },
    {
      step: "3",
      title: "Execute Trade",
      description: "Smart contract handles on-chain logic, backend manages fiat transfers"
    },
    {
      step: "4",
      title: "Receive Assets",
      description: "Get your SUI tokens or KSH via MPESA instantly"
    }
  ];

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
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
            <a href="#exchange" className="text-gray-300 hover:text-white transition-colors">Exchange</a>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Launch App
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800 border-t border-slate-700">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white">How It Works</a>
              <a href="#exchange" className="block text-gray-300 hover:text-white">Exchange</a>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg">
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Bridge
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> SUI </span>
              and
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> KSH</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The first hybrid exchange enabling seamless two-way swaps between SUI tokens and Kenyan Shillings via MPESA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Start Trading Now
              </button>
              <button className="border border-gray-400 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-all">
                View Documentation
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$2.5M+</div>
              <div className="text-gray-400">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5,000+</div>
              <div className="text-gray-400">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">0.1%</div>
              <div className="text-gray-400">Trading Fee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by Innovation
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our hybrid architecture combines the security of blockchain with the convenience of traditional finance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all group">
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to bridge the gap between crypto and fiat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-600 mx-auto mt-6 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="px-6 py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Technical Architecture
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on cutting-edge technology for maximum security and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  On-Chain Smart Contract
                </h3>
                <p className="text-gray-300">
                  SUI blockchain handles token transfers, AMM pricing calculations, and liquidity pool management with full transparency and security.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Off-Chain Backend
                </h3>
                <p className="text-gray-300">
                  Secure backend service monitors blockchain events and handles MPESA integrations for seamless KSH transfers.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  AMM Pricing Model
                </h3>
                <p className="text-gray-300">
                  Constant product formula (x * y = k) ensures fair market pricing based on liquidity pool reserves.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700">
              <div className="space-y-4 text-sm font-mono">
                <div className="text-blue-400">// Smart Contract Flow</div>
                <div className="text-gray-300">
                  <span className="text-yellow-400">function</span> <span className="text-blue-300">swapSUIToKSH</span>() {"{"}
                </div>
                <div className="text-gray-300 ml-4">
                  <span className="text-purple-400">calculateKSHAmount</span>();
                </div>
                <div className="text-gray-300 ml-4">
                  <span className="text-purple-400">depositToLP</span>();
                </div>
                <div className="text-gray-300 ml-4">
                  <span className="text-purple-400">emitEvent</span>();
                </div>
                <div className="text-gray-300">{"}"}</div>
                <div className="text-green-400 mt-6">// Backend Service</div>
                <div className="text-gray-300">
                  <span className="text-yellow-400">function</span> <span className="text-blue-300">handleMPESA</span>() {"{"}
                </div>
                <div className="text-gray-300 ml-4">
                  <span className="text-purple-400">listenForEvents</span>();
                </div>
                <div className="text-gray-300 ml-4">
                  <span className="text-purple-400">sendKSHViaMPESA</span>();
                </div>
                <div className="text-gray-300">{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-12 border border-slate-700">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users already benefiting from seamless SUI-KSH exchanges
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Launch Exchange
              </button>
              <button className="border border-gray-400 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-all">
                Read Whitepaper
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