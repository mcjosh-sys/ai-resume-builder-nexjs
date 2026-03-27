import { AppError } from "@/lib/errors";
import { PromptMessages } from "../prompts";
import { CVTask } from "../types/task.types";
import { GeminiAIProvider } from "./gemini-ai.provider";
import { GroqAIProvider } from "./groq-ai.provider";
import { AIProvider } from "./index";
import { OpenRouterAIProvider } from "./openrouter-ai.provider";

export class MultiAIProviderRouter extends AIProvider {
  readonly name = "multi-ai-router";

  private providers: AIProvider[];

  constructor(
    private readonly keys: { gemini: string; groq: string; openRouter: string },
  ) {
    super();
    this.providers = [
      new GeminiAIProvider(this.keys.gemini),
      new GroqAIProvider(this.keys.groq),
      new OpenRouterAIProvider(this.keys.openRouter),
    ];
  }

  private selectProvider(task: CVTask): AIProvider[] {
    switch (task) {
      case "rewrite":
      case "improve":
        return [this.providers[1], this.providers[0]];
      case "tailor":
        return [this.providers[0], this.providers[1]];
      case "analyze":
      case "suggestion":
        return [
          this.providers[0],
          this.providers[1],
          // this.providers[2]
        ];
      default:
        return [this.providers[0], this.providers[1]];
    }
  }

  async generate(messages: PromptMessages, task: CVTask): Promise<string> {
    const providers = this.selectProvider(task);

    let lastError: any;
    for (const provider of providers) {
      try {
        return await provider.generate(messages);
      } catch (err) {
        console.warn(`${provider.name} failed for task "${task}"`, err);
        lastError = err;
      }
    }

    throw new AppError("All AI providers failed", {
      code: "AI_ALL_FAILED",
      cause: lastError,
    });
  }
}
