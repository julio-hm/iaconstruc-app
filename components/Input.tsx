
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, unit, error, ...props }) => {
  const baseInputClasses = `
    bg-[var(--glass-bg)] 
    border border-[var(--glass-border)] 
    text-[var(--text-primary)] 
    text-sm rounded-lg 
    block w-full p-2.5 
    focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] focus:ring-offset-[var(--bg-color-dark)] focus:outline-none
    transition-all duration-300
    backdrop-blur-sm
  `;

  const errorClasses = error ? 'border-red-500/50' : '';

  return (
    <div className="relative">
      <label className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      <div className="flex items-center">
        <input
          type="number"
          className={`${baseInputClasses} ${unit ? 'pr-12' : ''} ${errorClasses}`}
          {...props}
        />
        {unit && <span className="absolute right-3 text-[var(--text-secondary)] text-sm">{unit}</span>}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;