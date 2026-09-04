# Shiki: fix unknown fence language warnings

**Date:** 2026-09-04  
**Agent:** content-shiki  
**Domain:** content

## Problem

Build/dev logged unknown Shiki langs falling back to plaintext: `conf`, `WARNING`, `WARING`, `service`, `config`, `goat`, `go-html-template`.

## Remaps (content fences only)

| File | Old | New | Rationale |
|------|-----|-----|-----------|
| `log/arch-linux.md` | `conf` (×2) | `ini` | GRUB / pacman.ini-style |
| `log/arch-linux.md` | `WARNING` / `WARING` | `text` | Log callout typos, not langs |
| `log/arch-linux.md` | `service` | `ini` | systemd unit |
| `log/proxy.md` | `config` | `ssh-config` | SSH client config |
| `tech/hugo/menu-params-version.md` | `go-html-template` | `html` | Hugo layout HTML |
| `tech/hugo/diagrams.md` | `goat` | `text` | ASCII art diagram |

## Verify

Repo search: no remaining fences for the unknown langs. `ssh-config` / `ini` / `text` / `html` load in Shiki.
