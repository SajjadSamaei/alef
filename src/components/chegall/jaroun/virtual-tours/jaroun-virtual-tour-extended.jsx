"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { motion } from "framer-motion";

// Extend Three.js OrbitControls for React Three Fiber
extend({ OrbitControls: ThreeOrbitControls });

const OrbitControls = ({
  minDistance = 0.5,
  maxDistance = 2.5,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    const controls = controlsRef.current;

    if (controls) {
      controls.minDistance = minDistance; // Set minimum zoom distance
      controls.maxDistance = maxDistance; // Set maximum zoom distance
      controls.minPolarAngle = minPolarAngle; // Restrict downward tilt
      controls.maxPolarAngle = maxPolarAngle; // Restrict upward tilt
    }

    return () => {
      controls?.dispose();
    };
  }, [minDistance, maxDistance, minPolarAngle, maxPolarAngle]);

  useFrame(() => controlsRef.current?.update());

  return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
};

const Sphere = ({ texturePath, isTransitioning, cameraPosition }) => {
  const sphereRef = useRef();
  const { camera } = useThree(); // Access the camera
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let currentTexture = null; // Store reference to dispose of old texture

    loader.load(
      texturePath,
      (loadedTexture) => {
        // Set the proper encoding and filters
        loadedTexture.encoding = THREE.SRGBColorSpace;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.generateMipmaps = false;

        // Dispose of the old texture to avoid WebGL errors
        if (currentTexture) {
          currentTexture.dispose();
        }
        currentTexture = loadedTexture;

        // Assign the texture to the material
        if (sphereRef.current) {
          sphereRef.current.material.map = loadedTexture;
          sphereRef.current.material.needsUpdate = true;
        }

        // Set the camera position dynamically for the current shot
        if (cameraPosition) {
          camera.position.set(...cameraPosition); // Use the specified position
          camera.lookAt(0, 0, 0); // Ensure the camera looks at the center
        }
      },
      undefined,
      (err) => console.error("Failed to load texture:", err),
    );

    // Cleanup on unmount
    return () => {
      if (currentTexture) {
        currentTexture.dispose();
      }
    };
  }, [texturePath, cameraPosition, camera]);

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        opacity={isTransitioning ? 0.5 : 1}
        transparent
      />
    </mesh>
  );
};

const Hotspot = ({ position, onClick }) => {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[5, 16, 16]} />
      <meshBasicMaterial color="red" transparent opacity={0.7} />
    </mesh>
  );
};

