/**
 * Novel localization glossary — proper nouns preserved during OpenCC TW/HK mirroring.
 * Source: src/content/novel/_glossary/*.json
 */
import fs from "node:fs";
import path from "node:path";

const GLOSSARY_DIR = path.join(process.cwd(), "src/content/novel/_glossary");

interface GlossaryFile {
  opencc_preserve?: string[];
  characters?: { zh?: string; en?: string }[];
  terms?: { zh?: string; en?: string }[];
}

function loadGlossaryTerms(): string[] {
  if (!fs.existsSync(GLOSSARY_DIR)) return [];
  const terms = new Set<string>();
  for (const file of fs.readdirSync(GLOSSARY_DIR)) {
    if (!file.endsWith(".json")) continue;
    const raw = fs.readFileSync(path.join(GLOSSARY_DIR, file), "utf8");
    const doc = JSON.parse(raw) as GlossaryFile;
    for (const t of doc.opencc_preserve ?? []) terms.add(t);
    for (const c of doc.characters ?? []) {
      if (c.zh) terms.add(c.zh);
      if (c.en) terms.add(c.en);
    }
    for (const t of doc.terms ?? []) {
      if (t.zh) terms.add(t.zh);
      if (t.en) terms.add(t.en);
    }
  }
  return [...terms].sort((a, b) => b.length - a.length);
}

/** Terms injected into OpenCC protected list (longest first). */
export const NOVEL_GLOSSARY_PROTECTED_TERMS = loadGlossaryTerms();
