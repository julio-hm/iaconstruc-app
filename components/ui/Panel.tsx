import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = '' }) => {
  const panelClasses = "p-6 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl shadow-lg";

  return (
    <div className={`${panelClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Panel;
