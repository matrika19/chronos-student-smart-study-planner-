"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Flame,
  Home,
  Palette,
  Timer,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Ticker } from "./Ticker";

const NAV = [
  { href: "/", label: "Desk", icon: Home },
  { href: "/timetable", label: "Grid", icon: Calendar },
  { href: "/attendance", label: "Roll", icon: CheckSquare },
  { href: "/exams", label: "Marks", icon: BookOpen },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/squad", label: "Squad", icon: Users },
  { href: "/dev", label: "Kit", icon: Palette },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-paper">
      <Ticker />
      <div className="mx-auto flex max-w-6xl gap-4 px-3 pb-24 pt-4 md:pb-8">
        <aside className="sticky top-4 hidden h-fit w-44 shrink-0 md:block">
          <p className="mb-3 flex items-center gap-1 font-display text-lg font-bold tracking-tighter">
            <Flame className="h-4 w-4" /> Chronos
          </p>
          <nav className="flex flex-col gap-3">
            {NAV.map((item, i) => {
              const active = path === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "brutal-hover flex items-center gap-2 border-[3px] border-ink px-3 py-2 font-display text-sm font-bold shadow-brutal",
                    active ? "bg-ink text-paper" : "bg-butter"
                  )}
                  style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto border-t-[3px] border-ink bg-paper md:hidden">
        {NAV.map((item) => {
          const active = path === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-[4.5rem] flex-1 flex-col items-center gap-0.5 py-2 font-display text-[10px] font-bold",
                active ? "bg-ink text-paper" : "text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
