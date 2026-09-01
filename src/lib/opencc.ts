import OpenCC from "opencc-js";
import type { TraditionalVariant } from "./i18n";
import { NOVEL_GLOSSARY_PROTECTED_TERMS } from "./novel-glossary";

const converters: Record<TraditionalVariant, (text: string) => string> = {
  tw: OpenCC.Converter({ from: "cn", to: "tw" }),
  hk: OpenCC.Converter({ from: "cn", to: "hk" }),
};

/** Terms that should not be altered by OpenCC conversion. */
const PROTECTED_TERMS = [
  "AI.LinkTrust.Top",
  "ai.linktrust.top",
  "hencte.top",
  "tongtianlu.cn",
  "github.com/hencter/Nova",
  "Hencter Lew",
  "LinkTrust",
  "Obsidian",
  "TypeScript",
  "Three.js",
  "DeepSeek",
  "WebSocket",
  "Zettelkasten",
  "GitHub",
  "Nova",
  "Hencter",
  "通天路",
  "亦幸",
  "Lua",
  "Python",
  "Astro",
  "Hugo",
  "MIT",
  "V2EX",
  "DeepSeek",
  ...NOVEL_GLOSSARY_PROTECTED_TERMS,
];

function protectTerms(text: string): { protectedText: string; placeholders: Map<string, string> } {
  const placeholders = new Map<string, string>();
  let protectedText = text;

  const sorted = [...PROTECTED_TERMS].sort((a, b) => b.length - a.length);
  sorted.forEach((term, index) => {
    if (!protectedText.includes(term)) return;
    const key = `\uE000${index}\uE001`;
    placeholders.set(key, term);
    protectedText = protectedText.split(term).join(key);
  });

  return { protectedText, placeholders };
}

function restoreTerms(text: string, placeholders: Map<string, string>): string {
  let restored = text;
  for (const [key, term] of placeholders) {
    restored = restored.split(key).join(term);
  }
  return restored;
}

export function convertText(text: string, variant: TraditionalVariant): string {
  if (!text) return text;
  const { protectedText, placeholders } = protectTerms(text);
  const converted = converters[variant](protectedText);
  return restoreTerms(converted, placeholders);
}

export function convertDeep<T>(value: T, variant: TraditionalVariant): T {
  if (typeof value === "string") {
    return convertText(value, variant) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => convertDeep(item, variant)) as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      result[key] = convertDeep(nested, variant);
    }
    return result as T;
  }
  return value;
}
