export function parseAIJSON<T = unknown>(raw: string): T {
  try {
    return JSON.parse(raw);
  } catch {
    let cleaned = raw.trim();

    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
      cleaned = codeBlockMatch[1].trim();
      try {
        return JSON.parse(cleaned);
      } catch {}
    }

    cleaned = cleaned.replace(/```/g, "");

    const firstCurly = cleaned.indexOf("{");
    const firstSquare = cleaned.indexOf("[");

    let firstBrace = -1;
    let lastBrace = -1;

    if (
      (firstCurly !== -1 && firstSquare !== -1 && firstCurly < firstSquare) ||
      (firstCurly !== -1 && firstSquare === -1)
    ) {
      firstBrace = firstCurly;
      lastBrace = cleaned.lastIndexOf("}");
    } else if (firstSquare !== -1) {
      firstBrace = firstSquare;
      lastBrace = cleaned.lastIndexOf("]");
    }

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    return JSON.parse(cleaned);
  }
}

export function parseAIHTML(input: string): string {
  if (!input) return "";

  let text = input.trim();

  text = text
    .replace(/```[\w]*\n?/g, "")
    .replace(/```/g, "")
    .trim();

  const match = text.match(/<ul[\s\S]*?<\/ul>/i);

  if (match) {
    return normalizeHTML(match[0]);
  }

  const liMatches = text.match(/<li[\s\S]*?<\/li>/gi);

  if (liMatches && liMatches.length > 0) {
    return `<ul>${liMatches.join("")}</ul>`;
  }

  return `<ul><li>${escapeHTML(text)}</li></ul>`;
}

function normalizeHTML(html: string): string {
  return html
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
