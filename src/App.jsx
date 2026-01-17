import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { FloatingTextBubble } from "./components/FloatingTextBubble";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <Loader />
      <Leva />
      <UI />

      <Canvas shadows camera={{ position: [0, 0, 1.5], fov: 30 }}>
        <OrbitControls
          enablePan={false}           // ❌ no dragging
          enableZoom={true}            // ✅ allow zoom
          enableRotate={true}          // ✅ allow rotation
          minPolarAngle={Math.PI / 4}  // ⬆️ can't go too high (45°)
          maxPolarAngle={Math.PI / 2}  // ⬇️ can't go below horizon (90°)
          minDistance={1}              // 🔍 minimum zoom distance
          maxDistance={5}              // 🔍 maximum zoom distance
          target={[0, 1, 0]}           // 🎯 focus on avatar's head/chest
        />

        <Experience />
      </Canvas>
      <FloatingTextBubble />
    </>
  );
}

export default App;