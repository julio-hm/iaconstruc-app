
import React, { useState, useContext, useMemo } from 'react';
import { Material, Currency } from '../types';
import { AppContext } from '../context/AppContext';
import Button from './Button';

interface ResultsTableProps {
  results: Material[];
  totalCost: number;
  onPriceChange: (materialId: string, newPrice: number) => void;
  onGenerateReport: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, totalCost, onPriceChange, onGenerateReport }) => {
  const { t, currency } = useContext(AppContext);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  
  const currencySymbol = currency === Currency.USD ? '$' : 'Mex$';

  const hasRoundedItems = useMemo(() => results.some(r => r.calculatedQuantity !== undefined), [results]);

  const handleToggleRow = (materialId: string) => {
    setExpandedRowId(prevId => prevId === materialId ? null : materialId);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>{t('results_placeholder')}</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      {/* --- DESKTOP TABLE --- */}
      <div className="hidden sm:block">
        <table className="min-w-full">
          <thead className="border-b border-white/20">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">{t('table_header_material')}</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">{t('table_header_quantity')}</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">{t('table_header_unit_price')} ({currencySymbol})</th>
              <th scope="col" className="py-3.5 pl-3 pr-4 text-left text-sm font-semibold text-white sm:pr-0">{t('table_header_subtotal')} ({currencySymbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {results.map((material) => (
              <tr key={material.id}>
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">{material.name}</td>
                <td className="px-3 py-4 text-sm text-gray-200">
                  {material.calculatedQuantity !== undefined ? (
                    <span className="flex items-center gap-2">
                      <span>{material.calculatedQuantity.toFixed(2)}</span>
                      <span className="text-[var(--primary-500)] font-sans text-xs">→</span>
                      <span className="font-semibold text-white">{material.quantity.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span>{material.quantity.toFixed(2)}</span>
                  )}
                   <span className="ml-1 text-gray-300">{material.unit}</span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-300">
                  <input
                    type="number"
                    value={material.price}
                    onChange={(e) => onPriceChange(material.id, parseFloat(e.target.value) || 0)}
                    className="input-glass w-24 p-1 text-right"
                  />
                </td>
                <td className="py-4 pl-3 pr-4 text-sm text-right font-medium text-white sm:pr-0">{material.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE ACCORDION --- */}
      <div className="block sm:hidden space-y-3">
        {results.map(material => {
          const isExpanded = expandedRowId === material.id;
          return (
            <div key={material.id} className="glass-card p-0 overflow-hidden">
              <button 
                onClick={() => handleToggleRow(material.id)}
                className="w-full p-4 flex justify-between items-center text-left"
              >
                <span className="font-semibold text-white">{material.name}</span>
                <div className="flex items-center gap-3">
                    <span className="font-medium text-white">{currencySymbol}{material.subtotal.toFixed(2)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="py-3 flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">{t('table_header_quantity')}</label>
                    <div className="text-right text-sm text-gray-200">
                        {material.calculatedQuantity !== undefined ? (
                            <span className="flex items-center gap-2">
                                <span>{material.calculatedQuantity.toFixed(2)}</span>
                                <span className="text-[var(--primary-500)] font-sans text-xs">→</span>
                                <span className="font-semibold text-white">{material.quantity.toFixed(2)}</span>
                            </span>
                        ) : (
                            <span>{material.quantity.toFixed(2)}</span>
                        )}
                        <span className="ml-1 text-gray-300">{material.unit}</span>
                    </div>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <label htmlFor={`price-${material.id}`} className="text-sm font-medium text-gray-300">{t('table_header_unit_price')}</label>
                    <input
                      id={`price-${material.id}`}
                      type="number"
                      value={material.price}
                      onChange={(e) => onPriceChange(material.id, parseFloat(e.target.value) || 0)}
                      className="input-glass w-28 p-1.5 text-right"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {hasRoundedItems && (
        <p className="mt-4 text-xs text-gray-400 italic">
            {t('rounding_footnote')}
        </p>
      )}
      <div className="mt-8 pt-4 border-t border-white/20 flex justify-between items-end flex-wrap gap-4">
        <div>
          <Button onClick={onGenerateReport} disabled={results.length === 0} variant="secondary">
            {t('generate_report_button')}
          </Button>
        </div>
        <div className="text-right">
            <p className="text-sm text-gray-300">{t('total_estimated_cost')}</p>
            <p className="text-3xl font-bold text-premium">{currencySymbol}{totalCost.toFixed(2)}</p>
        </div>
      </div>
       <div className="mt-6 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg text-sm text-amber-400/90">
          <p><span className="font-bold text-amber-300">{t('disclaimer_title')}:</span> {t('disclaimer_text')}</p>
      </div>
    </div>
  );
};

export default ResultsTable;
