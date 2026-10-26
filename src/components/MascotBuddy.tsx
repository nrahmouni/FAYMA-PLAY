import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useProfileStore } from '../store/profileStore';

export type MascotMood = 'idle' | 'happy' | 'thinking' | 'sad' | 'victory';

interface MascotBuddyProps {
  mood?: MascotMood;
  customMessage?: string | null;
  onTap?: () => void;
  language?: string;
}

const getSkinAccessory = (equippedSkin?: string) => {
  if (equippedSkin === 'skin_cyber_shades') return { type: 'visor', color: '#67e8f9' };
  if (equippedSkin === 'skin_beret_france') return { type: 'beret', color: '#f9a8d4' };
  if (equippedSkin === 'skin_oriental_turban') return { type: 'turban', color: '#c084fc' };
  if (equippedSkin === 'skin_astro_helmet') return { type: 'helmet', color: '#a5b4fc' };
  return null;
};

const MascotModel: React.FC<{ mood: MascotMood; equippedSkin?: string }> = ({ mood, equippedSkin }) => {
  const group = useRef<THREE.Group>(null);
  const skin = getSkinAccessory(equippedSkin);

  useFrame((state) => {
    if (!group.current) return;
    const idleBob = Math.sin(state.clock.elapsedTime * 2.2) * 0.08;
    const happyLift = mood === 'happy' || mood === 'victory' ? 0.14 : 0;
    group.current.position.y = idleBob + happyLift;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.6;
    group.current.rotation.z = mood === 'thinking' ? -0.12 : 0;
  });

  const bodyColor = mood === 'sad' ? '#93c5fd' : mood === 'victory' ? '#fbbf24' : '#a78bfa';
  const faceColor = mood === 'thinking' ? '#dbeafe' : '#f8fafc';

  return (
    <Float speed={2} rotationIntensity={0.25} floatIntensity={0.8}>
      <group ref={group}>
        <mesh position={[0, -0.55, 0]} castShadow>
          <capsuleGeometry args={[0.68, 1.1, 8, 18]} />
          <meshStandardMaterial color={bodyColor} metalness={0.15} roughness={0.35} />
        </mesh>

        <mesh position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color={faceColor} roughness={0.85} />
        </mesh>

        <mesh position={[-0.18, 0.8, 0.6]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.18, 0.8, 0.6]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        <mesh position={[0, 0.55, 0.64]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[0.18, 18, 18]} />
          <meshStandardMaterial color={mood === 'happy' ? '#f472b6' : '#e2e8f0'} />
        </mesh>

        <mesh position={[-0.75, 1.05, 0]} rotation={[0, 0, -0.45]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.75, 1.05, 0]} rotation={[0, 0, 0.45]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>

        {skin?.type === 'visor' && (
          <mesh position={[0, 0.72, 0.72]}>
            <boxGeometry args={[0.72, 0.18, 0.08]} />
            <meshStandardMaterial color={skin.color} emissive={skin.color} emissiveIntensity={0.35} />
          </mesh>
        )}

        {skin?.type === 'beret' && (
          <>
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.52, 0.22, 28]} />
              <meshStandardMaterial color={skin.color} />
            </mesh>
            <mesh position={[0, 1.58, 0]}>
              <sphereGeometry args={[0.34, 18, 18]} />
              <meshStandardMaterial color={skin.color} />
            </mesh>
          </>
        )}

        {skin?.type === 'turban' && (
          <mesh position={[0, 1.62, 0]} castShadow>
            <sphereGeometry args={[0.46, 28, 28, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
            <meshStandardMaterial color={skin.color} />
          </mesh>
        )}

        {skin?.type === 'helmet' && (
          <mesh position={[0, 1.58, 0]} castShadow>
            <sphereGeometry args={[0.53, 32, 32]} />
            <meshStandardMaterial color={skin.color} metalness={0.7} roughness={0.25} />
          </mesh>
        )}
      </group>
    </Float>
  );
};

export const MascotBuddy: React.FC<MascotBuddyProps> = ({
  mood = 'idle',
  customMessage,
  onTap,
}) => {
  const activePlayer = useProfileStore(s => s.getActivePlayer());
  const equippedSkin = activePlayer?.equippedSkin;
  const [bubbleText, setBubbleText] = useState<string | null>(customMessage || null);

  useEffect(() => {
    if (customMessage) {
      setBubbleText(customMessage);
      const timer = setTimeout(() => {
        setBubbleText(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [customMessage]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end">
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="pointer-events-auto relative mb-2 max-w-xs rounded-2xl border border-cyan-500/40 bg-slate-950/85 px-4 py-2.5 text-xs font-medium text-slate-100 shadow-2xl sm:text-sm"
          >
            <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="h-3 w-3" />
              <span>JuegoBuddy</span>
            </div>
            <p className="leading-snug">{bubbleText}</p>
            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-cyan-500/40 bg-slate-950" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onTap}
        aria-label="Interactuar con la mascota"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          y: mood === 'happy' || mood === 'victory' ? [-4, -14, -4] : [-2, -6, -2],
          rotate: mood === 'happy' ? [-4, 4, -4] : [0, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: mood === 'happy' ? 0.8 : 2.4,
          ease: 'easeInOut',
        }}
        className="pointer-events-auto relative h-20 w-20 overflow-hidden rounded-[1.5rem] border-2 border-cyan-400/50 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 shadow-2xl sm:h-24 sm:w-24"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-pink-500/20 to-amber-500/20 opacity-80" />
        <div className="relative h-full w-full">
          <Canvas camera={{ position: [0, 1.2, 4.2], fov: 32 }} shadows dpr={[1, 2]}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 4, 3]} intensity={2.6} castShadow />
            <pointLight position={[-3, 2, 2]} intensity={1.8} color="#f472b6" />
            <MascotModel mood={mood} equippedSkin={equippedSkin} />
            <ContactShadows position={[0, -1.7, 0]} opacity={0.45} scale={4.5} blur={1.8} far={2.2} />
          </Canvas>
        </div>

        <span className="absolute -bottom-1 -left-1 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400 bg-slate-950 text-[10px] font-bold text-cyan-300">
          ★
        </span>
      </motion.button>
    </div>
  );
};
