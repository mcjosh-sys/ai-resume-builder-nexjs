import { AppError } from "@/lib/errors";
import Groq from "groq-sdk";
import { PromptMessages } from "../prompts";
import { AIProvider } from "./index";

export class GroqAIProvider extends AIProvider {
  readonly name = "groq-ai";

  private readonly client: Groq;

  constructor(private readonly apiKey: string) {
    super();
    this.client = new Groq({ apiKey: this.apiKey });
  }

  async generate(messages: PromptMessages): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages.map((p) => {
        return {
          role: p.role,
          content: p.content,
        };
      }),
    });
    const content = response?.choices?.[0]?.message?.content;
    if (!content)
      throw new AppError("Failed to generate AI response", {
        code: "AI_RESPONSE_EMPTY",
      });
    return content;
  }
}
