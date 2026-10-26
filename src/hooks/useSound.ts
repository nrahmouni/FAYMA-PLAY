import { useRef, useCallback, useState, useEffect } from 'react';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private musicOscillator: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  public isMuted: boolean = false;
  public musicEnabled: boolean = true;

  constructor() {
    // Lazy AudioContext to satisfy autoplay policies
  }

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public startBackgroundMusic() {
    if (this.isMuted || !this.musicEnabled || this.musicOscillator) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 587.33, 783.99, 659.25, 587.33, 523.25, 392];
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(notes[0], this.ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.018, this.ctx.currentTime + 0.8);
    oscillator.connect(gain);
    gain.connect(this.ctx.destination);
    oscillator.start();
    this.musicOscillator = oscillator;
    this.musicGain = gain;

    let noteIndex = 0;
    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || !this.musicOscillator) return;
      noteIndex = (noteIndex + 1) % notes.length;
      const now = this.ctx.currentTime;
      this.musicOscillator.frequency.setTargetAtTime(notes[noteIndex], now, 0.12);
    }, 600);
  }

  public stopBackgroundMusic() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.04);
    }
    if (this.musicOscillator) {
      const oscillator = this.musicOscillator;
      const gain = this.musicGain;
      window.setTimeout(() => {
        try {
          oscillator.stop();
          oscillator.disconnect();
          gain?.disconnect();
        } catch {
          // The oscillator may already have stopped during page teardown.
        }
      }, 180);
      this.musicOscillator = null;
      this.musicGain = null;
    }
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.06);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    oscillator.connect(gain);
    gain.connect(this.ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  public playTurnStart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [659.25, 783.99].forEach((frequency, index) => {
      const oscillator = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startAt = now + index * 0.12;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(0.12, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.22);
      oscillator.connect(gain);
      gain.connect(this.ctx!.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.24);
    });
  }

  public playError() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playCoin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playCardFlip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playSlingshot() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chord.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.15, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.65);
    });
  }
}

const synthInstance = new SoundSynthesizer();

export function isAudioMuted() {
  return synthInstance.isMuted;
}

export function useSound() {
  const [muted, setMuted] = useState(synthInstance.isMuted);
  const [musicOn, setMusicOn] = useState(synthInstance.musicEnabled);

  const toggleMute = useCallback(() => {
    synthInstance.isMuted = !synthInstance.isMuted;
    if (synthInstance.isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (synthInstance.isMuted) synthInstance.stopBackgroundMusic();
    else synthInstance.startBackgroundMusic();
    setMuted(synthInstance.isMuted);
  }, []);

  const unlockAudio = useCallback(() => {
    synthInstance.init();
    synthInstance.startBackgroundMusic();
  }, []);
  const toggleMusic = useCallback(() => {
    synthInstance.musicEnabled = !synthInstance.musicEnabled;
    if (synthInstance.musicEnabled) synthInstance.startBackgroundMusic();
    else synthInstance.stopBackgroundMusic();
    setMusicOn(synthInstance.musicEnabled);
  }, []);
  const playSuccess = useCallback(() => synthInstance.playSuccess(), []);
  const playError = useCallback(() => synthInstance.playError(), []);
  const playPop = useCallback(() => synthInstance.playPop(), []);
  const playCoin = useCallback(() => synthInstance.playCoin(), []);
  const playCardFlip = useCallback(() => synthInstance.playCardFlip(), []);
  const playSlingshot = useCallback(() => synthInstance.playSlingshot(), []);
  const playFanfare = useCallback(() => synthInstance.playFanfare(), []);
  const playClick = useCallback(() => synthInstance.playClick(), []);
  const playTurnStart = useCallback(() => synthInstance.playTurnStart(), []);

  return {
    isMuted: muted,
    musicOn,
    toggleMute,
    toggleMusic,
    unlockAudio,
    playSuccess,
    playError,
    playPop,
    playCoin,
    playCardFlip,
    playSlingshot,
    playFanfare,
    playClick,
    playTurnStart,
  };
}
