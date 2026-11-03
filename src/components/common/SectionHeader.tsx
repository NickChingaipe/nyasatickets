import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionClick,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 ${className}`}>
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-[#faf7fc] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#9f8fa9] mt-1 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#f43f5e] hover:text-[#fb7185] transition-colors cursor-pointer group shrink-0"
        >
          <span>{actionText}</span>
          <svg 
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};
