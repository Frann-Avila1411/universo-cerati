"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NebulaeProps {
  colorA?: string;
  colorB?: string;
  scale?: number;
  intensity?: number;
  active?: boolean;
  center?: [number, number, number];
  ringStrength?: number;
  twist?: number;
  seed?: number;
}

export const Nebulae = ({
  colorA = "#20242469",
  colorB = "#2c292871",
  scale = 1.1,
  intensity = 0.35,
  active = false,
  center = [0, 0, 0],
  ringStrength = 0.75,
  twist = 0.35,
  seed = 0,
}: NebulaeProps) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
    uScale: { value: scale },
    uIntensity: { value: intensity },
    uRingStrength: { value: ringStrength },
    uTwist: { value: twist },
    uSeed: { value: seed },
  }), [colorA, colorB, scale, intensity, ringStrength, twist, seed]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  const fragment = `
    precision mediump float;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uScale;
    uniform float uIntensity;
    uniform float uRingStrength;
    uniform float uTwist;
    uniform float uSeed;
    varying vec2 vUv;

    // cheap pseudo-random
    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(127.1,311.7, 74.7))) * 43758.5453123);
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f*f*(3.0-2.0*f);
      float n = mix(mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
                        mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
                    mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
                        mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
      return n;
    }

    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv - 0.5;
      uv.x *= 1.18;

      vec2 drift = vec2(cos(uTime * 0.13), sin(uTime * 0.11)) * 0.12;
      float radial = length(uv);
      float angle = atan(uv.y, uv.x);
      angle += sin(radial * (7.0 + uSeed * 2.5) - uTime * 0.18 + uSeed * 3.2) * uTwist;
      vec2 spiralUv = vec2(cos(angle), sin(angle)) * radial;
      vec2 swirlUv = spiralUv * uScale + drift;

      float body = 1.0 - smoothstep(0.12, 0.58, radial);
      float shell = 1.0 - smoothstep(0.08, 0.24, abs(radial - (0.22 + uRingStrength * 0.08)));
      float ringCore = 1.0 - smoothstep(0.02, 0.10, abs(radial - (0.24 + uRingStrength * 0.11)));
      float n1 = fbm(vec3(swirlUv * 3.4, uTime * 0.05));
      float n2 = fbm(vec3(swirlUv * 6.2 + vec2(12.0, -4.0), uTime * 0.08));
      float wisps = smoothstep(0.36, 0.82, n1 * 0.7 + n2 * 0.55);
      float filament = smoothstep(0.25, 0.86, fbm(vec3(swirlUv * (9.0 + uSeed * 2.0), uTime * 0.03)));
      float spiralBands = smoothstep(0.34, 0.78, sin(angle * (3.0 + uSeed * 0.8) + radial * (16.0 + uSeed * 3.0) - uTime * 0.4 + uSeed * 5.5) * 0.5 + 0.5);
      float cavity = smoothstep(0.10, 0.29, radial);
      float falloff = smoothstep(0.72, 0.10, radial);
      float neb = (body * 0.22 + shell * 0.9 + ringCore * 0.95 + wisps * 0.85 + filament * 0.34 + spiralBands * 0.55) * cavity * falloff;

      vec3 col = mix(uColorA, uColorB, clamp(wisps * 0.65 + shell * 0.25 + spiralBands * 0.3, 0.0, 1.0));
      col += uColorA * 0.06 * body;
      col += uColorB * 0.08 * ringCore;
      float alpha = clamp(neb * uIntensity, 0.0, 1.0);
      alpha *= 0.82;
      gl_FragColor = vec4(col, alpha);
    }
  `;

  const vertex = `
    precision mediump float;
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;

  if (!active) {
    return null;
  }

  return (
    <group position={center}>
      <mesh frustumCulled={false} scale={[3.8 * scale, 2.7 * scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms as any}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh frustumCulled={false} scale={[2.7 * scale, 1.9 * scale, 1]} rotation={[0, 0, Math.PI * 0.18]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={uniforms as any}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh frustumCulled={false} scale={[2.1 * scale, 1.5 * scale, 1]} rotation={[0, 0, Math.PI * -0.23]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={uniforms as any}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh frustumCulled={false} scale={[1.65 * scale, 1.15 * scale, 1]} rotation={[0, 0, Math.PI * 0.34]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={uniforms as any}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

export default Nebulae;
