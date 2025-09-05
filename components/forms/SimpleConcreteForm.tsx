import React, { useContext } from 'react';
import { SimpleConcreteInputs, ConcreteResistance } from '../../types';
import Input from '../Input';
import Select from '../Select';
import { AppContext } from '../../context/AppContext';
import CollapsibleSection from '../ui/CollapsibleSection';

interface SimpleConcreteFormProps {
  inputs: SimpleConcreteInputs;
  onChange: (field: keyof SimpleConcreteInputs, value: string) => void;
  errors: Record<string, string>;
}

const SimpleConcreteForm: React.FC<SimpleConcreteFormProps> = ({ inputs, onChange, errors }) => {
  const { t } = useContext(AppContext);

  const resistanceOptions = [
    { value: ConcreteResistance.R100, label: t('resistance_100') },
    { value: ConcreteResistance.R150, label: t('resistance_150') },
    { value: ConcreteResistance.R210, label: t('resistance_210') },
    { value: ConcreteResistance.R280, label: t('resistance_280') },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <CollapsibleSection title={t('input_data')} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('concrete_form_volume')} unit="m³" value={inputs.volume || ''} onChange={(e) => onChange('volume', e.target.value)} error={errors.volume} />
          <Input label={t('concrete_form_waste')} unit="%" value={inputs.concreteWaste || ''} onChange={(e) => onChange('concreteWaste', e.target.value)} error={errors.concreteWaste} />
          <div className="md:col-span-2">
            <Select label={t('concrete_form_resistance')} value={inputs.resistance} options={resistanceOptions} onChange={(e) => onChange('resistance', e.target.value)} />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={t('concrete_form_mix_proportion')}>
        <p className="text-xs text-gray-300 mb-3">{t('concrete_form_mix_proportion_desc')}</p>
        <div className="grid grid-cols-3 gap-2 items-end text-center p-4 bg-black/20 rounded-lg text-white">
          <div>
            <p className="text-sm text-gray-300 mb-1">{t('concrete_form_cement')}</p>
            <span className="text-2xl font-bold">{inputs.proportionCement}</span>
          </div>
          <div className="text-2xl font-bold pb-1">:</div>
          <div>
            <p className="text-sm text-gray-300 mb-1">{t('concrete_form_sand')}</p>
            <span className="text-2xl font-bold">{inputs.proportionSand}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 items-end text-center p-4 bg-black/20 rounded-lg text-white mt-2">
            <div className="col-start-2">
              <p className="text-sm text-gray-300 mb-1">{t('concrete_form_gravel')}</p>
              <span className="text-2xl font-bold">{inputs.proportionGravel}</span>
            </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default SimpleConcreteForm;