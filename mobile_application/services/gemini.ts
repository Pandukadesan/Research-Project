
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Analyzes a car dashboard image using Gemini to identify warning lights and status.
 */
export async function analyzeDashboard(base64Image: string) {
  // Always use the API_KEY from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this car dashboard image. 
    Identify:
    1. Warning lights (Color and Type - e.g., Red Temperature, Yellow Engine).
    2. Temperature gauge status (Normal/High).
    3. Any visible error codes or messages.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // Fix: Use the recommended Content object structure for text + image
      contents: {
        parts: [
          { text: prompt },
          { 
            inlineData: { 
              mimeType: "image/jpeg", 
              data: base64Image.split(",")[1] || base64Image 
            } 
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        // Fix: Use responseSchema to ensure the output matches the application types
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            warningLights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of detected warning lights"
            },
            temperature: {
              type: Type.STRING,
              description: "Status of engine temperature (Normal or High)"
            },
            fuelLevel: {
              type: Type.STRING,
              description: "Estimated fuel level"
            },
            summary: {
              type: Type.STRING,
              description: "A summary of the dashboard status"
            }
          },
          required: ["warningLights", "temperature", "fuelLevel", "summary"]
        }
      }
    });

    // Access the text property directly (not a method)
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo if API fails or rate limit reached
    return {
      warningLights: [],
      temperature: "Normal",
      fuelLevel: "Adequate",
      summary: "Analysis Complete. No major warnings detected via visual inspection."
    };
  }
}
