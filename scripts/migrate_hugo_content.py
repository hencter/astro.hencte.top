from __future__ import annotations

import datetime as dt
import os
import re
import shutil
import tomllib
from pathlib import Path, PurePosixPath

CURRENT_ROOT = Path(__file__).resolve().parents[1]
HUGO_ROOT = Path(os.environ.get("HUGO_BLOG_ROOT", r"D:\Hencter\hencte.top.hugo")).resolve()

SRC_CONTENT = HUGO_ROOT / "content"
SRC_STATIC = HUGO_ROOT / "static"
DEST_CONTENT = CURRENT_ROOT / "src" / "content" / "blog"
DEST_PUBLIC = CURRENT_ROOT / "public"

REF_RE = re.compile(r"\{\{<\s*ref\s+[\"']([^\"']+)[\"']\s*>\}\}")
KBD_RE = re.compile(r"\{\{<\s*kbd\s+\"([^\"]+)\"\s*>\}\}")
FIGURE_RE = re.compile(r"\{\{<\s*figure\s+([^>]+?)\s*>\}\}")
YOUTUBE_RE = re.compile(r"\{\{<\s*youtube\s+([A-Za-z0-9_-]+)\s*>\}\}")
VIMEO_RE = re.compile(r"\{\{<\s*vimeo\s+([0-9]+)\s*>\}\}")
HIGHLIGHT_RE = re.compile(
    r"\{\{<\s*highlight\s+([A-Za-z0-9_+-]+)(?:\s+\"[^\"]*\")?\s*>\}\}\s*\n?(.*?)\n?\s*\{\{<\s*/highlight\s*>\}\}",
    re.S,
)
YEAR_RE = re.compile(r"\{\{<\s*year\s*>\}\}")
TIME_INLINE_RE = re.compile(r"\{\{<\s*time\.inline\s*>\}\}\s*\{\{\s*now\s*\}\}\s*\{\{<\s*/time\.inline\s*>\}\}")
TIME_INLINE_SELF_RE = re.compile(r"\{\{<\s*time\.inline\s*/\s*>\}\}")
HETI_OPEN_RE = re.compile(r"\{\{<\s*heti\s*>\}\}")
HETI_CLOSE_RE = re.compile(r"\{\{<\s*/heti\s*>\}\}")
SHORTCODE_RE = re.compile(r"\{\{[<%].*?[>%]\}\}")
CLASS_ONLY_LINE_RE = re.compile(r"^\s*\{\.[^{}\n]+\}\s*$", re.M)
CLASS_SUFFIX_RE = re.compile(r"([^\s])\{\.[^{}\n]+\}")
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")


def yaml_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def to_iso_string(value: object | None) -> str | None:
    if value is None:
        return None
    if isinstance(value, dt.datetime):
        return value.isoformat()
    if isinstance(value, dt.date):
        return value.isoformat()
    raw = str(value).strip()
    return raw or None


def coerce_bool(value: object | None, default: bool = False) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "on"}
    return bool(value)


def to_string_list(value: object | None) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        cleaned: list[str] = []
        for item in value:
            text = str(item).strip()
            if text:
                cleaned.append(text)
        return cleaned
    text = str(value).strip()
    return [text] if text else []


def split_toml_frontmatter(text: str) -> tuple[dict[str, object], str]:
    normalized = text.replace("\r\n", "\n")
    if not normalized.startswith("+++\n"):
        return {}, normalized

    lines = normalized.split("\n")
    closing_index = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "+++":
            closing_index = i
            break

    if closing_index is None:
        return {}, normalized

    frontmatter_text = "\n".join(lines[1:closing_index])
    body = "\n".join(lines[closing_index + 1 :])
    data = tomllib.loads(frontmatter_text)
    return data, body


def normalize_slug_segment(value: str) -> str:
    segment = value.strip().strip("/")
    segment = re.sub(r"\s+", "-", segment)
    segment = segment.replace("_", "-")
    segment = re.sub(r"-{2,}", "-", segment)
    return segment.lower()


