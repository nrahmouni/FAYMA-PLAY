import { Language, LanguageMeta } from '../types';

export const LANGUAGES: Record<Language, LanguageMeta> = {
  ar: {
    code: 'ar',
    name: 'Árabe',
    nativeName: 'العربية',
    flag: '🌟',
    themeColor: '#f59e0b', // Amber / Gold
    accentColor: '#06b6d4', // Cyan / Turquoise
    bgGradient: 'from-amber-950/40 via-slate-950 to-cyan-950/30',
    voiceLang: 'ar-SA',
    voiceFallbacks: ['ar', 'ar-EG', 'ar-AE', 'ar-MA'],
    dir: 'rtl',
    description: 'Aprende caligrafía, saludos y vocabulario del mundo árabe con fonética clara.',
  },
  'nl-BE': {
    code: 'nl-BE',
    name: 'Flamenco',
    nativeName: 'Vlaams (Nederlands)',
    flag: '🦁',
    themeColor: '#f97316', // Bright Orange
    accentColor: '#10b981', // Emerald Green
    bgGradient: 'from-orange-950/40 via-slate-950 to-emerald-950/30',
    voiceLang: 'nl-BE',
    voiceFallbacks: ['nl-NL', 'nl', 'nl-be'],
    dir: 'ltr',
    description: 'El neerlandés hablado en Flandes (Bélgica), con expresiones típicas y modismos.',
  },
  fr: {
    code: 'fr',
    name: 'Francés',
    nativeName: 'Français',
    flag: '🥐',
    themeColor: '#3b82f6', // Vivid Blue
    accentColor: '#ef4444', // Red / Rose
    bgGradient: 'from-blue-950/40 via-slate-950 to-rose-950/30',
    voiceLang: 'fr-FR',
    voiceFallbacks: ['fr-BE', 'fr-CA', 'fr', 'fr_FR'],
    dir: 'ltr',
    description: 'La lengua de la elegancia, gastronomía y cultura de Francia y la francofonía belga.',
  },
};
