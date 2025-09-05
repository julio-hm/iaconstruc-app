import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Language, Currency, SavedProject, AllInputs, Material, CalculationType } from '../types';

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
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

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

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`./locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Could not load translations:", error);
        if (language !== Language.EN) {
           try {
            const fallbackResponse = await fetch(`./locales/en.json`);
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
           } catch (fallbackError) {
            console.error("Could not load fallback translations:", fallbackError);
           }
        }
      }
    };

    fetchTranslations();
  }, [language]);

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
