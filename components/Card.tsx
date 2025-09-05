

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

interface CardProps {
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({ title, description, Icon, onClick, disabled = false }) => {
  const { t } = useContext(AppContext);
  
  const handleOnClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className={`glass-card p-6 flex flex-col items-center text-center space-y-4 group ${
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'cursor-pointer'
      }`}
    >
      <div 
        className="p-3 rounded-lg transition-colors duration-200 group-hover:bg-white/10"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <Icon className="w-8 h-8 text-[var(--primary-500)]" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-[var(--text-secondary)] mt-1">{description}</p>
      </div>
       {disabled && <span className="text-xs font-semibold text-[var(--text-secondary)] mt-2">{t('coming_soon')}</span>}
    </div>
  );
};

export default Card;