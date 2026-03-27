import { PromptMessages } from "../prompts";
import { CVTask } from "../types/task.types";

export abstract class AIProvider {
  abstract name: "groq-ai" | "gemini-ai" | "open-router-ai" | "multi-ai-router";

  abstract generate(messages: PromptMessages, task?: CVTask): Promise<string>;

  async safeGenerate(messages: PromptMessages, task?: CVTask): Promise<string> {
    try {
      return await this.generate(messages);
    } catch (err) {
      console.error(`${this.name} failed`, err);
      return "";
    }
  }
}
