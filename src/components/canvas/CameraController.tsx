"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { universeData } from "@/data/ceratiUniverse";

interface Props {
  selectedPlanet: string | null;
  sceneRevealed: boolean;
}

export const CameraController = ({ selectedPlanet, sceneRevealed }: Props) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const prevSelected = useRef<string | null>(null);
  const zoomBurst = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useFrame(() => {
    // detectamos cambio de planeta seleccionado para activar zoom burst
    if (prevSelected.current !== selectedPlanet) {
      if (selectedPlanet) {
        zoomBurst.current = 1.0;
      } else {
        zoomBurst.current = 0;
      }
      prevSelected.current = selectedPlanet;
    }

    if (selectedPlanet) {
      const planet = universeData.find((p) => p.id === selectedPlanet);
      if (planet) {
        // mobil: un poco más alejado para compensar menor campo de visión, y más arriba para mejor encuadre
        const selOffsetX = isMobile ? planet.radius + 5 : planet.radius + 3;
        const selOffsetY = isMobile ? 2 : 1;
        const selOffsetZ = isMobile ? 6 : 4;
        // más burst para mobile porque el zoom se siente menos intenso por el campo de visión más amplio, y también porque el encuadre más alejado hace que el movimiento sea más notorio. En desktop, el burst es más sutil para evitar que el zoom se sienta demasiado brusco dada la proximidad al planeta.
        const burstFactor = 0.03 + zoomBurst.current * (isMobile ? 0.06 : 0.12);
        camera.position.lerp(new THREE.Vector3(selOffsetX, selOffsetY, selOffsetZ), burstFactor);
        if (controlsRef.current) {
          controlsRef.current.target.lerp(new THREE.Vector3(planet.radius, 0, 0), burstFactor);
          controlsRef.current.autoRotate = false;
          controlsRef.current.enableZoom = true;
        }
      }
    } else {
      const cameraTarget = sceneRevealed
        ? (isMobile ? new THREE.Vector3(0, 6, 16) : new THREE.Vector3(0, 8, 20))
        : (isMobile ? new THREE.Vector3(0, 8, 26) : new THREE.Vector3(0, 12, 32));
      camera.position.lerp(cameraTarget, sceneRevealed ? (isMobile ? 0.02 : 0.03) : (isMobile ? 0.01 : 0.015));
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.03);
        controlsRef.current.autoRotate = !selectedPlanet;
        controlsRef.current.enableZoom = sceneRevealed;
        controlsRef.current.autoRotateSpeed = sceneRevealed ? (isMobile ? 0.12 : 0.2) : (isMobile ? 0.04 : 0.06);
      }
    }

    // el zoom burst se va atenuando gradualmente para crear un efecto de impulso suave al seleccionar un planeta
    zoomBurst.current *= 0.85;
  });

  return (
    <OrbitControls 
      ref={controlsRef} 
      enableZoom={sceneRevealed} 
      enablePan={false} 
      autoRotate={!selectedPlanet} 
      autoRotateSpeed={sceneRevealed ? (isMobile ? 0.12 : 0.2) : (isMobile ? 0.04 : 0.06)} 
      enableDamping
      dampingFactor={0.06}
    />
  );
};