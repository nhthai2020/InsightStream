import { GoogleGenAI } from "@google/genai";
import { Message, Sender, VisualizationData, SourceLink } from "../types";

const API_KEY = process.env.API_KEY || '';

// System instruction to enforce the user's specific workflow requirements:
// 1. Detailed breakdown.
// 2. Realtime data (Search).
// 3. Debug logic.
// 4. JSON for visuals.
const SYSTEM_INSTRUCTION = `
Bạn là "InsightStream Core", một chuyên gia phân tích dữ liệu cao cấp và kỹ sư phần mềm senior.
Nhiệm vụ: Trả lời câu hỏi người dùng bằng dữ liệu THỰC TẾ (Real-time) thông qua Google Search.

QUY TRÌNH XỬ LÝ (Bắt buộc tuân thủ):
1. **Kiểm tra giả thiết (Check Assumptions):** Xác định rõ ràng các giả định về thời gian, địa điểm, ngữ cảnh của câu hỏi.
2. **Tìm kiếm dữ liệu (Search):** Sử dụng công cụ Google Search để lấy thông tin mới nhất. KHÔNG dùng dữ liệu cũ.
3. **Phân tích chi tiết (Detailed Analysis):** Giải thích logic, công thức tính toán (nếu có), và lý do đưa ra kết luận.
4. **Debug Logic:** Tự rà soát xem câu trả lời có lỗ hổng logic hoặc edge-case nào không.
5. **Trình bày:** Dùng Markdown đẹp, rõ ràng.

ĐỊNH DẠNG DỮ LIỆU BIỂU ĐỒ (Quan trọng):
Nếu câu trả lời có chứa số liệu thống kê so sánh được (ví dụ: giá vàng, tỷ số, doanh thu, thống kê...), hãy BẮT BUỘC chèn một khối JSON đặc biệt vào cuối câu trả lời (sau phần kết luận) theo định dạng sau để hệ thống vẽ biểu đồ:

\`\`\`json_viz
{
  "type": "bar", 
  "title": "Tiêu đề biểu đồ",
  "xAxisLabel": "Nhãn trục X",
  "yAxisLabel": "Nhãn trục Y",
  "data": [
    {"name": "Mục A", "value": 100},
    {"name": "Mục B", "value": 250}
  ]
}
\`\`\`
Type có thể là: "bar", "line", "pie".
JSON này phải nằm trong block code \`\`\`json_viz ... \`\`\`.

Ngôn ngữ trả lời: Tiếng Việt.
Phong cách: Chuyên nghiệp, khách quan, súc tích nhưng đầy đủ.
`;

export const sendMessageToGemini = async (
  prompt: string,
  history: Message[]
): Promise<Partial<Message>> => {
  if (!API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    // We use gemini-2.5-flash for low latency and search capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Real-time Search Grounding
        temperature: 0.3, // Lower temperature for more factual, analytical responses
      },
    });

    const textResponse = response.text || "Không có dữ liệu trả về.";
    
    // Extract Grounding Metadata (Sources)
    let sources: SourceLink[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      sources = response.candidates[0].groundingMetadata.groundingChunks
        .map((chunk) => {
          if (chunk.web) {
            return { title: chunk.web.title || "Web Source", uri: chunk.web.uri || "#" };
          }
          return null;
        })
        .filter((item): item is SourceLink => item !== null);
    }

    // Extract Visualization Data
    let visualization: VisualizationData | undefined;
    const jsonVizMatch = textResponse.match(/```json_viz([\s\S]*?)```/);
    let cleanedText = textResponse;

    if (jsonVizMatch && jsonVizMatch[1]) {
      try {
        visualization = JSON.parse(jsonVizMatch[1]);
        // Remove the JSON block from the display text to keep it clean
        cleanedText = textResponse.replace(jsonVizMatch[0], '');
      } catch (e) {
        console.error("Failed to parse visualization JSON", e);
      }
    }

    return {
      sender: Sender.Bot,
      text: cleanedText,
      timestamp: Date.now(),
      groundingSources: sources,
      visualization: visualization,
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An unexpected error occurred while contacting Gemini.");
  }
};
