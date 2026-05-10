import React from 'react';

export const SociIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <circle cx="50" cy="55" r="35" fill="#4B90F2" />
    <path d="M50 20C30.67 20 15 35.67 15 55C15 74.33 30.67 90 50 90C69.33 90 85 74.33 85 55C85 35.67 69.33 20 50 20Z" fill="#3B82F6" />
    
    {/* Belly */}
    <circle cx="50" cy="65" r="20" fill="white" fillOpacity="0.2" />
    
    {/* Mask Pattern */}
    <path d="M30 45C30 40 38 38 50 38C62 38 70 40 70 45C70 50 62 55 50 55C38 55 30 50 30 45Z" fill="white" fillOpacity="0.9" />
    
    {/* Eyes */}
    <circle cx="40" cy="45" r="4" fill="#1E293B" />
    <circle cx="60" cy="45" r="4" fill="#1E293B" />
    
    {/* Beak */}
    <path d="M47 50L50 55L53 50H47Z" fill="#FBBF24" />
    
    {/* Hat */}
    <rect x="35" y="15" width="30" height="10" rx="4" fill="#1E3A8A" />
    <path d="M40 15V10C40 8 42 7 44 7H56C58 7 60 8 60 10V15H40Z" fill="#1E40AF" />
    
    {/* Wings */}
    <path d="M15 55C5 55 2 45 10 40L15 48V55Z" fill="#3B82F6" />
    <path d="M85 55C95 55 98 45 90 40L85 48V55Z" fill="#3B82F6" />
    
    {/* Hoodie Details */}
    <circle cx="50" cy="70" r="8" fill="white" fillOpacity="0.1" />
    <path d="M48 68L50 72L52 68" stroke="white" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const HarmoIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <circle cx="50" cy="55" r="35" fill="#F472B6" />
    <path d="M50 20C30.67 20 15 35.67 15 55C15 74.33 30.67 90 50 90C69.33 90 85 74.33 85 55C85 35.67 69.33 20 50 20Z" fill="#EC4899" />
    
    {/* Belly */}
    <circle cx="50" cy="65" r="22" fill="white" fillOpacity="0.3" />
    
    {/* Eyes */}
    <circle cx="40" cy="45" r="6" fill="#1E293B" />
    <circle cx="60" cy="45" r="6" fill="#1E293B" />
    <circle cx="42" cy="43" r="2" fill="white" />
    <circle cx="62" cy="43" r="2" fill="white" />
    
    {/* Beak */}
    <path d="M47 50L50 56L53 50H47Z" fill="#FBBF24" />
    
    {/* Bow */}
    <path d="M65 25C70 25 72 30 70 33C68 36 65 35 65 35V25Z" fill="#DB2777" />
    <path d="M65 25C60 25 58 30 60 33C62 36 65 35 65 35V25Z" fill="#DB2777" />
    <circle cx="65" cy="30" r="3" fill="#BE185D" />
    
    {/* Wings */}
    <path d="M15 55C5 55 2 65 10 70L15 62V55Z" fill="#F472B6" />
    <path d="M85 55C95 55 98 65 90 70L85 62V55Z" fill="#F472B6" />
    
    {/* Details */}
    <path d="M45 68C45 68 47 72 50 72C53 72 55 68 55 68" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <HeartIcon size={10} className="text-white fill-current absolute" />
  </svg>
);

const HeartIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
);
