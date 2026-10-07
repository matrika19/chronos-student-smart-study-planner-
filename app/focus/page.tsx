"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { PaperCard } from "@/components/ui/PaperCard";
import { SkeletonDesk } from "@/components/ui/Skeleton";
import { Slider } from "@/components/ui/Slider";
import { Tabs } from "@/components/ui/Tabs";
import { todayKey } from "@/lib/dates";
import { repo, useFocusSessions, useHydrated } from "@/lib/repo";
import type { FocusMode } from "@/lib/types";

const THEMES: Record<FocusMode, { grain: string; temp: string; tint: string; label: string }> = {
  lofi: { grain: "0.08", temp: "20deg", tint: "rgba(217,204,240,0.28)", label: "Late Night Lo-Fi Library" },
  rain: { grain: "0.12", temp: "180deg", tint: "rgba(205,228,242,0.35)", label: "Rainy Dorm" },
  cafe: { grain: "0.07", temp: "-20deg", tint: "rgba(247,211,193,0.32)", label: "Sunny Cafe" },
};

export default function FocusPage() {
  const hydrated = useHydrated();
  const sessions = useFocusSessions();
  const [mode, setMode] = useState<FocusMode>("lofi");
  const [work, setWork] = useState(25);
  const [brk, setBrk] = useState(5);
  const [phase, setPhase] = useState<"work" | "break">("work");
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(25 * 60);
  const [audioOn, setAudioOn] = useState(false);
  const endRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  useEffect(() => {
    const t = THEMES[mode];
    const root = document.documentElement;
    root.style.setProperty("--grain", t.grain);
    root.style.setProperty("--grain-temp", t.temp);
    root.style.setProperty("--focus-tint", t.tint);
    return () => {
      root.style.setProperty("--grain", "0.06");
      root.style.setProperty("--grain-temp", "40deg");
      root.style.setProperty("--focus-tint", "transparent");
    };
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const end = endRef.current;
      if (!end) return;
      const sec = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(sec);
      if (sec <= 0) {
        setRunning(false);
        endRef.current = null;
        repo.setFocusLive(null);
        if (phase === "work") {
          repo.addFocusSession({
            id: `fs-${Date.now()}`,
            date: todayKey(),
            minutes: work,
            mode,
          });
          setPhase("break");
          setLeft(brk * 60);
        } else {
          setPhase("work");
          setLeft(work * 60);
        }
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running, phase, work, brk, mode]);

  const stopAudio = useCallback(() => {
    nodesRef.current.forEach((n) => {
      if ("stop" in n && typeof (n as AudioBufferSourceNode).stop === "function") {
        (n as AudioBufferSourceNode).stop();
      }
      n.disconnect();
    });
    nodesRef.current = [];
    void ctxRef.current?.close();
    ctxRef.current = null;
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  function startAudio() {
    stopAudio();
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = mode === "rain" ? last * 1.4 : white * 0.35 + last * 0.8;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = mode === "cafe" ? 1800 : 900;
    const gain = ctx.createGain();
    gain.gain.value = 0.18;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    nodesRef.current = [src, filter, gain];
  }

  if (!hydrated) return <SkeletonDesk />;
  const todayMin = sessions.filter((s) => s.date === todayKey()).reduce((a, s) => a + s.minutes, 0);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold tracking-tighter">Focus studio</h1>
      <Tabs
        value={mode}
        onChange={setMode}
        items={[
          { id: "lofi" as const, label: "Lo-Fi Library" },
          { id: "rain" as const, label: "Rainy Dorm" },
          { id: "cafe" as const, label: "Sunny Cafe" },
        ]}
      />
      <PaperCard id="doodle">
        {mode === "rain" ? <RainDoodle /> : mode === "cafe" ? <CafeDoodle /> : <LibDoodle />}
        <p className="mt-2 font-display font-bold">{THEMES[mode].label}</p>
      </PaperCard>
      <PaperCard id="timer" className="text-center">
        <p className="font-display text-xs font-bold uppercase">{phase}</p>
        <p className="font-display text-6xl font-bold tabular tracking-tighter">
          {mm}:{ss}
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <BrutalButton
            variant="sage"
            onClick={() => {
              const secs = left > 0 ? left : (phase === "work" ? work : brk) * 60;
              endRef.current = Date.now() + secs * 1000;
              setRunning(true);
              if (phase === "work") repo.setFocusLive({ mode, startedAt: Date.now() });
            }}
          >
            Start
          </BrutalButton>
          <BrutalButton
            variant="tomato"
            onClick={() => {
              setRunning(false);
              endRef.current = null;
              repo.setFocusLive(null);
            }}
          >
            Stop
          </BrutalButton>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Slider label="Work minutes" min={15} max={50} value={work} onChange={(v) => { setWork(v); if (!running && phase === "work") setLeft(v * 60); }} />
          <Slider label="Break minutes" min={3} max={15} value={brk} onChange={(v) => { setBrk(v); if (!running && phase === "break") setLeft(v * 60); }} />
        </div>
        <BrutalButton
          className="mt-3"
          variant={audioOn ? "ink" : "paper"}
          onClick={() => {
            if (audioOn) {
              stopAudio();
              setAudioOn(false);
            } else {
              startAudio();
              setAudioOn(true);
            }
          }}
        >
          Ambient {audioOn ? "on" : "off"}
        </BrutalButton>
        <p className="mt-2 text-sm">Today: {todayMin} focus minutes</p>
      </PaperCard>
    </div>
  );
}

function RainDoodle() {
  return (
    <div className="relative h-24 overflow-hidden border-[3px] border-ink bg-sky">
      <div className="absolute inset-0" style={{ animation: "rain 0.8s linear infinite", backgroundImage: "repeating-linear-gradient(120deg, transparent 0 8px, #121212 8px 9px)" }} />
    </div>
  );
}
function CafeDoodle() {
  return (
    <svg viewBox="0 0 320 96" className="h-24 w-full border-[3px] border-ink bg-peach">
      <circle cx="60" cy="48" r="18" fill="#F6E7A1" stroke="#121212" strokeWidth="3" />
      <rect x="140" y="40" width="80" height="36" fill="#F9F6F0" stroke="#121212" strokeWidth="3" />
      <path d="M220 48h16" stroke="#121212" strokeWidth="3" />
    </svg>
  );
}
function LibDoodle() {
  return (
    <svg viewBox="0 0 320 96" className="h-24 w-full border-[3px] border-ink bg-lavender">
      <rect x="20" y="20" width="20" height="56" fill="#CFE3C8" stroke="#121212" strokeWidth="3" />
      <rect x="44" y="28" width="16" height="48" fill="#F6E7A1" stroke="#121212" strokeWidth="3" />
      <rect x="64" y="16" width="24" height="60" fill="#F7D3C1" stroke="#121212" strokeWidth="3" />
      <circle cx="240" cy="36" r="14" fill="#F6E7A1" stroke="#121212" strokeWidth="3" />
    </svg>
  );
}
