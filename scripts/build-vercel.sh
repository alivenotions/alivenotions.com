#!/usr/bin/env sh
set -eu

rm -rf .vercel/output
mkdir -p .vercel/output/static
cp -r public/. .vercel/output/static/
printf '%s\n' '{"version":3}' > .vercel/output/config.json
