import React from 'react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer select-none group ${className}`}
      title="NyasaTickets — Malawi's Event Discovery & Ticketing"
    >
      {/* Brand Icon: Ticket Stub with Rising Sun Rays */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#9f1239] via-[#831843] to-[#4c0519] flex items-center justify-center p-2 shadow-lg shadow-[#831843]/20 border border-[#f43f5e]/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 text-white"
        >
          {/* Ticket Body with notches */}
          <path d="M2 9a3 3 0 0 1 0 6v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a3 3 0 0 1 0-6V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
          {/* Rising Sun Rays inside Ticket */}
          <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.9" />
          <path d="M12 7v1" />
          <path d="M12 16v1" />
          <path d="M7 12h1" />
          <path d="M16 12h1" />
        </svg>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#f43f5e] ring-2 ring-[#120716]" />
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-tight overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Nyasa<span className="text-[#f43f5e]">Tickets</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-medium tracking-wider text-[#9f8ca8]">
            Malawi Live Events
          </span>
        </div>
      )}
    </div>
  );
};
