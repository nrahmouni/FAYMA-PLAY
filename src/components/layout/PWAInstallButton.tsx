import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Desktop / Android flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition"
        title="Instalar Juegofy en tu pantalla de inicio"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl glass-card px-2.5 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 active:scale-95 transition"
        >
          <Share className="w-3.5 h-3.5" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl glass-panel p-6 shadow-2xl border border-cyan-500/40 text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <span>📲</span> Instalar en iPhone / iPad
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <p>1. Toca el botón <strong>Compartir</strong> <Share className="inline w-4 h-4 text-cyan-400" /> en la barra de Safari.</p>
                <p>2. Desliza hacia abajo y elige <strong>Añadir a pantalla de inicio</strong>.</p>
                <p>3. Abre Juegofy sin barras del navegador y juega sin conexión.</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-cyan-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
