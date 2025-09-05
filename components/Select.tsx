
import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
}

const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  const selectClasses = `
    bg-[var(--glass-bg)] 
    border border-[var(--glass-border)] 
    text-[var(--text-primary)] 
    text-sm rounded-lg 
    block w-full p-2.5 
    focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] focus:ring-offset-[var(--bg-color-dark)] focus:outline-none
    transition-all duration-300
    backdrop-blur-sm
  `;

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      <select
        className={selectClasses}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} style={{ backgroundColor: 'var(--bg-color-dark)', color: 'var(--text-primary)' }}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;