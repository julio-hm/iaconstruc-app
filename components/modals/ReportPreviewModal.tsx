
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { ReportData } from '../../utils/reportGenerator';
import Button from '../Button';
import { downloadCsvReport, downloadPdfReport } from '../../utils/reportGenerator';
import { Currency } from '../../types';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData;
}

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ isOpen, onClose, reportData }) => {
  const { t } = useContext(AppContext);
  const { results, totalCost, currency, calculationName, aiResponse } = reportData;

  const hasRoundedItems = useMemo(() => results.some(r => r.calculatedQuantity !== undefined), [results]);

  if (!isOpen) {
    return null;
  }

  const currencySymbol = currency === Currency.USD ? '$' : 'Mex$';

  const handleDownloadCSV = () => {
    downloadCsvReport(reportData, t);
  };

  const handleDownloadPDF = () => {
    downloadPdfReport(reportData, t);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/60 border border-white/20 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">{t('report_preview_title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </header>
        
        <main className="p-6 overflow-y-auto text-gray-200">
          <h3 className="font-bold text-lg text-[var(--primary-500)]">{calculationName}</h3>
          <div className="mt-4">
             <h4 className="font-semibold text-white mb-2">{t('report_results_summary')}</h4>
             <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="border-b border-white/10">
                        <th className="py-2 pr-3 text-left font-semibold text-gray-200">{t('table_header_material')}</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-200">{t('table_header_quantity')}</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-200">{t('table_header_unit_price')}</th>
                        <th className="py-2 pl-3 text-right font-semibold text-gray-200">{t('table_header_subtotal')}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                    {results.map((material) => (
                        <tr key={material.id}>
                        <td className="py-2 pr-3 text-white">{material.name}</td>
                        <td className="px-3 py-2">
                            {material.calculatedQuantity !== undefined ? (
                                <>
                                    {material.calculatedQuantity.toFixed(2)}
                                    <span className="text-[var(--primary-500)] mx-1">→</span>
                                    {material.quantity.toFixed(2)}
                                </>
                            ) : (
                                material.quantity.toFixed(2)
                            )}
                            <span className="ml-1 text-gray-400">{material.unit}</span>
                        </td>
                        <td className="px-3 py-2 text-right">{material.price.toFixed(2)}</td>
                        <td className="py-2 pl-3 text-right font-medium text-white">{material.subtotal.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-white/20 font-bold">
                            <td colSpan={3} className="py-3 text-right text-gray-200">{t('total_estimated_cost')}</td>
                            <td className="py-3 pl-3 text-right text-lg text-premium">{currencySymbol}{totalCost.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
             </div>
             {hasRoundedItems && (
                <p className="mt-4 text-xs text-gray-400 italic">
                   * {t('rounding_footnote')}
                </p>
            )}

            {aiResponse && (
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">{t('ai_assistant_title')}</h4>
                <div className="p-3 bg-black/20 rounded-lg text-sm space-y-4 text-gray-300">
                  {aiResponse.analysis && (
                    <div>
                      <h5 className="font-bold text-gray-100 mb-2">{t('ai_assistant_analysis_title')}</h5>
                      {aiResponse.analysis.map((insight, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="font-semibold text-gray-200">{`[${insight.type.toUpperCase()}] ${insight.title}`}</p>
                          <p className="text-xs">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {aiResponse.stores && (
                     <div>
                      <h5 className="font-bold text-gray-100 mb-2">{t('ai_assistant_stores_title')}</h5>
                      {aiResponse.stores.map((store, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="font-semibold text-gray-200">{store.name}</p>
                          <p className="text-xs text-gray-400">{store.address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {aiResponse.prices && (
                     <div>
                      <h5 className="font-bold text-gray-100 mb-2">{t('ai_assistant_prices_title')}</h5>
                      {aiResponse.prices.map((price, i) => (
                        <p key={i} className="text-xs">{`${price.materialName}: ${price.priceRange} ${price.currency}`}</p>
                      ))}
                    </div>
                  )}
                   {aiResponse.sources && aiResponse.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[var(--glass-border)]">
                            <h5 className="font-semibold text-xs text-gray-300 mb-2">{t('ai_assistant_sources_title')}</h5>
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
                </div>
              </div>
            )}

             <div className="mt-6 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg text-xs text-amber-400/90">
                <p><span className="font-bold text-amber-300">{t('disclaimer_title')}:</span> {t('disclaimer_text')}</p>
            </div>
          </div>
        </main>

        <footer className="p-4 border-t border-white/10 flex justify-end items-center gap-3 flex-shrink-0">
            <Button onClick={onClose} variant="secondary">{t('close_button')}</Button>
            <Button onClick={handleDownloadCSV} variant="secondary">{t('download_csv_button')}</Button>
            <Button onClick={handleDownloadPDF} variant="primary">{t('download_pdf_button')}</Button>
        </footer>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
