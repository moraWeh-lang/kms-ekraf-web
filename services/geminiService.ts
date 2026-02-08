
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Document } from "../types";

export const askKmsBot = async (
  query: string, 
  history: { role: 'user' | 'model', text: string }[],
  knowledgeBase: Document[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Format knowledge base context for Gemini
  const contextString = knowledgeBase.map(doc => 
    `JUDUL: ${doc.title}\nKATEGORI: ${doc.category}\nKONTEN: ${doc.content}`
  ).join('\n\n---\n\n');

  const systemInstruction = `
    Anda adalah Asisten Pengetahuan (Chatbot KMS) untuk Divisi Ekonomi Kreatif (EKRAF) HIMA SI.
    Tugas Anda adalah menjawab pertanyaan anggota berdasarkan basis pengetahuan organisasi yang disediakan.
    
    BASIS PENGETAHUAN:
    ${contextString}
    
    ATURAN:
    1. Jawablah secara profesional namun tetap ramah (ala mahasiswa Sistem Informasi).
    2. Gunakan hanya informasi dari basis pengetahuan di atas. Jika tidak ada, sarankan untuk menghubungi Admin EKRAF.
    3. Bantu jelaskan SOP, alur kerja, atau dokumen AD/ART/GBHKO jika ditanyakan.
    4. Singkat dan padat.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Maaf, saya tidak dapat memproses jawaban saat ini.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Terjadi kesalahan saat menghubungi Google AI Studio.";
  }
};
