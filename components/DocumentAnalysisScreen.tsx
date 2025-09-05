

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Button from './Button';
import SparkleIcon from './icons/SparkleIcon';
import * as geminiService from '../services/geminiService';
import Panel from './ui/Panel';

interface DocumentAnalysisScreenProps {
  onBack: () => void;
}

const DocumentAnalysisScreen: React.FC<DocumentAnalysisScreenProps> = ({ onBack }) => {
  const { t } = useContext(AppContext);
  const [documentText, setDocumentText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError(t('document_analysis_no_text_error'));
      return;
    }
    if (!prompt.trim()) {
      setError(t('document_analysis_no_prompt_error'));
      return;
    }

    setIsLoading(true);
    setAiResponse('');
    setError('');

    const response = await geminiService.analyzeDocument(documentText, prompt, t);

    if (response.error) {
      setError(response.text);
    } else {
      setAiResponse(response.text);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('document_analysis_title')}</h1>
          <p className="text-gray-300 mt-1">{t('document_analysis_description')}</p>
        </div>
        <Button onClick={onBack} variant="secondary">
          {t('calculator_back_button')}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Column */}
        <Panel className="space-y-6 flex flex-col">
          <div className="flex-grow flex flex-col">
            <label className="block mb-2 text-sm font-medium text-gray-200">{t('document_analysis_text_label')}</label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder={t('document_analysis_text_placeholder')}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 flex-grow resize-y"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">{t('document_analysis_prompt_label')}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('document_analysis_prompt_placeholder')}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 min-h-[100px] resize-y"
            />
          </div>
          {error && <p className="text-red-400 text-sm -mt-2">{error}</p>}
          <Button onClick={handleAnalyze} disabled={isLoading} variant="primary" className="w-full inline-flex items-center justify-center">
             <SparkleIcon className="w-5 h-5 mr-2" />
             {isLoading ? t('ai_assistant_loading') : t('document_analysis_submit_button')}
          </Button>
        </Panel>

        {/* Output Column */}
        <Panel className="min-h-[400px] flex flex-col">
           <div className="flex items-center gap-3 mb-4">
                <SparkleIcon className="w-6 h-6 text-pink-300" />
                <h2 className="text-2xl font-semibold text-white">{t('ai_assistant_title')}</h2>
            </div>
            <div className="flex-grow flex items-center justify-center rounded-lg bg-black/20 p-4 relative">
                {isLoading && (
                     <div className="flex items-center justify-center gap-2 text-gray-300">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('ai_assistant_loading')}
                    </div>
                )}
                <div className="absolute top-0 left-0 w-full h-full overflow-y-auto p-2">
                  {!isLoading && aiResponse && (
                      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                  )}
                </div>
                 {!isLoading && !aiResponse && (
                     <p className="text-gray-400 text-center">{t('document_analysis_ai_placeholder')}</p>
                 )}
            </div>
        </Panel>
      </div>
    </div>
  );
};

export default DocumentAnalysisScreen;