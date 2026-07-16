# yt-dlp MCP integration

This repo is wired up to use the [`@kevinwatt/yt-dlp-mcp`](https://www.npmjs.com/package/@kevinwatt/yt-dlp-mcp)
MCP server, which exposes YouTube/video tooling (search, metadata, subtitles,
transcripts, comments, and video/audio downloads) to Claude Code.

## What's here

| File | Purpose |
| --- | --- |
| `../.mcp.json` | Registers the `yt-dlp` stdio MCP server (`npx @kevinwatt/yt-dlp-mcp@latest`), project-scoped so it's shared with anyone who clones the repo. |
| `settings.json` | Registers the `SessionStart` hook below. |
| `hooks/session-start.sh` | Installs the runtime dependencies the server shells out to. |

## Runtime dependencies

The MCP server is a thin wrapper around the `yt-dlp` CLI, which in turn needs
**FFmpeg** to merge separate audio/video streams and to convert formats and
subtitles. Neither ships in the Claude Code on the web base container, so the
`SessionStart` hook installs them on each fresh session:

- **FFmpeg** — via `apt-get install ffmpeg`.
- **yt-dlp** — via `pip install yt-dlp` (from PyPI, which the web-session
  network proxy allows; the GitHub release binary is blocked).
- **`~/Downloads`** — created because the server refuses to start unless its
  downloads directory exists.

The hook only runs in Claude Code on the web (`$CLAUDE_CODE_REMOTE`), is
idempotent, and skips anything already installed.

## Configuration

The server reads optional `YTDLP_*` environment variables (set them in the
`env` block of the `yt-dlp` entry in `.mcp.json`). Most useful:

- `YTDLP_DOWNLOADS_DIR` — where downloads are saved (default `~/Downloads`).
- `YTDLP_DEFAULT_RESOLUTION` — `480p` | `720p` (default) | `1080p` | `best`.
- `YTDLP_DEFAULT_AUDIO_FORMAT` — `m4a` (default) | `mp3`.
- `YTDLP_COOKIES_FILE` / `YTDLP_COOKIES_FROM_BROWSER` — for age/login-gated content.

## First-run approval

Project-scoped `.mcp.json` servers are shown as "pending approval" until a
human approves them once in an interactive `claude` session (a security gate so
cloning a repo can't silently run MCP servers).
