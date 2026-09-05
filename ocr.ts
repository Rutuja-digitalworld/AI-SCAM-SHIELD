import Tesseract from 'tesseract.js';

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: () => {},
    });
    return result.data.text.trim();
  } catch {
    return '';
  }
}
