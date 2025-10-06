import React from 'react';

const Loader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-5 h-5', 
    large: 'w-7 h-7'
  };

  const gapClasses = {
    small: 'gap-1.5',
    medium: 'gap-2.5',
    large: 'gap-3.5'
  };

  return (
    <div className={`flex items-center justify-center h-full w-full ${className}`}>
      <div className={`flex items-center ${gapClasses[size]}`}>
        <div 
          className={`${sizeClasses[size]} rounded-full bg-dermx-teal/25 animate-pulse-dot`}
          style={{ animationDelay: '-0.3s' }}
        />
        <div 
          className={`${sizeClasses[size]} rounded-full bg-dermx-teal/25 animate-pulse-dot`}
          style={{ animationDelay: '-0.1s' }}
        />
        <div 
          className={`${sizeClasses[size]} rounded-full bg-dermx-teal/25 animate-pulse-dot`}
          style={{ animationDelay: '0.1s' }}
        />
        <div 
          className={`${sizeClasses[size]} rounded-full bg-dermx-teal/25 animate-pulse-dot`}
          style={{ animationDelay: '0.3s' }}
        />
        <div 
          className={`${sizeClasses[size]} rounded-full bg-dermx-teal/25 animate-pulse-dot`}
          style={{ animationDelay: '0.5s' }}
        />
      </div>
    </div>
  );
};

export default Loader;