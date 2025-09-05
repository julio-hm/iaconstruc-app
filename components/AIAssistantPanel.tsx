import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import SparkleIcon from './icons/SparkleIcon';
import Button from './Button';
import { Material, AIResponse } from '../types';
import LocationPromptModal from './modals/LocationPromptModal';
import Panel from './ui/Panel';
import AnalysisInsightCard from './ai/AnalysisInsightCard';
import StoreLocationCard from './ai/StoreLocationCard';

interface AIAssistantPanelProps {
  results: Material[];
  onAnalyze: () => void;
  onFindPrices: (location: string) => void;
  onFindStores: (location: string) => void;
  aiResponse: AIResponse | null;
  isAILoading: boolean;
}

type LocationAction = 'prices' | 'stores' | null;

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ results, onAnalyze, onFindPrices, onFindStores, aiResponse, isAILoading }) => {
    const { t } = useContext(AppContext);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [locationAction, setLocationAction] = useState<LocationAction>(null);

    const handleOpenLocationModal = (action: LocationAction) => {
        setLocationAction(action);
        setIsLocationModalOpen(true);
    };

    const handleLocationSubmit = (location: string) => {
        setIsLocationModalOpen(false);
        if (locationAction === 'prices') {
            onFindPrices(location);
        } else if (locationAction === 'stores') {
            onFindStores(location);
        }
        setLocationAction(null); // Reset action
    };

    const renderContent = () => {
        if (isAILoading) {
            return (
                <div className="flex items-center justify-center gap-2 text-gray-300">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('ai_assistant_loading')}
                </div>
            );
        }
        
        if(aiResponse) {
            return (
                <div className="w-full text-left">
                    {aiResponse.analysis && (
                        <>
                            <h3 className="text-lg font-semibold text-white mb-3">{t('ai_assistant_analysis_title')}</h3>
                            <div className="space-y-3">
                                {aiResponse.analysis.map((insight, index) => (
                                    <AnalysisInsightCard key={index} insight={insight} />
                                ))}
                            </div>
                        </>
                    )}
                    {aiResponse.stores && (
                         <>
                            <h3 className="text-lg font-semibold text-white mb-3">{t('ai_assistant_stores_title')}</h3>
                            <div className="space-y-3">
                                {aiResponse.stores.map((store, index) => (
                                    <StoreLocationCard key={index} store={store} />
                                ))}
                            </div>
                        </>
                    )}
                    {aiResponse.prices && (
                         <>
                            <h3 className="text-lg font-semibold text-white mb-3">{t('ai_assistant_prices_title')}</h3>
                            <div className="bg-black/20 p-3 rounded-lg">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="py-2 pr-3 text-left font-semibold text-gray-200">{t('table_header_material')}</th>
                                            <th className="px-3 py-2 text-right font-semibold text-gray-200">{t('ai_assistant_prices_title')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {aiResponse.prices.map((price, index) => (
                                            <tr key={index} className="border-b border-white/10 last:border-b-0">
                                                <td className="py-2 pr-3">{price.materialName}</td>
                                                <td className="px-3 py-2 text-right">{price.priceRange} {price.currency}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                     {aiResponse.sources && aiResponse.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[var(--glass-border)]">
                            <h4 className="font-semibold text-xs text-gray-300 mb-2">{t('ai_assistant_sources_title')}</h4>
                            <ul className="space-y-1">
                                {aiResponse.sources.map((source, index) => (
                                    <li key={index}>
                                        <a 
                                            href={source.web.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[var(--primary-500)] hover:text-[var(--primary-600)] text-xs truncate block"
                                        >
                                           {index + 1}. {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                     {!aiResponse.analysis && !aiResponse.stores && !aiResponse.prices && (
                        <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap w-full">{aiResponse.text}</p>
                     )}
                </div>
            )
        }


        if (results.length > 0) {
            return (
                <div className="text-center">
                    <p className="text-sm text-gray-300 mb-4">{t('ai_assistant_cta')}</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Button onClick={onAnalyze} variant="primary" className="inline-flex items-center">
                            <SparkleIcon className="w-4 h-4 mr-2" />
                            {t('ai_assistant_analyze_button')}
                        </Button>
                         <Button onClick={() => handleOpenLocationModal('prices')} variant="secondary" className="inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            {t('ai_assistant_find_prices_button')}
                        </Button>
                        <Button onClick={() => handleOpenLocationModal('stores')} variant="secondary" className="inline-flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                           {t('ai_assistant_find_stores_button')}
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <p className="text-sm text-gray-400 leading-relaxed text-center">
                {t('ai_assistant_placeholder')}
            </p>
        );
    };
    
    return (
        <>
            <Panel className="min-h-[200px] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <SparkleIcon className="w-6 h-6 text-[var(--primary-500)]" />
                    <h2 className="text-2xl font-semibold text-white">{t('ai_assistant_title')}</h2>
                </div>
                <div className="flex-grow flex items-center justify-center w-full">
                    {renderContent()}
                </div>
            </Panel>
            <LocationPromptModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSubmit={handleLocationSubmit}
            />
        </>
    );
};

export default AIAssistantPanel;