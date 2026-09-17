import type { ImageMetadata } from "astro";

/**
 * Project images live in src/assets/projects/ (optimized at build by
 * astro:assets). Content entries keep a stable `image:` string such as
 * "/img/projects/nova.webp" — the basename acts as the lookup key, so
 * content files don't change when formats or paths do.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/projects/*.webp",
  { eager: true },
);

const byName = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([path, mod]) => {
    const name = path.split("/").pop()!.replace(/\.webp$/i, "");
    return [name, mod.default];
  }),
);

/** Resolve a content image value to its bundled asset, if one exists. */
export function getProjectImage(src?: string): ImageMetadata | undefined {
  if (!src) return undefined;
  const clean = src.split("?")[0];
  const name = clean
    .split("/")
    .pop()
    ?.replace(/\.(png|jpe?g|webp|avif|svg)$/i, "");
  return name ? byName.get(name) : undefined;
}
