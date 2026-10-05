# fracs-tools

Small interactive study tools for the FRACS (VASC) 2027 Notion workbook, served by GitHub Pages from `/docs` and embedded in the workbook's **Tools** page.

| Tool | Path | Source of truth |
|---|---|---|
| WIfI Calculator | `docs/wifi/index.html` | ESVS/SVS Global Vascular Guidelines 2019 (Tables 1.2, 3.2–3.5; Recs 6.7–6.14, 6.38, 7.6); Mills 2014 matrices (Rutherford 11e Fig 104.2) |

Each tool is one self-contained HTML file with no build step and no dependencies beyond Google Fonts.
The selected WIfI combination lives in the URL hash (e.g. `wifi/#w2i1f1`), so a Notes page can link straight to a case.

GVG Table 3.5 omits W0 I1 fI2 and lists W0 I2 fI1 under two stages; the calculator resolves both cells from the original SVS matrix (Mills 2014): stage 3 and stage 2.
