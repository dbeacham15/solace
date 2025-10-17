import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-healthcare transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-healthcare-primary-600 text-white hover:bg-healthcare-primary-700 focus:ring-healthcare-primary-500 shadow-sm',
    secondary: 'bg-healthcare-secondary-600 text-white hover:bg-healthcare-secondary-700 focus:ring-healthcare-secondary-500 shadow-sm',
    outline: 'bg-white border-2 border-healthcare-primary-600 text-healthcare-primary-700 hover:bg-healthcare-primary-50 focus:ring-healthcare-primary-500',
    ghost: 'bg-transparent text-healthcare-primary-700 hover:bg-healthcare-primary-50 focus:ring-healthcare-primary-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
