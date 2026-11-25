#!/usr/bin/env sh
# Start VRC Photo Manager from source.
cd "$(dirname "$0")" || exit 1
exec npx electron .
