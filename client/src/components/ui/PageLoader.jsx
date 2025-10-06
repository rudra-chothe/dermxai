import React from 'react';
import Loader from './Loader';

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="text-center">
        {/* Logo or Brand */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dermx-teal mb-2">DermX-AI</h1>
          <p className="text-gray-600">Intelligent Dermatology Analysis</p>
        </div>
        
        {/* Loader */}
        <div className="mb-6">
          <Loader size="large" />
        </div>
        
        {/* Loading Message */}
        <p className="text-gray-700 text-lg font-medium">{message}</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your experience</p>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-dermx-teal/5 rounded-full animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-dermx-lavender/5 rounded-full animate-float-reverse"></div>
      </div>
    </div>
  );
};

export default PageLoader;