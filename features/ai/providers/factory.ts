import { env } from "@/env";
import { GeminiAIProvider } from "./gemini-ai.provider";
import { GroqAIProvider } from "./groq-ai.provider";
import { MultiAIProviderRouter } from "./multi-ai.provider";
import { OpenRouterAIProvider } from "./openrouter-ai.provider";

let geminiProvider = null as GeminiAIProvider | null;
let groqProvider = null as GroqAIProvider | null;
let openRouterProvider = null as OpenRouterAIProvider | null;
let multiProvider = null as MultiAIProviderRouter | null;

export function getGeminiProvider() {
  if (!geminiProvider) {
    geminiProvider = new GeminiAIProvider(env.GEMINI_API_KEY);
  }
  return geminiProvider;
}

export function getGroqProvider() {
  if (!groqProvider) {
    groqProvider = new GroqAIProvider(env.GROQ_API_KEY);
  }
  return groqProvider;
}

export function getOpenRouterProvider() {
  if (!openRouterProvider) {
    openRouterProvider = new OpenRouterAIProvider(env.OPENROUTER_API_KEY);
  }
  return openRouterProvider;
}

export function getMultiProvider() {
  if (!multiProvider) {
    multiProvider = new MultiAIProviderRouter({
      gemini: env.GEMINI_API_KEY,
      groq: env.GROQ_API_KEY,
      openRouter: env.OPENROUTER_API_KEY,
    });
  }
  return multiProvider;
}
