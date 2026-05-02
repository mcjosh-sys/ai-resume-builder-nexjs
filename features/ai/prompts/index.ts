export type AIResumeSection = {
  id: string;
  heading: string;
  content: any;
};

export type AIResume = AIResumeSection[];

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

export const SKILL_RULES = `
SKILLS SECTION RULES:

The resume may contain a "skills" section. Each skill must follow this structure:

{
  "name": string,
  "category": "TECHNICAL" | "SOFT" | "OTHER",
  "level": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
}

Enum definitions:

SkillCategory:
- TECHNICAL: Programming languages, frameworks, tools, and technical abilities
- SOFT: Communication, leadership, teamwork, problem-solving
- OTHER: Any skill that does not clearly fit into TECHNICAL or SOFT

SkillLevel:
- BEGINNER: Basic familiarity
- INTERMEDIATE: Working proficiency
- ADVANCED: Strong proficiency, can work independently
- EXPERT: Deep expertise, can lead or mentor others

STRICT RULES:
1. DO NOT use values outside these enums
2. DO NOT rename enum values
3. DO NOT return lowercase or variations (must be exact match)
4. Only assign a level if it is reasonably implied
5. Prefer TECHNICAL when the skill is job-relevant and hard skill
6. Optimize skill names for ATS (e.g., "Node.js" instead of "Node")
`;

export * from "./improve.prompt";
export * from "./rewrite.prompt";
export * from "./suggestion.prompt";
