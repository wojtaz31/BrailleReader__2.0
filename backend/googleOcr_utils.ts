import {
    GoogleGenAI,
} from '@google/genai';
import {API_KEY} from './api_key';
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeMultipleImages(userPrompt: string, base64Images: string[], mimeType: string = 'image/jpeg') {

    const promptParts: any[] = [
        { text: userPrompt }
    ];

    for (const base64 of base64Images) {
        promptParts.push({
            inlineData: {
                data: base64,
                mimeType: mimeType
            }
        });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: promptParts
            }
        ]
    });

    return response.text;
}