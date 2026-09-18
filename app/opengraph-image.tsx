import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { detectGrok47 } from "@/lib/detect-grok-47";
import { SITE_URL } from "@/lib/site";

export const alt = "Is Grok 4.7 on the xAI catalogue?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 15;

const IDLE_BONE = "#f3ead4";
const LIVE_BONE = "#f8efe0";
const RIVET = 56;
const RIVET_INSET = 40;
const RIVET_PHOTO = Math.round(RIVET * 1.35);

function answerWord(available: boolean | null): string {
  if (available === true) {
    return "YES";
  }
  if (available === false) {
    return "NO";
  }
  return "—";
}

function pngDataUrl(bytes: Buffer): string {
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

function loadAsset(relativeFromModule: string): Promise<Buffer> {
  return readFile(new URL(relativeFromModule, import.meta.url));
}

function Rivet({
  src,
  style,
}: {
  src: string;
  style: { top?: number; left?: number; right?: number; bottom?: number };
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: RIVET,
        height: RIVET,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: RIVET / 2,
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={src} width={RIVET_PHOTO} height={RIVET_PHOTO} />
    </div>
  );
}

export default async function Image() {
  const [status, extraBold, bold, enamelIdle, enamelLive, rivet] =
    await Promise.all([
      detectGrok47(),
      loadAsset("../assets/fonts/BigShoulders-ExtraBold.ttf"),
      loadAsset("../assets/fonts/BigShoulders-Bold.ttf"),
      loadAsset("../public/plates/enamel-idle.png"),
      loadAsset("../public/plates/enamel-live.png"),
      loadAsset("../public/plates/rivet.png"),
    ]);

  const live = status.available === true;
  const enamel = pngDataUrl(live ? enamelLive : enamelIdle);
  const rivetSrc = pngDataUrl(rivet);
  const color = live ? LIVE_BONE : IDLE_BONE;
  const word = answerWord(status.available);
  const host = new URL(SITE_URL).hostname;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={enamel}
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            objectFit: "cover",
          }}
        />

        <Rivet src={rivetSrc} style={{ top: RIVET_INSET, left: RIVET_INSET }} />
        <Rivet src={rivetSrc} style={{ top: RIVET_INSET, right: RIVET_INSET }} />
        <Rivet
          src={rivetSrc}
          style={{ bottom: RIVET_INSET, left: RIVET_INSET }}
        />
        <Rivet
          src={rivetSrc}
          style={{ bottom: RIVET_INSET, right: RIVET_INSET }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Big Shoulders",
                fontWeight: 800,
                fontSize: 340,
                lineHeight: 0.78,
                letterSpacing: -13.6,
                textTransform: "uppercase",
              }}
            >
              {word}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontFamily: "Big Shoulders",
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: 6.1,
                textTransform: "uppercase",
              }}
            >
              Grok 4.7
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 48,
              display: "flex",
              fontFamily: "Big Shoulders",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 3.5,
            }}
          >
            {host}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Big Shoulders",
          data: extraBold,
          weight: 800,
          style: "normal",
        },
        {
          name: "Big Shoulders",
          data: bold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
