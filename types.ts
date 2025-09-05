export enum CalculationType {
  Wall = 'Wall',
  SimpleConcrete = 'SimpleConcrete',
  Slab = 'Slab',
  Foundation = 'Foundation',
  ImageAnalysis = 'ImageAnalysis',
  DocumentAnalysis = 'DocumentAnalysis',
  AIChat = 'AIChat',
}

export enum Language {
  EN = 'en',
  ES = 'es',
}

export enum Currency {
  USD = 'USD',
  MXN = 'MXN',
}

export enum BrickType {
  RedBrick = 'RedBrick',
  LightweightBlock = 'LightweightBlock',
  HeavyweightBlock = 'HeavyweightBlock',
}

export enum ConcreteResistance {
  R100 = '100', // kg/cm²
  R150 = '150',
  R210 = '210',
  R280 = '280',
}

export interface Material {
  id: string;
  name: string; // This will now be the translated name
  unit: string; // This will now be the translated unit
  quantity: number;
  calculatedQuantity?: number; // Store the original, pre-rounded value
  price: number;
  subtotal: number;
}

export interface WallInputs {
  area: number;
  brickType: BrickType;
  blockLength: number;
  blockHeight: number;
  blockWidth: number;
  jointHorizontal: number;
  jointVertical: number;
  mortarRatio: string; // e.g., "1:4"
  brickWaste: number;
  mortarWaste: number;
}

export interface SimpleConcreteInputs {
  volume: number;
  resistance: ConcreteResistance;
  proportionCement: number;
  proportionSand: number;
  proportionGravel: number;
  concreteWaste: number;
}

export interface SlabInputs {
    area: number;
    thickness: number;
    blockHeight: number;
    blockLength: number;
    blockWidth: number;
    joistWidth: number;
    concreteWaste: number;
    steelWaste: number;
}

export interface FoundationInputs {
    length: number;
    width: number;
    height: number;
    resistance: ConcreteResistance;
    stonePercentage: number;
    concreteWaste: number;
}


export type AllInputs = WallInputs | SimpleConcreteInputs | SlabInputs | FoundationInputs;

export interface SavedProject {
  id: string;
  name: string;
  calculationType: CalculationType;
  timestamp: number;
  inputs: AllInputs;
  results: Material[];
  totalCost: number;
  currency: Currency;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- New Types for Structured AI Responses ---

export interface Store {
  name: string;
  address: string;
  reason: string;
}

export interface PriceInfo {
  materialName: string;
  averagePrice: number;
  priceRange: string;
  currency: string;
}

export interface AnalysisInsight {
  type: 'suggestion' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface AIResponse {
    text: string; // Holds a summary or fallback text
    sources: GroundingChunk[];
    error?: string;
    analysis?: AnalysisInsight[];
    prices?: PriceInfo[];
    stores?: Store[];
}