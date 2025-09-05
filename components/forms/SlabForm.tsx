import React, { useContext } from 'react';
import { SlabInputs } from '../../types';
import Input from '../Input';
import { AppContext } from '../../context/AppContext';
import CollapsibleSection from '../ui/CollapsibleSection';

interface SlabFormProps {
  inputs: SlabInputs;
  onChange: (field: keyof SlabInputs, value: string | number) => void;
  errors: Record<string, string>;
}

const SlabForm: React.FC<SlabFormProps> = ({ inputs, onChange, errors }) => {
  const { t } = useContext(AppContext);

  return (
    <div className="grid grid-cols-1 gap-4">
      <CollapsibleSection title={t('slab_form_main_data')} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('slab_form_area')} unit="m²" value={inputs.area || ''} onChange={(e) => onChange('area', e.target.value)} error={errors.area} />
          <Input label={t('slab_form_thickness')} unit="m" value={inputs.thickness || ''} onChange={(e) => onChange('thickness', e.target.value)} error={errors.thickness} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={t('slab_form_block_dims')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('wall_form_length')} unit="m" value={inputs.blockLength || ''} onChange={(e) => onChange('blockLength', e.target.value)} error={errors.blockLength} />
          <Input label={t('wall_form_height')} unit="m" value={inputs.blockHeight || ''} onChange={(e) => onChange('blockHeight', e.target.value)} error={errors.blockHeight} />
          <Input label={t('wall_form_width')} unit="m" value={inputs.blockWidth || ''} onChange={(e) => onChange('blockWidth', e.target.value)} error={errors.blockWidth} />
          <Input label={t('slab_form_joist_width')} unit="m" value={inputs.joistWidth || ''} onChange={(e) => onChange('joistWidth', e.target.value)} error={errors.joistWidth} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={t('table_header_waste')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('slab_form_concrete_waste')} unit="%" value={inputs.concreteWaste || ''} onChange={(e) => onChange('concreteWaste', e.target.value)} error={errors.concreteWaste} />
          <Input label={t('slab_form_steel_waste')} unit="%" value={inputs.steelWaste || ''} onChange={(e) => onChange('steelWaste', e.target.value)} error={errors.steelWaste} />
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default SlabForm;