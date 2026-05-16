import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "Prompt Generator — write better prompts, faster";

const PAPER = "#F5F2EA";
const INK = "#2B2722";
const MUTED = "#6E675C";
const COBALT = "#2A41DB";

const LOGO_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='${COBALT}'/><path d='M10.5 9.5 L17 16 L10.5 22.5' fill='none' stroke='${PAPER}' stroke-width='2.8' stroke-linecap='round' stroke-linejoin='round'/><rect x='17.6' y='20.1' width='7.4' height='2.8' rx='1.4' fill='${PAPER}'/></svg>`;
const LOGO_DATA = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG)}`;

const FONT_DIR = join(process.cwd(), "assets", "fonts");
const NEWSREADER = readFileSync(join(FONT_DIR, "Newsreader-600.ttf"));
const HANKEN = readFileSync(join(FONT_DIR, "HankenGrotesk-500.ttf"));

export async function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          backgroundColor: PAPER,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 560,
            background: `radial-gradient(circle at 70% 30%, ${COBALT}26, transparent 62%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA} width={64} height={64} alt="" />
          <div
            style={{
              display: "flex",
              fontFamily: "Hanken",
              fontSize: 24,
              letterSpacing: 6,
              color: MUTED,
            }}
          >
            PROMPT GENERATOR
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Newsreader",
              fontWeight: 600,
              fontSize: 92,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: INK,
            }}
          >
            <span style={{ display: "flex" }}>Write better prompts,&nbsp;</span>
            <span style={{ display: "flex", color: COBALT }}>faster.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Hanken",
              fontSize: 32,
              color: MUTED,
            }}
          >
            150+ guided generators · 24 categories · open-source
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Hanken",
              fontSize: 26,
              color: INK,
            }}
          >
            prompt-generator.gm-sunshine.com
          </div>
          <div
            style={{ display: "flex", width: 120, height: 6, background: COBALT }}
          />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Newsreader",
          data: NEWSREADER,
          weight: 600,
          style: "normal",
        },
        { name: "Hanken", data: HANKEN, weight: 500, style: "normal" },
      ],
    },
  );
}
