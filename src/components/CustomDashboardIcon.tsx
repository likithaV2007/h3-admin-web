import React from 'react';

export const CustomDashboardIcon = ({ size = 64, className = "" }: { size?: number | string, className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M 5 60 A 5 5 0 0 0 15 60 L 15 100 L 5 100 Z" />
      <path d="M 22 40 A 5 5 0 0 0 32 40 L 32 100 L 22 100 Z" />
      <path d="M 39 55 A 5 5 0 0 0 49 55 L 49 100 L 39 100 Z" />
      <path d="M 56 30 A 5 5 0 0 0 66 30 L 66 100 L 56 100 Z" />
      <path d="M 73 45 A 5 5 0 0 0 83 45 L 83 100 L 73 100 Z" />
      <path d="M 90 20 A 5 5 0 0 0 100 20 L 100 100 L 90 100 Z" />
    </svg>
  );
};
