// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {PROMPT} from './prompt';
import { analyzeMultipleImages } from "./googleOcr_utils";
import { analyzeMultipleImagesLocal } from "./tesseract_utils";
import fs from "fs";

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