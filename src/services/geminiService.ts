
import { GoogleGenAI } from "@google/genai";

export async function askHemoAssistant(prompt: string): Promise<string> {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Eres un asistente experto en medicina crítica y técnicas de purificación sanguínea extracorpórea, específicamente hemoadsorción. 
        Tu objetivo es ayudar a profesionales de la salud a entender conceptos como el sistema CytoSorb, Purifi, y el uso de Polimixina B (PMX).
        Conoces en detalle estudios como el TIGRIS Trial y el EUPHRATES Trial sobre hemoadsorción en shock séptico endotóxico.
        Responde en español de forma profesional, clara y basada en evidencia. 
        Si se te pregunta sobre un caso clínico de shock séptico refractario con SOFA > 12, menciona la importancia de la modulación de la respuesta inflamatoria y la posible reducción de vasopresores.
        Si se te pregunta algo fuera del ámbito médico o técnico relacionado, reconduce amablemente la conversación.`,
        temperature: 0.7,
      },
    });

    return response.text || "Lo siento, no pude procesar tu solicitud en este momento.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error en la conexión con el asistente inteligente.";
  }
}