def canonical_key(relative_path: str) -> str:
    path = PurePosixPath(relative_path)
    if path.stem in {"index", "_index"}:
        return "/".join(path.parts[:-1])
    return "/".join((*path.parts[:-1], path.stem))


def compute_slug(relative_path: str, frontmatter: dict[str, object]) -> str:
    path = PurePosixPath(relative_path)
    dirs = [normalize_slug_segment(part) for part in path.parts[:-1]]
    file_stem = path.stem

    frontmatter_slug = frontmatter.get("slug")
    slug_override = ""
    if isinstance(frontmatter_slug, str) and frontmatter_slug.strip():
        slug_override = normalize_slug_segment(frontmatter_slug)

    if file_stem == "_index":
        if dirs:
            segments = dirs
            if slug_override:
                segments[-1] = slug_override
        else:
            segments = [slug_override or "legacy-home"]
    elif file_stem == "index":
        if dirs:
            segments = dirs
            if slug_override:
                segments[-1] = slug_override
        else:
            segments = [slug_override or "index"]
    else:
        segments = dirs + [normalize_slug_segment(file_stem)]
        if slug_override:
            segments[-1] = slug_override

    segments = [segment for segment in segments if segment]
    return "/".join(segments)


def build_slug_maps(records: list[dict[str, object]]) -> tuple[dict[str, str], dict[str, set[str]]]:
    key_to_slug: dict[str, str] = {}
    leaf_to_slug: dict[str, set[str]] = {}

    for record in records:
        rel = str(record["relative_path"])
        slug = str(record["slug"])
        key = canonical_key(rel).strip("/").lower()
        if key:
            key_to_slug[key] = slug

        frontmatter = record["frontmatter"]
        if isinstance(frontmatter, dict):
            raw_slug = frontmatter.get("slug")
            if isinstance(raw_slug, str) and raw_slug.strip():
                normalized = normalize_slug_segment(raw_slug)
                leaf_to_slug.setdefault(normalized, set()).add(slug)
                if key:
                    parent = "/".join(PurePosixPath(key).parts[:-1])
                    if parent:
                        key_to_slug[f"{parent}/{normalized}".strip("/")] = slug

        leaf = PurePosixPath(slug).name.lower()
        leaf_to_slug.setdefault(leaf, set()).add(slug)

    return key_to_slug, leaf_to_slug


def resolve_ref(target: str, current_relative_path: str, key_to_slug: dict[str, str], leaf_to_slug: dict[str, set[str]]) -> str:
    clean = target.strip().strip("/").replace("\\", "/")
    clean = re.sub(r"\.md$", "", clean, flags=re.I)
    clean = re.sub(r"/(?:index|_index)$", "", clean, flags=re.I)
    clean_key = clean.lower().strip("/")

    current_key = canonical_key(current_relative_path).strip("/")
    current_dir = "/".join(PurePosixPath(current_key).parts[:-1])

    candidates: list[str] = []
    if clean_key:
        candidates.append(clean_key)
        if current_dir:
            candidates.append(f"{current_dir}/{clean_key}".strip("/"))

    for candidate in candidates:
        candidate = re.sub(r"/{2,}", "/", candidate)
        if candidate in key_to_slug:
            return key_to_slug[candidate]

    if clean_key in leaf_to_slug and len(leaf_to_slug[clean_key]) == 1:
        return next(iter(leaf_to_slug[clean_key]))

    fallback = normalize_slug_segment(clean_key or "ref")
    return f"legacy/{fallback}"


