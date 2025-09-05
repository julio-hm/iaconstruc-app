import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Language, Currency, SavedProject, AllInputs, Material, CalculationType } from '../types';

// Import translations directly
import enTranslations from '../src/locales/en.json';
import esTranslations from '../src/locales/es.json';

const translationsData: { [key: string]: { [key: string]: string } } = {
  en: enTranslations,
  es: esTranslations,
};

type ProjectDataToSave = Omit<SavedProject, 'id' | 'timestamp'>;

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  savedProjects: SavedProject[];
  saveProject: (projectData: ProjectDataToSave) => void;
  deleteProject: (projectId: string) => void;
}

export const AppContext = createContext<AppContextType>({
  language: Language.EN,
  setLanguage: () => {},
  currency: Currency.USD,
  setCurrency: () => {},
  t: (key: string) => key,
  savedProjects: [],
  saveProject: () => {},
  deleteProject: () => {},
});

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  
  // Get the correct translations based on the current language
  const translations = translationsData[language] || translationsData[Language.EN];

  // Load projects from localStorage on initial render
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('quantifyEasyProjects');
      if (storedProjects) {
        setSavedProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage:", error);
    }
  }, []);

  // Persist projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('quantifyEasyProjects', JSON.stringify(savedProjects));
    } catch (error) {
      console.error("Failed to save projects to localStorage:", error);
    }
  }, [savedProjects]);

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    let translation = translations[key] || key;
    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = translation.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }
    return translation;
  }, [translations]);

  const saveProject = useCallback((projectData: ProjectDataToSave) => {
    const newProject: SavedProject = {
      ...projectData,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };
    setSavedProjects(prev => [...prev, newProject].sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    if (window.confirm(t('confirm_delete_project'))) {
        setSavedProjects(prev => prev.filter(p => p.id !== projectId));
    }
  }, [t]);

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, t, savedProjects, saveProject, deleteProject }}>
      {children}
    </AppContext.Provider>
  );
};
