import { AIResume, PromptBuilder } from ".";

export interface AISuggestion {
  sectionId: string;
  itemId?: string;
  subIndex?: number;
  type: "replace" | "insert" | "delete";
  original: string;
  suggested: string;
  label: string;
}

export function buildSuggestionPrompt(
  jobDescription: string,
  resume: AIResume,
) {
  const systemMessage = `
You are an expert resume writer and ATS optimization specialist.

Your task is to analyze a resume and suggest improvements to better match the provided job description.

STRICT RULES:
1. Do NOT invent experience — only enhance what is implied.
2. Tailor suggestions to align with the job description, including relevant ATS keywords.
3. Focus on achievements, measurable impact, and strong action verbs.
4. Preserve bullet structure and formatting where applicable.
5. Return structured JSON only, using the AISuggestion format below.
6. If a section is already strong, it is okay to return no suggestion for it.

AISuggestion JSON format:
[
  {
    "sectionId": "string - the ID of the section",
    "itemId": "optional string - the ID of the item",
    "subIndex": "optional number for bullet position",
    "type": "replace | insert | delete",
    "original": "the original text",
    "suggested": "AI suggested improvement",
    "label": "short description of the suggestion"
  }
]
Only return a JSON array. Do not include any explanations outside the JSON.
      `.trim();
  const userMessage = `
Job description:
${jobDescription}

Resume sections (JSON):
${JSON.stringify(resume, null, 2)}

Analyze each section and generate structured suggestions to improve the resume for this job. Include subIndex for bullet-level suggestions if applicable.
      `.trim();

  return new PromptBuilder()
    .addSystem(systemMessage)
    .addUser(userMessage)
    .build();
}
