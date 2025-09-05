import { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { CalculationType, Material, AllInputs, WallInputs, SimpleConcreteInputs, SlabInputs, FoundationInputs, BrickType, ConcreteResistance, SavedProject } from '../types';
import { INITIAL_PRICES, BRICK_TYPES, CONCRETE_RESISTANCES, MORTAR_RATIOS, SLAB_BLOCK_DIMENSIONS } from '../constants';
import { AppContext } from '../context/AppContext';

const defaultWallInputs: WallInputs = {
  area: 10,
  brickType: BrickType.RedBrick,
  blockLength: BRICK_TYPES[BrickType.RedBrick].length,
  blockHeight: BRICK_TYPES[BrickType.RedBrick].height,
  blockWidth: BRICK_TYPES[BrickType.RedBrick].width,
  jointHorizontal: 0.015,
  jointVertical: 0.015,
  mortarRatio: MORTAR_RATIOS[1], // 1:4
  brickWaste: 5,
  mortarWaste: 10,
};

const defaultSimpleConcreteInputs: SimpleConcreteInputs = {
    volume: 1,
    resistance: ConcreteResistance.R210,
    proportionCement: CONCRETE_RESISTANCES[ConcreteResistance.R210].cement,
    proportionSand: CONCRETE_RESISTANCES[ConcreteResistance.R210].sand,
    proportionGravel: CONCRETE_RESISTANCES[ConcreteResistance.R210].gravel,
    concreteWaste: 5,
};

const defaultSlabInputs: SlabInputs = {
    area: 10,
    thickness: 0.20,
    blockHeight: SLAB_BLOCK_DIMENSIONS.h15.height,
    blockLength: SLAB_BLOCK_DIMENSIONS.h15.length,
    blockWidth: SLAB_BLOCK_DIMENSIONS.h15.width,
    joistWidth: 0.10,
    concreteWaste: 8,
    steelWaste: 10,
};

const defaultFoundationInputs: FoundationInputs = {
    length: 5,
    width: 0.6,
    height: 0.8,
    resistance: ConcreteResistance.R150,
    stonePercentage: 30,
    concreteWaste: 5,
};

// Materials that should be rounded up to the nearest whole number for purchasing
const materialsToRoundUp = new Set(['brick', 'cement', 'slab_block']);


const useMaterialCalculator = (calculationType: CalculationType, projectToLoad: SavedProject | null, onProjectLoaded: () => void) => {
  const { currency, setCurrency, t } = useContext(AppContext);
  
  const initialInputs = useMemo(() => {
    switch (calculationType) {
      case CalculationType.Wall: return defaultWallInputs;
      case CalculationType.SimpleConcrete: return defaultSimpleConcreteInputs;
      case CalculationType.Slab: return defaultSlabInputs;
      case CalculationType.Foundation: return defaultFoundationInputs;
      default: return {};
    }
  }, [calculationType]);

  const [inputs, setInputs] = useState<AllInputs>(initialInputs as AllInputs);
  const [results, setResults] = useState<Material[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (projectToLoad) {
      setInputs(projectToLoad.inputs);
      setResults(projectToLoad.results);
      setCurrency(projectToLoad.currency);
      setErrors({}); // Clear any previous errors
      onProjectLoaded(); // Signal that the project has been loaded
    }
  }, [projectToLoad, setCurrency, onProjectLoaded]);


  const validateInput = useCallback((name: keyof AllInputs, value: number) => {
    if (value < 0) {
      return t('error_negative_value');
    }
    if ( (name === 'brickWaste' || name === 'mortarWaste' || name === 'concreteWaste' || name === 'steelWaste') && value > 100) {
        return t('error_waste_percentage');
    }
    if (name === 'stonePercentage' && value >= 100) {
        return t('error_stone_percentage');
    }
    return '';
  }, [t]);

  const handleInputChange = useCallback((field: keyof AllInputs, value: string | number) => {
    setInputs(prev => {
      const isNumberField = typeof (prev as any)[field] === 'number';
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      const finalValue = isNumberField && !isNaN(numValue) ? numValue : value;

      if(isNumberField && !isNaN(numValue)) {
        const errorMessage = validateInput(field, numValue);
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: errorMessage,
        }));
      } else {
         setErrors(prevErrors => {
            const newErrors = {...prevErrors};
            delete newErrors[field as string];
            return newErrors;
         });
      }

      const newInputs = { ...prev, [field]: finalValue };

      if (calculationType === CalculationType.Wall) {
        if (field === 'brickType') {
          const newBrickType = value as BrickType;
          const { length, height, width } = BRICK_TYPES[newBrickType];
          return { ...newInputs, blockLength: length, blockHeight: height, blockWidth: width };
        }
      }
      if (calculationType === CalculationType.SimpleConcrete || calculationType === CalculationType.Foundation) {
        if (field === 'resistance') {
          const newResistance = value as ConcreteResistance;
          const { cement, sand, gravel } = CONCRETE_RESISTANCES[newResistance];
          return { ...newInputs, proportionCement: cement, proportionSand: sand, proportionGravel: gravel };
        }
      }
      
      return newInputs;
    });
  }, [calculationType, validateInput]);
  

  const clearFields = useCallback(() => {
    setInputs(initialInputs as AllInputs);
    setResults([]);
    setErrors({});
  }, [initialInputs]);

  const updatePrice = useCallback((materialId: string, newPrice: number) => {
    setResults(prevResults =>
      prevResults.map(material =>
        material.id === materialId
          ? { ...material, price: newPrice, subtotal: material.quantity * newPrice }
          : material
      ).map(m => ({...m, subtotal: m.quantity * m.price}))
    );
  }, []);
  
  const calculate = useCallback(() => {
    let calculatedMaterials: Pick<Material, 'id' | 'quantity'>[] = [];
    
    switch (calculationType) {
      case CalculationType.Wall: {
        const wallInputs = inputs as WallInputs;
        const { area, blockLength, blockHeight, blockWidth, jointHorizontal, jointVertical, brickWaste, mortarWaste } = wallInputs;

        const bricksPerSqm = 1 / ((blockLength + jointVertical) * (blockHeight + jointHorizontal));
        const totalBricks = bricksPerSqm * area * (1 + brickWaste / 100);
        
        const mortarVolumePerSqm = (1 - (bricksPerSqm * blockLength * blockHeight)) * blockWidth;
        const totalMortarVolume = mortarVolumePerSqm * area * (1 + mortarWaste / 100);
        
        const cementBagsPerM3 = 9.5;
        const sandM3PerM3 = 1.05;
        const waterLitersPerM3 = 250;
        
        const totalCementBags = totalMortarVolume * cementBagsPerM3;
        const totalSandM3 = totalMortarVolume * sandM3PerM3;
        const totalWaterLiters = totalMortarVolume * waterLitersPerM3;

        calculatedMaterials = [
          { id: 'brick', quantity: totalBricks },
          { id: 'cement', quantity: totalCementBags },
          { id: 'sand', quantity: totalSandM3 },
          { id: 'water', quantity: totalWaterLiters },
        ];
        break;
      }
      case CalculationType.SimpleConcrete: {
        const concreteInputs = inputs as SimpleConcreteInputs;
        const { volume, concreteWaste } = concreteInputs;
        const { cement, sand, gravel } = CONCRETE_RESISTANCES[concreteInputs.resistance];

        const totalVolume = volume * (1 + concreteWaste / 100);
        const totalProportions = cement + sand + gravel;
        
        const cementFactor = (350 / totalProportions) * cement / 50;
        const sandFactor = (1 / totalProportions) * sand;
        const gravelFactor = (1 / totalProportions) * gravel;
        const waterFactor = 180;

        calculatedMaterials = [
            { id: 'cement', quantity: totalVolume * cementFactor },
            { id: 'sand', quantity: totalVolume * sandFactor },
            { id: 'gravel', quantity: totalVolume * gravelFactor },
            { id: 'water', quantity: totalVolume * waterFactor },
        ];
        break;
      }
      case CalculationType.Slab: {
        const slabInputs = inputs as SlabInputs;
        const { area, thickness, blockLength, blockWidth, joistWidth, concreteWaste, steelWaste } = slabInputs;
        
        const axisDistance = blockWidth + joistWidth;
        const blocksPerSqm = 1 / (axisDistance * blockLength);
        const totalBlocks = area * blocksPerSqm;
        
        const compressionLayerHeight = thickness - slabInputs.blockHeight;
        const concreteVolume = (area * compressionLayerHeight) + (area / axisDistance * joistWidth * slabInputs.blockHeight);
        const totalConcreteVolume = concreteVolume * (1 + concreteWaste / 100);

        const { cement, sand, gravel } = CONCRETE_RESISTANCES[ConcreteResistance.R210]; // Slabs usually use R210
        const totalProportions = cement + sand + gravel;
        const cementFactor = (350 / totalProportions) * cement / 50;
        const sandFactor = (1 / totalProportions) * sand;
        const gravelFactor = (1 / totalProportions) * gravel;
        const waterFactor = 180;

        const steelKgPerM3 = 80; // Aprox
        const totalSteelKg = concreteVolume * steelKgPerM3 * (1 + steelWaste / 100);

        calculatedMaterials = [
            { id: 'slab_block', quantity: totalBlocks },
            { id: 'cement', quantity: totalConcreteVolume * cementFactor },
            { id: 'sand', quantity: totalConcreteVolume * sandFactor },
            { id: 'gravel', quantity: totalConcreteVolume * gravelFactor },
            { id: 'water', quantity: totalConcreteVolume * waterFactor },
            { id: 'steel', quantity: totalSteelKg },
        ];
        break;
      }
      case CalculationType.Foundation: {
        const foundInputs = inputs as FoundationInputs;
        const { length, width, height, resistance, stonePercentage, concreteWaste } = foundInputs;
        
        const totalVolume = length * width * height;
        const concreteVolume = totalVolume * (1 - stonePercentage / 100);
        const stoneVolume = totalVolume * (stonePercentage / 100);
        
        const totalConcreteVolumeWithWaste = concreteVolume * (1 + concreteWaste / 100);

        const { cement, sand, gravel } = CONCRETE_RESISTANCES[resistance];
        const totalProportions = cement + sand + gravel;
        const cementFactor = (350 / totalProportions) * cement / 50;
        const sandFactor = (1 / totalProportions) * sand;
        const gravelFactor = (1 / totalProportions) * gravel;
        const waterFactor = 180;

        calculatedMaterials = [
            { id: 'stone', quantity: stoneVolume },
            { id: 'cement', quantity: totalConcreteVolumeWithWaste * cementFactor },
            { id: 'sand', quantity: totalConcreteVolumeWithWaste * sandFactor },
            { id: 'gravel', quantity: totalConcreteVolumeWithWaste * gravelFactor },
            { id: 'water', quantity: totalConcreteVolumeWithWaste * waterFactor },
        ];
        break;
      }
    }

    const finalResults: Material[] = calculatedMaterials.map(mat => {
      const price = INITIAL_PRICES[mat.id]?.[currency] ?? 0;
      const originalQuantity = mat.quantity;
      let finalQuantity = originalQuantity;
      let calculatedQuantity: number | undefined = undefined;

      if (materialsToRoundUp.has(mat.id)) {
        finalQuantity = Math.ceil(originalQuantity);
        if (finalQuantity !== originalQuantity) {
             calculatedQuantity = originalQuantity;
        }
      }

      return {
        id: mat.id,
        quantity: finalQuantity,
        calculatedQuantity: calculatedQuantity,
        price,
        subtotal: finalQuantity * price,
        name: t(`material_${mat.id}`),
        unit: t(`unit_${mat.id}`),
      };
    });

    setResults(finalResults);
  }, [calculationType, inputs, currency, t]);

  const totalCost = useMemo(() => {
    return results.reduce((sum, material) => sum + (material.subtotal || 0), 0);
  }, [results]);
  
  const hasErrors = useMemo(() => Object.values(errors).some(error => error !== ''), [errors]);

  return {
    inputs,
    handleInputChange,
    calculate,
    results,
    totalCost,
    clearFields,
    updatePrice,
    errors,
    hasErrors,
  };
};

export default useMaterialCalculator;