"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { AppShell } from "./AppShell";
import { CustomCursor } from "./CustomCursor";
import { NotebookLoader } from "./NotebookLoader";
import { ToastHost } from "./ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("cc-opened");
    if (seen) setBoot(false);
    const finish = () => {
      if (useAppStore.getState().hydrated) return;
      useAppStore.getState().setHydrated();
    };
    const unsub = useAppStore.persist.onFinishHydration(finish);
    if (useAppStore.persist.hasHydrated()) finish();
    return unsub;
  }, []);

  const done = useCallback(() => {
    sessionStorage.setItem("cc-opened", "1");
    setBoot(false);
  }, []);

  return (
    <>
      <div className="grain-overlay" />
      <div className="focus-tint" />
      {boot ? <NotebookLoader onDone={done} /> : null}
      <CustomCursor />
      <ToastHost />
      <AppShell>{children}</AppShell>
    </>
  );
}
