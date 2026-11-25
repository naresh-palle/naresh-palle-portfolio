#!/usr/bin/env bash
# Encodes the interactive hero clip (design/hero-head-turn.mp4) into web assets.
#   hero-scrub.mp4  desktop, scrubbed by the cursor: keyframe every 3 frames so seeking stays smooth
#   hero-loop.mp4   touch devices: forward + reverse so the loop has no visible jump
#   hero-poster-*   front-facing still used before the video loads and for reduced motion
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=design/hero-head-turn.mp4
OUT=public/video
mkdir -p "$OUT" public/images

ffmpeg -v error -y -i "$SRC" -an -t 5.9 \
  -vf "scale=1280:-2,fps=24" -c:v libx264 -preset slow -crf 28 -g 3 -keyint_min 3 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart "$OUT/hero-scrub.mp4"

ffmpeg -v error -y -i "$SRC" -an \
  -filter_complex "[0:v]trim=0:5.9,setpts=PTS-STARTPTS,scale=960:-2,fps=24,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop.mp4"

ffmpeg -v error -y -ss 2.0 -i "$SRC" -frames:v 1 -q:v 2 /tmp/hero-poster.png
for w in 960 1600; do
  ffmpeg -v error -y -i /tmp/hero-poster.png -vf "scale=$w:-2" -c:v libwebp -quality 80 "public/images/hero-poster-$w.webp"
done

ls -la "$OUT" public/images/hero-poster-*
