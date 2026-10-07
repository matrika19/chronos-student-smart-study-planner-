"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { PaperCard } from "@/components/ui/PaperCard";
import { SkeletonDesk } from "@/components/ui/Skeleton";
import { StickyNote } from "@/components/ui/StickyNote";
import { useFocusLive, useHydrated } from "@/lib/repo";
import { subscribe, type Peer } from "@/lib/squad";

export default function SquadPage() {
  const hydrated = useHydrated();
  const live = useFocusLive();
  const reduce = useReducedMotion();
  const [peers, setPeers] = useState<Peer[]>([]);
  const [notes, setNotes] = useState<number[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    return subscribe(setPeers, () => Boolean(live));
  }, [hydrated, live]);

  if (!hydrated) return <SkeletonDesk />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold tracking-tighter">Squad canvas</h1>
      <PaperCard id="board" padded={false} className="relative h-[420px] overflow-hidden bg-dotted">
        {peers.map((p) => (
          <motion.div
            key={p.id}
            className="absolute flex h-16 w-16 flex-col items-center justify-center rounded-full border-[3px] border-ink font-display text-[10px] font-bold"
            style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.self ? "#121212" : p.color, color: p.self ? "#F9F6F0" : "#121212" }}
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3 + (p.self ? 0 : 0.4), ease: "easeInOut" }}
          >
            {p.name}
            <span className="text-[8px] opacity-80">{p.flow}</span>
          </motion.div>
        ))}
        {notes.map((n) => (
          <motion.div
            key={n}
            className="absolute"
            initial={{ scale: 0, x: 80, y: 80 }}
            animate={{ scale: 1, x: 40 + (n % 5) * 18, y: 30 + (n % 3) * 22 }}
          >
            <StickyNote id={`nudge-${n}`} color="butter" className="w-28 text-xs">
              Nudge! back to the desk.
            </StickyNote>
          </motion.div>
        ))}
      </PaperCard>
      <BrutalButton variant="ink" onClick={() => setNotes((n) => [...n, Date.now()])}>
        Send a nudge
      </BrutalButton>
      <p className="text-sm opacity-70">Mock peers via lib/squad.ts — swap subscribe() for realtime later.</p>
    </div>
  );
}
