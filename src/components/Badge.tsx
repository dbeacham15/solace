import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  'aria-label': ariaLabel
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variantStyles = {
    primary: 'bg-healthcare-primary-100 text-healthcare-primary-800',
    secondary: 'bg-healthcare-secondary-100 text-healthcare-secondary-800',
    accent: 'bg-healthcare-accent-100 text-healthcare-accent-800',
    neutral: 'bg-healthcare-neutral-100 text-healthcare-neutral-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const Component = onClick ? 'button' : 'span';
  const clickableStyles = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${clickableStyles} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
};
