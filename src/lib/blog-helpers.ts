import { getCollection } from "astro:content";

const allowedSections = new Set(["log", "tech", "ancient"]);

const isIndexPage = (entry: { data: { legacyPath?: string } }) =>
  Boolean(entry.data.legacyPath?.endsWith("_index.md"));

export async function getLatestPosts(limit = 6) {
  const allEntries = await getCollection("blog");
  return allEntries
    .filter((entry) => !entry.data.draft)
    .filter((entry) => allowedSections.has(entry.data.section || entry.id.split("/")[0]))
    .filter((entry) => !isIndexPage(entry))
    .sort((a, b) => {
      const aTime = a.data.date ? a.data.date.getTime() : 0;
      const bTime = b.data.date ? b.data.date.getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}

export async function getHomeNovels() {
  const novelEntries = await getCollection("novel");
  return novelEntries
    .filter((e) => !e.data.draft)
    .filter((e) => !e.data.chapter && !e.data.novel && e.id !== "novel");
}
