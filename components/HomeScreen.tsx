

import React, { useContext } from 'react';
import { CalculationType, SavedProject } from '../types';
import { CALCULATION_CARDS } from '../constants';
import Card from './Card';
import { AppContext } from '../context/AppContext';
import Button from './Button';

interface HomeScreenProps {
  onSelect: (calcType: CalculationType) => void;
  onLoadProject: (project: SavedProject) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelect, onLoadProject }) => {
  const { t, savedProjects, deleteProject } = useContext(AppContext);

  return (
    <>
      <header className="text-center mb-12">
        <img src="/logoBADI.png" alt="BADI Logo" className="mx-auto mb-6 h-20 object-contain" />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] tracking-tight">{t('header_title')}</h1>
        <p className="text-lg text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">{t('header_subtitle')}</p>
      </header>
      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CALCULATION_CARDS.map((card) => (
            <Card
              key={card.type}
              title={t(card.nameKey)}
              description={t(card.descriptionKey)}
              Icon={card.icon}
              onClick={() => onSelect(card.type)}
              disabled={card.disabled}
            />
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--glass-border)] pb-4">{t('saved_projects_title')}</h2>
          {savedProjects.length > 0 ? (
            <ul className="space-y-4">
              {savedProjects.map(project => (
                <li 
                  key={project.id} 
                  className="p-4 rounded-lg flex items-center justify-between flex-wrap gap-4"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(var(--backdrop-blur))',
                    WebkitBackdropFilter: 'blur(var(--backdrop-blur))',
                  }}
                >
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{project.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {t(CALCULATION_CARDS.find(c => c.type === project.calculationType)?.nameKey || '')} - {new Date(project.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => onLoadProject(project)} variant="primary" className="text-xs px-3 py-1.5">{t('load_project_button')}</Button>
                    <Button onClick={() => deleteProject(project.id)} variant="secondary" className="text-xs px-3 py-1.5">{t('delete_project_button')}</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-secondary)] text-center py-4">{t('no_saved_projects')}</p>
          )}
        </div>
      </main>
       <footer className="text-center mt-16 space-y-8 text-[var(--text-secondary)] text-sm">
         <div 
            className="max-w-3xl mx-auto p-4 rounded-lg"
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <p className="font-semibold text-[var(--text-primary)] uppercase text-xs tracking-wider mb-2">{t('disclaimer_title')}</p>
            <p>{t('disclaimer_text')}</p>
        </div>
        <p>{t('footer_copy', { year: new Date().getFullYear() })}</p>
      </footer>
    </>
  );
};

export default HomeScreen;