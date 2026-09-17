#!/bin/bash
# ==========================================================
# WeDRIVE - Skrip Pemulihan Sandaran Rasmi REPORT FYP 3.docx
# SHA-256: 03499f1aa22271d5fe915f3d82a29709b2a1e0d721403258b56a913ca0141c22
# ==========================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$(dirname "$DIR")"
TARGET_FILE="$TARGET_DIR/REPORT FYP 3.docx"

echo "Memulihkan fail REPORT FYP 3.docx daripada bahagian sandaran GitHub..."
cat "$DIR"/REPORT_FYP_3.docx.part* > "$TARGET_FILE"

if [ -f "$TARGET_FILE" ]; then
    SIZE=$(stat -f%z "$TARGET_FILE" 2>/dev/null || stat -c%s "$TARGET_FILE" 2>/dev/null)
    echo "=========================================================="
    echo "✓ BERJAYA! Fail telah dipulihkan sepenuhnya:"
    echo "  Laluan : $TARGET_FILE"
    echo "  Saiz   : $SIZE bytes (~112.78 MB)"
    echo "=========================================================="
else
    echo "✗ Ralat: Gagal memulihkan fail."
fi
