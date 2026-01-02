"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { useRef } from "react";

export function ModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath, true);
  const controlsRef = useRef();

  const handleControlEnd = (controls) => {
    // Snap azimuth (horizontal) angle to 45-degree increments
    const snapIncrement = Math.PI / 4; // 45 degrees in radians
    controls.azimuthAngle =
      Math.round(controls.azimuthAngle / snapIncrement) * snapIncrement;

    // Snap polar (vertical) angle to 45-degree increments
    controls.polarAngle =
      Math.round(controls.polarAngle / snapIncrement) * snapIncrement;

    // Prevent the camera from looking at the bottom of the model
    const maxPolarAngle = Math.PI / 2; // 90 degrees in radians
    if (controls.polarAngle > maxPolarAngle) {
      controls.polarAngle = maxPolarAngle;
    }

    controls.update(); // Update the controls
  };

  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [20, 35, -20], fov: 16 }}
      shadows
    >
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="city" />
      <primitive
        object={scene}
        scale={[0.5, 0.5, 0.5]}
        castShadow
        receiveShadow
      />
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        minDistance={10}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2} // Prevent looking at the bottom
        onEnd={(e) => handleControlEnd(e.target)}
      />
    </Canvas>
  );
}

export default ModelViewer;
