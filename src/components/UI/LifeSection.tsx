"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const MONO = "'JetBrains Mono', monospace";

type Scene = "football" | "chess" | "singing" | "terminal";

const FOCUS: Record<Scene, string> = {
  football: "38% 50%",
  chess: "45% 50%",
  singing: "40% 50%",
  terminal: "50% 58%",
};

export default function LifeSection({ onEnterDistrict }: { onEnterDistrict: () => void }) {
  const reduce = useReducedMotion();

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  const rows: Array<{
    scene: Scene;
    kicker: string;
    title: string;
    body: string;
    districtLink?: boolean;
  }> = [
    {
      scene: "football",
      kicker: "01 / PITCH",
      title: "The reset button.",
      body: "Football is where I clear my head. Off the pitch I come back sharper — for code and everything else.",
      districtLink: true,
    },
    {
      scene: "chess",
      kicker: "02 / BOARD",
      title: "Two moves ahead.",
      body: "I play chess to slow my thinking down. Strategy on the board became strategy in my work.",
    },
    {
      scene: "singing",
      kicker: "03 / MIC",
      title: "For the soul.",
      body: "I sing a bit — never for the stage, just because it makes the long build nights better.",
    },
    {
      scene: "terminal",
      kicker: "04 / TERMINAL",
      title: "It all feeds the craft.",
      body: "Play keeps the energy, chess keeps the patience, music keeps the rhythm — the code gets all of it.",
    },
  ];

  return (
    <section id="life" className="ls-root">
      <header className="simple-wrap simple-section ls-head">
        <motion.p {...fade()} className="simple-eyebrow">
          06 — Life
        </motion.p>
        <motion.h2 {...fade(0.05)} className="simple-h2">
          Beyond the code
        </motion.h2>
        <motion.p {...fade(0.1)} className="ls-sub">
          Three things I do purely for the love of them — and how they feed the work.
        </motion.p>
      </header>

      <div className="ls-banners">
        {rows.map((row) => (
          <SceneBanner
            key={row.scene}
            scene={row.scene}
            kicker={row.kicker}
            title={row.title}
            body={row.body}
            districtLink={row.districtLink}
            onEnterDistrict={onEnterDistrict}
            reduce={reduce}
          />
        ))}
      </div>

      <style jsx global>{`
        .ls-root {
          margin-top: 40px;
        }
        .ls-sub {
          margin-top: -18px;
          font-size: 15.5px;
          color: #a8b2bd;
          max-width: 34rem;
        }
        .ls-banners {
          display: flex;
          flex-direction: column;
        }
        .ls-banner {
          position: relative;
          height: clamp(440px, 72vh, 820px);
          overflow: hidden;
          background: #000;
        }
        .ls-bg {
          position: absolute;
          inset: -9% 0;
          line-height: 0;
        }
        .ls-bg video,
        .ls-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          line-height: 0;
        }
        .ls-shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.62) 0%,
              rgba(0, 0, 0, 0.18) 32%,
              rgba(0, 0, 0, 0.22) 58%,
              rgba(0, 0, 0, 0.88) 100%
            ),
            linear-gradient(90deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 55%);
        }
        .ls-banner-copy {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding-bottom: 56px;
          padding-top: 48px;
        }
        .ls-kicker {
          font-family: ${MONO};
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(168, 178, 189, 0.9);
          margin-bottom: 10px;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.9);
        }
        .ls-title {
          font-size: clamp(24px, 3.2vw, 34px);
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #fff;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.9);
        }
        .ls-body {
          margin-top: 10px;
          font-size: 15px;
          line-height: 1.65;
          color: #c8d2dc;
          max-width: 30rem;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.95);
        }
        .ls-district-link {
          margin-top: 14px;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────────────────────────
   Full-bleed banner: video bg + parallax + reveal
   ─────────────────────────────────────────────── */

function SceneBanner({
  scene,
  kicker,
  title,
  body,
  districtLink,
  onEnterDistrict,
  reduce,
}: {
  scene: Scene;
  kicker: string;
  title: string;
  body: string;
  districtLink?: boolean;
  onEnterDistrict: () => void;
  reduce: boolean | null;
}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

  const copyIn = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };

  return (
    <section ref={ref} className="ls-banner">
      <motion.div className="ls-bg" style={reduce ? undefined : { y: bgY }}>
        <LifeVideo scene={scene} live={!reduce} container={ref} />
      </motion.div>
      <div className="ls-shade" aria-hidden />
      <motion.div
        className="simple-wrap ls-banner-copy"
        style={reduce ? undefined : { y: copyY }}
        {...copyIn}
      >
        <p className="ls-kicker">{kicker}</p>
        <h3 className="ls-title">{title}</h3>
        <p className="ls-body">{body}</p>
        {districtLink && (
          <button className="simple-link ls-district-link" onClick={onEnterDistrict}>
            See the Football Arena in the 3D district →
            </button>
        )}
      </motion.div>
    </section>
  );
}

/* ───────────────────────
   Looping muted clip —
   plays only while on screen
   ─────────────────────── */

function LifeVideo({
  scene,
  live,
  container,
}: {
  scene: Scene;
  live: boolean;
  container: React.RefObject<HTMLElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    const w = container.current;
    if (!live || !v || !w) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(w);
    return () => io.disconnect();
  }, [live, container]);

  if (!live) {
    return (
      <img
        src={`/life/${scene}.webp`}
        alt=""
        style={{ objectPosition: FOCUS[scene] }}
      />
    );
  }

  const startPlay = () => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };

  return (
    <video
      ref={videoRef}
      src={`/life/${scene}.mp4`}
      poster={`/life/${scene}.webp`}
      muted
      loop
      playsInline
      preload="none"
      onLoadedData={startPlay}
      style={{ objectPosition: FOCUS[scene] }}
    />
  );
}
