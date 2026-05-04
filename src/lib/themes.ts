export interface ThemeConfig {
  id: string;
  name: string;
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentSecondary: string;
  border: string;
  panelBg: string;
  cardBg: string;
  success: string;
  warning: string;
  danger: string;
  starField: string;
  nebulaColor1: string;
  nebulaColor2: string;
}

export const themes: Record<string, ThemeConfig> = {
  "deep-space": {
    id: "deep-space",
    name: "Deep Space",
    bg: "#0a0a1a",
    bgSecondary: "#111128",
    text: "#e0e0f0",
    textSecondary: "#8888aa",
    accent: "#6366f1",
    accentSecondary: "#818cf8",
    border: "#1e1e3a",
    panelBg: "rgba(10, 10, 30, 0.92)",
    cardBg: "rgba(20, 20, 50, 0.8)",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
    starField: "#ffffff",
    nebulaColor1: "#4c1d95",
    nebulaColor2: "#1e3a5f",
  },
  "neon-cyber": {
    id: "neon-cyber",
    name: "Neon Cyber",
    bg: "#0d0221",
    bgSecondary: "#150530",
    text: "#f0e6ff",
    textSecondary: "#b088cc",
    accent: "#ff006e",
    accentSecondary: "#00f5d4",
    border: "#2a1050",
    panelBg: "rgba(13, 2, 33, 0.92)",
    cardBg: "rgba(25, 8, 55, 0.8)",
    success: "#00f5d4",
    warning: "#fee440",
    danger: "#ff006e",
    starField: "#ccddff",
    nebulaColor1: "#ff006e",
    nebulaColor2: "#00f5d4",
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    bg: "#0c0c0c",
    bgSecondary: "#141414",
    text: "#00ff41",
    textSecondary: "#008f11",
    accent: "#00ff41",
    accentSecondary: "#00cc33",
    border: "#1a3a1a",
    panelBg: "rgba(12, 12, 12, 0.95)",
    cardBg: "rgba(20, 20, 20, 0.85)",
    success: "#00ff41",
    warning: "#ffcc00",
    danger: "#ff3333",
    starField: "#33ff66",
    nebulaColor1: "#003300",
    nebulaColor2: "#001a33",
  },
  aurora: {
    id: "aurora",
    name: "Aurora",
    bg: "#0a1628",
    bgSecondary: "#0f1f35",
    text: "#e0f0ff",
    textSecondary: "#7aa8c8",
    accent: "#22d3ee",
    accentSecondary: "#a78bfa",
    border: "#1a2d4a",
    panelBg: "rgba(10, 22, 40, 0.92)",
    cardBg: "rgba(15, 30, 55, 0.8)",
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#f87171",
    starField: "#ddeeff",
    nebulaColor1: "#22d3ee",
    nebulaColor2: "#a78bfa",
  },
};

export type ThemeId = keyof typeof themes;

export function getTheme(id: string): ThemeConfig {
  return themes[id] || themes["deep-space"];
}
