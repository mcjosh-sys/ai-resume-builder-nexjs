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

export function parseDateInput(value: any) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
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
