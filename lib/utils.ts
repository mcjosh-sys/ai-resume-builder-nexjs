import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildSearchParams(params: Record<string, any>, prefix = "") {
  const searchParams = new URLSearchParams();

  function appendParam(key: string, value: any) {
    if (value === null || value === undefined || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => appendParam(key, v));
    } else if (typeof value === "object" && !(value instanceof Date)) {
      for (const k in value) {
        if (value.hasOwnProperty(k)) {
          appendParam(`${key}[${k}]`, value[k]);
        }
      }
    } else {
      searchParams.append(key, value.toString());
    }
  }

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      appendParam(fullKey, params[key]);
    }
  }

  return searchParams.toString();
}

export function isValidDate(value: any) {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export function parseDateInput(value: any) {
  if (!value || !isValidDate(value)) return "";
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

export function isEqual(a: any, b: any): boolean {
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }
  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => isEqual(a[key], b[key]));
  }
  return a === b;
}

export function isUrl(value: any) {
  if (typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
}

export function downalodObject(filename: string, blob: Blob) {
  if (typeof window === "undefined") return;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function sanitizeAndParseJson<T = unknown>(raw: string): T {
  try {
    return JSON.parse(raw);
  } catch {
    // محاولة تنظيف الرد
    let cleaned = raw.trim();

    // Remove ```json ... ``` or ``` ... ```
    if (cleaned.startsWith("```")) {
      cleaned = cleaned
        .replace(/^```[a-zA-Z]*\n?/, "") // remove opening ```json
        .replace(/```$/, ""); // remove closing ```
    }

    // Remove stray backticks anywhere
    cleaned = cleaned.replace(/```/g, "");

    // Optional: extract JSON if wrapped with text
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    return JSON.parse(cleaned);
  }
}
