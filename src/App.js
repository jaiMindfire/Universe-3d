import React, { useRef, useState } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GUI } from "dat.gui";
import './App.css';

extend({ OrbitControls });

const Sun = ({ texture }) => {
  const sunRef = useRef();

  // Rotate the sun
  useFrame(({ clock }) => {
    sunRef.current.rotation.y += 0.004;
  });

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[15, 50, 50]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const Planet = ({ size, texture, position, ring, speeds }) => {
  const planetRef = useRef();
  const orbitRef = useRef();

  // Rotate planet and its orbit
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += speeds.selfRotationSpeed;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y += speeds.orbitSpeed;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={planetRef} position={position}>
        <sphereGeometry args={[size, 50, 50]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.innerRadius, ring.outerRadius, 32]} />
          <meshBasicMaterial
            map={ring.texture}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      )}
    </group>
  );
};

const Path = ({ radius, color }) => {
  const points = [];
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle))
    );
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <lineLoop>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color={color} />
    </lineLoop>
  );
};

const SolarSystem = () => {
  const textures = useTexture({
    sun: "../../Images/sun.jpg",
    mercury: "../../Images/mercury.jpg",
    venus: "../../Images/venus.jpg",
    earth: "../../Images/earth.jpg",
    mars: "../../Images/mars.jpg",
    jupiter: "../../Images/jupiter.jpg",
    saturn: "../../Images/saturn.jpg",
    uranus: "../../Images/uranus.jpg",
    neptune: "../../Images/neptune.jpg",
    pluto: "../../Images/pluto.jpg",
    saturnRing: "../../Images/saturn_ring.png",
    uranusRing: "../../Images/uranus_ring.png",
    stars: "../../Images/stars.jpg",
  });

  const planets = [
    {
      size: 3.2,
      texture: textures.mercury,
      position: [28, 0, 0],
      speeds: { orbitSpeed: 0.004, selfRotationSpeed: 0.004 },
    },
    {
      size: 5.8,
      texture: textures.venus,
      position: [44, 0, 0],
      speeds: { orbitSpeed: 0.015, selfRotationSpeed: 0.002 },
    },
    {
      size: 6,
      texture: textures.earth,
      position: [62, 0, 0],
      speeds: { orbitSpeed: 0.01, selfRotationSpeed: 0.02 },
    },
    {
      size: 4,
      texture: textures.mars,
      position: [78, 0, 0],
      speeds: { orbitSpeed: 0.008, selfRotationSpeed: 0.018 },
    },
    {
      size: 12,
      texture: textures.jupiter,
      position: [100, 0, 0],
      speeds: { orbitSpeed: 0.002, selfRotationSpeed: 0.04 },
    },
    {
      size: 10,
      texture: textures.saturn,
      position: [138, 0, 0],
      speeds: { orbitSpeed: 0.0009, selfRotationSpeed: 0.038 },
      ring: { innerRadius: 10, outerRadius: 20, texture: textures.saturnRing },
    },
    {
      size: 7,
      texture: textures.uranus,
      position: [176, 0, 0],
      speeds: { orbitSpeed: 0.0004, selfRotationSpeed: 0.03 },
      ring: { innerRadius: 7, outerRadius: 12, texture: textures.uranusRing },
    },
    {
      size: 7,
      texture: textures.neptune,
      position: [200, 0, 0],
      speeds: { orbitSpeed: 0.0001, selfRotationSpeed: 0.032 },
    },
    {
      size: 2.8,
      texture: textures.pluto,
      position: [216, 0, 0],
      speeds: { orbitSpeed: 0.0007, selfRotationSpeed: 0.008 },
    },
  ];

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={4} />
      <Sun texture={textures.sun} />
      {planets.map((planet, index) => (
        <React.Fragment key={index}>
          <Planet {...planet} />
          <Path radius={planet.position[0]} color="white" />
        </React.Fragment>
      ))}
    </>
  );
};

const App = () => {
  return (
    <Canvas camera={{ position: [-50, 90, 150], fov: 75 }}>
      <OrbitControls />
      <SolarSystem />
    </Canvas>
  );
};

export default App;
