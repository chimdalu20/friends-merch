#!/usr/bin/env bash
# Deploy the Friends Merch storefront to https://friendsmerch.favtoma.com/
#
# The site is a static export (see next.config.ts). The target is cPanel shared
# hosting with no Node runtime, so we build locally and ship the resulting out/
# directory.
#
#   Host    : ssh favtoma  (cPanel user rmmoxnli)
#   Docroot : /home/rmmoxnli/friendsmerch      <- the subdomain
#
# Usage: ./deploy.sh

set -euo pipefail

REMOTE="favtoma"
DOCROOT="/home/rmmoxnli/friendsmerch"
URL="https://friendsmerch.favtoma.com/"
TMPDIR_LOCAL="$(mktemp -d)"
ARCHIVE="$TMPDIR_LOCAL/friendsmerch-out.tar.gz"
MANIFEST="$TMPDIR_LOCAL/manifest.txt"

echo "==> Building static export"
rm -rf .next out
npm run build

[ -f out/index.html ] || { echo "ERROR: out/index.html missing - build produced no export"; exit 1; }

# The list of things to clear on the remote is DERIVED from what this build
# actually produced, never hardcoded - a hardcoded list goes stale the moment a
# route or asset folder is added, leaving ghost files served forever.
( cd out && ls -A ) > "$MANIFEST"
echo "    export contains $(wc -l < "$MANIFEST") top-level entries"

echo "==> Packaging $(du -sh out | cut -f1)"
tar -czf "$ARCHIVE" -C out .

echo "==> Uploading"
scp -q "$ARCHIVE" "$REMOTE:/home/rmmoxnli/friendsmerch-out.tar.gz"
scp -q "$MANIFEST" "$REMOTE:/home/rmmoxnli/friendsmerch-manifest.txt"

# Checksums must match, or we are extracting a truncated upload.
LOCAL_SUM="$(sha256sum "$ARCHIVE" | cut -d' ' -f1)"
REMOTE_SUM="$(ssh "$REMOTE" "sha256sum /home/rmmoxnli/friendsmerch-out.tar.gz | cut -d' ' -f1")"
[ "$LOCAL_SUM" = "$REMOTE_SUM" ] || { echo "ERROR: checksum mismatch after upload"; exit 1; }
echo "    checksum ok"

echo "==> Extracting on $REMOTE"
# Remove only what a previous export put there. cPanel's own .htaccess,
# .user.ini, php.ini, cgi-bin and .well-known (AutoSSL renewal) must survive.
ssh "$REMOTE" "set -e
  cd '$DOCROOT'
  while IFS= read -r entry; do
    case \"\$entry\" in
      ''|.htaccess|.user.ini|php.ini|cgi-bin|.well-known|.|..) continue ;;
    esac
    rm -rf -- \"\$entry\"
  done < /home/rmmoxnli/friendsmerch-manifest.txt
  tar -xzf /home/rmmoxnli/friendsmerch-out.tar.gz -C '$DOCROOT'
  find '$DOCROOT' -type d -exec chmod 755 {} \;
  find '$DOCROOT' -type f -exec chmod 644 {} \;
  rm -f /home/rmmoxnli/friendsmerch-out.tar.gz /home/rmmoxnli/friendsmerch-manifest.txt"

rm -rf "$TMPDIR_LOCAL"

echo "==> Verifying"
CODE=$(curl -sS -o /dev/null -w '%{http_code}' "$URL")
echo "    $URL -> HTTP $CODE"
[ "$CODE" = "200" ] || { echo "ERROR: site did not return 200"; exit 1; }

# The gallery textures are the whole page - assert one really serves.
IMG=$(curl -sS -o /dev/null -w '%{http_code}' "${URL}images/1.jpg")
echo "    ${URL}images/1.jpg -> HTTP $IMG"
[ "$IMG" = "200" ] || { echo "ERROR: gallery image did not return 200"; exit 1; }

echo "==> Done."
