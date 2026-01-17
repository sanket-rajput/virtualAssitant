import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const facialExpressions = {
  default: {
    eyeBlinkLeft: 0,
    eyeBlinkRight: 0,
    mouthSmileLeft: 0,
    mouthSmileRight: 0,
    jawOpen: 0,
  },

  smile: {
    mouthSmileLeft: 0.7,
    mouthSmileRight: 0.7,
    cheekSquintLeft: 0.4,
    cheekSquintRight: 0.4,
    eyeSquintLeft: 0.25,
    eyeSquintRight: 0.25,
  },

  sad: {
    mouthFrownLeft: 0.55,
    mouthFrownRight: 0.55,
    browInnerUp: 0.35,
    eyeSquintLeft: 0.15,
    eyeSquintRight: 0.15,
  },

  angry: {
    browDownLeft: 0.8,
    browDownRight: 0.8,
    noseSneerLeft: 0.5,
    noseSneerRight: 0.5,
    eyeSquintLeft: 0.35,
    eyeSquintRight: 0.35,
    jawOpen: 0.15,
  },

  surprised: {
    browInnerUp: 0.75,
    eyeWideLeft: 0.75,
    eyeWideRight: 0.75,
    jawOpen: 0.65,
  },
};

// Rhubarb viseme mapping
const visemeMap = {
  A: "viseme_aa",
  B: "viseme_PP",
  C: "viseme_I",
  D: "viseme_O",
  E: "viseme_U",
  F: "viseme_FV",
  G: "viseme_CDGK",
  H: "viseme_L",
  X: "viseme_aa",
};

export function Avatar(props) {
  const { message, onMessagePlayed } = useChat();

  const group = useRef();
  const audioRef = useRef(null);

  const { scene } = useGLTF("/models/newmodel2vsm.glb");
  const { animations } = useGLTF("/models/animations.glb");
  const { actions, mixer } = useAnimations(animations, group);

  const [animation, setAnimation] = useState("Idle");
  const [expression, setExpression] = useState("default");
  const [lipSync, setLipSync] = useState([]);

  // Debug morph targets
  useEffect(() => {
    console.log("------ MORPH TARGETS IN MODEL ------");
    scene.traverse((o) => {
      if (o.morphTargetDictionary) {
        console.log(o.name, o.morphTargetDictionary);
      }
    });
  }, [scene]);

  // Handle new message
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!message) {
      setAnimation("Idle");
      setExpression("default");
      setLipSync([]);
      return;
    }

    setAnimation(message.animation || "Talking_1");
    setExpression(message.facialExpression || "default");
    setLipSync(message.lipsync || []);

    if (message.audio) {
      const audio = new Audio("data:audio/mp3;base64," + message.audio);
      audioRef.current = audio;
      
      audio.play().then(() => {
        console.log("✅ Audio playing");
      }).catch((err) => {
        console.error("❌ Audio play failed:", err);
      });
      
      audio.onended = onMessagePlayed;
    }
  }, [message, onMessagePlayed]);

  // Play animation
  useEffect(() => {
    if (!actions || !animation || !actions[animation]) return;

    const action = actions[animation];
    action.reset().fadeIn(0.25).play();

    return () => action.fadeOut(0.25);
  }, [animation, actions]);

  const setMorph = (target, value, speed = 0.2) => {
    scene.traverse((obj) => {
      if (!obj.isSkinnedMesh || !obj.morphTargetDictionary) return;

      const index = obj.morphTargetDictionary[target];
      if (index === undefined) return;

      const current = obj.morphTargetInfluences[index] || 0;
      obj.morphTargetInfluences[index] = THREE.MathUtils.lerp(
        current,
        value,
        speed
      );
    });
  };

  useFrame((state, delta) => {
    mixer?.update(delta);

    // 1) Apply facial expression
    const exp = facialExpressions[expression] || {};
    Object.entries(exp).forEach(([key, value]) => setMorph(key, value, 0.18));

    // 2) Reset non-used morphs
    scene.traverse((obj) => {
      if (obj.isSkinnedMesh && obj.morphTargetDictionary) {
        Object.keys(obj.morphTargetDictionary).forEach((key) => {
          if (!exp[key] && !Object.values(visemeMap).includes(key)) {
            setMorph(key, 0, 0.18);
          }
        });
      }
    });

    // 3) REDUCED LIPSYNC INTENSITY
    if (!audioRef.current || !audioRef.current.currentTime) {
      Object.values(visemeMap).forEach((v) => setMorph(v, 0, 0.3));
      setMorph("jawOpen", 0, 0.3);
      return;
    }

    const t = audioRef.current.currentTime;
    const stretch = 1.2; // Reduced from 1.6

    let activeVisemeKey = null;

    for (let cue of lipSync) {
      if (t >= cue.start * stretch && t <= cue.end * stretch) {
        activeVisemeKey = visemeMap[cue.value] || visemeMap["X"];
        break;
      }
    }

    // REDUCED: Apply visemes with lower intensity
    Object.values(visemeMap).forEach((v) => {
      if (v === activeVisemeKey) {
        setMorph(v, 0.5, 0.35);   // Reduced from 1.35 to 0.5
      } else {
        setMorph(v, 0, 0.35);
      }
    });

    // REDUCED: Jaw open less aggressive
    if (activeVisemeKey) {
      setMorph("jawOpen", 0.3, 0.3);  // Reduced from 0.85 to 0.3
    } else {
      setMorph("jawOpen", 0, 0.3);
    }
  });

  return (
    <group {...props} dispose={null}>
      <primitive ref={group} object={scene} />
    </group>
  );
}

useGLTF.preload("/models/newmodel2vsm.glb");
useGLTF.preload("/models/animations.glb");