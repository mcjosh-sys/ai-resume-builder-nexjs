export type Prompt = {
  role: "system" | "user" | "assistant";
  content: string;
  metadata?: {
    sectionId?: string;
    actionType?: "rewrite" | "improve" | "tailor" | "suggestion" | "analyze";
    jobDescription?: string;
  };
};

export type PromptMessages = Prompt[];

export class PromptBuilder {
  private messages: PromptMessages = [];

  constructor(private systemMessage?: string) {
    if (systemMessage) {
      this.addSystem(systemMessage);
    }
  }

  addSystem(content: string) {
    this.messages.push({ role: "system", content });
    return this;
  }

  addUser(content: string, metadata?: Prompt["metadata"]) {
    this.messages.push({ role: "user", content, metadata });
    return this;
  }

  addAssistant(content: string, metadata?: Prompt["metadata"]) {
    this.messages.push({ role: "assistant", content, metadata });
    return this;
  }

  rewrite(sectionText: string, sectionId?: string) {
    return this.addUser(sectionText, { actionType: "rewrite", sectionId });
  }

  improveBullets(sectionText: string, sectionId?: string) {
    return this.addUser(sectionText, { actionType: "improve", sectionId });
  }

  tailorToJob(sectionText: string, jobDescription: string, sectionId?: string) {
    return this.addUser(sectionText, {
      actionType: "tailor",
      sectionId,
      jobDescription,
    });
  }

  analyzeResume(resumeText: string, jobDescription?: string) {
    return this.addUser(resumeText, { actionType: "analyze", jobDescription });
  }

  suggestions(resumeText: string, sectionId?: string, jobDescription?: string) {
    return this.addUser(resumeText, {
      actionType: "suggestion",
      sectionId,
      jobDescription,
    });
  }

  build(): PromptMessages {
    return this.messages;
  }
}
