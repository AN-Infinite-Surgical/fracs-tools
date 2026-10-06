# fracs-tools

Small interactive study tools for the FRACS (VASC) 2027 Notion workbook, served by GitHub Pages from `/docs` and embedded in the workbook's **Tools** page.

| Tool | Path | Source of truth |
|---|---|---|
| WIfI Calculator | `docs/wifi/index.html` | ESVS/SVS Global Vascular Guidelines 2019 (Tables 1.2, 3.2–3.5; Recs 6.7–6.14, 6.38, 7.6); Mills 2014 matrices (Rutherford 11e Fig 104.2) |
| Harborview rAAA Score | `docs/harborview/index.html` | Garland, J Vasc Surg 2018;68:991; Hemingway, J Vasc Surg 2021;74:1508; ESVS 2024 AAA §6.2.6 |
| POSSUM Calculator | `docs/possum/index.html` | Copeland 1991; Prytherch 1998 (P-POSSUM); Prytherch 2001 (V-POSSUM); Neary 2003 (equation tabulation incl. RAAA-POSSUM) |

Each tool is one HTML file sharing `docs/assets/fracs-tools.css` and `fracs-tools.js`; no build step, no dependencies beyond Google Fonts.
Every view must fit a 930 px-tall Notion embed at 375, 708 and 816 px wide.
Each tool opens fresh on every load (no saved state) and has a Reset button.

GVG Table 3.5 omits W0 I1 fI2 and lists W0 I2 fI1 under two stages; the calculator resolves both cells from the original SVS matrix (Mills 2014): stage 3 and stage 2.