const SkeletonLoader = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(255, 255, 255, 0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <motion.div
      animate={{ scale: [1, 1.5, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "red",
        borderRadius: "50%",
      }}
    />
  </div>
);

const InfoPanel = ({ info, onClose }) => (
  <div
    style={{
      position: "absolute",
      bottom: "10%",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0, 0, 0, 0.7)",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      zIndex: 1000,
    }}
  >
    <p>{info}</p>
    <button
      onClick={onClose}
      style={{
        marginTop: "10px",
        padding: "5px 10px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Close
    </button>
  </div>
);

// Displays camera position on the UI
const CameraCoordinates = ({ cameraPosition }) => (
  <div
    style={{
      position: "absolute",
      top: 10,
      left: 10,
      background: "rgba(0, 0, 0, 0.7)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      fontFamily: "monospace",
    }}
  >
    <p>X: {cameraPosition.x.toFixed(2)}</p>
    <p>Y: {cameraPosition.y.toFixed(2)}</p>
    <p>Z: {cameraPosition.z.toFixed(2)}</p>
  </div>
);

const CameraPositionTracker = ({ onPositionChange }) => {
  const { camera } = useThree();

  useEffect(() => {
    const updatePosition = () => {
      onPositionChange({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      });
    };

    // Update position on every frame
    const interval = setInterval(updatePosition, 10000); // Update at a fixed interval
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [camera, onPositionChange]);

  return null;
};

const LoadingIndicator = () => (
  <div
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      width: "30px",
      height: "30px",
      border: "4px solid rgba(255, 255, 255, 0.3)",
      borderTop: "4px solid red",
      borderRadius: "50%",
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
      }}
    />
  </div>
);

const VirtualTour = () => {
  const rooms = useMemo(
    () => ({
      livingRoom: {
        shots: [
          {
            image:
              "https://storage.c2.liara.space/chegall/projects/jaroun/virtual-tours/unit-505/505-living-room-1.jpg",
            cameraPosition: [0, 0, 1],
            hotspots: [
              { position: [0, -50, 100], target: "livingRoom", shotIndex: 0 },
              { position: [-100, -50, 50], target: "kitchen" },
            ],
            info: null,
          },
          {
            image:
              "https://storage.c2.liara.space/chegall/projects/jaroun/virtual-tours/unit-505/505-living-room-2.jpg",
            cameraPosition: [0, 0, 1],
            hotspots: [
              { position: [50, -50, 50], target: "livingRoom", shotIndex: 1 },
              { position: [0, -50, -100], target: "bedroom" },
            ],
            info: "This is a cozy living room with modern furniture and a large window.",
          },
        ],
      },
      kitchen: {
        shots: [
          {
            image:
              "https://storage.c2.liara.space/chegall/projects/jaroun/virtual-tours/unit-505/505-kitchen.jpg",
            cameraPosition: [94, 71, 1],
            hotspots: [
              { position: [0, -50, 50], target: "livingRoom" },
              { position: [50, -50, -50], target: "bathroom" },
            ],
            info: "A fully equipped kitchen with modern appliances.",
          },
        ],
      },
      bedroom: {
        shots: [
          {
            image:
              "https://storage.c2.liara.space/chegall/projects/jaroun/virtual-tours/unit-505/505-bedroom-1.jpg",
            cameraPosition: [0, 0, 1],
            hotspots: [
              { position: [0, -50, 50], target: "livingRoom", shotIndex: 2 },
            ],
            info: "The master bedroom features a comfortable bed and ample storage space.",
          },
          {
            image:
              "https://storage.c2.liara.space/chegall/projects/jaroun/virtual-tours/unit-505/505-bedroom-2.jpg",
            cameraPosition: [0, 0, 1],
            hotspots: [
              { position: [0, -50, 50], target: "livingRoom", shotIndex: 1 },
            ],
            info: "The master bedroom features a comfortable bed and ample storage space.",
          },
          {
            image:
              "https://storage.c2.liara.space/chegall/projects/jaroun/virtual-tours/unit-505/505-bedroom-3.jpg",
            cameraPosition: [0, 0, 1],
            hotspots: [
              { position: [0, -50, 50], target: "livingRoom", shotIndex: 0 },
            ],
            info: "The master bedroom features a comfortable bed and ample storage space.",
          },
        ],
      },
      bathroom: {
        shots: [
          {
            image:
              "https://storage.c2.liara.space/chegall/projects/jaroun/virtual-tours/unit-505/505-bathroom.jpg",
            cameraPosition: [0, 0, 1],
            hotspots: [{ position: [0, -50, 50], target: "kitchen" }],
            info: null,
          },
        ],
      },
    }),
    [], // Dependencies array for useMemo; add dependencies here if rooms depend on other variables
  );

  const [currentRoomKey, setCurrentRoomKey] = useState("kitchen"); // Current room key
  // const [currentRoom, setCurrentRoom] = useState("livingRoom");
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const currentRoom = rooms[currentRoomKey] || {}; // Fallback to an empty object
  const currentShot = currentRoom.shots?.[currentShotIndex] || {}; // Fallback to an empty object

  // Cache to store preloaded textures
  useEffect(() => {
    const preloadImages = async () => {
      const loader = new THREE.TextureLoader();
      for (const room in rooms) {
        for (const shot of rooms[room].shots) {
          await loader.loadAsync(shot.image);
        }
      }
      setIsLoading(false);
    };
    preloadImages();
  }, [rooms]);

  const handleHotspotClick = (targetRoomKey, shotIndex = 0) => {
    setIsTransitioning(true); // Start transition
    setTimeout(() => {
      setCurrentRoomKey(targetRoomKey); // Navigate to the target room
      setCurrentShotIndex(shotIndex); // Set the target shot
      setIsTransitioning(false); // End transition
    }, 500); // Adjust transition delay if needed
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  // SRGBColorSpace

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {info && <InfoPanel info={info} onClose={() => setInfo(null)} />}
      <Canvas
        gl={{
          antialias: false,
          outputEncoding: THREE.SRGBColorSpace, // Correct rendering color space
          toneMapping: THREE.NoToneMapping, // Disable tone mapping for exact texture details
        }}
        camera={{
          fov: 80, // Adjust field of view
          near: 0.1,
          far: 1000,
          position: [0, 0, 1], // Slightly further from the sphere
        }}
      >
        <ambientLight intensity={0.5} />

        {/* Orbit Controls */}
        <OrbitControls
          enableZoom={true} // Enable zoom
          minDistance={0.5} // Minimum zoom distance
          maxDistance={2.5} // Maximum zoom distance
          minPolarAngle={Math.PI / 4} // Restrict downward tilt
          maxPolarAngle={Math.PI / 2} // Restrict upward tilt
        />
        {/* Sphere with texture */}
        <Sphere
          texturePath={currentShot.image}
          cameraPosition={currentShot.cameraPosition}
          isTransitioning={isTransitioning}
          onTransitionEnd={() => {}}
        />
        {/* Hotspots */}
        {currentShot.hotspots?.map((hotspot, index) => {
          // Check if the hotspot leads to the current shot
          const isCurrentShot =
            hotspot.target === currentRoomKey &&
            hotspot.shotIndex === currentShotIndex;

          // Only render if it's not the current shot
          if (isCurrentShot) return null;

          return (
            <Hotspot
              key={index}
              position={hotspot.position}
              onClick={() =>
                handleHotspotClick(hotspot.target, hotspot.shotIndex || 0)
              }
            />
          );
        })}
      </Canvas>
      {currentShot.info && !info && (
        <button
          onClick={() => setInfo(currentShot.info)}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            padding: "10px 20px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          Show Info
        </button>
      )}
    </div>
  );
};

export default VirtualTour;
