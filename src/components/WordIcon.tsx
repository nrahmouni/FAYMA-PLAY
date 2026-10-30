import React from 'react';
import { getCachedAiImage } from '../lib/ai-image';
import {
  HandHelping,
  Gift,
  LogIn,
  LogOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  AlertTriangle,
  Compass,
  Scale,
  Ruler,
  Brain,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Volume2,
  Heart,
  HeartHandshake,
  Eye,
  Ear,
  Smile,
  Frown,
  Flame,
  Snowflake,
  Sun,
  Moon,
  CloudRain,
  Share2,
} from 'lucide-react';

export interface WordIconProps {
  icon?: string;
  esWord?: string;
  word?: string;
  category?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  style?: React.CSSProperties;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-base',
  sm: 'w-8 h-8 text-xl',
  md: 'w-10 h-10 text-2xl',
  lg: 'w-14 h-14 text-4xl',
  xl: 'w-16 h-16 text-5xl',
  '2xl': 'w-20 h-20 text-6xl',
  '3xl': 'w-24 h-24 text-7xl',
};

// Custom handcrafted SVG pictograms for abstract verbs and spatial concepts
const CUSTOM_SVGS: Record<string, (className?: string) => React.ReactNode> = {
  // DAR: Giver hand extending and offering a glowing heart/star to another hand with a motion arrow
  dar: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Dar (to give)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Motion arrow */}
      <path d="M26 24 C32 18, 38 18, 44 24" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M42 20 L45 24 L40 26" fill="#10B981" />
      {/* Left hand (giver) extending */}
      <path d="M8 38 C14 38, 18 36, 24 33 C26 32, 29 33, 30 35 C30 37, 28 39, 25 41 C21 44, 15 45, 8 44 Z" fill="#FBBF24" />
      <path d="M10 35 C16 35, 20 33, 26 31 C28 30, 31 31, 31 33 C31 35, 29 36, 26 37 C22 39, 16 41, 10 40 Z" fill="#F59E0B" />
      {/* Gifted star/heart in motion */}
      <g transform="translate(30, 16) scale(0.9)">
        <circle cx="10" cy="10" r="9" fill="#F43F5E" />
        <path d="M10 6 C7.5 3 4 5 4 8 C4 11.5 10 15 10 15 C10 15 16 11.5 16 8 C16 5 12.5 3 10 6 Z" fill="#FFFFFF" />
      </g>
      {/* Right hand (receiver) open cupped */}
      <path d="M56 42 C50 42, 46 44, 40 47 C38 48, 35 47, 34 45 C34 43, 36 41, 39 39 C43 36, 49 35, 56 36 Z" fill="#FBBF24" />
    </svg>
  ),

  // RECIBIR: Hands open upwards receiving incoming star/heart
  recibir: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Recibir (to receive)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Downward arrow */}
      <path d="M32 10 L32 28" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M28 24 L32 29 L36 24" fill="#3B82F6" />
      {/* Incoming star */}
      <path d="M32 14 L33.5 18 L37.5 18.5 L34.5 21 L35.5 25 L32 23 L28.5 25 L29.5 21 L26.5 18.5 L30.5 18 Z" fill="#F59E0B" />
      {/* Two cupped welcoming hands */}
      <path d="M16 46 C20 40, 26 38, 30 42 C31 43, 31 46, 29 48 C25 52, 20 52, 14 50 Z" fill="#FBBF24" />
      <path d="M48 46 C44 40, 38 38, 34 42 C33 43, 33 46, 35 48 C39 52, 44 52, 50 50 Z" fill="#F59E0B" />
      <circle cx="32" cy="46" r="3" fill="#10B981" />
    </svg>
  ),

  // PONER: Hand placing a colorful block onto a surface with down arrow
  poner: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Poner (to put/place)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* Table surface */}
      <rect x="8" y="48" width="48" height="6" rx="3" fill="#78716C" />
      <rect x="14" y="54" width="6" height="6" fill="#57534E" />
      <rect x="44" y="54" width="6" height="6" fill="#57534E" />
      {/* Down arrow */}
      <path d="M48 20 L48 36 M44 32 L48 37 L52 32" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hand lowering block */}
      <path d="M18 14 C22 14, 25 18, 28 22 C30 24, 34 24, 36 22 L40 18" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      {/* Block */}
      <rect x="20" y="28" width="18" height="18" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      <circle cx="29" cy="37" r="4" fill="#93C5FD" />
    </svg>
  ),

  // QUITAR: Hand lifting a block off a surface with upward arrow
  quitar: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Quitar (to remove)">
      <rect width="64" height="64" rx="16" fill="#FEF2F2" />
      {/* Table surface */}
      <rect x="8" y="48" width="48" height="6" rx="3" fill="#78716C" />
      {/* Dashed outline of where block was */}
      <rect x="22" y="38" width="18" height="10" rx="3" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      {/* Up arrow */}
      <path d="M48 36 L48 18 M44 22 L48 17 L52 22" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Block being lifted */}
      <rect x="20" y="16" width="18" height="18" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
      <path d="M16 8 C20 8, 24 12, 27 16" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),

  // SUBIR: Stepped stairs with upward climbing green arrow
  subir: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Subir (to go up)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Stairs */}
      <path d="M12 52 L26 52 L26 40 L40 40 L40 28 L54 28 L54 52 Z" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
      {/* Up arrow */}
      <path d="M18 38 L38 18 M28 17 L39 17 L39 28" stroke="#047857" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // BAJAR: Stepped stairs with downward blue arrow
  bajar: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Bajar (to go down)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Stairs */}
      <path d="M12 28 L26 28 L26 40 L40 40 L40 52 L54 52 L12 52 Z" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2" />
      {/* Down arrow */}
      <path d="M18 18 L38 38 M28 38 L39 38 L39 27" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // ENTRAR: Door with arrow walking inside
  entrar: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Entrar (to enter)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      <rect x="28" y="14" width="24" height="38" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="2" />
      <rect x="34" y="18" width="14" height="30" fill="#FEF3C7" />
      <circle cx="45" cy="34" r="2" fill="#78350F" />
      {/* Arrow going into door */}
      <path d="M10 34 L32 34 M26 28 L32 34 L26 40" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // SALIR: Door with arrow walking out
  salir: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Salir (to leave/exit)">
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      <rect x="12" y="14" width="24" height="38" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="2" />
      <rect x="16" y="18" width="16" height="30" fill="#FEF3C7" />
      {/* Arrow leaving door */}
      <path d="M26 34 L52 34 M46 28 L52 34 L46 40" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // EMPUJAR: Two hands pushing a block forward
  empujar: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Empujar (to push)">
      <rect width="64" height="64" rx="16" fill="#FDF4FF" />
      <rect x="34" y="20" width="22" height="30" rx="4" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" />
      {/* Hands pushing */}
      <path d="M10 26 C16 26, 24 28, 32 30" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
      <path d="M10 38 C16 38, 24 38, 32 36" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
      {/* Speed lines */}
      <path d="M40 14 L50 14 M44 10 L54 10" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // TIRAR: Hands pulling a rope/cart
  tirar: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Tirar (to pull)">
      <rect width="64" height="64" rx="16" fill="#FFFBEB" />
      {/* Cart on right */}
      <rect x="40" y="24" width="18" height="22" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
      <circle cx="45" cy="50" r="4" fill="#78350F" />
      <circle cx="53" cy="50" r="4" fill="#78350F" />
      {/* Rope pulled to left */}
      <path d="M40 34 L18 34" stroke="#92400E" strokeWidth="3" strokeDasharray="3 2" />
      {/* Pulling hands */}
      <circle cx="16" cy="34" r="5" fill="#F59E0B" />
      <path d="M14 26 L8 34 L14 42" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // DENTRO: Box with golden ball clearly inside
  dentro: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Dentro (inside)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* Box back */}
      <rect x="14" y="20" width="36" height="34" rx="4" fill="#BBF7D0" stroke="#16A34A" strokeWidth="2" />
      {/* Ball inside */}
      <circle cx="32" cy="37" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      <circle cx="29" cy="34" r="3" fill="#FEF08A" />
      {/* Box front glass / rim */}
      <path d="M14 34 L50 34" stroke="#16A34A" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  ),

  // FUERA: Box with golden ball clearly outside
  fuera: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Fuera (outside)">
      <rect width="64" height="64" rx="16" fill="#FEF2F2" />
      {/* Box closed */}
      <rect x="10" y="22" width="28" height="30" rx="4" fill="#FECACA" stroke="#DC2626" strokeWidth="2" />
      {/* Ball outside */}
      <circle cx="48" cy="37" r="10" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      <circle cx="45" cy="34" r="3" fill="#93C5FD" />
      <path d="M38 37 L40 37" stroke="#DC2626" strokeWidth="2" />
    </svg>
  ),

  // SOBRE: Ball resting on top of a table/cube
  sobre: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Sobre (on/above)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Base platform */}
      <rect x="12" y="36" width="40" height="20" rx="3" fill="#93C5FD" stroke="#2563EB" strokeWidth="2" />
      {/* Ball on top */}
      <circle cx="32" cy="22" r="11" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
      <circle cx="29" cy="18" r="3" fill="#FDA4AF" />
      {/* Down arrow onto surface */}
      <path d="M32 30 L32 34" stroke="#2563EB" strokeWidth="2" />
    </svg>
  ),

  // BAJO: Ball placed underneath a table
  bajo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Bajo (under/below)">
      <rect width="64" height="64" rx="16" fill="#F5F3FF" />
      {/* Table top and legs */}
      <rect x="10" y="18" width="44" height="6" rx="2" fill="#8B5CF6" />
      <rect x="14" y="24" width="5" height="30" fill="#7C3AED" />
      <rect x="45" y="24" width="5" height="30" fill="#7C3AED" />
      {/* Ball under table */}
      <circle cx="32" cy="40" r="10" fill="#10B981" stroke="#047857" strokeWidth="2" />
      <circle cx="29" cy="37" r="3" fill="#A7F3D0" />
    </svg>
  ),

  // CERCA: Two friendly colorful circles close together
  cerca: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Cerca (near)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      <circle cx="24" cy="32" r="11" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
      <circle cx="40" cy="32" r="11" fill="#10B981" stroke="#047857" strokeWidth="2" />
      <path d="M28 32 L36 32 M30 30 L28 32 L30 34 M34 30 L36 32 L34 34" stroke="#78350F" strokeWidth="2" />
    </svg>
  ),

  // LEJOS: Two circles far apart with long dotted distance line
  lejos: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Lejos (far)">
      <rect width="64" height="64" rx="16" fill="#F1F5F9" />
      <circle cx="16" cy="32" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
      <circle cx="48" cy="32" r="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      <path d="M26 32 L38 32" stroke="#64748B" strokeWidth="3" strokeDasharray="3 3" />
    </svg>
  ),

  // PELIGRO: Warning triangle
  peligro: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Peligro (danger)">
      <rect width="64" height="64" rx="16" fill="#FEF2F2" />
      <path d="M32 10 L54 50 L10 50 Z" fill="#FBBF24" stroke="#DC2626" strokeWidth="4" strokeLinejoin="round" />
      <rect x="30" y="24" width="4" height="14" rx="2" fill="#18181B" />
      <circle cx="32" cy="43" r="2.5" fill="#18181B" />
    </svg>
  ),

  // VERDAD: Golden shield with sparkling checkmark
  verdad: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Verdad (truth)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      <path d="M32 10 C42 12, 48 16, 50 24 C50 38, 42 48, 32 54 C22 48, 14 38, 14 24 C16 16, 22 12, 32 10 Z" fill="#10B981" />
      <path d="M24 32 L29 37 L40 25" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // MENTIRA: Cross speech bubble / false mask
  mentira: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mentira (lie)">
      <rect width="64" height="64" rx="16" fill="#FFF1F2" />
      <path d="M12 20 C12 14, 18 10, 26 10 L38 10 C46 10, 52 14, 52 20 L52 32 C52 38, 46 42, 38 42 L24 42 L16 48 L18 42 C14 40, 12 36, 12 32 Z" fill="#FDA4AF" />
      <path d="M26 22 L38 34 M38 22 L26 34" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),

  // PAZ: Flying white dove with olive twig
  paz: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Paz (peace)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      <circle cx="32" cy="32" r="18" fill="#86EFAC" opacity="0.3" />
      <path d="M20 34 C26 28, 36 28, 44 22 C42 30, 48 36, 44 42 C38 42, 30 40, 22 44 C24 38, 22 36, 20 34 Z" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
      <path d="M14 26 L18 28 L16 32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // SUERTE: Bright 4-leaf clover
  suerte: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Suerte (luck)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      <circle cx="26" cy="24" r="8" fill="#10B981" />
      <circle cx="38" cy="24" r="8" fill="#10B981" />
      <circle cx="26" cy="36" r="8" fill="#10B981" />
      <circle cx="38" cy="36" r="8" fill="#10B981" />
      <path d="M32 30 C32 44, 26 50, 24 52" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="30" r="3" fill="#FBBF24" />
    </svg>
  ),

  // CASTILLO: Fairytale stone fortress with towers, flags, and drawbridge gate
  castillo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Castillo (castle)">
      <rect width="64" height="64" rx="16" fill="#F0F9FF" />
      {/* Hill base */}
      <ellipse cx="32" cy="56" rx="28" ry="8" fill="#86EFAC" />
      {/* Central Keep wall */}
      <rect x="22" y="26" width="20" height="26" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
      {/* Crenellations on central wall */}
      <rect x="22" y="22" width="4" height="5" fill="#94A3B8" />
      <rect x="30" y="22" width="4" height="5" fill="#94A3B8" />
      <rect x="38" y="22" width="4" height="5" fill="#94A3B8" />
      {/* Arched wooden gate */}
      <path d="M28 52 L28 40 C28 37, 36 37, 36 40 L36 52 Z" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
      {/* Left Tower */}
      <rect x="10" y="20" width="12" height="32" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
      {/* Left Turret roof */}
      <path d="M8 20 L16 8 L24 20 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
      {/* Left Flag */}
      <path d="M16 8 L16 3 L22 5.5 L16 8" fill="#F59E0B" />
      {/* Right Tower */}
      <rect x="42" y="20" width="12" height="32" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
      {/* Right Turret roof */}
      <path d="M40 20 L48 8 L56 20 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
      {/* Right Flag */}
      <path d="M48 8 L48 3 L54 5.5 L48 8" fill="#F59E0B" />
      {/* Tower windows */}
      <rect x="14" y="26" width="4" height="6" rx="2" fill="#1E293B" />
      <rect x="46" y="26" width="4" height="6" rx="2" fill="#1E293B" />
      <rect x="30" y="30" width="4" height="6" rx="2" fill="#1E293B" />
    </svg>
  ),

  // CIRCO: Striped big top circus tent with colorful pennants and starry entrance
  circo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Circo (circus)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Base ground */}
      <ellipse cx="32" cy="54" rx="26" ry="6" fill="#FDE68A" />
      {/* Tent wall */}
      <path d="M10 36 L54 36 L52 52 L12 52 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
      {/* White wall stripes */}
      <path d="M18 36 L24 36 L23 52 L17 52 Z" fill="#FFFFFF" />
      <path d="M40 36 L46 36 L47 52 L41 52 Z" fill="#FFFFFF" />
      {/* Tent conical roof with red & white stripes */}
      <path d="M10 36 L32 14 L54 36 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
      <path d="M22 36 L32 14 L28 36 Z" fill="#FFFFFF" />
      <path d="M36 36 L32 14 L42 36 Z" fill="#FFFFFF" />
      {/* Roof peak flagpole & pennant */}
      <path d="M32 14 L32 6" stroke="#B45309" strokeWidth="2" />
      <path d="M32 6 L44 9 L32 12 Z" fill="#F59E0B" />
      {/* Circus entrance arch with drape */}
      <path d="M26 52 C26 42, 38 42, 38 52 Z" fill="#312E81" />
      <path d="M26 42 C29 46, 32 46, 32 42" stroke="#FBBF24" strokeWidth="2" fill="none" />
      <path d="M32 42 C32 46, 35 46, 38 42" stroke="#FBBF24" strokeWidth="2" fill="none" />
      {/* Golden stars around */}
      <circle cx="12" cy="18" r="2.5" fill="#F59E0B" />
      <circle cx="52" cy="18" r="2.5" fill="#F59E0B" />
    </svg>
  ),

  // MUNDO: Vibrant globe showing blue oceans, green continents, and atmospheric glow
  mundo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mundo (world)">
      <rect width="64" height="64" rx="16" fill="#0F172A" />
      {/* Atmosphere glow */}
      <circle cx="32" cy="32" r="22" fill="#38BDF8" opacity="0.3" />
      {/* Ocean globe */}
      <circle cx="32" cy="32" r="20" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
      {/* Continents (Americas & Eurasia/Africa silhouettes) */}
      <g clipPath="url(#globe-clip)">
        <path d="M22 18 C24 16, 27 18, 26 23 C25 26, 21 27, 20 30 C19 33, 24 37, 25 42 C26 45, 23 48, 20 46 C18 44, 18 36, 17 31 C16 26, 19 20, 22 18 Z" fill="#22C55E" />
        <path d="M34 16 C37 15, 43 17, 44 21 C45 25, 41 28, 43 32 C45 36, 42 41, 38 44 C35 44, 34 38, 35 34 C36 30, 31 28, 32 23 C33 19, 31 17, 34 16 Z" fill="#22C55E" />
        <circle cx="46" cy="42" r="3.5" fill="#22C55E" />
        {/* White swirl clouds */}
        <path d="M16 24 C22 23, 28 26, 36 24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <path d="M26 38 C32 37, 38 40, 48 37" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      </g>
      <defs>
        <clipPath id="globe-clip">
          <circle cx="32" cy="32" r="19" />
        </clipPath>
      </defs>
      {/* Outer twinkling stars */}
      <circle cx="10" cy="14" r="1.5" fill="#FDE047" />
      <circle cx="54" cy="12" r="1.5" fill="#FDE047" />
      <circle cx="56" cy="50" r="1.5" fill="#FDE047" />
      <circle cx="8" cy="48" r="1.5" fill="#FDE047" />
    </svg>
  ),

  // DELGADO: Slender, tall figure with comparison arrows showing thin/slim
  delgado: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Delgado (thin)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Head */}
      <circle cx="32" cy="14" r="7" fill="#10B981" />
      {/* Slim smiling face */}
      <circle cx="30" cy="13" r="1" fill="#FFFFFF" />
      <circle cx="34" cy="13" r="1" fill="#FFFFFF" />
      <path d="M30 16 C31 17, 33 17, 34 16" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
      {/* Slim body */}
      <rect x="29" y="22" width="6" height="20" rx="3" fill="#059669" />
      {/* Slim legs */}
      <rect x="28" y="42" width="3" height="15" rx="1.5" fill="#047857" />
      <rect x="33" y="42" width="3" height="15" rx="1.5" fill="#047857" />
      {/* Slender arms */}
      <path d="M28 26 L22 36" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 26 L42 36" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      {/* Inward squeeze arrows indicating thinness */}
      <path d="M12 32 L20 32 M17 28 L21 32 L17 36" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 32 L44 32 M47 28 L43 32 L47 36" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // GORDO: Cheerful chubby round character with round tummy and outward width arrows
  gordo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Gordo (fat/chubby)">
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      {/* Head */}
      <circle cx="32" cy="15" r="8" fill="#F97316" />
      {/* Happy face */}
      <circle cx="29.5" cy="14" r="1.2" fill="#FFFFFF" />
      <circle cx="34.5" cy="14" r="1.2" fill="#FFFFFF" />
      <path d="M29 17 C31 19, 33 19, 35 17" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      {/* Big round chubby tummy */}
      <circle cx="32" cy="35" r="16" fill="#EA580C" />
      {/* Inner tummy highlight */}
      <ellipse cx="32" cy="37" rx="10" ry="8" fill="#FDBA74" />
      {/* Sturdy legs */}
      <rect x="24" y="48" width="6" height="10" rx="3" fill="#C2410C" />
      <rect x="34" y="48" width="6" height="10" rx="3" fill="#C2410C" />
      {/* Outstretched friendly arms */}
      <path d="M18 30 C12 28, 10 32, 10 35" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 30 C52 28, 54 32, 54 35" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
      {/* Outward width arrows */}
      <path d="M8 44 L4 44 M6 41 L3 44 L6 47" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M56 44 L60 44 M58 41 L61 44 L58 47" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // BONITO: Beautiful radiant blooming flower with butterfly and sparkling gems
  bonito: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Bonito (beautiful)">
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Glowing aura */}
      <circle cx="32" cy="34" r="20" fill="#FCE7F3" />
      {/* Blooming flower petals */}
      <circle cx="32" cy="24" r="8" fill="#FB7185" />
      <circle cx="22" cy="32" r="8" fill="#F43F5E" />
      <circle cx="42" cy="32" r="8" fill="#F43F5E" />
      <circle cx="25" cy="42" r="8" fill="#E11D48" />
      <circle cx="39" cy="42" r="8" fill="#E11D48" />
      {/* Golden center */}
      <circle cx="32" cy="34" r="7" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
      {/* Tiny smiling face in center */}
      <circle cx="30" cy="33" r="0.9" fill="#78350F" />
      <circle cx="34" cy="33" r="0.9" fill="#78350F" />
      <path d="M30 35.5 C31 36.5, 33 36.5, 34 35.5" stroke="#78350F" strokeWidth="0.8" strokeLinecap="round" />
      {/* Little fluttering butterfly in corner */}
      <path d="M14 14 C10 10, 10 18, 14 16 C18 18, 18 10, 14 14 Z" fill="#38BDF8" />
      <circle cx="14" cy="15" r="1" fill="#0284C7" />
      {/* Sparkling magic stars */}
      <path d="M48 14 L49 11 L50 14 L53 15 L50 16 L49 19 L48 16 L45 15 Z" fill="#FBBF24" />
      <path d="M52 24 L53 22 L54 24 L56 25 L54 26 L53 28 L52 26 L50 25 Z" fill="#F472B6" />
      <path d="M12 48 L13 46 L14 48 L16 49 L14 50 L13 52 L12 50 L10 49 Z" fill="#FBBF24" />
    </svg>
  ),

  // FEO: Cute, silly, friendly little monster with funny eyes and goofy smile (playful ugly)
  feo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Feo (ugly/silly monster)">
      <rect width="64" height="64" rx="16" fill="#F5F3FF" />
      {/* Cute mismatched little horns */}
      <path d="M22 20 L16 10 L25 16 Z" fill="#A855F7" />
      <path d="M42 20 L48 12 L39 16 Z" fill="#EC4899" />
      {/* Goofy monster body */}
      <rect x="16" y="18" width="32" height="32" rx="12" fill="#84CC16" stroke="#65A30D" strokeWidth="2" />
      {/* Monster spots */}
      <circle cx="21" cy="24" r="3" fill="#65A30D" />
      <circle cx="43" cy="24" r="2.5" fill="#65A30D" />
      <circle cx="20" cy="42" r="2" fill="#65A30D" />
      {/* Big quirky cyclops eye */}
      <circle cx="32" cy="28" r="9" fill="#FFFFFF" stroke="#4D7C0F" strokeWidth="2" />
      <circle cx="32" cy="28" r="4.5" fill="#8B5CF6" />
      <circle cx="30" cy="26" r="1.5" fill="#FFFFFF" />
      {/* Goofy crooked zigzag smile with one snaggle tooth */}
      <path d="M23 42 Q32 46 41 40" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="28" y="42" width="3" height="4" rx="1" fill="#FFFFFF" stroke="#365314" strokeWidth="1" />
      {/* Little feet */}
      <ellipse cx="24" cy="52" rx="4" ry="2.5" fill="#65A30D" />
      <ellipse cx="40" cy="52" rx="4" ry="2.5" fill="#65A30D" />
    </svg>
  ),

  // VIEJO: Smiling elderly grandfather with round spectacles, gray hair, and walking cane
  viejo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Viejo (old/elderly)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Grandfather head */}
      <circle cx="32" cy="22" r="11" fill="#FED7AA" />
      {/* Fluffy white hair around sides */}
      <circle cx="21" cy="22" r="5" fill="#E2E8F0" />
      <circle cx="43" cy="22" r="5" fill="#E2E8F0" />
      <path d="M22 17 C26 12, 38 12, 42 17" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      {/* Round spectacles */}
      <circle cx="28" cy="22" r="4" stroke="#475569" strokeWidth="1.5" fill="#F8FAFC" opacity="0.6" />
      <circle cx="36" cy="22" r="4" stroke="#475569" strokeWidth="1.5" fill="#F8FAFC" opacity="0.6" />
      <path d="M32 22 L32 21" stroke="#475569" strokeWidth="1.5" />
      {/* Eyes behind glasses */}
      <circle cx="28" cy="22" r="1" fill="#1E293B" />
      <circle cx="36" cy="22" r="1" fill="#1E293B" />
      {/* Gentle smile and gray mustache */}
      <path d="M28 27 C30 28.5, 34 28.5, 36 27" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Warm cardigan sweater */}
      <path d="M20 34 C20 34, 25 32, 32 32 C39 32, 44 34, 44 34 L46 54 L18 54 Z" fill="#D97706" />
      <path d="M32 32 L32 54" stroke="#B45309" strokeWidth="2" />
      {/* Wooden walking stick / cane */}
      <path d="M48 30 C51 30, 52 33, 50 35 L48 54" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      <circle cx="48" cy="38" r="2.5" fill="#FED7AA" />
    </svg>
  ),

  // === PARTES DEL CUERPO HUMANO (MAGNIFIED LENS & HIGH-CONTRAST CALLOUT STYLE) ===

  // PIERNA: Full human leg highlighted from hip down to foot
  pierna: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Pierna (leg)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Full body outline muted */}
      <circle cx="16" cy="12" r="4" fill="#CBD5E1" />
      <path d="M12 16 L20 16 L18 30 L14 30 Z" fill="#CBD5E1" />
      {/* HIGHLIGHTED FULL LEG (Hip to foot) */}
      <path d="M30 10 L46 10 L44 26 L42 46 L48 54 C50 56, 46 60, 40 60 L32 60 C30 56, 32 50, 32 46 L34 26 Z" fill="#10B981" stroke="#047857" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Knee line */}
      <line x1="33" y1="34" x2="43" y2="34" stroke="#047857" strokeWidth="2" strokeDasharray="2 2" />
      {/* Side height bracket */}
      <path d="M52 12 L56 12 L56 58 L52 58" stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // RODILLA: Muted figure + Magnifying lens callout showing BENT KNEE & KNEECAP in vivid detail
  rodilla: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Rodilla (knee)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Muted child figure sitting/standing on left */}
      <circle cx="12" cy="14" r="3.5" fill="#CBD5E1" />
      <path d="M8 18 L16 18 L15 32 L18 42 L12 42 Z" fill="#CBD5E1" />
      {/* Knee focal dot on figure */}
      <circle cx="16" cy="32" r="3" fill="#EF4444" />
      {/* Connecting pointer line */}
      <path d="M16 32 C20 32, 22 28, 26 28" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 2" />
      {/* MAGNIFYING CALLOUT LENS */}
      <circle cx="42" cy="32" r="19" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3" />
      {/* Inside lens: Bent knee joint with kneecap highlighted */}
      <g clipPath="url(#knee-lens-clip)">
        <path d="M28 18 L40 18 C44 18, 48 22, 50 28 L56 46 L44 46 L40 34 C38 30, 34 28, 28 28 Z" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
        {/* Kneecap highlighted in vivid red */}
        <ellipse cx="46" cy="27" rx="5" ry="7" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
        <circle cx="45" cy="25" r="1.5" fill="#FFFFFF" />
      </g>
      <defs>
        <clipPath id="knee-lens-clip">
          <circle cx="42" cy="32" r="17.5" />
        </clipPath>
      </defs>
      {/* Lens shine */}
      <path d="M30 20 A 17 17 0 0 1 48 16" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // CODO: Muted figure + Magnifying lens callout showing ELBOW JOINT in vivid detail
  codo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Codo (elbow)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Muted figure on left */}
      <circle cx="12" cy="14" r="3.5" fill="#CBD5E1" />
      <path d="M8 18 L16 18 L18 28 L24 34 L20 36 L14 28 Z" fill="#CBD5E1" />
      <circle cx="18" cy="28" r="3" fill="#2563EB" />
      {/* Pointer line */}
      <path d="M18 28 C22 28, 22 30, 26 30" stroke="#2563EB" strokeWidth="2" strokeDasharray="2 2" />
      {/* MAGNIFYING CALLOUT LENS */}
      <circle cx="42" cy="32" r="19" fill="#FFFFFF" stroke="#D97706" strokeWidth="3" />
      {/* Inside lens: Bent elbow joint in detail */}
      <g clipPath="url(#elbow-lens-clip)">
        <path d="M26 20 L38 20 C42 20, 46 24, 48 30 L54 46 L44 46 L38 34 C36 30, 32 28, 26 28 Z" fill="#FED7AA" stroke="#D97706" strokeWidth="2" />
        {/* Elbow point highlighted in vivid blue */}
        <circle cx="43" cy="26" r="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <circle cx="42" cy="25" r="1.5" fill="#FFFFFF" />
      </g>
      <defs>
        <clipPath id="elbow-lens-clip">
          <circle cx="42" cy="32" r="17.5" />
        </clipPath>
      </defs>
    </svg>
  ),

  // HOMBRO: Muted figure + Magnifying lens callout showing SHOULDER JOINT
  hombro: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Hombro (shoulder)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Muted torso */}
      <circle cx="12" cy="14" r="3.5" fill="#CBD5E1" />
      <path d="M6 18 L18 18 L18 38 L6 38 Z" fill="#CBD5E1" />
      <circle cx="16" cy="20" r="3" fill="#F59E0B" />
      {/* Pointer */}
      <path d="M16 20 C20 20, 22 26, 26 28" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2 2" />
      {/* LENS */}
      <circle cx="42" cy="32" r="19" fill="#FFFFFF" stroke="#059669" strokeWidth="3" />
      <g clipPath="url(#shoulder-lens-clip)">
        <path d="M26 16 L36 16 L36 28 L26 28 Z" fill="#FED7AA" />
        <path d="M24 28 C28 28, 42 28, 52 32 C58 35, 56 48, 50 56 L38 56 L42 40 L34 40 L34 56 L24 56 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        {/* Shoulder highlighted */}
        <circle cx="48" cy="32" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        <circle cx="47" cy="31" r="2" fill="#FFFFFF" />
      </g>
      <defs>
        <clipPath id="shoulder-lens-clip">
          <circle cx="42" cy="32" r="17.5" />
        </clipPath>
      </defs>
    </svg>
  ),

  // CUELLO: Muted figure + Magnifying lens callout showing HUMAN NECK
  cuello: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Cuello (neck)">
      <rect width="64" height="64" rx="16" fill="#F5F3FF" />
      <circle cx="12" cy="12" r="3.5" fill="#CBD5E1" />
      <rect x="10" y="16" width="4" height="6" fill="#7C3AED" />
      <path d="M6 22 L18 22 L18 38 L6 38 Z" fill="#CBD5E1" />
      {/* Pointer */}
      <path d="M14 18 C18 18, 22 24, 26 26" stroke="#7C3AED" strokeWidth="2" strokeDasharray="2 2" />
      {/* LENS */}
      <circle cx="42" cy="32" r="19" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="3" />
      <g clipPath="url(#neck-lens-clip)">
        <circle cx="42" cy="18" r="10" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1.5" />
        <path d="M28 48 C32 40, 42 38, 56 48 Z" fill="#CBD5E1" />
        {/* Neck in center highlighted */}
        <rect x="36" y="24" width="12" height="16" rx="3" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="neck-lens-clip">
          <circle cx="42" cy="32" r="17.5" />
        </clipPath>
      </defs>
    </svg>
  ),

  // BARRIGA: Child patting cute round tummy highlighted
  barriga: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Barriga (belly/tummy)">
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      {/* Head */}
      <circle cx="32" cy="14" r="7" fill="#FED7AA" />
      <circle cx="30" cy="13" r="1" fill="#78350F" />
      <circle cx="34" cy="13" r="1" fill="#78350F" />
      <path d="M30 16 C31 17, 33 17, 34 16" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
      {/* Upper body shirt */}
      <rect x="24" y="21" width="16" height="10" rx="3" fill="#60A5FA" />
      {/* ROUND CUTE TUMMY HIGHLIGHTED */}
      <circle cx="32" cy="39" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="3" />
      <circle cx="32" cy="40" r="2" fill="#EA580C" />
      <path d="M25 35 C28 32, 36 32, 39 35" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      {/* Patting hands */}
      <circle cx="18" cy="39" r="3.5" fill="#FED7AA" />
      <circle cx="46" cy="39" r="3.5" fill="#FED7AA" />
    </svg>
  ),

  // === COMIDA, FRUTAS & VERDURAS (ACCURATE & DISTINCT) ===

  // CIRUELA: Plum fruit (violet with golden amber flesh cut half)
  ciruela: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Ciruela (plum)">
      <rect width="64" height="64" rx="16" fill="#FAF5FF" />
      {/* Whole plum */}
      <circle cx="26" cy="36" r="14" fill="#7E22CE" stroke="#581C87" strokeWidth="2" />
      <path d="M26 22 C24 28, 24 44, 26 50" stroke="#581C87" strokeWidth="1.5" />
      {/* Cut plum half showing amber yellow flesh & pit */}
      <circle cx="42" cy="36" r="13" fill="#FBBF24" stroke="#7E22CE" strokeWidth="2" />
      <ellipse cx="42" cy="36" rx="5" ry="7" fill="#92400E" />
      {/* Top green leaf & stem */}
      <path d="M30 22 L32 12" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 12 C38 10, 42 16, 32 18 Z" fill="#22C55E" />
    </svg>
  ),

  // FRAMBUESA: Raspberry (magenta red drupelet texture, distinct from blueberry)
  frambuesa: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Frambuesa (raspberry)">
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Raspberry shape made of textured drupelets */}
      <g>
        <circle cx="26" cy="28" r="5" fill="#EC4899" />
        <circle cx="38" cy="28" r="5" fill="#EC4899" />
        <circle cx="32" cy="24" r="5" fill="#F43F5E" />
        <circle cx="20" cy="36" r="5" fill="#EC4899" />
        <circle cx="32" cy="34" r="5.5" fill="#E11D48" />
        <circle cx="44" cy="36" r="5" fill="#EC4899" />
        <circle cx="24" cy="44" r="5" fill="#E11D48" />
        <circle cx="40" cy="44" r="5" fill="#E11D48" />
        <circle cx="32" cy="50" r="5" fill="#BE123C" />
      </g>
      {/* Top green leafy cap */}
      <path d="M32 20 L24 14 L30 16 L32 10 L34 16 L40 14 Z" fill="#16A34A" />
    </svg>
  ),

  // MORA: Blackberry (dark indigo/black drupelet texture, distinct from blueberry)
  mora: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mora (blackberry)">
      <rect width="64" height="64" rx="16" fill="#F8FAFC" />
      {/* Dark drupelets */}
      <g>
        <circle cx="26" cy="28" r="5" fill="#334155" />
        <circle cx="38" cy="28" r="5" fill="#334155" />
        <circle cx="32" cy="24" r="5" fill="#1E293B" />
        <circle cx="20" cy="36" r="5" fill="#334155" />
        <circle cx="32" cy="34" r="5.5" fill="#0F172A" />
        <circle cx="44" cy="36" r="5" fill="#334155" />
        <circle cx="24" cy="44" r="5" fill="#1E293B" />
        <circle cx="40" cy="44" r="5" fill="#1E293B" />
        <circle cx="32" cy="50" r="5" fill="#0F172A" />
      </g>
      {/* Shiny highlights */}
      <circle cx="30" cy="32" r="1.5" fill="#94A3B8" />
      <circle cx="42" cy="34" r="1.5" fill="#94A3B8" />
      {/* Top green cap */}
      <path d="M32 20 L24 14 L30 16 L32 10 L34 16 L40 14 Z" fill="#15803D" />
    </svg>
  ),

  // HIGO: Fig fruit (purple teardrop cut open showing red seeded interior)
  higo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Higo (fig)">
      <rect width="64" height="64" rx="16" fill="#FAF5FF" />
      {/* Teardrop fig shape cut open */}
      <path d="M32 12 C28 16, 12 28, 12 42 C12 52, 21 58, 32 58 C43 58, 52 52, 52 42 C52 28, 36 16, 32 12 Z" fill="#581C87" stroke="#3B0764" strokeWidth="2" />
      {/* Red seeded inner flesh */}
      <path d="M32 18 C29 22, 18 32, 18 42 C18 49, 24 53, 32 53 C40 53, 46 49, 46 42 C46 32, 35 22, 32 18 Z" fill="#BE123C" />
      {/* Seeds */}
      <circle cx="28" cy="38" r="1" fill="#FDE047" />
      <circle cx="36" cy="38" r="1" fill="#FDE047" />
      <circle cx="32" cy="44" r="1" fill="#FDE047" />
      <circle cx="26" cy="44" r="1" fill="#FDE047" />
      <circle cx="38" cy="44" r="1" fill="#FDE047" />
    </svg>
  ),

  // ESPINACA: Spinach leaves bunch
  espinaca: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Espinaca (spinach)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* Spinach leaf 1 */}
      <path d="M22 52 C10 42, 10 24, 24 16 C34 22, 30 42, 22 52 Z" fill="#15803D" stroke="#166534" strokeWidth="2" />
      <path d="M22 52 C22 40, 24 28, 24 16" stroke="#86EFAC" strokeWidth="1.5" fill="none" />
      {/* Spinach leaf 2 */}
      <path d="M42 52 C54 42, 54 24, 40 16 C30 22, 34 42, 42 52 Z" fill="#16A34A" stroke="#166534" strokeWidth="2" />
      <path d="M42 52 C42 40, 40 28, 40 16" stroke="#86EFAC" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  // COL: Cabbage head
  col: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Col (cabbage)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Dense round cabbage head */}
      <circle cx="32" cy="34" r="20" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
      {/* Layered leaf curves */}
      <path d="M16 28 C22 20, 42 20, 48 28" stroke="#86EFAC" strokeWidth="2.5" fill="none" />
      <path d="M18 42 C26 50, 38 50, 46 42" stroke="#86EFAC" strokeWidth="2.5" fill="none" />
      <path d="M22 34 C26 28, 38 28, 42 34" stroke="#15803D" strokeWidth="2" fill="none" />
    </svg>
  ),

  // APIO: Celery stalks
  apio: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Apio (celery)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* Stalks */}
      <path d="M20 54 L24 24 C24 24, 20 18, 16 16" stroke="#4ADE80" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M32 54 L32 20 C32 20, 32 14, 32 12" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M44 54 L40 24 C40 24, 44 18, 48 16" stroke="#4ADE80" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Leafy tops */}
      <circle cx="16" cy="14" r="4" fill="#15803D" />
      <circle cx="32" cy="10" r="5" fill="#15803D" />
      <circle cx="48" cy="14" r="4" fill="#15803D" />
    </svg>
  ),

  // CALABACIN: Zucchini squash with yellow flower tip
  calabacin: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Calabacín (zucchini)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Curved dark green zucchini */}
      <path d="M12 48 C16 54, 44 52, 52 30 C56 18, 44 12, 38 18 C28 26, 10 38, 12 48 Z" fill="#15803D" stroke="#166534" strokeWidth="2" />
      {/* Light green stripes */}
      <path d="M18 45 C28 36, 40 28, 46 22" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Yellow blossom tip */}
      <polygon points="52,30 58,28 56,34 60,32 54,36" fill="#FACC15" />
    </svg>
  ),

  // PUERRO: Leek stalk with root bristles
  puerro: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Puerro (leek)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* White lower bulb & green upper leaves */}
      <rect x="26" y="32" width="12" height="22" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
      <path d="M26 32 L16 10 L28 26 L32 8 L36 26 L48 10 L38 32 Z" fill="#15803D" />
      {/* Root bristles at bottom */}
      <path d="M28 54 L26 60 M32 54 L32 60 M36 54 L38 60" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // RABANO: Magenta round radish with leaves and taproot
  rabano: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Rábano (radish)">
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Green leaves top */}
      <path d="M32 30 L22 10 L30 22 L32 8 L34 22 L42 10 Z" fill="#22C55E" />
      {/* Round pink/magenta radish bulb */}
      <circle cx="32" cy="38" r="13" fill="#E11D48" stroke="#9F1239" strokeWidth="2" />
      <path d="M24 38 C28 44, 36 44, 40 38" fill="#FFFFFF" opacity="0.6" />
      {/* Taproot at bottom */}
      <path d="M32 51 L32 60" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  // HORNO: Stainless kitchen oven appliance with glass door & baking tray
  horno: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Horno (oven)">
      <rect width="64" height="64" rx="16" fill="#F8FAFC" />
      {/* Oven body */}
      <rect x="12" y="10" width="40" height="46" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
      {/* Control panel top */}
      <rect x="15" y="13" width="34" height="8" rx="2" fill="#334155" />
      <circle cx="20" cy="17" r="2" fill="#F59E0B" />
      <circle cx="28" cy="17" r="2" fill="#38BDF8" />
      <rect x="36" y="15" width="10" height="4" fill="#10B981" />
      {/* Glass door */}
      <rect x="16" y="24" width="32" height="28" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <rect x="20" y="28" width="24" height="16" rx="2" fill="#EA580C" opacity="0.7" />
      {/* Door handle */}
      <rect x="22" y="48" width="20" height="2" fill="#E2E8F0" />
    </svg>
  ),

  // NEVERA: Tall kitchen refrigerator
  nevera: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Nevera (fridge)">
      <rect width="64" height="64" rx="16" fill="#F0F9FF" />
      {/* Refrigerator body */}
      <rect x="16" y="8" width="32" height="50" rx="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
      {/* Freezer & fridge door split */}
      <line x1="16" y1="26" x2="48" y2="26" stroke="#64748B" strokeWidth="2" />
      {/* Door handles */}
      <rect x="20" y="18" width="3" height="6" rx="1" fill="#0284C7" />
      <rect x="20" y="32" width="3" height="12" rx="1" fill="#0284C7" />
    </svg>
  ),

  // MICROONDAS: Countertop microwave with digital timer screen
  microondas: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Microondas (microwave)">
      <rect width="64" height="64" rx="16" fill="#F1F5F9" />
      <rect x="10" y="18" width="44" height="30" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
      {/* Glass window */}
      <rect x="14" y="22" width="26" height="22" rx="2" fill="#0284C7" opacity="0.8" />
      {/* Control keypad */}
      <rect x="43" y="22" width="8" height="6" fill="#10B981" />
      <circle cx="47" cy="34" r="2" fill="#94A3B8" />
      <circle cx="47" cy="40" r="2" fill="#94A3B8" />
    </svg>
  ),

  // SERVILLETA: Folded cloth dining napkin with ring
  servilleta: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Servilleta (napkin)">
      <rect width="64" height="64" rx="16" fill="#FFF1F2" />
      {/* Triangular folded cloth napkin */}
      <polygon points="12,16 52,16 32,52" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2" />
      <path d="M22 28 L42 28" stroke="#FDA4AF" strokeWidth="1.5" />
      {/* Golden napkin ring */}
      <ellipse cx="32" cy="24" rx="12" ry="4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    </svg>
  ),

  // BATIDORA: Kitchen blender pitcher with smoothie
  batidora: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Batidora (blender)">
      <rect width="64" height="64" rx="16" fill="#FAF5FF" />
      {/* Motor base */}
      <rect x="20" y="42" width="24" height="14" rx="3" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
      <circle cx="32" cy="49" r="2.5" fill="#FDE047" />
      {/* Glass pitcher with pink smoothie */}
      <polygon points="22,42 42,42 46,16 18,16" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
      {/* Lid & handle */}
      <rect x="16" y="12" width="32" height="4" rx="2" fill="#334155" />
      <path d="M44 20 C50 20, 50 36, 43 36" stroke="#BE185D" strokeWidth="3" fill="none" />
    </svg>
  ),

  // TOSTADORA: Toaster with golden toast popping up
  tostadora: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Tostadora (toaster)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Toast slices popping up */}
      <rect x="20" y="10" width="10" height="16" rx="2" fill="#D97706" />
      <rect x="34" y="12" width="10" height="14" rx="2" fill="#D97706" />
      {/* Chrome toaster body */}
      <rect x="12" y="22" width="40" height="28" rx="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
      {/* Lever slider */}
      <rect x="46" y="30" width="8" height="4" rx="1" fill="#EF4444" />
      {/* Motion lines */}
      <path d="M25 6 L25 2 M39 8 L39 4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // BOTELLA: Clean water bottle with cap
  botella: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Botella (bottle)">
      <rect width="64" height="64" rx="16" fill="#ECFEFF" />
      {/* Bottle body */}
      <path d="M26 18 L26 12 L38 12 L38 18 C44 22, 44 26, 44 32 L44 52 C44 56, 40 58, 32 58 C24 58, 20 56, 20 52 L20 32 C20 26, 20 22, 26 18 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
      {/* Blue cap */}
      <rect x="27" y="6" width="10" height="6" rx="1" fill="#0284C7" />
      {/* Water level wave */}
      <path d="M21 36 C28 32, 36 40, 43 36 L43 52 C43 55, 38 56, 32 56 C26 56, 21 55, 21 52 Z" fill="#0284C7" opacity="0.6" />
    </svg>
  ),

  // ESPALDA: Human torso viewed from the back with spine highlighted
  espalda: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Espalda (back)">
      <rect width="64" height="64" rx="16" fill="#F0FDFA" />
      {/* Back of head with hair */}
      <circle cx="32" cy="14" r="7" fill="#78350F" />
      {/* Neck */}
      <rect x="29" y="20" width="6" height="6" fill="#FED7AA" />
      {/* Back torso */}
      <path d="M18 26 C24 24, 40 24, 46 26 L42 54 L22 54 Z" fill="#FED7AA" stroke="#F59E0B" strokeWidth="2" />
      {/* Spine line running down center */}
      <path d="M32 26 L32 50" stroke="#0D9488" strokeWidth="3" strokeDasharray="3 3" strokeLinecap="round" />
      {/* Shoulder blades */}
      <path d="M25 32 C26 36, 28 36, 28 38" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <path d="M39 32 C38 36, 36 36, 36 38" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      {/* Focus arrows on back */}
      <path d="M12 38 L18 38 M15 35 L19 38 L15 41" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 38 L46 38 M49 35 L45 38 L49 41" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // CABEZA: Cheerful smiling child head with hair, ears, eyes, smile
  cabeza: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Cabeza (head)">
      <rect width="64" height="64" rx="16" fill="#FFF1F2" />
      {/* Soft circular aura around head */}
      <circle cx="32" cy="32" r="22" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="4 3" fill="none" />
      {/* Ears */}
      <circle cx="16" cy="32" r="4" fill="#FED7AA" />
      <circle cx="48" cy="32" r="4" fill="#FED7AA" />
      {/* Head */}
      <circle cx="32" cy="32" r="16" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
      {/* Hair */}
      <path d="M16 28 C16 16, 48 16, 48 28 C44 20, 36 18, 32 22 C28 18, 20 20, 16 28 Z" fill="#92400E" />
      {/* Eyes */}
      <circle cx="27" cy="32" r="2" fill="#1E293B" />
      <circle cx="37" cy="32" r="2" fill="#1E293B" />
      <circle cx="26" cy="31" r="0.6" fill="#FFFFFF" />
      <circle cx="36" cy="31" r="0.6" fill="#FFFFFF" />
      {/* Nose & Smile */}
      <circle cx="32" cy="35" r="1" fill="#EA580C" />
      <path d="M28 38 C30 41, 34 41, 36 38" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // ESTOMAGO: Anatomical child-friendly stomach organ (not a soup bowl!)
  estomago: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Estómago (stomach)">
      <rect width="64" height="64" rx="16" fill="#FFF1F2" />
      {/* Esophagus tube in */}
      <path d="M26 10 L26 22" stroke="#FB7185" strokeWidth="5" strokeLinecap="round" />
      {/* Stomach J-shaped pouch */}
      <path d="M26 22 C26 22, 16 26, 16 38 C16 50, 30 54, 40 50 C48 46, 50 36, 44 28 C38 22, 30 22, 26 22 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="2.5" />
      {/* Duodenum exit tube */}
      <path d="M42 46 C46 48, 50 46, 52 42" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
      {/* Friendly sparkle */}
      <circle cx="28" cy="36" r="3" fill="#FDA4AF" />
      <circle cx="36" cy="40" r="2" fill="#FDA4AF" />
    </svg>
  ),

  // INTESTINO: Curving winding digestive intestines (not DNA!)
  intestino: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Intestino (intestines)">
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      {/* Large intestine outer frame */}
      <path d="M16 46 L16 20 C16 16, 48 16, 48 20 L48 46" stroke="#FB923C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Small intestine winding coils inside */}
      <path d="M22 28 C26 28, 30 32, 34 32 C38 32, 42 28, 42 32 C42 36, 38 36, 34 36 C30 36, 26 40, 26 44 C26 46, 38 46, 38 44" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // MUSCULO: Bicep muscle flexed with power curves
  musculo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Músculo (muscle)">
      <rect width="64" height="64" rx="16" fill="#FEF2F2" />
      {/* Arm outline */}
      <path d="M12 38 C14 30, 22 18, 32 18 C40 18, 48 26, 48 36 L48 46 C48 50, 42 52, 36 50 C28 48, 18 46, 12 38 Z" fill="#F87171" stroke="#DC2626" strokeWidth="2.5" />
      {/* Bicep bump highlight */}
      <path d="M24 24 C28 20, 36 20, 40 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      {/* Energy sparks */}
      <path d="M32 12 L32 8 M42 14 L46 10 M22 14 L18 10" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // VENA: Forearm showing blue blood vessel vein (not a blood droplet!)
  vena: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Vena (vein)">
      <rect width="64" height="64" rx="16" fill="#ECFEFF" />
      {/* Arm surface */}
      <rect x="14" y="14" width="36" height="36" rx="8" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
      {/* Branching blue vein */}
      <path d="M20 44 C26 38, 30 36, 32 30 C34 24, 38 20, 44 18" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M32 30 C36 32, 40 32, 44 36" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Pulsing blood droplet */}
      <circle cx="32" cy="30" r="3" fill="#38BDF8" />
    </svg>
  ),

  // PIEL: Smooth skin patch with gentle touch and sparkle (not a lotion bottle!)
  piel: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Piel (skin)">
      <rect width="64" height="64" rx="16" fill="#FFFBEB" />
      {/* Smooth skin surface */}
      <rect x="10" y="24" width="44" height="26" rx="12" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
      {/* Touching gentle finger */}
      <path d="M26 10 C28 10, 30 14, 30 20 L30 26 C30 28, 26 28, 26 26 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
      {/* Sparkles of healthy soft skin */}
      <path d="M42 16 L43 14 L44 16 L46 17 L44 18 L43 20 L42 18 L40 17 Z" fill="#F59E0B" />
      <path d="M18 18 L19 16 L20 18 L22 19 L20 20 L19 22 L18 20 L16 19 Z" fill="#F59E0B" />
    </svg>
  ),

  // BARBILLA: Profile of face clearly highlighting the chin (not a beard!)
  barbilla: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Barbilla (chin)">
      <rect width="64" height="64" rx="16" fill="#F0F9FF" />
      {/* Face profile outline */}
      <path d="M18 12 L30 12 C34 12, 38 18, 38 22 C36 26, 32 26, 32 30 C36 32, 38 34, 34 38 C32 42, 34 44, 38 46 C34 50, 26 50, 22 46 Z" fill="#FED7AA" stroke="#94A3B8" strokeWidth="2" />
      {/* Glowing TARGET ON THE CHIN */}
      <circle cx="37" cy="46" r="9" fill="#FEE2E2" opacity="0.7" />
      <circle cx="37" cy="46" r="5" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
      {/* Arrow pointing to chin */}
      <path d="M52 46 L44 46 M48 42 L44 46 L48 50" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // MEJILLA: Smiling cheek with bright rosy round cheek blush
  mejilla: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mejilla (cheek)">
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Face base */}
      <circle cx="32" cy="32" r="18" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
      {/* Eye & Smile */}
      <circle cx="26" cy="28" r="2" fill="#1E293B" />
      <circle cx="38" cy="28" r="2" fill="#1E293B" />
      <path d="M28 38 C30 41, 34 41, 36 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      {/* BRIGHT ROSY CHEEK HIGHLIGHTED */}
      <circle cx="22" cy="35" r="5" fill="#F43F5E" opacity="0.8" />
      <circle cx="42" cy="35" r="5" fill="#F43F5E" opacity="0.8" />
      {/* Focus sparkle on cheek */}
      <circle cx="22" cy="35" r="2" fill="#FFFFFF" />
      <path d="M12 24 L16 28 M12 28 L16 24" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // MANDIBULA: Lower jaw profile with jawline highlighted
  mandibula: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mandíbula (jaw)">
      <rect width="64" height="64" rx="16" fill="#F8FAFC" />
      {/* Lower head and jaw */}
      <path d="M16 16 L24 16 L24 34 L38 42 C40 43, 40 46, 38 48 C32 52, 22 50, 16 42 Z" fill="#FED7AA" />
      {/* JAWLINE BONE HIGHLIGHT */}
      <path d="M24 24 L24 38 L40 46" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="24" cy="38" r="4" fill="#1D4ED8" />
    </svg>
  ),

  // NUCA: Back of child head with nape highlighted
  nuca: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Nuca (nape)">
      <rect width="64" height="64" rx="16" fill="#F5F3FF" />
      {/* Back of head with hair */}
      <circle cx="32" cy="22" r="14" fill="#78350F" />
      {/* Neck base */}
      <rect x="27" y="32" width="10" height="14" rx="2" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
      {/* NAPE HIGHLIGHT (top of neck where hair ends) */}
      <circle cx="32" cy="34" r="8" fill="#DDD6FE" opacity="0.8" />
      <circle cx="32" cy="34" r="4" fill="#7C3AED" />
      {/* Arrow pointing to nape */}
      <path d="M48 34 L38 34 M44 30 L38 34 L44 38" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // AXILA: Raised arm with underarm/axilla clearly indicated
  axila: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Axila (armpit)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* Torso & raised arm */}
      <path d="M18 54 L18 36 C18 32, 24 28, 28 20 L36 10 C38 8, 42 10, 42 14 L36 28 C34 32, 34 38, 34 54 Z" fill="#FED7AA" stroke="#94A3B8" strokeWidth="2" />
      {/* UNDERARM / AXILA CREASE */}
      <circle cx="30" cy="34" r="10" fill="#BBF7D0" opacity="0.7" />
      <circle cx="30" cy="34" r="5" fill="#16A34A" />
      {/* Indicator arrow */}
      <path d="M48 34 L38 34 M44 30 L38 34 L44 38" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // PESTAÑA: Eye with prominent lush curved eyelashes highlighted
  pestana: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Pestaña (eyelashes)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Eye almond outline */}
      <path d="M12 36 C20 24, 44 24, 52 36 C44 48, 20 48, 12 36 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
      <circle cx="32" cy="36" r="6" fill="#0284C7" />
      <circle cx="32" cy="36" r="3" fill="#0F172A" />
      {/* PROMINENT CURVED EYELASHES */}
      <path d="M16 28 C14 22, 12 18, 10 16" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 25 C24 18, 22 14, 20 12" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 24 C32 16, 32 12, 32 10" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M40 25 C40 18, 42 14, 44 12" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 28 C50 22, 52 18, 54 16" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  // PARPADO: Eye with eyelid closing midway over pupil
  parpado: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Párpado (eyelid)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Eye socket */}
      <path d="M10 34 C18 22, 46 22, 54 34 C46 46, 18 46, 10 34 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
      {/* Lower pupil */}
      <circle cx="32" cy="38" r="6" fill="#0284C7" />
      <circle cx="32" cy="38" r="3" fill="#0F172A" />
      {/* EYELID COVERING TOP HALF */}
      <path d="M10 34 C18 22, 46 22, 54 34 C46 36, 18 36, 10 34 Z" fill="#FED7AA" stroke="#F59E0B" strokeWidth="2" />
      {/* Eyelid crease line */}
      <path d="M16 28 C24 22, 40 22, 48 28" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      {/* Down arrow showing eyelid movement */}
      <path d="M32 16 L32 26 M29 23 L32 27 L35 23" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // ALIENTO: Gentle breath puff coming from mouth
  aliento: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Aliento (breath)">
      <rect width="64" height="64" rx="16" fill="#F0F9FF" />
      {/* Face profile mouth */}
      <path d="M12 20 L20 20 C22 20, 24 24, 22 28 C20 32, 16 32, 18 36 C22 38, 22 42, 16 44" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
      {/* Lips */}
      <path d="M19 32 C22 31, 24 33, 22 35" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
      {/* Soft breath vapor clouds */}
      <path d="M26 33 C32 30, 36 34, 42 32 C48 30, 52 34, 56 32" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M28 39 C34 37, 38 41, 46 39" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="48" cy="28" r="2" fill="#BAE6FD" />
      <circle cx="56" cy="38" r="2.5" fill="#BAE6FD" />
    </svg>
  ),

  // LATIDO: Heart with energetic ECG pulse rhythm wave
  latido: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Latido (heartbeat)">
      <rect width="64" height="64" rx="16" fill="#FEF2F2" />
      {/* Red heart */}
      <path d="M32 50 C32 50, 14 38, 14 26 C14 18, 20 14, 26 14 C29 14, 31 16, 32 18 C33 16, 35 14, 38 14 C44 14, 50 18, 50 26 C50 38, 32 50, 32 50 Z" fill="#F43F5E" />
      {/* Pulsing wave lines across */}
      <path d="M10 32 L22 32 L26 22 L30 42 L34 26 L38 34 L42 32 L54 32" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pulse rings */}
      <circle cx="32" cy="32" r="16" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="3 3" fill="none" />
    </svg>
  ),

  // SUDOR: Forehead of smiling character with sweat drops
  sudor: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Sudor (sweat)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Face */}
      <circle cx="32" cy="36" r="18" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
      {/* Tired friendly face */}
      <circle cx="26" cy="36" r="2" fill="#1E293B" />
      <circle cx="38" cy="36" r="2" fill="#1E293B" />
      <path d="M28 44 C30 46, 34 46, 36 44" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      {/* Shiny blue SWEAT DROPLETS */}
      <path d="M44 20 C44 20, 48 26, 48 29 C48 31, 46 33, 44 33 C42 33, 40 31, 40 29 C40 26, 44 20, 44 20 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
      <path d="M20 24 C20 24, 23 28, 23 30 C23 32, 21.5 33, 20 33 C18.5 33, 17 32, 17 30 C17 28, 20 24, 20 24 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
    </svg>
  ),

  // FALDA: Pleated colorful skirt
  falda: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Falda (skirt)">
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Waistband */}
      <rect x="22" y="14" width="20" height="6" rx="2" fill="#BE185D" />
      {/* Skirt body with pleats */}
      <path d="M22 20 L12 50 C12 50, 32 54, 52 50 L42 20 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
      {/* Pleat lines */}
      <path d="M26 20 L22 51 M32 20 L32 52 M38 20 L42 51" stroke="#FBCFE8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // PERCHA: Clothes hanger (separate from dress)
  percha: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Percha (hanger)">
      <rect width="64" height="64" rx="16" fill="#F8FAFC" />
      {/* Metal top hook */}
      <path d="M32 22 C32 16, 38 12, 38 8 C38 6, 36 4, 34 4 C31 4, 30 6, 30 8" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Wooden triangular hanger */}
      <path d="M32 22 L10 38 C9 39, 10 42, 12 42 L52 42 C54 42, 55 39, 54 38 Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
      {/* Bottom bar */}
      <rect x="14" y="38" width="36" height="4" rx="2" fill="#B45309" />
    </svg>
  ),

  // ARMARIO: Two-door wooden wardrobe closet
  armario: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Armario (wardrobe)">
      <rect width="64" height="64" rx="16" fill="#FFFBEB" />
      {/* Wardrobe frame */}
      <rect x="14" y="10" width="36" height="46" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
      {/* Door split */}
      <line x1="32" y1="12" x2="32" y2="54" stroke="#78350F" strokeWidth="2" />
      {/* Left & right door panels */}
      <rect x="17" y="14" width="12" height="18" rx="2" fill="#D97706" />
      <rect x="35" y="14" width="12" height="18" rx="2" fill="#D97706" />
      <rect x="17" y="34" width="12" height="16" rx="2" fill="#D97706" />
      <rect x="35" y="34" width="12" height="16" rx="2" fill="#D97706" />
      {/* Handles */}
      <circle cx="29" cy="34" r="1.5" fill="#FDE047" />
      <circle cx="35" cy="34" r="1.5" fill="#FDE047" />
    </svg>
  ),

  // COLCHON: Bed mattress
  colchon: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Colchón (mattress)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Mattress top 3D perspective */}
      <path d="M12 26 L44 14 L56 24 L24 36 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
      {/* Mattress sides */}
      <path d="M12 26 L24 36 L24 46 L12 36 Z" fill="#93C5FD" stroke="#2563EB" strokeWidth="2" />
      <path d="M24 36 L56 24 L56 34 L24 46 Z" fill="#60A5FA" stroke="#2563EB" strokeWidth="2" />
      {/* Tuft marks */}
      <circle cx="30" cy="24" r="1.5" fill="#2563EB" />
      <circle cx="42" cy="22" r="1.5" fill="#2563EB" />
      <circle cx="36" cy="30" r="1.5" fill="#2563EB" />
    </svg>
  ),

  // COJIN: Plump soft sofa cushion
  cojin: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Cojín (cushion)">
      <rect width="64" height="64" rx="16" fill="#FDF4FF" />
      <path d="M12 20 C14 12, 50 12, 52 20 C56 32, 56 32, 52 44 C50 52, 14 52, 12 44 C8 32, 8 32, 12 20 Z" fill="#C084FC" stroke="#9333EA" strokeWidth="2" />
      {/* Center tuft button */}
      <circle cx="32" cy="32" r="3.5" fill="#7E22CE" />
      <path d="M16 22 L29 29 M48 22 L35 29 M16 42 L29 35 M48 42 L35 35" stroke="#E9D5FF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // ZOO: Zoo entrance arch with animal silhouettes
  zoo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Zoo (zoo)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Stone pillars */}
      <rect x="10" y="24" width="8" height="32" rx="2" fill="#94A3B8" />
      <rect x="46" y="24" width="8" height="32" rx="2" fill="#94A3B8" />
      {/* Arch sign with ZOO text */}
      <path d="M14 26 C14 14, 50 14, 50 26" stroke="#059669" strokeWidth="6" strokeLinecap="round" fill="none" />
      <rect x="22" y="16" width="20" height="10" rx="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      <text x="32" y="24" fontSize="8" fontWeight="bold" fill="#78350F" textAnchor="middle" dominantBaseline="middle">ZOO</text>
      {/* Giraffe & Lion head silhouettes inside */}
      <circle cx="28" cy="40" r="4" fill="#F59E0B" />
      <circle cx="36" cy="42" r="5" fill="#EA580C" />
    </svg>
  ),

  // ALFOMBRA: Woven decorative room rug with fringes (User highlighted!)
  alfombra: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Alfombra (rug/carpet)">
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      {/* Rug fringe edges */}
      <path d="M8 20 L8 44 M56 20 L56 44" stroke="#D97706" strokeWidth="2" strokeDasharray="2 2" />
      {/* Outer rug body */}
      <rect x="10" y="18" width="44" height="28" rx="3" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
      {/* Inner decorative pattern */}
      <rect x="16" y="22" width="32" height="20" fill="#FDBA74" />
      {/* Diamond center motif */}
      <polygon points="32,24 40,32 32,40 24,32" fill="#B45309" />
      <polygon points="32,27 36,32 32,37 28,32" fill="#FDE047" />
    </svg>
  ),

  // JERSEY: Cozy knitted sweater top
  jersey: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Jersey (sweater)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Sweater body & long sleeves */}
      <path d="M22 14 C26 18, 38 18, 42 14 L56 24 L48 34 L44 28 L44 52 L20 52 L20 28 L16 34 L8 24 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      {/* Ribbed neck collar & hem */}
      <path d="M24 14 C28 17, 36 17, 40 14" stroke="#93C5FD" strokeWidth="2" fill="none" />
      <rect x="20" y="48" width="24" height="4" fill="#1D4ED8" />
      {/* Knit stitch pattern lines */}
      <path d="M28 26 L28 44 M32 26 L32 44 M36 26 L36 44" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  ),

  // MANTA: Soft cozy folded bed blanket
  manta: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Manta (blanket)">
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Blanket folded stack */}
      <rect x="12" y="32" width="40" height="18" rx="4" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
      <path d="M12 24 C12 20, 52 20, 52 24 L52 34 L12 34 Z" fill="#FB7185" stroke="#BE123C" strokeWidth="2" />
      <path d="M16 16 C16 12, 48 12, 48 16 L48 24 L16 24 Z" fill="#FDA4AF" stroke="#BE123C" strokeWidth="2" />
      {/* Soft stitching hem */}
      <line x1="16" y1="20" x2="48" y2="20" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  ),

  // SUELO: Section of wooden parquet / tile floor
  suelo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Suelo (floor)">
      <rect width="64" height="64" rx="16" fill="#FFFBEB" />
      {/* Floor perspective surface */}
      <polygon points="8,54 56,54 48,16 16,16" fill="#D97706" stroke="#92400E" strokeWidth="2" />
      {/* Parquet board lines */}
      <line x1="24" y1="16" x2="20" y2="54" stroke="#B45309" strokeWidth="2" />
      <line x1="32" y1="16" x2="32" y2="54" stroke="#B45309" strokeWidth="2" />
      <line x1="40" y1="16" x2="44" y2="54" stroke="#B45309" strokeWidth="2" />
      <line x1="14" y1="32" x2="50" y2="32" stroke="#B45309" strokeWidth="1.5" />
      <line x1="11" y1="44" x2="53" y2="44" stroke="#B45309" strokeWidth="1.5" />
    </svg>
  ),

  // PARED: Wall section with bricks & picture frame
  pared: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Pared (wall)">
      <rect width="64" height="64" rx="16" fill="#F8FAFC" />
      {/* Wall surface */}
      <rect x="10" y="10" width="44" height="44" rx="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
      {/* Brick mortar lines */}
      <line x1="10" y1="24" x2="54" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="10" y1="38" x2="54" y2="38" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="24" y1="10" x2="24" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="40" y1="10" x2="40" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="32" y1="24" x2="32" y2="38" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="20" y1="38" x2="20" y2="54" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="44" y1="38" x2="44" y2="54" stroke="#94A3B8" strokeWidth="1.5" />
    </svg>
  ),

  // MESA: Sturdy 4-legged wooden table
  mesa: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mesa (table)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Table top perspective */}
      <polygon points="8,26 56,26 50,18 14,18" fill="#D97706" stroke="#92400E" strokeWidth="2" />
      <rect x="8" y="26" width="48" height="6" rx="2" fill="#B45309" />
      {/* 4 Legs */}
      <rect x="12" y="32" width="5" height="22" fill="#92400E" />
      <rect x="22" y="32" width="4" height="16" fill="#78350F" />
      <rect x="38" y="32" width="4" height="16" fill="#78350F" />
      <rect x="47" y="32" width="5" height="22" fill="#92400E" />
    </svg>
  ),

  // MESITA: Nightstand bedside table with drawer & lamp
  mesita: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mesita (nightstand)">
      <rect width="64" height="64" rx="16" fill="#FFFBEB" />
      {/* Small table top */}
      <rect x="16" y="28" width="32" height="22" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="2" />
      {/* Drawer */}
      <rect x="20" y="32" width="24" height="12" rx="2" fill="#B45309" />
      <circle cx="32" cy="38" r="1.5" fill="#FDE047" />
      {/* Legs */}
      <rect x="18" y="50" width="4" height="8" fill="#78350F" />
      <rect x="42" y="50" width="4" height="8" fill="#78350F" />
      {/* Small lamp on top */}
      <path d="M26 28 L38 28 L34 16 L30 16 Z" fill="#FBBF24" />
      <rect x="31" y="10" width="2" height="6" fill="#78350F" />
    </svg>
  ),

  // MUEBLE: Sideboard / cabinet furniture
  mueble: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Mueble (cabinet)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      <rect x="12" y="16" width="40" height="38" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
      {/* Left & Right Doors */}
      <rect x="15" y="20" width="16" height="30" rx="2" fill="#D97706" />
      <rect x="33" y="20" width="16" height="30" rx="2" fill="#D97706" />
      {/* Handles */}
      <circle cx="28" cy="35" r="1.5" fill="#FDE047" />
      <circle cx="36" cy="35" r="1.5" fill="#FDE047" />
    </svg>
  ),

  // PALA: Garden shovel / spade
  pala: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Pala (shovel)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* Wooden handle bar */}
      <line x1="16" y1="12" x2="38" y2="38" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
      {/* Handle D-grip */}
      <circle cx="14" cy="10" r="4" fill="#D97706" />
      {/* Metal shovel blade */}
      <path d="M34 34 L52 52 C54 54, 50 58, 44 54 L30 40 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
    </svg>
  ),

  // BARRO: Mud puddle / clay lump
  barro: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Barro (mud)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Mud puddle shape */}
      <path d="M10 38 C10 26, 26 22, 38 24 C50 26, 56 34, 52 44 C48 52, 28 54, 16 50 C10 46, 10 42, 10 38 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
      {/* Mud splatters & boots prints */}
      <circle cx="26" cy="36" r="3" fill="#451A03" />
      <circle cx="38" cy="40" r="4" fill="#451A03" />
      <circle cx="48" cy="20" r="2.5" fill="#78350F" />
      <circle cx="12" cy="22" r="2" fill="#78350F" />
    </svg>
  ),

  // HABITACION: Bedroom view with bed & window
  habitacion: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Habitación (bedroom)">
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      {/* Window with moon */}
      <rect x="36" y="10" width="16" height="18" rx="2" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2" />
      <path d="M44 14 C42 16, 42 20, 44 22 C46 22, 48 20, 48 18 Z" fill="#FDE047" />
      {/* Bed */}
      <rect x="10" y="32" width="44" height="20" rx="3" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
      <rect x="14" y="28" width="14" height="8" rx="2" fill="#FFFFFF" />
      <rect x="8" y="24" width="4" height="32" fill="#1E40AF" />
    </svg>
  ),

  // SALON: Living room scene
  salon: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Salón (living room)">
      <rect width="64" height="64" rx="16" fill="#FAF5FF" />
      {/* Sofa */}
      <rect x="12" y="30" width="36" height="20" rx="4" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
      <rect x="8" y="26" width="44" height="8" rx="3" fill="#C084FC" />
      {/* Floor lamp */}
      <rect x="52" y="14" width="2" height="38" fill="#78350F" />
      <path d="M46 14 L60 14 L56 24 L50 24 Z" fill="#FDE047" />
    </svg>
  ),

  // SILLON: Armchair with armrests
  sillon: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Sillón (armchair)">
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      {/* Backrest */}
      <rect x="18" y="12" width="28" height="28" rx="6" fill="#10B981" stroke="#047857" strokeWidth="2" />
      {/* Seat cushion */}
      <rect x="16" y="32" width="32" height="14" rx="4" fill="#34D399" stroke="#047857" strokeWidth="2" />
      {/* Armrests */}
      <rect x="10" y="26" width="8" height="22" rx="3" fill="#059669" />
      <rect x="46" y="26" width="8" height="22" rx="3" fill="#059669" />
      {/* Wooden legs */}
      <rect x="14" y="48" width="4" height="8" fill="#78350F" />
      <rect x="46" y="48" width="4" height="8" fill="#78350F" />
    </svg>
  ),

  // SABANA: Folded bedsheet
  sabana: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Sábana (sheet)">
      <rect width="64" height="64" rx="16" fill="#F0F9FF" />
      <rect x="12" y="20" width="40" height="28" rx="4" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
      <path d="M12 28 C22 32, 42 24, 52 28" stroke="#BAE6FD" strokeWidth="2" fill="none" />
      <path d="M12 36 C22 40, 42 32, 52 36" stroke="#BAE6FD" strokeWidth="2" fill="none" />
    </svg>
  ),

  // CEPILLO: Hairbrush (distinct from toothbrush)
  cepillo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Cepillo (hairbrush)">
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Brush handle */}
      <path d="M32 38 L32 54 C32 56, 28 56, 28 54 L28 38 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
      {/* Oval brush head */}
      <ellipse cx="30" cy="24" rx="14" ry="18" fill="#F43F5E" stroke="#BE185D" strokeWidth="2" />
      {/* Bristles matrix */}
      <circle cx="22" cy="16" r="1.5" fill="#FFFFFF" />
      <circle cx="30" cy="14" r="1.5" fill="#FFFFFF" />
      <circle cx="38" cy="16" r="1.5" fill="#FFFFFF" />
      <circle cx="22" cy="24" r="1.5" fill="#FFFFFF" />
      <circle cx="30" cy="24" r="1.5" fill="#FFFFFF" />
      <circle cx="38" cy="24" r="1.5" fill="#FFFFFF" />
      <circle cx="24" cy="32" r="1.5" fill="#FFFFFF" />
      <circle cx="30" cy="32" r="1.5" fill="#FFFFFF" />
      <circle cx="36" cy="32" r="1.5" fill="#FFFFFF" />
    </svg>
  ),

  // PEGAMENTO: Glue bottle & glue drop
  pegamento: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Pegamento (glue)">
      <rect width="64" height="64" rx="16" fill="#ECFDF5" />
      {/* Bottle body */}
      <rect x="22" y="24" width="20" height="30" rx="4" fill="#10B981" stroke="#047857" strokeWidth="2" />
      {/* Nozzle tip */}
      <polygon points="28,24 36,24 34,14 30,14" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
      <circle cx="32" cy="12" r="1.5" fill="#CA8A04" />
      {/* Glue droplet falling */}
      <path d="M42 38 C42 38, 48 44, 48 48 C48 50, 45 52, 42 52 C39 52, 36 50, 36 48 C36 44, 42 38, 42 38 Z" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
    </svg>
  ),

  // CHAMPU: Shampoo bottle with foam bubbles
  champu: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Champú (shampoo)">
      <rect width="64" height="64" rx="16" fill="#F0F9FF" />
      {/* Shampoo bottle */}
      <rect x="20" y="20" width="24" height="36" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
      <rect x="26" y="12" width="12" height="8" rx="2" fill="#38BDF8" />
      {/* Foam suds bubbles */}
      <circle cx="48" cy="18" r="4" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1" />
      <circle cx="42" cy="14" r="3" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1" />
      <circle cx="50" cy="25" r="2.5" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1" />
    </svg>
  ),

  // RASTRILLO: Garden rake
  rastrillo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Rastrillo (rake)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Handle */}
      <line x1="20" y1="10" x2="40" y2="46" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
      {/* Metal rake head bar & tines */}
      <line x1="28" y1="52" x2="52" y2="40" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="50" x2="26" y2="56" stroke="#475569" strokeWidth="2" />
      <line x1="36" y1="47" x2="32" y2="53" stroke="#475569" strokeWidth="2" />
      <line x1="42" y1="44" x2="38" y2="50" stroke="#475569" strokeWidth="2" />
      <line x1="48" y1="41" x2="44" y2="47" stroke="#475569" strokeWidth="2" />
    </svg>
  ),

  // FREGONA: Mop with string head & bucket
  fregona: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Fregona (mop)">
      <rect width="64" height="64" rx="16" fill="#ECFEFF" />
      {/* Mop pole */}
      <line x1="16" y1="8" x2="36" y2="40" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
      {/* Mop strings */}
      <path d="M32 38 C28 46, 24 54, 20 58 M36 40 C34 48, 32 56, 28 60 M40 42 C40 50, 40 56, 36 60" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      {/* Bucket */}
      <polygon points="40,32 58,32 54,54 44,54" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
    </svg>
  ),

  // POLVO: Dust cloud with feather duster
  polvo: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Polvo (dust)">
      <rect width="64" height="64" rx="16" fill="#F8FAFC" />
      {/* Dust particles cloud */}
      <circle cx="24" cy="24" r="10" fill="#CBD5E1" opacity="0.6" />
      <circle cx="36" cy="20" r="12" fill="#CBD5E1" opacity="0.6" />
      <circle cx="44" cy="30" r="8" fill="#CBD5E1" opacity="0.6" />
      {/* Tiny dust motes */}
      <circle cx="12" cy="18" r="2" fill="#94A3B8" />
      <circle cx="16" cy="34" r="2.5" fill="#94A3B8" />
      <circle cx="52" cy="18" r="1.5" fill="#94A3B8" />
      {/* Feather duster handle */}
      <line x1="12" y1="52" x2="28" y2="36" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  // CLASE: Classroom with blackboard
  clase: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Clase (classroom)">
      <rect width="64" height="64" rx="16" fill="#FFFBEB" />
      {/* Chalkboard */}
      <rect x="12" y="12" width="40" height="24" rx="2" fill="#064E3B" stroke="#78350F" strokeWidth="2" />
      <line x1="18" y1="20" x2="34" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="18" y1="26" x2="42" y2="26" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Student desk */}
      <rect x="18" y="42" width="28" height="12" rx="2" fill="#D97706" />
      <rect x="22" y="54" width="3" height="6" fill="#78350F" />
      <rect x="39" y="54" width="3" height="6" fill="#78350F" />
    </svg>
  ),

  // BLOQUES: Toy building blocks (Lego-style)
  bloques: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Bloques (toy blocks)">
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Red bottom block */}
      <rect x="12" y="36" width="40" height="18" rx="2" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
      <circle cx="20" cy="33" r="2.5" fill="#EF4444" />
      <circle cx="32" cy="33" r="2.5" fill="#EF4444" />
      <circle cx="44" cy="33" r="2.5" fill="#EF4444" />
      {/* Blue top left block */}
      <rect x="12" y="18" width="22" height="15" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      <circle cx="18" cy="15" r="2" fill="#3B82F6" />
      <circle cx="28" cy="15" r="2" fill="#3B82F6" />
      {/* Yellow top right block */}
      <rect x="34" y="18" width="18" height="15" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
      <circle cx="43" cy="15" r="2" fill="#FACC15" />
    </svg>
  ),

  // ASTEROIDE: Space asteroid rock with craters
  asteroide: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Asteroide (asteroid)">
      <rect width="64" height="64" rx="16" fill="#0F172A" />
      {/* Irregular space rock */}
      <path d="M18 16 C26 10, 44 12, 50 20 C56 28, 54 44, 44 50 C34 56, 18 52, 12 40 C8 28, 10 22, 18 16 Z" fill="#64748B" stroke="#475569" strokeWidth="2" />
      {/* Craters */}
      <circle cx="24" cy="24" r="5" fill="#334155" />
      <circle cx="40" cy="34" r="6" fill="#334155" />
      <circle cx="26" cy="42" r="4" fill="#334155" />
    </svg>
  ),

  // CARBON: Black coal lump with glowing ember
  carbon: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Carbón (coal)">
      <rect width="64" height="64" rx="16" fill="#18181B" />
      {/* Dark jagged coal rock */}
      <polygon points="16,20 36,12 52,24 46,46 22,52 10,36" fill="#27272A" stroke="#3F3F46" strokeWidth="2" />
      {/* Red ember heat crack */}
      <path d="M22 32 L34 28 L40 40" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="34" cy="28" r="2" fill="#F59E0B" />
    </svg>
  ),

  // PESADO: Heavy 100kg weight barbell
  pesado: (cls = 'w-full h-full') => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-label="Pesado (heavy)">
      <rect width="64" height="64" rx="16" fill="#F1F5F9" />
      {/* Center bar */}
      <rect x="8" y="28" width="48" height="8" rx="2" fill="#94A3B8" />
      {/* Left heavy weight plate */}
      <rect x="12" y="14" width="10" height="36" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      {/* Right heavy weight plate */}
      <rect x="42" y="14" width="10" height="36" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      {/* Weight label */}
      <text x="32" y="54" fontSize="9" fontWeight="extrabold" fill="#DC2626" textAnchor="middle">100 kg</text>
      {/* Down force arrow */}
      <path d="M32 10 L32 22 M28 18 L32 23 L36 18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export const WordIcon: React.FC<WordIconProps> = ({
  icon,
  esWord,
  word,
  category,
  className = '',
  size = 'md',
  style,
}) => {
  const normKey = (esWord || word || '').trim().toLowerCase();

  // 1. Check if we have a dedicated vector SVG illustration
  const customSvgRenderer = CUSTOM_SVGS[normKey] || (icon?.startsWith('svg:') ? CUSTOM_SVGS[icon.replace('svg:', '')] : undefined);
  if (customSvgRenderer) {
    const sizeCls = SIZE_CLASSES[size] || 'w-10 h-10';
    return (
      <span className={`inline-flex items-center justify-center shrink-0 ${sizeCls} ${className}`} style={style} role="img" aria-label={esWord || word}>
        {customSvgRenderer('w-full h-full drop-shadow-sm')}
      </span>
    );
  }

  // 2. Check if icon is an SVG data URI or online image URL
  if (icon && (icon.startsWith('http') || icon.startsWith('data:') || icon.startsWith('/'))) {
    const sizeCls = SIZE_CLASSES[size] || 'w-10 h-10';
    return (
      <img
        src={icon}
        alt={esWord || word || 'icon'}
        className={`inline-block object-contain shrink-0 ${sizeCls} ${className}`}
        style={style}
        loading="lazy"
      />
    );
  }

  // 3. Check if we have an AI-generated image cached for this word
  const aiCached = getCachedAiImage(word || esWord || '', esWord || '');
  if (aiCached) {
    const sizeCls = SIZE_CLASSES[size] || 'w-10 h-10';
    return (
      <img
        src={aiCached}
        alt={esWord || word || 'ai icon'}
        className={`inline-block object-contain rounded-xl shrink-0 ${sizeCls} ${className}`}
        style={style}
        loading="lazy"
      />
    );
  }

  // 4. Fallback: clean, vibrant emoji/symbol representation
  const displayIcon = icon && !icon.startsWith('svg:') ? icon : '✨';
  return (
    <span
      className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={style}
      role="img"
      aria-label={esWord || word}
    >
      {displayIcon}
    </span>
  );
};
