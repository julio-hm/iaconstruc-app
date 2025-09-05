

import { AllInputs, Material, Currency, AIResponse } from '../types';

// Helper to call our backend API route
async function callApi(action: string, payload: any): Promise<any> {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: 'Failed to parse error response' }));
        console.error("API Error:", errorData);
        throw new Error(errorData.details || 'An unknown API error occurred');
    }

    return response.json();
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
};


export const analyzeResults = async (
    calculationName: string,
    inputs: AllInputs,
    results: Material[],
    totalCost: number,
    currency: Currency,
    t: (key: string, options?: { [key: string]: string | number }) => string
): Promise<AIResponse> => {
    try {
        const analysis = await callApi('analyzeResults', { 
            calculationName, inputs, results, totalCost, currency, 
            t: { ai_prompt_calculation_analysis: t('ai_prompt_calculation_analysis', { language: t('lang_name'), calculationType: calculationName, currency, inputs: JSON.stringify(inputs, null, 2), results: JSON.stringify(results.map(({name, quantity, unit}) => ({name, quantity, unit})), null, 2), totalCost: totalCost.toFixed(2) }) }
        });
        return { analysis, text: t('ai_assistant_summary_received'), sources: [] };
    } catch (error) {
        return { text: `${t('ai_assistant_generic_error')}\n\nDetails: ${error instanceof Error ? error.message : String(error)}`, sources: [], error: (error as Error).message };
    }
};

export const findOnlinePrices = async (
    results: Material[],
    location: string,
    currency: Currency,
    t: (key: string, options?: { [key: string]: string | number }) => string
): Promise<AIResponse> => {
    try {
        const materialsList = results.map(r => `${r.name} (${r.quantity.toFixed(2)} ${r.unit})`).join(', ');
        const prices = await callApi('findOnlinePrices', {
            results,
            location,
            currency,
            t: { ai_prompt_price_search: t('ai_prompt_price_search', { language: t('lang_name'), currency, materials: materialsList, location }) }
        });
        return { prices, text: t('ai_assistant_summary_received'), sources: [] };
    } catch (error) {
        return { text: `${t('ai_assistant_generic_error')}\n\nDetails: ${error instanceof Error ? error.message : String(error)}`, sources: [], error: (error as Error).message };
    }
};

export const findNearbyStores = async (
    results: Material[],
    location: string,
    currency: Currency,
    t: (key: string, options?: { [key: string]: string | number }) => string
): Promise<AIResponse> => {
    try {
        const materialsList = results.map(r => r.name).join(', ');
        const stores = await callApi('findNearbyStores', {
            results,
            location,
            currency,
            t: { 
                ai_prompt_store_search: t('ai_prompt_store_search'),
                lang_name: t('lang_name')
            }
        });
        return { stores, text: t('ai_assistant_summary_received'), sources: [] };
    } catch (error) {
        return { text: `${t('ai_assistant_generic_error')}\n\nDetails: ${error instanceof Error ? error.message : String(error)}`, sources: [], error: (error as Error).message };
    }
};

export const analyzeImage = async (
    imageFile: File,
    prompt: string,
    t: (key: string) => string
): Promise<AIResponse> => {
    try {
        const imageBase64 = await fileToBase64(imageFile);
        const response = await callApi('analyzeImage', { 
            imageBase64, 
            mimeType: imageFile.type, 
            prompt, 
            t: { lang_name: t('lang_name') } // Pass the language name
        });
        return { text: response.text || '', sources: [] };
    } catch (error) {
        return { text: `${t('ai_assistant_generic_error')}\n\nDetails: ${error instanceof Error ? error.message : String(error)}`, sources: [], error: (error as Error).message };
    }
};

export const analyzeDocument = async (
    documentText: string,
    prompt: string,
    t: (key: string, options?: { [key: string]: string | number }) => string
): Promise<AIResponse> => {
    try {
        const response = await callApi('analyzeDocument', { 
            documentText, 
            prompt, 
            t: { ai_prompt_document_analysis: t('ai_prompt_document_analysis', { language: t('lang_name') }) }
        });
        return { text: response.text || '', sources: [] };
    } catch (error) {
        return { text: `${t('ai_assistant_generic_error')}\n\nDetails: ${error instanceof Error ? error.message : String(error)}`, sources: [], error: (error as Error).message };
    }
};

// Chat is more complex due to state (history). 
// This is a simplified example of how you might adapt it.
export const sendChatMessage = async (
    history: any[], 
    message: string, 
    t: (key: string, options?: { [key: string]: any }) => string
): Promise<AIResponse> => {
     try {
        const response = await callApi('chat', {
            history, 
            message, 
            t: { ai_chat_system_prompt: t('ai_chat_system_prompt', { language: t('lang_name') }) }
        });
        return { text: response.text || '', sources: [] };
    } catch (error) {
        return { text: `${t('ai_assistant_generic_error')}\n\nDetails: ${error instanceof Error ? error.message : String(error)}`, sources: [], error: (error as Error).message };
    }
}
