import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-white/10 backdrop-blur-md border border-white/20',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    solid: 'bg-white shadow-lg border border-gray-200',
  };

  return (
    <div
      className={cn(
        'rounded-xl',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};