import tesseract from 'node-tesseract-ocr';
import fs from "fs";

const tesseractConfig = {
    lang: "pol", // language
    oem: 1,      // (1 = Neural nets LSTM only)
    psm: 3,      // page segmentation mode (3 = Fully automatic page segmentation)
};

export async function analyzeMultipleImagesLocal(base64Images: string[]) {
    let combinedText = '';

    for (const [index, base64] of base64Images.entries()) {
        const imageBuffer = Buffer.from(base64, 'base64');
        const text = await tesseract.recognize(imageBuffer, tesseractConfig);
        combinedText += text.trim() + '\n\n';
    }

    return combinedText.trim();
}