"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Comets = () => {
  const count = 8;
  const cometsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const cometsData = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 100
      ),
      velocity: new THREE.Vector3(
        -(Math.random() * 2 + 1),
        -(Math.random() * 1 + 0.5),
        (Math.random() * 2 + 1)
      ),
      length: Math.random() * 4 + 2
    }));
  }, []);

  useFrame((_, delta) => {
    if (!cometsRef.current) return;
    
    cometsData.forEach((comet, i) => {
      comet.position.addScaledVector(comet.velocity, delta * 30);

      if (comet.position.x < -50 || comet.position.y < -30 || comet.position.z > 50) {
        comet.position.set(
          50 + Math.random() * 30,
          30 + Math.random() * 20,
          -50 - Math.random() * 30
        );
      }

      dummy.position.copy(comet.position);
      dummy.scale.set(0.05, 0.05, comet.length);
      dummy.lookAt(dummy.position.clone().add(comet.velocity));
      dummy.updateMatrix();
      cometsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    cometsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={cometsRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.1, 0, 1, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  );
};