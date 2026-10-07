export type FlowLabel = "Deep focus" | "Break" | "Cramming" | "Idle";

export type Peer = {
  id: string;
  name: string;
  subject: string;
  flow: FlowLabel;
  x: number;
  y: number;
  color: string;
  self?: boolean;
};

const NAMES = ["Aisha", "Dev", "Kiran", "Mira", "Paul"] as const;
const SUBJECTS = ["DS", "DBMS", "WMAD", "OOPP", "DMGT"] as const;
const FLOWS: FlowLabel[] = ["Deep focus", "Break", "Cramming", "Idle"];
const COLORS = ["#CFE3C8", "#F6E7A1", "#D9CCF0", "#F7D3C1", "#CDE4F2"];

function tick(selfFocus: boolean): Peer[] {
  const t = Date.now() / 1000;
  const peers: Peer[] = NAMES.map((name, i) => ({
    id: `peer-${i}`,
    name,
    subject: SUBJECTS[i],
    flow: FLOWS[(Math.floor(t / 3) + i) % FLOWS.length],
    x: 18 + i * 15 + Math.sin(t / 2 + i) * 6,
    y: 28 + (i % 3) * 18 + Math.cos(t / 2.4 + i) * 5,
    color: COLORS[i],
  }));
  peers.push({
    id: "self",
    name: "You",
    subject: selfFocus ? "Focus" : "Desk",
    flow: selfFocus ? "Deep focus" : "Idle",
    x: 48 + Math.sin(t / 3) * 4,
    y: 62,
    color: "#121212",
    self: true,
  });
  return peers;
}

export function subscribe(
  callback: (peers: Peer[]) => void,
  isFocusing: () => boolean
): () => void {
  callback(tick(isFocusing()));
  const id = window.setInterval(() => callback(tick(isFocusing())), 900);
  return () => window.clearInterval(id);
}
