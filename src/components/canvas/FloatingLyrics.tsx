/*"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center, Billboard } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  text: string;
  color: string;
}

export const FloatingLyrics = ({ text, color }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const orbitRadius = Math.max(2.6, Math.min(3.8, 2.1 + text.length * 0.07));
  const textSize = Math.max(0.16, Math.min(0.24, 2.6 / Math.max(text.length, 8)));
  const lyricCopies = 4;

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const elapsed = clock.getElapsedTime();
      groupRef.current.position.y = 2.15 + Math.sin(elapsed * 0.8) * 0.12;
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.rotation.z = Math.sin(elapsed * 0.35) * 0.28;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2.15, 0]}>
      <group rotation={[Math.PI / 2.6, 0, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[orbitRadius, 0.02, 10, 180]} />
          <meshBasicMaterial color={color} transparent opacity={0.16} depthWrite={false} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[orbitRadius * 0.87, 0.014, 10, 160]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} depthWrite={false} />
        </mesh>
      </group>

      {Array.from({ length: lyricCopies }).map((_, index) => {
        const angle = (index / lyricCopies) * Math.PI * 2;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        return (
          <group key={`${text}-${index}`} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <Billboard follow lockX={false} lockY={false} lockZ={false}>
              <group>
                <mesh position={[0, 0, -0.08]}>
                  <planeGeometry args={[Math.max(1.6, text.length * 0.14 + 0.7), 0.82]} />
                  <meshBasicMaterial color="#000000" transparent opacity={0.28} depthWrite={false} />
                </mesh>
                <Center>
                  <Text3D
                    font="/fonts/helvetiker_regular.typeface.json"
                    size={textSize}
                    height={0.04}
                    curveSegments={12}
                  >
                    {text}
                    <meshStandardMaterial
                      color={color}
                      emissive={color}
                      emissiveIntensity={1.15}
                      roughness={0.34}
                      metalness={0.04}
                    />
                  </Text3D>
                </Center>
              </group>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
};*/