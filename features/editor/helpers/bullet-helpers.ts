import { capitalizeFirst } from "@/lib/utils";

export function isBullet(content: string): boolean {
  if (!content) return false;

  const text = content.toLowerCase();

  return (
    /<ul[\s\S]*?>[\s\S]*?<li[\s\S]*?>[\s\S]*?<\/li>[\s\S]*?<\/ul>/.test(text) ||
    /<ol[\s\S]*?>[\s\S]*?<li[\s\S]*?>[\s\S]*?<\/li>[\s\S]*?<\/ol>/.test(text)
  );
}

export function extractEntries(input: string): string[] {
  if (!input) return [];

  const text = normalizeInput(input);

  let entries = splitByLines(text);
  if (entries.length > 1) return cleanEntries(entries);

  entries = splitByPseudoBullets(text);
  if (entries.length > 1) return cleanEntries(entries);

  entries = splitBySentences(text);
  entries = mergeShortEntries(entries);

  return cleanEntries(entries);
}

export function entriesToHTML(entries: string[]) {
  return `<ul>${entries.map((e) => `<li>${e}</li>`).join("")}</ul>`;
}

export function extractListItemsDOM(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const items = Array.from(doc.querySelectorAll("li"));

  return items.map((li) => li.textContent?.trim() || "").filter(Boolean);
}

export function extractListItems(html: string): string[] {
  if (!html) return [];

  let text = html
    .replace(/```[\w]*\n?/g, "")
    .replace(/```/g, "")
    .trim();

  const matches = text.match(/<li[\s\S]*?<\/li>/gi);

  if (!matches) return [];

  return matches
    .map((li) => stripTags(li))
    .map(cleanText)
    .filter(Boolean);
}

function stripTags(html: string): string {
  return html.replace(/<\/?li[^>]*>/gi, "").replace(/<\/?[^>]+(>|$)/g, "");
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeInput(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitByLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitByPseudoBullets(text: string): string[] {
  return text
    .split(/(?:^|\n|\r| )[\-\*\u2022]\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitBySentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function mergeShortEntries(entries: string[]): string[] {
  const result: string[] = [];

  for (const entry of entries) {
    if (!result.length) {
      result.push(entry);
      continue;
    }

    if (entry.length < 40) {
      result[result.length - 1] += " " + entry;
    } else {
      result.push(entry);
    }
  }

  return result;
}

function cleanEntries(entries: string[]): string[] {
  return entries
    .map((e) => e.trim())
    .filter((e) => e.length > 20)
    .map(capitalizeFirst);
}
