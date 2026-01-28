/**
 * Configuration for OCR-based PPTX conversion
 */

export interface OCRConfig {
  mistral: {
    apiKey: string;
    model: 'pixtral-12b-2409' | 'pixtral-large-latest';
  };
  conversion: {
    dpi: number;
    keepTempFiles: boolean;
  };
  marp: {
    size: '16:9' | '4:3';
    theme: string;
  };
}

export type ConversionStrategy = 'background' | 'hybrid' | 'reconstruction';

export const defaultConfig: OCRConfig = {
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY || '',
    model: 'pixtral-12b-2409',
  },
  conversion: {
    dpi: 300,
    keepTempFiles: false,
  },
  marp: {
    size: '16:9',
    theme: 'default',
  },
};

export function validateConfig(config: OCRConfig): void {
  if (!config.mistral.apiKey) {
    throw new Error(
      'Mistral API key is required. Set MISTRAL_API_KEY environment variable or use --api-key option.'
    );
  }

  if (config.conversion.dpi < 72 || config.conversion.dpi > 600) {
    throw new Error('DPI must be between 72 and 600');
  }
}
