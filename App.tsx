
import React from 'react';
import { CalculationType, SavedProject } from './types';
import HomeScreen from './components/HomeScreen';
import CalculatorScreen from './components/CalculatorScreen';
import SettingsBar from './components/SettingsBar';
import ImageAnalysisScreen from './components/ImageAnalysisScreen';
import DocumentAnalysisScreen from './components/DocumentAnalysisScreen';
import AIChatScreen from './components/AIChatScreen'; // Import new screen

const App: React.FC = () => {
  const [selectedCalculation, setSelectedCalculation] = React.useState<CalculationType | null>(null);
  const [projectToLoad, setProjectToLoad] = React.useState<SavedProject | null>(null);

  const handleSelectCalculation = React.useCallback((calcType: CalculationType) => {
    setProjectToLoad(null); // Ensure we're starting a new calculation
    setSelectedCalculation(calcType);
  }, []);
  
  const handleLoadProject = React.useCallback((project: SavedProject) => {
    setProjectToLoad(project);
    setSelectedCalculation(project.calculationType);
  }, []);

  const handleGoBack = React.useCallback(() => {
    setSelectedCalculation(null);
    setProjectToLoad(null);
  }, []);
  
  const handleClearLoadedProject = React.useCallback(() => {
    setProjectToLoad(null);
  }, []);

  const renderContent = () => {
    if (!selectedCalculation) {
      return <HomeScreen onSelect={handleSelectCalculation} onLoadProject={handleLoadProject} />;
    }
    
    if (selectedCalculation === CalculationType.ImageAnalysis) {
      return <ImageAnalysisScreen onBack={handleGoBack} />;
    }
    
    if (selectedCalculation === CalculationType.DocumentAnalysis) {
      return <DocumentAnalysisScreen onBack={handleGoBack} />;
    }

    if (selectedCalculation === CalculationType.AIChat) {
      return <AIChatScreen onBack={handleGoBack} />;
    }

    return (
      <CalculatorScreen
        calculationType={selectedCalculation}
        onBack={handleGoBack}
        projectToLoad={projectToLoad}
        onProjectLoaded={handleClearLoadedProject}
      />
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto relative p-4 sm:p-6 lg:p-8">
        <SettingsBar />
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;