def transform_body(
    body: str,
    relative_path: str,
    key_to_slug: dict[str, str],
    leaf_to_slug: dict[str, set[str]],
    source_file: Path,
    slug: str,
) -> str:
    text = body.replace("\r\n", "\n")

    text = REF_RE.sub(
        lambda match: f"/blog/{resolve_ref(match.group(1), relative_path, key_to_slug, leaf_to_slug)}",
        text,
    )

    text = KBD_RE.sub(lambda match: f"<kbd>{match.group(1)}</kbd>", text)

    def replace_figure(match: re.Match[str]) -> str:
        attrs = dict(re.findall(r"(\w+)=\"([^\"]*)\"", match.group(1)))
        src = attrs.get("src", "").strip() or "/img/avatar.jpg"
        caption = attrs.get("caption", "").strip()
        attr = attrs.get("attr", "").strip()
        attrlink = attrs.get("attrlink", "").strip()

        lines = [f"![{caption or attr or 'figure'}]({src})"]
        if caption:
            lines.append(f"*{caption}*")
        if attr and attrlink:
            lines.append(f"[{attr}]({attrlink})")
        elif attrlink:
            lines.append(f"[Source]({attrlink})")
        return "\n\n".join(lines)

    text = FIGURE_RE.sub(replace_figure, text)
    text = YOUTUBE_RE.sub(lambda match: f"[YouTube](https://www.youtube.com/watch?v={match.group(1)})", text)
    text = VIMEO_RE.sub(lambda match: f"[Vimeo](https://vimeo.com/{match.group(1)})", text)

    def replace_highlight(match: re.Match[str]) -> str:
        language = match.group(1)
        code = match.group(2).strip("\n")
        return f"```{language}\n{code}\n```"

    text = HIGHLIGHT_RE.sub(replace_highlight, text)
    text = YEAR_RE.sub(str(dt.datetime.now().year), text)
    text = TIME_INLINE_RE.sub(dt.datetime.now().isoformat(timespec="seconds"), text)
    text = TIME_INLINE_SELF_RE.sub("", text)
    text = HETI_OPEN_RE.sub("", text)
    text = HETI_CLOSE_RE.sub("", text)
    text = CLASS_ONLY_LINE_RE.sub("", text)
    text = CLASS_SUFFIX_RE.sub(r"\1", text)

    text = text.replace("/imgs/", "/img/")

    def replace_image(match: re.Match[str]) -> str:
        alt = match.group(1)
        raw_target = match.group(2).strip()

        target_match = re.match(r'^([^\s]+)(\s+"[^"]*")?$', raw_target)
        if not target_match:
            return match.group(0)

        image_path = target_match.group(1)
        image_title = target_match.group(2) or ""

        if image_path.startswith(("http://", "https://", "/", "#", "mailto:")):
            return match.group(0)

        source_image = (source_file.parent / image_path).resolve()
        if source_image.exists() and source_image.is_file():
            asset_rel_path = Path("legacy-assets") / slug / source_image.name
            target_image = DEST_PUBLIC / asset_rel_path
            target_image.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_image, target_image)
            return f"![{alt}](/{asset_rel_path.as_posix()}{image_title})"

        fallback_alt = alt or "Image"
        return f"_{fallback_alt} (missing source image: {image_path})_"

    text = IMAGE_RE.sub(replace_image, text)

    text = SHORTCODE_RE.sub(lambda match: f"`{match.group(0)}`", text)

    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text + "\n"


