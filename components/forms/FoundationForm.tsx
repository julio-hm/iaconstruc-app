import React, { useContext } from 'react';
import { FoundationInputs, ConcreteResistance } from '../../types';
import Input from '../Input';
import Select from '../Select';
import { AppContext } from '../../context/AppContext';
import CollapsibleSection from '../ui/CollapsibleSection';

interface FoundationFormProps {
  inputs: FoundationInputs;
  onChange: (field: keyof FoundationInputs, value: string | number) => void;
  errors: Record<string, string>;
}

const FoundationForm: React.FC<FoundationFormProps> = ({ inputs, onChange, errors }) => {
  const { t } = useContext(AppContext);

  const resistanceOptions = [
    { value: ConcreteResistance.R100, label: t('resistance_100') },
    { value: ConcreteResistance.R150, label: t('resistance_150') },
    { value: ConcreteResistance.R210, label: t('resistance_210') },
    { value: ConcreteResistance.R280, label: t('resistance_280') },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <CollapsibleSection title={t('foundation_form_main_data')} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('foundation_form_length')} unit="m" value={inputs.length || ''} onChange={(e) => onChange('length', e.target.value)} error={errors.length} />
          <Input label={t('foundation_form_width')} unit="m" value={inputs.width || ''} onChange={(e) => onChange('width', e.target.value)} error={errors.width} />
          <Input label={t('foundation_form_height')} unit="m" value={inputs.height || ''} onChange={(e) => onChange('height', e.target.value)} error={errors.height} />
          
          <div className="md:col-span-2">
            <Select label={t('concrete_form_resistance')} value={inputs.resistance} options={resistanceOptions} onChange={(e) => onChange('resistance', e.target.value)} />
          </div>

          <Input label={t('foundation_form_stone_percentage')} unit="%" value={inputs.stonePercentage || ''} onChange={(e) => onChange('stonePercentage', e.target.value)} error={errors.stonePercentage} />
          <Input label={t('concrete_form_waste')} unit="%" value={inputs.concreteWaste || ''} onChange={(e) => onChange('concreteWaste', e.target.value)} error={errors.concreteWaste} />
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default FoundationForm;