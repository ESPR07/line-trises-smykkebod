import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const handler = async (event: any) => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { images } = body;

    if (!images || !images.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No images provided" }),
      };
    }

    const imageBase64 = images[0]?.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/webp",
                data: imageBase64,
              },
            },
            {
              text: `
Analyze this product image and generate title + description in Norwegian:

Return JSON ONLY in this format:
{
  "title": "...",
  "description": "..."
}

Rules:
- Title: max 6 words
- Description: 2 paragrapgs with a bullet point list of 3-5 key features, both paragraphs 30-70 words each.
- Example description: "Dette smykket, Rosa Stjernenatt, er inspirert av en stille natt fylt med glitrende stjerner. Anhenget har en dyp rosa tone med subtile skimmer og mønstre som minner om et lite univers fanget i resin.

Detaljer:
⭐ Materiale: Resin
⭐ Farge: Rosa med glitrende nyanser
⭐ Form: Rundt anheng

Produktet inkluderer kjede."
- Please only use the given stars as bullet points, do NOT use other symbols
- Be realistic, do NOT guess materials unless obvious
- Tone: ecommerce, clean, slightly premium
              `,
            },
          ],
        },
      ],
    });

    const text = response.text;

    if (!text) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "AI response was empty" }),
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI generation failed" }),
    };
  }
};