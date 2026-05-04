import { useState, useMemo } from "react";
import type { PlanetData } from "../lib/galaxy";
import type { ThemeConfig } from "../lib/themes";

interface WebGLFallbackProps {
  planets: PlanetData[];
  theme: ThemeConfig;
  onSelect: (planet: PlanetData | null) => void;
  selectedRepoId: number | null;
}

export function WebGLFallback({
  planets,
  theme,
  onSelect,
  selectedRepoId,
}: WebGLFallbackProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const viewBox = useMemo(() => {
    if (planets.length === 0) return "-20 -20 40 40";
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of planets) {
      const x = p.position[0];
      const y = p.position[2];
      minX = Math.min(minX, x - 3);
      maxX = Math.max(maxX, x + 3);
      minY = Math.min(minY, y - 3);
      maxY = Math.max(maxY, y + 3);
    }
    const pad = 5;
    return `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
  }, [planets]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        background: theme.bg,
      }}
      data-testid="webgl-fallback"
    >
      <svg
        viewBox={viewBox}
        style={{ width: "100%", height: "100%" }}
        onClick={() => onSelect(null)}
      >
        {/* Background stars */}
        {Array.from({ length: 100 }).map((_, i) => (
          <circle
            key={`star-${i}`}
            cx={((i * 37 + 13) % 60) - 30}
            cy={((i * 53 + 7) % 60) - 30}
            r={0.05 + (i % 3) * 0.03}
            fill={theme.starField}
            opacity={0.3 + (i % 5) * 0.12}
          />
        ))}

        {/* Planets */}
        {planets.map((planet) => {
          const x = planet.position[0];
          const y = planet.position[2];
          const isSelected = selectedRepoId === planet.repo.id;
          const isHovered = hoveredId === planet.repo.id;
          const r = planet.size * 0.4;

          return (
            <g
              key={planet.repo.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(planet);
              }}
              onMouseEnter={() => setHoveredId(planet.repo.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Glow */}
              {(isSelected || isHovered) && (
                <circle
                  cx={x}
                  cy={y}
                  r={r * 1.8}
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth={0.08}
                  opacity={0.6}
                />
              )}

              {/* Planet */}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={planet.color}
                opacity={planet.isArchived ? 0.3 : planet.brightness}
              />

              {/* Homepage ring */}
              {planet.hasHomepage && (
                <circle
                  cx={x}
                  cy={y}
                  r={r * 1.4}
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth={0.04}
                  opacity={0.3}
                  strokeDasharray="0.2 0.2"
                />
              )}

              {/* Satellites */}
              {planet.satellites > 0 &&
                Array.from({ length: planet.satellites }).map((_, i) => {
                  const angle = (i / planet.satellites) * Math.PI * 2;
                  const dist = r * 2;
                  return (
                    <circle
                      key={i}
                      cx={x + Math.cos(angle) * dist}
                      cy={y + Math.sin(angle) * dist}
                      r={0.06}
                      fill={theme.accentSecondary}
                      opacity={0.6}
                    />
                  );
                })}

              {/* Label */}
              {(isHovered || isSelected) && (
                <text
                  x={x}
                  y={y - r - 0.4}
                  textAnchor="middle"
                  fill={theme.text}
                  fontSize="0.5"
                  style={{ pointerEvents: "none" }}
                >
                  {planet.repo.name} ⭐{planet.repo.stargazers_count}
                </text>
              )}
            </g>
          );
        })}

        {/* Central sun */}
        <circle cx={0} cy={0} r={0.6} fill={theme.accent} opacity={0.8} />
        <circle cx={0} cy={0} r={1} fill={theme.accent} opacity={0.1} />
      </svg>
    </div>
  );
}
