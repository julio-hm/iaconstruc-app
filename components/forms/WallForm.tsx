import React, { useContext } from 'react';
import { WallInputs, BrickType } from '../../types';
import Input from '../Input';
import Select from '../Select';
import { AppContext } from '../../context/AppContext';
import { MORTAR_RATIOS } from '../../constants';
import CollapsibleSection from '../ui/CollapsibleSection';

interface WallFormProps {
  inputs: WallInputs;
  onChange: (field: keyof WallInputs, value: string) => void;
  errors: Record<string, string>;
}

const WallForm: React.FC<WallFormProps> = ({ inputs, onChange, errors }) => {
  const { t } = useContext(AppContext);

  const brickTypeOptions = [
    { value: BrickType.RedBrick, label: t('brick_type_red_brick') },
    { value: BrickType.LightweightBlock, label: t('brick_type_light_block') },
    { value: BrickType.HeavyweightBlock, label: t('brick_type_heavy_block') },
  ];
  
  const mortarRatioOptions = MORTAR_RATIOS.map(ratio => ({ value: ratio, label: ratio }));

  return (
    <div className="grid grid-cols-1 gap-4">
      <CollapsibleSection title={t('wall_form_main_data')} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('wall_form_area')} unit="m²" value={inputs.area || ''} onChange={(e) => onChange('area', e.target.value)} error={errors.area} />
            <Input label={t('wall_form_brick_waste')} unit="%" value={inputs.brickWaste || ''} onChange={(e) => onChange('brickWaste', e.target.value)} error={errors.brickWaste} />
            <div className="md:col-span-2">
              <Select label={t('wall_form_brick_type')} value={inputs.brickType} options={brickTypeOptions} onChange={(e) => onChange('brickType', e.target.value)} />
            </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={t('wall_form_brick_dimensions')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('wall_form_length')} unit="m" value={inputs.blockLength || ''} onChange={(e) => onChange('blockLength', e.target.value)} readOnly />
          <Input label={t('wall_form_height')} unit="m" value={inputs.blockHeight || ''} onChange={(e) => onChange('blockHeight', e.target.value)} readOnly />
          <Input label={t('wall_form_width')} unit="m" value={inputs.blockWidth || ''} onChange={(e) => onChange('blockWidth', e.target.value)} readOnly />
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title={t('wall_form_mortar_details')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('wall_form_joint_horizontal')} unit="m" value={inputs.jointHorizontal || ''} onChange={(e) => onChange('jointHorizontal', e.target.value)} error={errors.jointHorizontal} />
          <Input label={t('wall_form_joint_vertical')} unit="m" value={inputs.jointVertical || ''} onChange={(e) => onChange('jointVertical', e.target.value)} error={errors.jointVertical} />
          <div className="md:col-span-2">
            <Select label={t('wall_form_mortar_ratio')} value={inputs.mortarRatio} options={mortarRatioOptions} onChange={(e) => onChange('mortarRatio', e.target.value)} />
          </div>
          <Input label={t('wall_form_mortar_waste')} unit="%" value={inputs.mortarWaste || ''} onChange={(e) => onChange('mortarWaste',e.target.value)} error={errors.mortarWaste} />
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default WallForm;