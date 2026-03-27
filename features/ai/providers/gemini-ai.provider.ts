import { AppError } from "@/lib/errors";
import { GoogleGenAI } from "@google/genai";
import { PromptMessages } from "../prompts";
import { AIProvider } from "./index";

export class GeminiAIProvider extends AIProvider {
  readonly name = "gemini-ai";

  private readonly client: GoogleGenAI;

  constructor(private readonly apiKey: string) {
    super();
    this.client = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generate(messages: PromptMessages): Promise<string> {
    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages.map((p) => {
        return {
          role: p.role === "user" ? "user" : "model",
          parts: [
            {
              text: p.content,
            },
          ],
        };
      }),
    });
    const content = response.text;
    if (!content)
      throw new AppError("Failed to generate AI response", {
        code: "AI_RESPONSE_EMPTY",
      });
    return content;
  }
}
