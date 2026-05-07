"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
//import { FloatingLyrics } from "./FloatingLyrics";

interface PlanetProps {
  data: any;
  onSelect: (id: string) => void;
  isSelected: boolean;
  sceneRevealed: boolean;
  dimmed?: boolean;
  onSatelliteHover?: (songIndex: number) => void;
}

export const Planet = ({ data, onSelect, isSelected, sceneRevealed, dimmed, onSatelliteHover }: PlanetProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const revealProgress = useRef(0);
  const dimProgress = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const satellitesGroupRef = useRef<THREE.Group>(null);
  const satelliteAngles = useRef<number[]>([]);
  const lastHoverRef = useRef<{ index: number; time: number }>({ index: -1, time: 0 });

  // crea texturas de ruido y brillo para el material del planeta, usando un gradiente radial para el brillo basado en el color del planeta, y una textura de ruido generada aleatoriamente para darle un aspecto más orgánico. Esto se hace dentro de un useEffect para que se ejecute solo una vez al montar el componente, o cuando cambie el color del planeta.
  useEffect(() => {
    if (!materialRef.current) return;
    try {
      const c1 = document.createElement('canvas');
      c1.width = 256; c1.height = 256;
      const ctx1 = c1.getContext('2d')!;
      const grad = ctx1.createRadialGradient(128,128,10,128,128,140);
      grad.addColorStop(0, data.color);
      grad.addColorStop(0.5, data.color + '88');
      grad.addColorStop(1, '#00000000');
      ctx1.fillStyle = grad as any;
      ctx1.fillRect(0,0,256,256);
      const emissive = new THREE.CanvasTexture(c1);
      emissive.needsUpdate = true;

      const c2 = document.createElement('canvas');
      c2.width = 256; c2.height = 256;
      const ctx2 = c2.getContext('2d')!;
      const img = ctx2.createImageData(256,256);
      for (let i=0;i<img.data.length;i+=4){
        const v = Math.floor(Math.random()*200)+55;
        img.data[i]=v; img.data[i+1]=v; img.data[i+2]=v; img.data[i+3]=255;
      }
      ctx2.putImageData(img,0,0);
      const noise = new THREE.CanvasTexture(c2);
      noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
      noise.repeat.set(2,2);
      noise.needsUpdate = true;

      materialRef.current.emissiveMap = emissive as any;
      materialRef.current.map = noise as any;
      materialRef.current.emissiveIntensity = 0.9;
      materialRef.current.needsUpdate = true;
    } catch (e) {
      // en caso de error (por ejemplo, si el navegador no soporta canvas), simplemente no se aplican las texturas y el planeta se renderiza con un material básico sin ruido ni brillo personalizado. Esto asegura que el componente siga funcionando aunque no se puedan generar las texturas.
    }
  }, [data.color]);

    useFrame(() => {
      const targetReveal = sceneRevealed ? 1 : 0;
      revealProgress.current = THREE.MathUtils.lerp(revealProgress.current, targetReveal, 0.06);

      const targetDim = dimmed ? 1 : 0;
      dimProgress.current = THREE.MathUtils.lerp(dimProgress.current, targetDim, 0.08);

      if (groupRef.current) {
        // escala base que crece al revelarse el planeta, con un crecimiento adicional cuando está seleccionado; además, cuando está atenuado, se escala aún más hacia abajo para enfatizar el efecto de atenuación (más fuerte en mobile para compensar la menor reducción de opacidad). La posición vertical también se ajusta para que el planeta emerja desde abajo a medida que se revela. En mobile, el crecimiento es un poco más lento y el tamaño final es ligeramente menor para adaptarse a la pantalla más pequeña.
        const base = isMobile ? 0.18 : 0.22;
        const growth = isMobile ? 0.6 : 0.78;
        const baseScale = base + revealProgress.current * growth;
        // cuando el planeta está atenuado, aplicamos una reducción adicional al tamaño para enfatizar el efecto de atenuación. Esta reducción es más pronunciada en mobile para compensar la menor reducción de opacidad, haciendo que los planetas atenuados se sientan más distantes y menos prominentes. La posición vertical también se ajusta para que el planeta emerja desde abajo a medida que se revela, con un movimiento ligeramente más lento en mobile para un efecto más suave.
        const dimScaleFactor = isMobile ? 0.55 : 0.45;
        const dimScale = 1 - dimProgress.current * dimScaleFactor;
        groupRef.current.scale.setScalar(baseScale * dimScale);
        groupRef.current.position.y = (1 - revealProgress.current) * (isMobile ? 1.6 : 1.2);

        if (!isSelected && !dimmed) {
          // más lento en mobile para compensar la sensación de movimiento más rápido debido al tamaño más pequeño y al campo de visión más amplio, haciendo que la rotación se sienta más suave y menos frenética en pantallas pequeñas. En desktop, la velocidad es un poco más rápida para mantener el interés visual dado el mayor tamaño y campo de visión.
          groupRef.current.rotation.y += data.speed * (isMobile ? 0.7 : 1);
        } else if (isSelected) {
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.07);
        }
      }

      if (planetRef.current) {
        // rotacion más lenta cuando el planeta está atenuado para enfatizar la sensación de que está perdiendo energía o alejándose, y también más lento en mobile para compensar la sensación de movimiento más rápido debido al tamaño más pequeño y al campo de visión más amplio. En desktop, la rotación es un poco más rápida para mantener el interés visual dado el mayor tamaño y campo de visión. Además, cuando el planeta está seleccionado, la rotación se detiene gradualmente para darle una sensación de estabilidad y enfoque.
        const baseRot = isMobile ? 0.006 : 0.01;
        const rotSpeed = dimProgress.current > 0.08 ? 0.0 : baseRot;
        planetRef.current.rotation.y += rotSpeed;
      }

      if (materialRef.current) {
        // hacer que el planeta se desvanezca gradualmente al revelarse, y que se atenúe aún más cuando está atenuado para enfatizar el efecto de atenuación (más fuerte en mobile para compensar la menor reducción de tamaño). Esto crea una sensación de que el planeta emerge lentamente y luego pierde energía o se aleja cuando está atenuado. En mobile, la opacidad final es un poco menor para adaptarse a la pantalla más pequeña y al campo de visión más amplio, haciendo que los planetas atenuados se sientan más distantes y menos prominentes.
        const dimFactor = isMobile ? 0.8 : 0.7;
        const opacity = revealProgress.current * (1 - dimProgress.current * dimFactor);
        materialRef.current.opacity = opacity;
      }

      // satelites orbitando alrededor del planeta seleccionado, con una velocidad base que se incrementa ligeramente en mobile para compensar la sensación de movimiento más rápido debido al tamaño más pequeño y al campo de visión más amplio. Las posiciones de los satélites se actualizan en cada frame para crear una órbita suave, y también se les aplica un pequeño movimiento vertical oscilante para darles un aspecto más dinámico. Además, se utiliza un sistema de ángulos almacenados en un ref para mantener la posición de cada satélite entre frames, lo que permite que la órbita sea continua incluso si el componente se vuelve a renderizar.
      if (satellitesGroupRef.current && data.songs && data.songs.length) {
        const baseSpeed = (data.speed || 0.007) * 0.9;
        if (!satelliteAngles.current.length) satelliteAngles.current = data.songs.map((_: any, i: number) => (i / Math.max(1, data.songs.length)) * Math.PI * 2);
        satelliteAngles.current = satelliteAngles.current.map((a) => a + baseSpeed * (isMobile ? 0.4 : 1));
        satellitesGroupRef.current.children.forEach((child, i) => {
          const ang = satelliteAngles.current[i] || 0;
          const r = 1.6 + (i % 3) * 0.14;
          const x = Math.cos(ang) * r;
          const z = Math.sin(ang) * r;
          child.position.set(x, 0.12 + Math.sin(ang * 1.2) * 0.06, z);
          (child as THREE.Object3D).rotation.y = -ang + Math.PI / 2;
        });
      }
    });

    return (
    <group ref={groupRef}>
      <group position={[data.radius, 0, 0]}>
        <mesh 
          ref={planetRef} 
          onPointerDown={(e) => { e.stopPropagation(); try { (e.nativeEvent as PointerEvent | undefined)?.preventDefault?.(); } catch {} }}
          onClick={(e) => {
            e.stopPropagation();
            try { (e.nativeEvent as PointerEvent | undefined)?.preventDefault?.(); } catch {}
            onSelect(data.id);
          }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial ref={materialRef} color={data.color} roughness={0.7} metalness={0.2} transparent opacity={0} />
        </mesh>
        {isSelected && data.songs && (
          <group ref={satellitesGroupRef}>
            {data.songs.map((s: any, si: number) => (
              <group key={si}>
                <mesh
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                    const now = performance.now();
                    const last = lastHoverRef.current;
                    if (si === last.index && now - last.time < 600) return;
                    lastHoverRef.current = { index: si, time: now };
                    if (typeof onSatelliteHover === 'function') onSatelliteHover(si);
                  }}
                  onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'default'; }}
                >
                  <sphereGeometry args={[0.082, 10, 10]} />
                  <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.9} />
                </mesh>
                {/* área invisible pequeña para ayudar al puntero pero mucho más pequeña para reducir activaciones accidentales */}
                <mesh>
                  <sphereGeometry args={[0.18, 8, 8]} />
                  <meshBasicMaterial transparent opacity={0} />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>
    </group>
  );
};