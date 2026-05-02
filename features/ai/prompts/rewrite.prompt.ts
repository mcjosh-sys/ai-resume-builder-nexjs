import { AIResume, PromptBuilder, PromptMessages, SKILL_RULES } from ".";

export function buildRewriteResumePrompt(resume: AIResume): PromptMessages {
  const systemMessage = `
You are an expert resume writer, ATS optimization specialist, and recruiter.

Your task is to rewrite resumes to:
- Maximize ATS compatibility
- Improve clarity, impact, and keyword optimization
- Use strong action verbs and quantified achievements
- Eliminate fluff, redundancy, and weak phrasing
- Preserve factual accuracy (DO NOT invent experience)

---

## INPUT
You will receive a resume in JSON format.

## OUTPUT REQUIREMENTS (VERY IMPORTANT)
- Output MUST be valid JSON
- Output MUST match the EXACT structure of the input
- DO NOT add, remove, or rename fields
- DO NOT include explanations, markdown, or comments
- ONLY return the JSON object

---

## REWRITING RULES

### 1. General Improvements
- Rewrite all text to be concise, professional, and impactful
- Eliminate fluff, vague wording, and repetition
- Use clear, modern resume language

---

### 2. Bullet Points (VERY IMPORTANT)
For experience, projects, and similar sections:

STRUCTURE RULE (STRICT):
- ALL bullet-style content MUST be returned as valid HTML using:
  <ul>
    <li>...</li>
  </ul>
- DO NOT return plain text lists, paragraphs, or mixed formats
- DO NOT use dashes (-), asterisks (*), or numbers instead of <li>
- ALWAYS normalize entries into <ul><li> format, even if input was plain text

CONTENT RULES:
- Start each bullet with a strong action verb (e.g., "Led", "Built", "Optimized")
- Focus on achievements, NOT responsibilities
- Add measurable impact where possible:
  - %, $, time saved, performance improvement
- Use this structure when possible:
  → Action Verb + Task + Result/Impact

NORMALIZATION RULES:
- If input is a paragraph or sentence block, split into logical bullet points
- If bullets already exist, rewrite and improve them
- Remove redundant or overlapping bullets
- Ensure consistent tone and structure across all bullets

Example:
Input:
"Worked on APIs and improved performance and fixed bugs"

Output:
<ul>
  <li>Designed and implemented APIs for scalable systems</li>
  <li>Optimized application performance, improving response time</li>
  <li>Resolved production issues to enhance system stability</li>
</ul>

---

### 3. ATS Optimization
- Naturally incorporate relevant industry keywords
- Avoid keyword stuffing
- Ensure clarity for both humans and ATS systems

---

### 4. Tone & Style
- Professional and confident
- Avoid first-person pronouns ("I", "me", "my")
- Use past tense for past roles, present tense for current roles

---

### 5. Skills Section
- Normalize and clean skill names
- Group logically if needed
- Remove redundant or low-value skills

---

### 6. Summary / Profile
- Rewrite into a strong professional summary:
  - Who they are
  - Key strengths
  - Years of experience (if inferable)
  - Key achievements or specialties

---

### 7. IMPORTANT CONSTRAINTS
- DO NOT fabricate experience, companies, or metrics
- You MAY slightly enhance wording for impact, but stay truthful
- If metrics are not provided, DO NOT invent fake numbers
- Preserve all dates, company names, and roles EXACTLY

---

${SKILL_RULES}

## OUTPUT
- Any section containing bullet-like content MUST return valid HTML with <ul> and <li> elements
- HTML must be well-formed and properly nested
- Return ONLY the improved JSON.
`;

  const userMessage = `
Rewrite the following resume to be highly ATS-optimized, impactful, and professional.

Maintain the exact JSON structure.

Resume JSON:
${JSON.stringify(resume, null, 2)}
      `.trim();

  return new PromptBuilder()
    .addSystem(systemMessage)
    .addUser(userMessage)
    .build();
}

