"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@/components/canvas/Stars";
import { Nebulae } from "@/components/canvas/Nebulae";
import { SolarSystem } from "@/components/canvas/SolarSystem";
import { CameraController } from "@/components/canvas/CameraController";
import { Comets } from "@/components/canvas/Comets";
import { universeData } from "@/data/ceratiUniverse";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Home() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const [sceneRevealed, setSceneRevealed] = useState(false);
  const planetInfo = universeData.find((p) => p.id === selectedPlanet);
  const songsContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToSong = useCallback((index: number) => {
    if (!songsContainerRef.current || !planetInfo) return;
    const id = `${planetInfo.id}-song-${index}`;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [planetInfo]);

  const prevScrollRef = useRef<number>(0);

  const nebulaSettings = (() => {
    if (!planetInfo) {
      return { colorA: "#071122", colorB: "#0b2740", scale: 1.2, intensity: 0.45, active: false as const, center: [0, 0, 0] as [number, number, number], ringStrength: 0.75, twist: 0.35, seed: 0 };
    }
    try {
      const c = new THREE.Color(planetInfo.color || "#ffffff");
      const seed = planetInfo.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hueOffset = ((seed % 23) - 11) / 100;
      const nebula = planetInfo.nebula;
      const dark = c.clone().offsetHSL(hueOffset * 0.5, -0.18, -0.16).multiplyScalar(0.42);
      const accent = c.clone().offsetHSL(hueOffset, 0.12, 0.06);
      const scale = nebula.scale;
      const intensity = nebula.intensity;
      const ringStrength = nebula.ringStrength;
      const twist = nebula.twist;
      return { colorA: accent.getStyle(), colorB: dark.getStyle(), scale, intensity, active: true as const, center: [planetInfo.radius, 0, 0] as [number, number, number], ringStrength, twist, seed: seed / 1000 };
    } catch (e) {
      return { colorA: "#071122", colorB: "#0b2740", scale: 1.2, intensity: 0.45, active: false as const, center: [0, 0, 0] as [number, number, number], ringStrength: 0.75, twist: 0.35, seed: 0 };
    }
  })();

  useEffect(() => {
    if (selectedPlanet) {
      prevScrollRef.current = window.scrollY || window.pageYOffset || 0;
      // prevenir scroll en mobile para evitar que el panel se desplace inesperadamente al abrirse
      try { document.body.style.overflow = 'hidden'; } catch { }
      // al abrir el panel, llevar scroll a top para evitar que el contenido se muestre parcialmente y genere confusión
      window.scrollTo({ top: 0, left: 0 });
    } else {
      try { document.body.style.overflow = ''; } catch { }
      // al cerrar el panel, restaurar la posición de scroll previa para evitar que el usuario pierda su lugar en la página
      window.scrollTo({ top: prevScrollRef.current, left: 0 });
    }
  }, [selectedPlanet]);

  useEffect(() => {
    // si el panel de canciones está abierto y se selecciona otro planeta, resetear scroll a top para mostrar el nuevo contenido desde el inicio
    if (songsContainerRef.current) {
      songsContainerRef.current.scrollTop = 0;
    }
  }, [selectedPlanet]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroReady(true), 120);

    return () => window.clearTimeout(timer);
  }, []);

  const handleEnterUniverse = () => {
    setIntroVisible(false);
    window.setTimeout(() => setSceneRevealed(true), 650);
  };

  return (
    <main className="w-full h-screen bg-cerati-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.2)_30%,rgba(0,0,0,0.9)_68%,rgba(0,0,0,1)_100%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.4)_100%)]" />

      <div
        className={`absolute inset-0 z-20 flex items-center justify-center px-6 transition-all duration-700 ${introVisible ? "opacity-100 scale-100" : "opacity-0 scale-[1.02] pointer-events-none"
          }`}
      >
        <div className="relative w-full max-w-4xl text-center">
          <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-pulse-glow" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl animate-float" />

          <p
            className={`mb-6 text-[0.7rem] uppercase tracking-[0.6em] text-white/45 transition-all duration-700 ${introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            En cada mínimo detalle creo oír tu voz...
          </p>

          <h1
            className={`text-white text-4xl sm:text-6xl md:text-7xl tracking-[0.28em] font-light drop-shadow-[0_0_18px_rgba(255,255,255,0.38)] transition-all duration-1000 ${introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            UNIVERSO CERATI
          </h1>

          <p
            className={`text-white mx-auto mt-8 max-w-2xl text-sm sm:text-base leading-relaxed text-white/58 tracking-wide transition-all duration-1000 delay-150 ${introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            Un viaje 3D por la discografía solista de Gustavo Adrián Cerati,
            donde cada planeta abre una interpretación íntima de su obra.
          </p>

          <div
            className={`mt-10 flex flex-col items-center justify-center gap-4 transition-all duration-1000 delay-300 ${introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <button
              onClick={handleEnterUniverse}
              className="rounded-full border border-white/15 bg-white/10 px-7 py-3 text-xs font-medium uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-white/18 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Entrar al viaje
            </button>
            <p className="max-w-xl text-[0.72rem] uppercase tracking-[0.35em] text-white/30">
              Haz clic en un planeta para recorrer álbumes, canciones y símbolos.
            </p>
          </div>

          <div
            className={`mt-10 flex flex-wrap items-center justify-center gap-3 transition-all duration-1000 delay-500 ${introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] uppercase tracking-[0.32em] text-white/40 backdrop-blur-sm">
              5 álbumes
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] uppercase tracking-[0.32em] text-white/40 backdrop-blur-sm">
              Exploración interactiva
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] uppercase tracking-[0.32em] text-white/40 backdrop-blur-sm">
              Lectura emocional
            </span>
          </div>
        </div>
      </div>

      {selectedPlanet && planetInfo && (
        <div className="fixed inset-0 z-20 pointer-events-none flex items-center p-10 animate-fade-in">
          <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl pointer-events-auto panel-bloom"
            style={{ ['--bloom-color' as any]: planetInfo.color }}>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-white/50 hover:text-white mb-6 text-xs tracking-widest transition-colors uppercase"
            >
            Volver al sistema
            </button>
            <h2
              className="text-4xl font-light tracking-wider mb-1"
              style={{ color: planetInfo.color, textShadow: `0 0 10px ${planetInfo.color}80` }}
            >
              {planetInfo.title}
            </h2>
            <p className="text-white/40 mb-8 tracking-widest text-sm">{planetInfo.year}</p>

            <div ref={songsContainerRef} className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar panel-content">
              {planetInfo.songs.map((song, index) => (
                <div id={`${planetInfo.id}-song-${index}`} key={index} className="border-l border-white/20 pl-4 py-2">
                  <h3 className="text-white/90 text-lg mb-1 tracking-wide">{song.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed font-light italic">
                    "{song.symbolism}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 8, 20], fov: 45 }}
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => { try { e.stopPropagation(); e.preventDefault(); } catch { } }}
        onWheel={(e) => { try { e.preventDefault(); e.stopPropagation(); } catch { } }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#fde047" />
        <Nebulae
          colorA={nebulaSettings.colorA}
          colorB={nebulaSettings.colorB}
          scale={nebulaSettings.scale}
          intensity={nebulaSettings.intensity}
          active={nebulaSettings.active}
          center={nebulaSettings.center}
          ringStrength={nebulaSettings.ringStrength}
          twist={nebulaSettings.twist}
          seed={nebulaSettings.seed}
        />
        <Stars />
        <Comets />
        <SolarSystem
          onSelect={(id: string) => setSelectedPlanet(id)}
          selectedPlanet={selectedPlanet}
          sceneRevealed={sceneRevealed}
          onSatelliteHover={(songIndex: number) => scrollToSong(songIndex)}
        />
        <CameraController selectedPlanet={selectedPlanet} sceneRevealed={sceneRevealed} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.9} kernelSize={3} />
        </EffectComposer>
      </Canvas>
    </main>
  );
}