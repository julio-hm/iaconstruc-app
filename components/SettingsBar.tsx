

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Language, Currency } from '../types';

const SettingsBar: React.FC = () => {
  const { language, setLanguage, currency, setCurrency } = useContext(AppContext);

  const toggleButtonClasses = (isActive: boolean) => 
    `px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${
      isActive ? 'bg-[var(--accent-color)] text-white' : 'bg-transparent text-[var(--text-secondary)] hover:bg-white/10'
    }`;

  const containerClasses = "flex items-center p-1 rounded-lg";

  return (
    <div className="w-full flex justify-between items-center mb-8">
      {/* Logo */}
      <div>
        <img src="/logoBADI.png" alt="BADI Logo" className="h-8 object-contain" />
      </div>

      {/* Settings */}
      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <div 
          className={containerClasses}
          style={{ 
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
        >
          <button onClick={() => setLanguage(Language.EN)} className={toggleButtonClasses(language === Language.EN)}>
            EN
          </button>
          <button onClick={() => setLanguage(Language.ES)} className={toggleButtonClasses(language === Language.ES)}>
            ES
          </button>
        </div>
        
        {/* Currency Toggle */}
        <div 
          className={containerClasses}
          style={{ 
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
        >
          <button onClick={() => setCurrency(Currency.USD)} className={toggleButtonClasses(currency === Currency.USD)}>
            USD
          </button>
          <button onClick={() => setCurrency(Currency.MXN)} className={toggleButtonClasses(currency === Currency.MXN)}>
            MXN
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;