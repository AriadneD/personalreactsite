import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Background component: sets the scene's background to your supernova image
 */
function SupernovaBackground() {
  // Load texture
  const texture = useTexture('https://i.ibb.co/FsPfyny/super.png');
  // Access Three.js scene object
  const { scene } = useThree();

  useEffect(() => {
    if (texture) {
      scene.background = texture;
    }
  }, [scene, texture]);

  return null;
}

/**
 * Floating starfield: We'll use Drei's <Stars /> for convenience
 */
function Starfield() {
  return (
    <Stars
      radius={100}      // sphere radius in world units
      depth={50}        // star travel distance
      count={5000}      // number of stars
      factor={10}       // star size
      saturation={0}
      fade
    />
  );
}

/**
 * A sample rotating planet
 */
function Planet({ textureURL, position = [0, 0, 0], size = 1, onClick }) {
  const planetRef = useRef();
  const planetTexture = useTexture(textureURL);

  // Rotate the planet on each frame
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2; // rotate slowly
    }
  });

  return (
    <mesh
      ref={planetRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(); // if onClick is passed, call it
      }}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={planetTexture} />
    </mesh>
  );
}

function PlanetWithRings({
  textureURL,
  ringColors = ['#aaaaaa', '#ffcc00'], // Alternating colors
  position = [0, 0, 0],
  size = 1,
  ringCount = 3, // Number of rings
  emissiveIntensity = 1.5, // Glow intensity
  ringOrientation = [1.5, 0, 0], // Default orientation
  onClick,
}) {
  const planetRef = useRef();
  const planetTexture = useTexture(textureURL);

  // Rotate the planet and rings on each frame
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2; // Rotate the planet
    }
  });

  return (
    <group
      ref={planetRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Planet */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={planetTexture} />
      </mesh>

      {/* Rings */}
      {Array.from({ length: ringCount }, (_, i) => {
        const innerRadius = size * (1.2 + i * 0.1);
        const outerRadius = size * (1.3 + i * 0.1);
        const color = ringColors[i % ringColors.length]; // Alternate colors
        return (
          <mesh key={i} rotation={ringOrientation}>
            <ringGeometry args={[innerRadius, outerRadius, 64]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function GlowingSphere({ position = [0, 0, 0], color = '#ffcc00', size = 1, pulseSpeed = 2 }) {
  const sphereRef = useRef();

  // Animate the pulsating effect
  useFrame((state) => {
    if (sphereRef.current) {
      const scale = 1 + 0.2 * Math.sin(state.clock.getElapsedTime() * pulseSpeed); // Pulsating effect
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={sphereRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial emissive={color} emissiveIntensity={1.5} color={color} />
    </mesh>
  );
}

function GlowingPlanet({ textureURL, position = [0, 0, 0], size = 1, glowColor = '#ffcc00', emissiveIntensity = 1.5 }) {
  const sphereRef = useRef();
  const planetTexture = useTexture(textureURL);

  return (
    <mesh ref={sphereRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        map={planetTexture}
        emissive={glowColor}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

function OrbitingPlanet({
  textureURL,
  size = 1,
  orbitRadius = 5,
  orbitSpeed = 0.5,
  orbitOrientation = [0, 0, 0], // Default orientation
  orbitCenter = [0, 0, 0], // Default center at the origin
  onClick
}) {
  const groupRef = useRef();
  const planetTexture = useTexture(textureURL);

  // Rotate the group to create the orbit effect
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * orbitSpeed; // Controls the orbit speed
    }
  });

  return (
    <group ref={groupRef} rotation={orbitOrientation} position={orbitCenter}>
      {/* Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 64]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      {/* The Orbiting Planet */}
      <mesh
        position={[orbitRadius, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={planetTexture} />
      </mesh>
    </group>
  );
}

/**
 * Constellations
 */
function Constellation({ points, lines, starSize = 0.1, color = "white" }) {
  // Create stars
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points.flat(), 3)
  );

  // Create connecting lines
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lines.flat(), 3)
  );

  return (
    <group>
      {/* Stars */}
      <points>
        <bufferGeometry attach="geometry" {...starGeometry} />
        <pointsMaterial attach="material" color={color} size={starSize} />
      </points>

      {/* Lines */}
      <lineSegments>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial attach="material" color={color} linewidth={1} />
      </lineSegments>
    </group>
  );
}

// Constellation Points
const bigDipperPoints = [
  [0, 4, -2],
  [1, 3.75, -2],
  [2, 3, -2],
  [2.75, 2.5, -2],
  [5, 2, -2],
  [4.25, 1, -2],
  [2.75, 1.35, -2]
];

// Constellation Lines
const bigDipperLines = [
  [0, 4, -2, 1, 3.75, -2],
  [1, 3.75, -2, 2, 3, -2],
  [2, 3, -2, 2.75, 2.5, -2],
  [2.75, 2.5, -2, 5, 2, -2],
  [5, 2, -2, 4.25, 1, -2],
  [4.25, 1, -2, 2.75, 1.35, -2],
  [2.75, 1.35, -2, 2.75, 2.5, -2]
];

// Updated Orion Points
const orionPoints = [
  [-2, -2, 0],
  [-3, -3, 0],
  [-2.5, -4, 0],
  [-2, -4.5, 0],
  [-1.5, -4, 0],
  [-1, -3, 0],
];

// Updated Orion Lines
const orionLines = [
  [-2, -2, 0, -3, -3, 0],
  [-3, -3, 0, -2.5, -4, 0],
  [-2.5, -4, 0, -2, -4.5, 0],
  [-2, -4.5, 0, -1.5, -4, 0],
  [-1.5, -4, 0, -1, -3, 0],
  [-1, -3, 0, -2, -2, 0],
];

/**
 * // ADDED: A lookup dictionary so each planet/orbiting planet has custom title/description
 */
const PLANET_INFOS = {
  pinkPlanet: {
    title: "The Pink Planet",
    description: "A swirling pink atmosphere with cotton candy clouds!",
  },
  centerRings: {
    title: "Center Ring Planet",
    description: "A majestic ringed planet right at the center of the scene.",
  },
  ringPlanet2: {
    title: "Smaller Ring Planet",
    description: "A tidally locked planet sporting subtle rings.",
  },
  planetBlue: {
    title: "Blue Planet",
    description: "A bright, ocean-covered world with swirling storms.",
  },
  planetMagenta: {
    title: "Magenta Planet",
    description: "Vivid magenta surface, rumored to hold exotic crystals.",
  },
  orbitPlanet1: {
    title: "Orbiting Planet #1",
    description: "Orbits at radius 3. Possibly home to advanced life!",
  },
  orbitPlanet2: {
    title: "Orbiting Planet #2",
    description: "Orbits at radius 5. Great for stargazing!",
  },
  orbitPlanet3: {
    title: "Orbiting Planet #3",
    description: "Orbits at radius 7. Has rings under development!",
  },
};

/**
 * The main 3D scene
 */
function SupernovaScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  // New boolean for camera movement:
  const [cameraMoveWithMouse, setCameraMoveWithMouse] = useState(false);


  // We keep the "home" camera position
  const homePosition = [0, 0, 10];

  // We'll store the ID of whichever planet is selected. Null means none selected.
  const [selectedPlanetID, setSelectedPlanetID] = useState(null);

  // We'll store the position (i.e. [x, y, z]) of whichever planet is selected
  const [selectedPlanetPosition, setSelectedPlanetPosition] = useState(null);

  // If true, we are returning home (camera is lerping to home position)
  const [returningHome, setReturningHome] = useState(false);

  // Track mouse movement globally
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      setMouse({
        x: (event.clientX / innerWidth) * 2 - 1,
        y: -(event.clientY / innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // When you toggle from "Look Around" => "Be Still", we want the camera to go home.
  // So if cameraMoveWithMouse just became false => setReturningHome(true).
  useEffect(() => {
    if (!cameraMoveWithMouse) {
      // If you want to also clear any selected planet, do:
      setSelectedPlanetID(null);
      setSelectedPlanetPosition(null);
      setReturningHome(true);
    }
  }, [cameraMoveWithMouse]);

  // handlePlanetClick: pass an ID and the position
  const handlePlanetClick = (planetID, position) => {
    setSelectedPlanetID(planetID);
    setSelectedPlanetPosition(position);
    setReturningHome(false);
  };

  // "Go back home" button
  const goHome = () => {
    setSelectedPlanetID(null);
    setSelectedPlanetPosition(null);
    setReturningHome(true);
  };

  return (
    <>
      <Canvas
        camera={{ position: homePosition, fov: 45 }}
        style={{ width: '100vw', height: '100vh' , overflowX: 'hidden', overflowY: 'hidden !important'}}
      >
        <CameraController
          mouse={mouse}
          selectedPlanetPosition={selectedPlanetPosition}
          returningHome={returningHome}
          setReturningHome={setReturningHome}
          homePosition={homePosition}
          cameraMoveWithMouse={cameraMoveWithMouse}
        />

        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <SupernovaBackground />
        <Starfield />

        {/** 
         * Now, we restore *all* your original Planets/OrbitingPlanets
         * giving each a unique ID in handlePlanetClick(...) 
         * and passing the planet's position.
         */}

        {/* Pink Planet */}
        <Planet
          textureURL="https://i.ibb.co/BrFZVKy/Screenshot-2024-12-27-at-11-00-22-AM.png"
          position={[-3, 3, -1.5]}
          size={0.35}
          onClick={() => handlePlanetClick("pinkPlanet", [-3, 3, -1.5])}
        />

        {/* Glowing Planet */}
        <GlowingPlanet
          textureURL="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmxhY2slMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww"
          position={[0.0, 0, -0.5]}
          size={1.28}
          glowColor="#fff"
          emissiveIntensity={1}
        />

        {/* Planet with big rings in the center */}
        <PlanetWithRings
          textureURL="https://i.ibb.co/MGdYdp5/istockphoto-498478219-612x612-1.jpg"
          position={[0, 0, 0]}
          size={1.2}
          ringColors={['#00ffcc', '#ff00ff']}
          ringCount={10}
          emissiveIntensity={2}
          ringOrientation={[1.4, 0.3, 0]}
          onClick={() => handlePlanetClick("centerRings", [0, 0, 0])}
        />

        {/* Another ring planet (smaller) */}
        <PlanetWithRings
          textureURL="https://i.ibb.co/BrFZVKy/Screenshot-2024-12-27-at-11-00-22-AM.png"
          position={[4, 2, -4]}
          size={0.4}
          ringColors={['#00ffcc', '#ff00ff']}
          ringCount={1}
          emissiveIntensity={0}
          ringOrientation={[1.2, 0, 0]}
          onClick={() => handlePlanetClick("ringPlanet2", [4, 2, -4])}
        />

        {/* Blue planet */}
        <Planet
          textureURL="https://i.ibb.co/y4sw6z0/planet.png"
          position={[6, 1, 1]}
          size={0.7}
          onClick={() => handlePlanetClick("planetBlue", [6, 1, 1])}
        />

        {/* Magenta planet */}
        <Planet
          textureURL="https://i.ibb.co/mb5VnF4/Screenshot-2024-12-26-at-12-46-49-AM.png"
          position={[-4, -2, 1]}
          size={0.7}
          onClick={() => handlePlanetClick("planetMagenta", [-4, -2, 1])}
        />

        {/* Orbiting Planets (3) */}
        <OrbitingPlanet
          textureURL="https://i.ibb.co/BrFZVKy/Screenshot-2024-12-27-at-11-00-22-AM.png"
          size={0.3}
          orbitRadius={3}
          orbitSpeed={0.7}
          orbitOrientation={[0.5, 0, 0]}
          orbitCenter={[0, 0, 0]}
          onClick={() => handlePlanetClick("orbitPlanet1", [3, 0, 0])}
        />

        <OrbitingPlanet
          textureURL="https://i.ibb.co/y4sw6z0/planet.png"
          size={0.5}
          orbitRadius={5}
          orbitSpeed={0.5}
          orbitOrientation={[0.5, 0, 0]}
          orbitCenter={[0, 0, 0]}
          onClick={() => handlePlanetClick("orbitPlanet2", [5, 0, 0])}
        />

        <OrbitingPlanet
          textureURL="https://i.ibb.co/mb5VnF4/Screenshot-2024-12-26-at-12-46-49-AM.png"
          size={0.5}
          orbitRadius={7}
          orbitSpeed={0.3}
          orbitOrientation={[0.5, 0, 0]}
          orbitCenter={[0, 0, 0]}
          onClick={() => handlePlanetClick("orbitPlanet3", [7, 0, 0])}
        />

        {/* Constellations */}
        <Constellation points={bigDipperPoints} lines={bigDipperLines} />
        <Constellation points={orionPoints} lines={orionLines} />

        {/* Postprocessing for Bloom */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        {/* A bunch of glowing spheres */}
        <GlowingSphere position={[2, 3, 0]} color="#f24ec6" size={0.05} pulseSpeed={3} />
        <GlowingSphere position={[-4, 1, -2]} color="#61dafb" size={0.08} pulseSpeed={1.5} />
        <GlowingSphere position={[-4, 2, 0]} color="#f24ec6" size={0.02} pulseSpeed={2} />
        <GlowingSphere position={[4, -3, 1]} color="#f24ec6" size={0.03} pulseSpeed={2} />
        <GlowingSphere position={[-5, -1, 3]} color="#f24ec6" size={0.03} pulseSpeed={2} />
        <GlowingSphere position={[-2, -3, 0]} color="#f24ec6" size={0.07} pulseSpeed={3} />
        <GlowingSphere position={[4, 1, 2]} color="#61dafb" size={0.05} pulseSpeed={1.5} />
        <GlowingSphere position={[5, 3, 1]} color="#61dafb" size={0.07} pulseSpeed={2} />
        <GlowingSphere position={[1, -1, 2]} color="#61dafb" size={0.05} pulseSpeed={1.5} />
        <GlowingSphere position={[2, -1, 3]} color="#f24ec6" size={0.01} pulseSpeed={3} />
        <GlowingSphere position={[5, -2, 3]} color="#61dafb" size={0.05} pulseSpeed={2} />
      </Canvas>
      <div class="camcontrol" style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000 }}>
        {cameraMoveWithMouse ? (
            <button onClick={() => setCameraMoveWithMouse(false)}>
            <FontAwesomeIcon icon={faCamera}/> Be Still
            </button>
        ) : (
            <button onClick={() => setCameraMoveWithMouse(true)}>
            <FontAwesomeIcon icon={faCamera}/> Look Around
            </button>
        )}
      </div>
      {/* === ADDED: Show overlay if a planetID is selected, with custom text from PLANET_INFOS. */}
      {selectedPlanetID && (
        <div className="planet-info-overlay">
          <h1>{PLANET_INFOS[selectedPlanetID]?.title || "Planet Info"}</h1>
          <p>
            {PLANET_INFOS[selectedPlanetID]?.description ||
              "Mysterious planet with no known data."}
          </p>
          <button class="special" style={{
            border: '0px solid transparent',
            fontFamily: 'Orbitron'
            }} onClick={goHome}>Go Back Home</button>
        </div>
      )}
    </>
  );
}

/**
 * Updated CameraController
 */
function CameraController({
    mouse,
    selectedPlanetPosition,
    returningHome,
    setReturningHome,
    homePosition,
    cameraMoveWithMouse // NEW
  }) {
    const { camera } = useThree();
  
    useFrame(() => {
        if (returningHome) {
          // Lerp home
          const homeVec = new THREE.Vector3(...homePosition);
          camera.position.lerp(homeVec, 0.1);
          camera.lookAt(0, 0, 0);
          if (camera.position.distanceTo(homeVec) < 0.01) {
            setReturningHome(false);
          }
        }
        else if (selectedPlanetPosition) {
          // Zoom to selected planet
          const targetVec = new THREE.Vector3(...selectedPlanetPosition);
          const offset = new THREE.Vector3(0, 0, 2);
          const desiredPos = targetVec.clone().add(offset);
          camera.position.lerp(desiredPos, 0.1);
          camera.lookAt(targetVec);
        }
        else {
          // If no returningHome and no planet selected:
          if (cameraMoveWithMouse) {
            camera.rotation.y = mouse.x * 0.3;
            camera.rotation.x = mouse.y * 0.3;
          }
          // else do nothing: camera remains where it was
        }
    });
  
    return null;
}
  

export default SupernovaScene;
