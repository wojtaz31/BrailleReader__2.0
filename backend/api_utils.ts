// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
    GoogleGenAI,
} from '@google/genai';
import {PROMPT} from './prompt';
import {API_KEY} from './api_key';
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function analyzeMultipleImages(userPrompt: string, base64Images: string[], mimeType: string = 'image/jpeg') {

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

async function main() {
    try {
        const cameraFrameBase64_1 = fs.readFileSync('zdjecie_1.jpg').toString('base64');
        const cameraFrameBase64_2 = fs.readFileSync('zdjecie_2.jpg').toString('base64');
        const aiAnswer = await analyzeMultipleImages(PROMPT, [cameraFrameBase64_1, cameraFrameBase64_2]);

        console.log("\n--- WYNIK ANALIZY (OCR) ---");
        console.log(aiAnswer);

    } catch (error) {
        console.error("Wystąpił błąd komunikacji z API:", error);
    }
}

main();