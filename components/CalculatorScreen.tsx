

import React, { useContext, useState, useEffect } from 'react';
import { CalculationType, AllInputs, SavedProject, WallInputs, SimpleConcreteInputs, SlabInputs, FoundationInputs, AIResponse } from '../types';
import useMaterialCalculator from '../hooks/useMaterialCalculator';
import WallForm from './forms/WallForm';
import SimpleConcreteForm from './forms/SimpleConcreteForm';
import SlabForm from './forms/SlabForm';
import FoundationForm from './forms/FoundationForm';
import Button from './Button';
import ResultsTable from './ResultsTable';
import { CALCULATION_CARDS } from '../constants';
import { AppContext } from '../context/AppContext';
import WallDiagram from './diagrams/WallDiagram';
import SimpleConcreteDiagram from './diagrams/SimpleConcreteDiagram';
import SlabDiagram from './diagrams/SlabDiagram';
import FoundationDiagram from './diagrams/FoundationDiagram';
import { ReportData } from '../utils/reportGenerator';
import AIAssistantPanel from './AIAssistantPanel';
import ReportPreviewModal from './modals/ReportPreviewModal';
import * as geminiService from '../services/geminiService';
import Panel from './ui/Panel';


interface CalculatorScreenProps {
  calculationType: CalculationType;
  onBack: () => void;
  projectToLoad: SavedProject | null;
  onProjectLoaded: () => void;
}

const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ calculationType, onBack, projectToLoad, onProjectLoaded }) => {
  const { t, currency, saveProject } = useContext(AppContext);
  const {
    inputs,
    handleInputChange,
    calculate,
    results,
    totalCost,
    clearFields,
    updatePrice,
    errors,
    hasErrors,
  } = useMaterialCalculator(calculationType, projectToLoad, onProjectLoaded);

  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isReportPreviewOpen, setReportPreviewOpen] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  
  useEffect(() => {
    // Reset AI suggestion and sources whenever a new calculation is made
    setAiResponse(null);
  }, [results]);

  const currentCalc = CALCULATION_CARDS.find(c => c.type === calculationType);
  const title = currentCalc ? t(currentCalc.nameKey) : 'Calculator';
  const description = currentCalc ? t(currentCalc.descriptionKey) : '';

  const handleGenerateReport = () => {
    if (!currentCalc) return;
    
    const data: ReportData = {
      calculationName: t(currentCalc.nameKey),
      inputs: inputs as AllInputs,
      results: results,
      totalCost: totalCost,
      currency: currency,
      t: t,
      aiResponse: aiResponse,
    };
    setReportData(data);
    setReportPreviewOpen(true);
  };
  
  const handleSaveProject = () => {
    const projectName = prompt(t('project_name_prompt'));
    if (projectName) {
      saveProject({
        name: projectName,
        calculationType,
        inputs,
        results,
        totalCost,
        currency
      });
    }
  };
  
  const handleAIRequest = async (requestFn: () => Promise<AIResponse>) => {
    setIsAILoading(true);
    setAiResponse(null);
    const response = await requestFn();
    setAiResponse(response);
    setIsAILoading(false);
  };

  const handleAnalyzeResults = () => {
     if (!currentCalc) return;
     const calculationName = t(currentCalc.nameKey);
     handleAIRequest(() => geminiService.analyzeResults(calculationName, inputs, results, totalCost, currency, t));
  };

  const handleFindPrices = (location: string) => {
    handleAIRequest(() => geminiService.findOnlinePrices(results, location, currency, t));
  };

  const handleFindStores = (location: string) => {
    handleAIRequest(() => geminiService.findNearbyStores(results, location, currency, t));
  };


  const renderForm = () => {
    switch (calculationType) {
      case CalculationType.Wall:
        return <WallForm inputs={inputs as WallInputs} onChange={handleInputChange} errors={errors} />;
      case CalculationType.SimpleConcrete:
        return <SimpleConcreteForm inputs={inputs as SimpleConcreteInputs} onChange={handleInputChange} errors={errors} />;
      case CalculationType.Slab:
        return <SlabForm inputs={inputs as SlabInputs} onChange={handleInputChange} errors={errors} />;
      case CalculationType.Foundation:
        return <FoundationForm inputs={inputs as FoundationInputs} onChange={handleInputChange} errors={errors} />;
      default:
        return <p>This calculator is not yet implemented.</p>;
    }
  };
  
  const renderDiagram = () => {
    switch (calculationType) {
      case CalculationType.Wall:
        return <WallDiagram inputs={inputs as WallInputs} />;
      case CalculationType.SimpleConcrete:
        return <SimpleConcreteDiagram inputs={inputs as SimpleConcreteInputs} />;
      case CalculationType.Slab:
        return <SlabDiagram inputs={inputs as SlabInputs} />;
      case CalculationType.Foundation:
        return <FoundationDiagram inputs={inputs as FoundationInputs} />;
      default:
        return null;
    }
  }

  return (
    <>
    <div className="space-y-8">
       <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-gray-300 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveProject} variant="secondary" disabled={results.length === 0}>{t('save_project_button')}</Button>
            <Button onClick={onBack} variant="secondary">
              {t('calculator_back_button')}
            </Button>
          </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Section */}
        <Panel className="lg:col-span-2">
           <h2 className="text-2xl font-semibold mb-6 border-b border-white/20 pb-4 text-white">{t('input_data')}</h2>
           <div className="space-y-6">
            {renderForm()}
            <div className="flex items-center space-x-4 pt-6 border-t border-white/20">
              <Button onClick={calculate} variant="primary" className="flex-1" disabled={hasErrors}>{t('calculate_button')}</Button>
              <Button onClick={clearFields} variant="secondary" className="flex-1">{t('clear_button')}</Button>
            </div>
           </div>
        </Panel>
        
        {/* Output Section */}
        <div className="lg:col-span-3 space-y-8">
            <Panel>
                <h2 className="text-2xl font-semibold mb-6 border-b border-white/20 pb-4 text-white">{t('calculation_results')}</h2>
                <ResultsTable
                    results={results}
                    onPriceChange={updatePrice}
                    totalCost={totalCost}
                    onGenerateReport={handleGenerateReport}
                />
            </Panel>
             <AIAssistantPanel 
                results={results}
                onAnalyze={handleAnalyzeResults}
                onFindPrices={handleFindPrices}
                onFindStores={handleFindStores}
                aiResponse={aiResponse}
                isAILoading={isAILoading}
             />
            <Panel>
                <h2 className="text-2xl font-semibold mb-6 border-b border-white/20 pb-4 text-white">{t('visual_reference')}</h2>
                <div className="flex items-center justify-center min-h-[200px]">
                    {renderDiagram()}
                </div>
            </Panel>
        </div>
      </div>
    </div>
    {reportData && (
        <ReportPreviewModal 
            isOpen={isReportPreviewOpen}
            onClose={() => setReportPreviewOpen(false)}
            reportData={reportData}
        />
    )}
    </>
  );
};

export default CalculatorScreen;
