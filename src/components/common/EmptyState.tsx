import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onActionClick,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#160a1a]/80 border border-[#2f1435] max-w-lg mx-auto ${className}`}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#281031] border border-[#481c57] flex items-center justify-center text-[#d6b7e6] mb-4 shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-display font-semibold text-[#f5effa] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[#9f8ca7] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onActionClick && (
        <Button variant="primary" size="md" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
