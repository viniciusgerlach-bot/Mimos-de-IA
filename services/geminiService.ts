
import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

export const generateImage = async (params: GenerationParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const greeting = params.greetingType === 'Personalizado' 
    ? params.customGreeting 
    : params.greetingType === 'Nenhum' 
      ? '' 
      : params.greetingType;

  const theme = params.theme === 'Personalizado' 
    ? params.customTheme 
    : params.theme === 'Aleatório'
      ? 'a random beautiful and cute theme (like kittens, puppies, babies, or landscapes)'
      : params.theme;

  let motivationalPart = '';
  if (params.motivationalType === 'Personalizado') {
    motivationalPart = params.customMotivational;
  } else if (params.motivationalType === 'Aleatório') {
    motivationalPart = 'a short, beautiful, and inspiring motivational quote';
  }

  // Build the text requirement string
  let textRequirement = '';
  if (params.includeText) {
    const parts = [];
    if (greeting) parts.push(`the greeting "${greeting}"`);
    if (motivationalPart) {
      if (params.motivationalType === 'Aleatório') {
        parts.push(`a random short inspiring quote`);
      } else {
        parts.push(`the message "${motivationalPart}"`);
      }
    }

    if (parts.length > 0) {
      textRequirement = `The image MUST include ${parts.join(' and ')} written clearly in a beautiful, elegant, and artistic decorative typography that complements the background. Ensure the text is highly legible and aesthetically pleasing.`;
    }
  } else {
    textRequirement = 'DO NOT include any text or words on the image.';
  }

  const prompt = `
    A high-quality, professional greeting card image. 
    Main Theme: ${theme}. 
    Visual Style: Extremely cute, soft lighting, pastel colors, cozy and heartwarming atmosphere, high definition, 4k.
    ${textRequirement}
    The overall composition should be perfect for sharing on WhatsApp or Instagram to spread love and positivity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Não foi possível encontrar a imagem na resposta da IA.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw error;
  }
};
