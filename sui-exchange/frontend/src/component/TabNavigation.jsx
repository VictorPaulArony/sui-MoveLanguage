import React from 'react';
import { ArrowDownUp, Clock, Receipt, TrendingUp } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'swap', label: 'Swap', icon: ArrowDownUp },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-xl p-1 mb-8">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === id
              ? 'bg-white text-purple-600 shadow-lg transform scale-105'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
export default TabNavigation;