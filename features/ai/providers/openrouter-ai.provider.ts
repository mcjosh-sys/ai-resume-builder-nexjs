import { AppError } from "@/lib/errors";
import { OpenRouter } from "@openrouter/sdk";
import { PromptMessages } from "../prompts";
import { AIProvider } from "./index";

export class OpenRouterAIProvider extends AIProvider {
  readonly name = "open-router-ai";

  private readonly client: OpenRouter;

  constructor(private readonly apiKey: string) {
    super();
    this.client = new OpenRouter({ apiKey: this.apiKey });
  }

  async generate(messages: PromptMessages): Promise<string> {
    const response = await this.client.chat.send({
      chatGenerationParams: {
        messages: messages.map((p) => {
          return {
            role: p.role,
            content: p.content,
          };
        }),
        model: "mistral-small-24b",
        stream: false,
      },
    });
    const content = response.choices?.[0]?.message?.content;
    if (!content)
      throw new AppError("Failed to generate AI response", {
        code: "AI_RESPONSE_EMPTY",
      });
    return content;
  }
}
