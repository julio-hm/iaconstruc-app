

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-5 py-2.5 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-color-dark)] transition-all duration-200 disabled:opacity-50';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: `text-[var(--text-primary)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm`,
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;