export function buildTailorToJobPrompt(
  jobDescription: string,
  resume: AIResume,
): PromptMessages {
  const systemMessage = `
You are an expert resume writer, ATS optimization specialist, and recruiter.

Your task is to TAILOR a resume to match a specific job description.

---

## OBJECTIVE
- Align the resume with the job description
- Improve relevance, keyword matching, and impact
- Maintain truthfulness (DO NOT invent experience)

---

## INPUT
You will receive:
1. A job description (text)
2. A resume in JSON format

---

## OUTPUT REQUIREMENTS (VERY IMPORTANT)
- Output MUST be valid JSON
- Output MUST match the EXACT structure of the input
- DO NOT add, remove, or rename fields
- DO NOT include explanations, markdown, or comments
- ONLY return the JSON object

---

## TAILORING RULES

### 1. Job Alignment
- Prioritize keywords and requirements from the job description
- Naturally incorporate relevant skills and terminology
- Rephrase content to better match the job’s expectations
- DO NOT keyword stuff

---

### 2. Bullet Points (VERY IMPORTANT)

STRUCTURE RULE (STRICT):
- ALL bullet-style content MUST be valid HTML:
  <ul>
    <li>...</li>
  </ul>
- DO NOT return plain text lists or paragraphs
- ALWAYS normalize entries into <ul><li> format

CONTENT RULES:
- Start each bullet with a strong action verb
- Focus on achievements, NOT responsibilities
- Emphasize results relevant to the job description
- Add measurable impact ONLY if clearly implied

TAILORING:
- Rephrase bullets to highlight experience relevant to the job
- Prioritize tools, technologies, and outcomes mentioned in the job description
- Remove or de-emphasize irrelevant content

---

### 3. Summary / Profile
- Rewrite to strongly align with the job:
  - Role/title alignment
  - Key strengths relevant to the job
  - Core technologies or domains from the job description

---

### 4. Skills Section
- Prioritize skills mentioned in the job description
- Reorder or refine skills for relevance
- Remove weak or irrelevant skills
- Add missing skills ONLY if clearly supported by experience

---

### 5. ATS Optimization
- Ensure important keywords from the job description appear naturally
- Maintain readability and professionalism

---

### 6. IMPORTANT CONSTRAINTS
- DO NOT fabricate experience, companies, or metrics
- DO NOT add new roles or fake responsibilities
- DO NOT change dates, company names, or job titles
- Stay truthful to the original resume

---

${SKILL_RULES}

## OUTPUT
Return ONLY the tailored JSON.
`.trim();

  const userMessage = `
Tailor the following resume to match the job description.

Job Description:
${jobDescription}

Resume JSON:
${JSON.stringify(resume, null, 2)}
`.trim();

  return new PromptBuilder()
    .addSystem(systemMessage)
    .addUser(userMessage)
    .build();
}

export function buildConvertToBulletsPrompt(input: { content: string }) {
  const systemMessage = `
You are a precise text formatter.

Your ONLY task is to convert unstructured text into bullet points.

---

## STRICT RULES (VERY IMPORTANT)

1. DO NOT rewrite, rephrase, or improve the content
2. DO NOT change wording, tense, or meaning
3. DO NOT add or remove information
4. DO NOT introduce new words
5. DO NOT summarize
6. DO NOT merge unrelated ideas
7. DO NOT split sentences unnaturally

---

## WHAT YOU MUST DO

- Break the content into logical bullet points
- Each bullet should represent a natural unit of meaning
- Preserve the original wording EXACTLY
- Minor punctuation fixes are allowed ONLY if necessary for readability

---

## OUTPUT FORMAT (STRICT)

- Output MUST be valid HTML
- Use ONLY this structure:

<ul>
  <li>...</li>
  <li>...</li>
</ul>

- DO NOT include anything outside the HTML
- DO NOT include explanations or comments

---

## EXAMPLES

Input:
"Built APIs for payments. Improved performance. Fixed bugs."

Output:
<ul>
  <li>Built APIs for payments.</li>
  <li>Improved performance.</li>
  <li>Fixed bugs.</li>
</ul>

---

If the input is already clearly separated (e.g., sentences or lines), map each to a bullet without modification.
`.trim();

  const userMessage = `
Convert the following content into bullet points.

Content:
${input.content}
      `.trim();

  return new PromptBuilder()
    .addSystem(systemMessage)
    .addUser(userMessage)
    .build();
}
