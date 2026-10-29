import { LanguageMeta, NativeLanguage } from '../types';

export const LANGUAGES: Record<NativeLanguage, LanguageMeta> = {
  es: {
    code: 'es',
    country: 'España',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    themeColor: '#ef4444', // Red & Gold
    accentColor: '#f59e0b',
    bgGradient: 'from-red-950/40 via-slate-950 to-amber-950/30',
    voiceLang: 'es-ES',
    voiceFallbacks: ['es', 'es-MX', 'es-US', 'es-419'],
    dir: 'ltr',
    description: '¡Aprende palabras geniales en español jugando con amigos!',
  },
  ar: {
    code: 'ar',
    country: 'Marruecos',
    name: 'Árabe',
    nativeName: 'العربية',
    flag: '🇲🇦',
    themeColor: '#f59e0b', // Amber / Gold
    accentColor: '#06b6d4', // Cyan / Turquoise
    bgGradient: 'from-amber-950/40 via-slate-950 to-cyan-950/30',
    voiceLang: 'ar-MA',
    voiceFallbacks: ['ar', 'ar-SA', 'ar-EG', 'ar-AE'],
    dir: 'rtl',
    description: 'Aprende caligrafía, saludos y vocabulario del mundo árabe con fonética clara.',
  },
  'nl-BE': {
    code: 'nl-BE',
    country: 'Bélgica / Flandes',
    name: 'Flamenco',
    nativeName: 'Vlaams (Nederlands)',
    flag: '🇧🇪',
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
    country: 'Francia',
    name: 'Francés',
    nativeName: 'Français',
    flag: '🇫🇷',
    themeColor: '#3b82f6', // Vivid Blue
    accentColor: '#ef4444', // Red / Rose
    bgGradient: 'from-blue-950/40 via-slate-950 to-rose-950/30',
    voiceLang: 'fr-FR',
    voiceFallbacks: ['fr-BE', 'fr-CA', 'fr', 'fr_FR'],
    dir: 'ltr',
    description: 'La lengua de la elegancia, gastronomía y cultura de Francia y la francofonía belga.',
  },
  en: {
    code: 'en',
    country: 'Reino Unido / EE.UU.',
    name: 'Inglés',
    nativeName: 'English',
    flag: '🇬🇧',
    themeColor: '#6366f1',
    accentColor: '#3b82f6',
    bgGradient: 'from-indigo-950/40 via-slate-950 to-blue-950/30',
    voiceLang: 'en-US',
    voiceFallbacks: ['en-GB', 'en', 'en-CA'],
    dir: 'ltr',
    description: 'El idioma internacional para comunicarte y jugar en cualquier parte del mundo.',
  },
};
