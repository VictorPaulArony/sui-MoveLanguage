import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessToast = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in-right">
      <CheckCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};
export default SuccessToast;