export interface TextGenerationRequest {
  text: string;
  textInfo?: string;
  templateId?: number;
  customRules?: string;
  textType?: TextType;
  settings: {
    length: number; // 1-5 scale
    languageLevel: 'A1-A2' | 'B1-B2' | 'C1-C2';
    includeAnalysis: boolean;
    includeStylistic: boolean;
  };
  sourceFile?: {
    name: string;
    type: string;
    content: string;
  };
  photoSource?: {
    dataUrl: string;
  };
  autoLookupInfo?: {
    title?: string;
    author?: string;
    year?: string;
  };
}

export interface TextGenerationResponse {
  summary: string;
  analysis?: {
    introduction: string;
    mainPart: string;
    conclusion: string;
    languageStyle: string;
  };
  stylisticDevices?: {
    name: string;
    description: string;
    examples: string[];
  }[];
  suggestions?: string[];
}

export interface TemplateDetails {
  structure: string[];
  guidelines: string[];
  examples: string[];
  timeForm: string;
}

export type LanguageLevel = 'A1-A2' | 'B1-B2' | 'C1-C2';

export type TextType = 
  | 'Inhaltsangabe' 
  | 'Charakterisierung' 
  | 'Literarische Analyse' 
  | 'Gedichtanalyse' 
  | 'Sachtextanalyse' 
  | 'Erörterung';
