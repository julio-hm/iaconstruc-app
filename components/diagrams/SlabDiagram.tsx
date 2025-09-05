
import React from 'react';

const SlabDiagram: React.FC = () => {
  return (
    <div className="p-4 bg-gray-700 rounded-lg flex justify-center items-center">
      <img 
        src="/visualizarMATERIAL.png" 
        alt="Referencia Visual de Construcción" 
        className="w-full h-auto object-contain rounded-md max-w-xs"
      />
    </div>
  );
};

export default SlabDiagram;
