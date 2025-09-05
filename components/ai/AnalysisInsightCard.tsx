
import React from 'react';
import { AnalysisInsight } from '../../types';
import InfoIcon from '../icons/InfoIcon';
import LightbulbIcon from '../icons/LightbulbIcon';
import WarningIcon from '../icons/WarningIcon';

interface AnalysisInsightCardProps {
  insight: AnalysisInsight;
}

const InsightIcon: React.FC<{ type: AnalysisInsight['type'] }> = ({ type }) => {
  const iconClasses = "w-5 h-5 flex-shrink-0";
  switch (type) {
    case 'suggestion':
      return <LightbulbIcon className={`${iconClasses} text-yellow-300`} />;
    case 'warning':
      return <WarningIcon className={`${iconClasses} text-red-400`} />;
    case 'info':
      return <InfoIcon className={`${iconClasses} text-blue-300`} />;
    default:
      return null;
  }
};

const AnalysisInsightCard: React.FC<AnalysisInsightCardProps> = ({ insight }) => {
  const typeClasses: Record<AnalysisInsight['type'], string> = {
      suggestion: 'bg-yellow-900/20 border-yellow-500/30',
      warning: 'bg-red-900/20 border-red-500/30',
      info: 'bg-blue-900/20 border-blue-500/30',
  }

  return (
    <div className={`p-3 rounded-lg flex items-start gap-3 border ${typeClasses[insight.type]}`}>
      <InsightIcon type={insight.type} />
      <div>
        <h4 className="font-semibold text-sm text-white">{insight.title}</h4>
        <p className="text-xs text-gray-300 mt-1">{insight.description}</p>
      </div>
    </div>
  );
};

export default AnalysisInsightCard;