def serialize_frontmatter(record: dict[str, object]) -> str:
    frontmatter = record["frontmatter"]
    if not isinstance(frontmatter, dict):
        frontmatter = {}

    title = str(frontmatter.get("title") or PurePosixPath(str(record["relative_path"])).stem)
    description = str(frontmatter.get("description") or "").strip()

    date_value = to_iso_string(frontmatter.get("date"))
    publish_date = to_iso_string(frontmatter.get("publishDate"))
    lastmod = to_iso_string(frontmatter.get("lastmod"))

    tags = to_string_list(frontmatter.get("tags") or frontmatter.get("tag"))
    categories = to_string_list(frontmatter.get("categories"))
    aliases = to_string_list(frontmatter.get("aliases"))
    keywords = to_string_list(frontmatter.get("keywords"))
    images = to_string_list(frontmatter.get("images"))

    draft = coerce_bool(frontmatter.get("draft"), False)
    toc = coerce_bool(frontmatter.get("toc"), False)
    math = coerce_bool(frontmatter.get("math"), False)

    lines = ["---"]
    lines.append(f"title: \"{yaml_escape(title)}\"")

    if description:
        lines.append(f"description: \"{yaml_escape(description)}\"")
    if date_value:
        lines.append(f"date: \"{yaml_escape(date_value)}\"")
    if publish_date:
        lines.append(f"publishDate: \"{yaml_escape(publish_date)}\"")
    if lastmod:
        lines.append(f"lastmod: \"{yaml_escape(lastmod)}\"")

    lines.append(f"draft: {'true' if draft else 'false'}")

    if tags:
        lines.append("tags:")
        for tag in tags:
            lines.append(f"  - \"{yaml_escape(tag)}\"")

    if categories:
        lines.append("categories:")
        for category in categories:
            lines.append(f"  - \"{yaml_escape(category)}\"")

    if aliases:
        lines.append("aliases:")
        for alias in aliases:
            lines.append(f"  - \"{yaml_escape(alias)}\"")

    if keywords:
        lines.append("keywords:")
        for keyword in keywords:
            lines.append(f"  - \"{yaml_escape(keyword)}\"")

    if images:
        lines.append("images:")
        for image in images:
            lines.append(f"  - \"{yaml_escape(image)}\"")

    if toc:
        lines.append("toc: true")
    if math:
        lines.append("math: true")

    section = str(record["section"])
    slug = str(record["slug"])
    legacy_path = str(record["relative_path"])

    lines.append(f"slug: \"{yaml_escape(slug)}\"")
    lines.append(f"section: \"{yaml_escape(section)}\"")
    lines.append(f"legacyPath: \"{yaml_escape(legacy_path)}\"")
    lines.append("---")

    return "\n".join(lines)


def collect_records() -> list[dict[str, object]]:
    records: list[dict[str, object]] = []

    for source_file in sorted(SRC_CONTENT.rglob("*.md")):
        relative_path = source_file.relative_to(SRC_CONTENT).as_posix()
        text = source_file.read_text(encoding="utf-8")
        frontmatter, body = split_toml_frontmatter(text)

        slug = compute_slug(relative_path, frontmatter)
        section = slug.split("/", 1)[0] if slug else "legacy"

        records.append(
            {
                "source_file": source_file,
                "relative_path": relative_path,
                "frontmatter": frontmatter,
                "body": body,
                "slug": slug,
                "section": section,
            }
        )

    seen: dict[str, int] = {}
    for record in records:
        base_slug = str(record["slug"] or "post")
        current = seen.get(base_slug, 0)
        if current == 0:
            seen[base_slug] = 1
            continue
        seen[base_slug] = current + 1
        record["slug"] = f"{base_slug}-{seen[base_slug]}"

    return records


def write_content(records: list[dict[str, object]]) -> None:
    if DEST_CONTENT.exists():
        shutil.rmtree(DEST_CONTENT)
    DEST_CONTENT.mkdir(parents=True, exist_ok=True)

    key_to_slug, leaf_to_slug = build_slug_maps(records)

    for record in records:
        frontmatter = serialize_frontmatter(record)
        transformed_body = transform_body(
            str(record["body"]),
            str(record["relative_path"]),
            key_to_slug,
            leaf_to_slug,
            Path(record["source_file"]),
            str(record["slug"]),
        )
        output = f"{frontmatter}\n\n{transformed_body}"

        output_path = DEST_CONTENT / f"{record['slug']}.md"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(output, encoding="utf-8")


def copy_static_assets() -> None:
    source_img_dir = SRC_STATIC / "img"
    target_img_dir = DEST_PUBLIC / "img"
    target_img_dir.mkdir(parents=True, exist_ok=True)

    if source_img_dir.exists():
        for file_path in source_img_dir.glob("*"):
            if file_path.is_file():
                shutil.copy2(file_path, target_img_dir / file_path.name)

    source_favicon = SRC_STATIC / "favicon.ico"
    if source_favicon.exists():
        shutil.copy2(source_favicon, DEST_PUBLIC / "favicon.ico")


def main() -> None:
    records = collect_records()
    write_content(records)
    copy_static_assets()
    print(f"Migrated {len(records)} markdown files to {DEST_CONTENT}")


if __name__ == "__main__":
    main()
