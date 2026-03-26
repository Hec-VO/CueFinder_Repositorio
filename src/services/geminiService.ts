import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeCravingText = async (text: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza el siguiente texto de un paciente que está intentando dejar de fumar.
Identifica los "triggers" (desencadenantes o elementos contextuales) que lo llevaron a tener ganas de fumar.
Extrae los triggers como una lista de palabras clave o frases cortas (máximo 3 palabras por trigger).
Devuelve solo los triggers más relevantes (máximo 5).

Texto del paciente: "${text}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: 'Un trigger o desencadenante corto (ej. "estrés", "después de comer", "discusión")',
          },
        },
      },
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      const triggers = JSON.parse(jsonStr);
      if (Array.isArray(triggers)) {
        return triggers.map(t => t.toLowerCase());
      }
    }
    return [];
  } catch (error) {
    console.error('Error analyzing craving text:', error);
    return [];
  }
};
