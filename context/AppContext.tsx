import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Language, Currency, SavedProject } from '../types';

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

export const AppContext = createContext<AppContextType>({} as AppContextType);


export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  // Forzar idioma y moneda por defecto
  const [language, setLanguageState] = useState<Language>(Language.ES);
  const [currency, setCurrency] = useState<Currency>(Currency.MXN);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Sincronizar i18n con el estado local
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

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

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        savedProjects,
        saveProject,
        deleteProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
