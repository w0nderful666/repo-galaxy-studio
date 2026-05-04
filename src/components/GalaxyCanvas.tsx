import { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetData } from "../lib/galaxy";
import type { ThemeConfig } from "../lib/themes";

interface GalaxyCanvasProps {
  planets: PlanetData[];
  theme: ThemeConfig;
  autoRotate: boolean;
  performanceMode: boolean;
  onSelect: (planet: PlanetData | null) => void;
  selectedRepoId: number | null;
}

function Planet({
  planet,
  theme,
  selected,
  onClick,
  performanceMode,
}: {
  planet: PlanetData;
  theme: ThemeConfig;
  selected: boolean;
  onClick: () => void;
  performanceMode: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (glowRef.current) {
      const scale = selected ? 1.6 : hovered ? 1.3 : 1.0;
      glowRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.1
      );
    }
  });

  const emissiveIntensity = selected ? 0.8 : hovered ? 0.5 : planet.brightness * 0.3;

  return (
    <group position={planet.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[planet.size, performanceMode ? 12 : 24, performanceMode ? 12 : 24]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Glow ring for selected */}
      {selected && (
        <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.size * 1.2, planet.size * 1.5, 32]} />
          <meshBasicMaterial
            color={theme.accent}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Satellite moons for forks */}
      {!performanceMode &&
        Array.from({ length: planet.satellites }).map((_, i) => {
          const angle = (i / planet.satellites) * Math.PI * 2;
          const dist = planet.size * 2 + i * 0.3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * dist, Math.sin(angle) * 0.3, Math.sin(angle) * dist]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={theme.accentSecondary} emissive={theme.accentSecondary} emissiveIntensity={0.2} />
            </mesh>
          );
        })}

      {/* Homepage glow ring */}
      {planet.hasHomepage && !performanceMode && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.size * 1.6, planet.size * 1.7, 32]} />
          <meshBasicMaterial color={theme.accent} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Label on hover */}
      {(hovered || selected) && (
        <Html distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: theme.panelBg,
              color: theme.text,
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              border: `1px solid ${theme.border}`,
              backdropFilter: "blur(8px)",
            }}
          >
            ⭐ {planet.repo.stargazers_count} · {planet.repo.language || "N/A"}
          </div>
        </Html>
      )}
    </group>
  );
}

function Scene({
  planets,
  theme,
  autoRotate,
  performanceMode,
  onSelect,
  selectedRepoId,
}: GalaxyCanvasProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const resetCamera = useCallback(() => {
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [camera]);

  // Expose resetCamera via a global
  if (typeof window !== "undefined") {
    (window as any).__resetGalaxyCamera = resetCamera;
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color={theme.accent} />
      <pointLight position={[20, 20, 20]} intensity={0.5} color={theme.accentSecondary} />

      <Stars
        radius={100}
        depth={50}
        count={performanceMode ? 2000 : 5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {planets.map((planet) => (
        <Planet
          key={planet.repo.id}
          planet={planet}
          theme={theme}
          selected={selectedRepoId === planet.repo.id}
          onClick={() => onSelect(planet)}
          performanceMode={performanceMode}
        />
      ))}

      {/* Central sun */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial color={theme.accent} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial color={theme.accent} transparent opacity={0.1} />
        </mesh>
      </Float>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={60}
        onPointerMissed={() => onSelect(null)}
      />
    </>
  );
}

export function GalaxyCanvas(props: GalaxyCanvasProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      data-testid="galaxy-canvas"
    >
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        dpr={props.performanceMode ? 1 : [1, 2]}
        gl={{ antialias: !props.performanceMode }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
