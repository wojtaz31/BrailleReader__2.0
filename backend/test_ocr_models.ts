import {PROMPT} from './prompt';
import { analyzeMultipleImages } from "./googleOcr_utils";
import { analyzeMultipleImagesLocal } from "./tesseract_utils";
import fs from "fs";

async function main() {
    try {
        const cameraFrameBase64_1 = fs.readFileSync('zdjecie_1.jpg').toString('base64');
        const cameraFrameBase64_2 = fs.readFileSync('zdjecie_2.jpg').toString('base64');
        const images = [cameraFrameBase64_1, cameraFrameBase64_2];

        const googleAnswer = await analyzeMultipleImages(PROMPT, images);
        const localAnswer = await analyzeMultipleImagesLocal(images);

        console.log("\n==========================================");
        console.log("WYNIK - GOOGLE OCR:");
        console.log("==========================================");
        console.log(googleAnswer);

        console.log("\n==========================================");
        console.log("WYNIK - LOKALNY TESSERACT:");
        console.log("==========================================");
        console.log(localAnswer);

    } catch (error) {
        console.error("Wystąpił błąd:", error);
    }
}

main();