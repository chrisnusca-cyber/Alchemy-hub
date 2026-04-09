#!/bin/bash
GIT="/Applications/GitHub Desktop.app/Contents/Resources/app/git/bin/git"
REPO=~/Documents/GitHub/Alchemy-hub

cd "$REPO"
"$GIT" config user.email "chrisnusca@gmail.com"
"$GIT" config user.name "Christopher Nusca"
"$GIT" add -A
"$GIT" commit -m "Claude update: $(date '+%d %b %H:%M')"
"$GIT" push
echo "✅ Pushed to GitHub — Vercel deploying now"
