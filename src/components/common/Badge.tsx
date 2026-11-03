import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'plum' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'plum',
  className = '',
  icon
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    info: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    plum: 'bg-[#2d1238]/90 text-[#f1d8fd] border-[#59226f]/70',
    neutral: 'bg-[#1e0e24] text-[#bdaac9] border-[#381a42]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
