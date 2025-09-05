import { CalculationType, Currency, BrickType, ConcreteResistance } from './types';
import WallIcon from './components/icons/WallIcon';
import ConcreteIcon from './components/icons/ConcreteIcon';
import SlabIcon from './components/icons/SlabIcon';
import FoundationIcon from './components/icons/FoundationIcon';
import ImageIcon from './components/icons/ImageIcon';
import DocumentIcon from './components/icons/DocumentIcon';
import ChatIcon from './components/icons/ChatIcon';

// FIX: Added the `disabled` property to each card object to resolve the type error in HomeScreen.tsx.
// Since all calculation types are implemented, they are all set to false.
export const CALCULATION_CARDS = [
  {
    type: CalculationType.Wall,
    nameKey: 'card_wall_name',
    descriptionKey: 'card_wall_description',
    icon: WallIcon,
    disabled: false,
  },
  {
    type: CalculationType.SimpleConcrete,
    nameKey: 'card_concrete_name',
    descriptionKey: 'card_concrete_description',
    icon: ConcreteIcon,
    disabled: false,
  },
   {
    type: CalculationType.Slab,
    nameKey: 'card_slab_name',
    descriptionKey: 'card_slab_description',
    icon: SlabIcon,
    disabled: false,
  },
  {
    type: CalculationType.Foundation,
    nameKey: 'card_foundation_name',
    descriptionKey: 'card_foundation_description',
    icon: FoundationIcon,
    disabled: false,
  },
  {
    type: CalculationType.AIChat,
    nameKey: 'card_ai_chat_name',
    descriptionKey: 'card_ai_chat_description',
    icon: ChatIcon,
    disabled: false,
  },
  {
    type: CalculationType.ImageAnalysis,
    nameKey: 'card_image_analysis_name',
    descriptionKey: 'card_image_analysis_description',
    icon: ImageIcon,
    disabled: false,
  },
  {
    type: CalculationType.DocumentAnalysis,
    nameKey: 'card_document_analysis_name',
    descriptionKey: 'card_document_analysis_description',
    icon: DocumentIcon,
    disabled: false,
  },
];

export const BRICK_TYPES = {
  [BrickType.RedBrick]: { length: 0.24, height: 0.06, width: 0.12 },
  [BrickType.LightweightBlock]: { length: 0.40, height: 0.20, width: 0.15 },
  [BrickType.HeavyweightBlock]: { length: 0.40, height: 0.20, width: 0.15 },
};

export const MORTAR_RATIOS = ["1:3", "1:4", "1:5"];

export const CONCRETE_RESISTANCES = {
  [ConcreteResistance.R100]: { cement: 1, sand: 2.5, gravel: 3.5 },
  [ConcreteResistance.R150]: { cement: 1, sand: 2, gravel: 3 },
  [ConcreteResistance.R210]: { cement: 1, sand: 1.5, gravel: 2.5 },
  [ConcreteResistance.R280]: { cement: 1, sand: 1, gravel: 2 },
};

export const SLAB_BLOCK_DIMENSIONS = {
    h15: { height: 0.15, length: 0.40, width: 0.20 },
    h20: { height: 0.20, length: 0.40, width: 0.20 },
    h25: { height: 0.25, length: 0.40, width: 0.20 },
};


export const INITIAL_PRICES: { [key: string]: { [c in Currency]: number } } = {
  brick:    { USD: 0.5,  MXN: 10 },
  cement:   { USD: 10,   MXN: 200 }, // per bag
  sand:     { USD: 40,   MXN: 800 }, // per m3
  water:    { USD: 0.1,  MXN: 2 },   // per liter
  gravel:   { USD: 50,   MXN: 1000 },// per m3
  steel:    { USD: 1.5,  MXN: 30 },  // per kg
  stone:    { USD: 30,   MXN: 600 }, // per m3
  slab_block: { USD: 2,  MXN: 40 }, // per unit
};