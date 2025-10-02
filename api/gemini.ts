
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import type { AllInputs, Material, Currency } from '../types';

// Initialize Gemini AI
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY || '');

// --- Schemas for Structured JSON Responses ---
const analysisInsightSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['suggestion', 'warning', 'info'] },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
    },
    required: ["type", "title", "description"]
};
const analysisSchema = { type: Type.ARRAY, items: analysisInsightSchema };

const priceInfoSchema = {
    type: Type.OBJECT,
    properties: {
        materialName: { type: Type.STRING },
        averagePrice: { type: Type.NUMBER },
        priceRange: { type: Type.STRING },
        currency: { type: Type.STRING },
    },
     required: ["materialName", "averagePrice", "priceRange", "currency"]
};
const pricesSchema = { type: Type.ARRAY, items: priceInfoSchema };

const storeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        address: { type: Type.STRING },
        reason: { type: Type.STRING },
    },
    required: ["name", "address", "reason"]
};
const storesSchema = { type: Type.ARRAY, items: storeSchema };

// Main handler for all API requests
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, payload } = req.body;

    try {
        let response;
        switch (action) {
            case 'analyzeResults':
                response = await analyzeResults(payload);
                break;
            case 'findOnlinePrices':
                response = await findOnlinePrices(payload);
                break;
            case 'findNearbyStores':
                response = await findNearbyStores(payload);
                break;
            case 'analyzeImage':
                 response = await analyzeImage(payload);
                 break;
            case 'analyzeDocument':
                 response = await analyzeDocument(payload);
                 break;
            case 'chat':
                 response = await getChatResponse(payload);
                 break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error(`Error in action '${action}':`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
}

// --- Action Handlers ---

async function analyzeResults(payload: { 
    calculationName: string, inputs: AllInputs, results: Material[], 
    totalCost: number, currency: Currency, t: any
}) {
    const { calculationName, inputs, results, totalCost, currency, t } = payload;
    const prompt = t.ai_prompt_calculation_analysis;

    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        }
    });
    return processResponse(response, t);
}

async function findOnlinePrices(payload: { results: Material[], location: string, currency: Currency, t: any }) {
    const { results, location, currency, t } = payload;
    const prompt = t.ai_prompt_price_search;

    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        tools: [{ googleSearch: {} }],
        config: {
            responseMimeType: "application/json",
            responseSchema: pricesSchema,
        }
    });
    return processResponse(response, t);
}

async function findNearbyStores(payload: { results: Material[], location: string, currency: Currency, t: any }) {
    const { results, location, currency, t } = payload;
    const materialsList = results.map(r => r.name).join(', ');
    const prompt = t.ai_prompt_store_search.replace('{{language}}', t.lang_name).replace('{{currency}}', currency).replace('{{materials}}', materialsList).replace('{{location}}', location);

    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        tools: [{ googleSearch: {} }],
        config: {
            responseMimeType: "application/json",
            responseSchema: storesSchema,
        }
    });
    return processResponse(response, t);
}

async function analyzeImage(payload: { imageBase64: string, mimeType: string, prompt: string, t: any }) {
    const { imageBase64, mimeType, prompt, t } = payload;
    const imagePart = { inlineData: { data: imageBase64, mimeType } };
    const fullPrompt = `As 'ConstruIA', an expert AI in construction and design, analyze the following image. Provide a brief, concise, and visually appealing description or analysis based on the user's request. Respond in ${t.lang_name || 'English'}. User's request: "${prompt}"`;
    const contents = { parts: [imagePart, { text: fullPrompt }] };
    const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents });
    return processResponse(response, t);
}

async function analyzeDocument(payload: { documentText: string, prompt: string, t: any }) {
    const { documentText, prompt, t } = payload;
    const fullPrompt = t.ai_prompt_document_analysis.replace('{{request}}', prompt).replace('{{documentText}}', documentText);
    const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: fullPrompt });
    return processResponse(response, t);
}

async function getChatResponse(payload: { history: any[], message: string, t: any }) {
    const { history, message, t } = payload;

    const cleanedHistory = (history || []).map(item => ({
        role: item.role,
        parts: (item.parts || []).map(part => ({ text: String(part.text || '') }))
    }));

    // Add the new user message to the history to form the full conversation
    const fullConversation = [
        ...cleanedHistory,
        { role: 'user', parts: [{ text: message }] }
    ];

    const systemInstruction = t.ai_chat_system_prompt;

    // Use the generateContent method which is known to work in this project
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: fullConversation,
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        }
    });

    return processResponse(response, t);
}


// --- Response Processing ---

function processResponse(response: any, t: any) {
    const text = response.text || '';
    const jsonString = extractJsonFromString(text);
    
    if (jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            // Fallback to text if JSON parsing fails
            return { text };
        }
    } 
    return { text };
}

function extractJsonFromString(text: string): string | null {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        return match[1];
    }
    const firstBracket = text.indexOf('{');
    const firstSquare = text.indexOf('[');
    let start = -1;

    if (firstBracket === -1) start = firstSquare;
    else if (firstSquare === -1) start = firstBracket;
    else start = Math.min(firstBracket, firstSquare);

    if (start === -1) return null;

    const lastBracket = text.lastIndexOf('}');
    const lastSquare = text.lastIndexOf(']');
    const end = Math.max(lastBracket, lastSquare);
    
    if (end === -1 || end < start) return null;

    return text.substring(start, end + 1);
}