"use client";

import { useState } from "react";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PaperCard } from "@/components/ui/PaperCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Slider } from "@/components/ui/Slider";
import { StampCheck } from "@/components/ui/StampCheck";
import { StickyNote } from "@/components/ui/StickyNote";
import { Tabs } from "@/components/ui/Tabs";
import { Toggle } from "@/components/ui/Toggle";
import { toast } from "@/components/ui/Toast";

export default function DevPage() {
  const [on, setOn] = useState(true);
  const [tab, setTab] = useState<"one" | "two">("one");
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(75);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold tracking-tighter">Style guide</h1>
      <div className="flex flex-wrap gap-2">
        <BrutalButton variant="ink">Ink</BrutalButton>
        <BrutalButton variant="paper">Paper</BrutalButton>
        <BrutalButton variant="tomato">Tomato</BrutalButton>
        <BrutalButton variant="sage">Sage</BrutalButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Ink</Badge>
        <Badge tone="sage">Sage</Badge>
        <Badge tone="tomato">Tomato</Badge>
        <StatusBadge status="SAFE" />
        <StatusBadge status="EDGE" />
        <StatusBadge status="DANGER" />
      </div>
      <Toggle pressed={on} onPressed={setOn} label="Stamp toggle" />
      <StampCheck checked={on} />
      <Tabs value={tab} onChange={setTab} items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }]} />
      <ProgressBar value={slide} label="Chunky bar" />
      <Slider label="Slider" min={50} max={90} value={slide} onChange={setSlide} />
      <Input label="Sample input" placeholder="Write in ink" />
      <div className="grid gap-3 sm:grid-cols-2">
        <PaperCard id="guide-card">Paper card with tape or fold</PaperCard>
        <StickyNote id="guide-note" color="lavender">
          Sticky note lift
        </StickyNote>
      </div>
      <EmptyState title="Empty doodle" body="Never a blank page." />
      <BrutalButton variant="paper" onClick={() => setOpen(true)}>
        Open modal
      </BrutalButton>
      <BrutalButton variant="ink" onClick={() => toast("Toast stamped", "sage")}>
        Toast
      </BrutalButton>
      <Modal open={open} title="Modal" onClose={() => setOpen(false)}>
        <p>Thick ink dialog.</p>
      </Modal>
    </div>
  );
}
