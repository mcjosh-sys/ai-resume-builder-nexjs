import { PromptBuilder } from ".";

export function buildImproveBulletsPrompt(input: {
  html: string;
  role?: string;
  company?: string;
}) {
  const { html, role, company } = input;

  return new PromptBuilder()
    .addSystem(
      `
        You are an expert resume writer and ATS optimization specialist.

Your task is to improve ALL bullet points within a work experience section.

STRICT RULES:
1. Output MUST be valid HTML
2. Preserve the original structure (<ul>/<ol> and <li>)
3. Do NOT add or remove bullets unless clearly redundant
4. Do NOT invent experience or metrics
5. Keep content concise and professional

WRITING RULES:
- Start each bullet with strong action verbs
- Focus on achievements, not responsibilities
- Add measurable impact where possible (only if implied)
- Remove redundancy across bullets
- Optimize for ATS keywords relevant to the role
- Keep consistent tone and tense

Return ONLY the improved HTML.
      `.trim(),
    )
    .addUser(
      `
Improve the bullet points in this work experience.

Role: ${role ?? "N/A"}
Company: ${company ?? "N/A"}

HTML:
${html}
      `.trim(),
    )
    .build();
}
