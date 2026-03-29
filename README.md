# hencte.top

Personal public website for project showcase + blog.

## Local development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Migrate content from old Hugo site

This project includes a migration script that reads markdown from the old Hugo repository,
converts TOML front matter to YAML, and writes posts into `src/content/blog`.

Default source path:

`D:\Hencter\hencte.top.hugo`

Run migration:

```bash
pnpm migrate:hugo
```

If your Hugo repo is elsewhere, set `HUGO_BLOG_ROOT` first:

```bash
set HUGO_BLOG_ROOT=D:\path\to\your\hugo\site
pnpm migrate:hugo
```

## Key routes

- `/` Home
- `/projects` Project showcase
- `/blog` Blog index
- `/blog/[...slug]` Blog post pages
- `/en` English home
- `/en/projects` English projects
