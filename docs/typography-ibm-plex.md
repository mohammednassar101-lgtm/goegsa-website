# Approved typography

User selected option 1 (IBM Plex) on 2026-11-07 after reviewing full bilingual samples.

- Arabic: IBM Plex Sans Arabic. English: IBM Plex Sans.
- Body: 400. Headings: 700. Action buttons: 600.
- Font files downloaded from Google Fonts for the comparison, then converted from TTF to WOFF, then losslessly repackaged as WOFF2 without removing glyphs.
- Six local font assets; no external font requests at runtime. The regular face for the page language is preloaded.
- Original OFL notices accompany both families under dist/assets/fonts.
- Checked computed font family and heading weight across all 16 page variants at mobile width; no document-level horizontal overflow.
- Visually checked Arabic desktop home, English mobile home, light mobile services and trial dialog.
- Logo letter outlines and monospace code examples are unchanged.

## WOFF2 conversion — 8 November 2026

Six fonts: 595,312 → 426,056 bytes (28.4% smaller). Verified the full Unicode cmap, glyph order, advance widths, every glyph outline, and GSUB/GPOS/GDEF layout tables after decoding. No subsetting or font-family changes. Evidence: ibm-plex-woff2-verification.json. Unused Tajawal files and former WOFFs were removed. Build preloads and font-face declarations now use font/woff2.
