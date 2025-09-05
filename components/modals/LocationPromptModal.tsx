

import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Button from '../Button';

interface LocationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (location: string) => void;
}

const LocationPromptModal: React.FC<LocationPromptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useContext(AppContext);
  const [location, setLocation] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSubmit(location.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/60 border border-white/20 rounded-2xl w-full max-w-md backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <header className="p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">{t('location_modal_title')}</h2>
          </header>
          
          <main className="p-6">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('location_modal_placeholder')}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
              autoFocus
            />
          </main>

          <footer className="p-4 border-t border-white/10 flex justify-end items-center gap-3">
              <Button type="button" onClick={onClose} variant="secondary">{t('close_button')}</Button>
              <Button type="submit" variant="primary" disabled={!location.trim()}>{t('location_modal_submit_button')}</Button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default LocationPromptModal;