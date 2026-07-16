#!/bin/bash
# SessionStart hook: install the system binaries the yt-dlp MCP server shells out to.
#
# @kevinwatt/yt-dlp-mcp runs `yt-dlp` as a subprocess and relies on `ffmpeg`
# for merging separate audio/video streams and for format/subtitle conversion.
# Neither ships with the base web-session container, so we install both here.
#
# Idempotent and non-interactive: safe to re-run; skips anything already present.
set -euo pipefail

# Only provision in Claude Code on the web; local machines manage their own tools.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

log() { echo "[session-start] $*" >&2; }

# --- ffmpeg (via apt) -------------------------------------------------------
if command -v ffmpeg >/dev/null 2>&1; then
  log "ffmpeg already present: $(ffmpeg -version 2>/dev/null | head -1)"
else
  log "installing ffmpeg..."
  export DEBIAN_FRONTEND=noninteractive
  # Third-party PPAs may be blocked by the session proxy; the main Ubuntu
  # archive (which carries ffmpeg) still resolves, so ignore update failures.
  apt-get update -qq || true
  apt-get install -y --no-install-recommends ffmpeg >/dev/null
  log "ffmpeg installed: $(ffmpeg -version 2>/dev/null | head -1)"
fi

# --- yt-dlp (via pip / PyPI) -----------------------------------------------
# Installed from PyPI rather than the GitHub release binary: the web-session
# proxy allow-lists pypi.org / files.pythonhosted.org but blocks GitHub
# release downloads (403). pip lands the `yt-dlp` console script on PATH.
if command -v yt-dlp >/dev/null 2>&1; then
  log "yt-dlp already present: $(yt-dlp --version 2>/dev/null)"
else
  log "installing yt-dlp..."
  python3 -m pip install --quiet --upgrade yt-dlp
  log "yt-dlp installed: $(yt-dlp --version 2>/dev/null)"
fi

# --- downloads directory ----------------------------------------------------
# yt-dlp-mcp refuses to start unless its downloads directory exists. It
# defaults to ~/Downloads (override with YTDLP_DOWNLOADS_DIR); create it so
# the server boots and video/audio saves have a valid target.
mkdir -p "${YTDLP_DOWNLOADS_DIR:-$HOME/Downloads}"
log "downloads dir ready: ${YTDLP_DOWNLOADS_DIR:-$HOME/Downloads}"

log "dependencies ready for the yt-dlp MCP server"
