import { useCallback } from 'react';

/**
 * Custom hook using Web Audio API to play gentle scholarly chime/bell sounds.
 * Completely offline and self-contained, no external mp3 assets required.
 */
export function useAudioBeep() {
  const playGentleChime = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Two harmonic tones for a warm chime
      const now = ctx.currentTime;
      
      // Tone 1: 523.25 Hz (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Tone 2: 659.25 Hz (E5) delayed slightly
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 1.2);
      osc2.start(now + 0.15);
      osc2.stop(now + 1.5);
    } catch (e) {
      console.warn('Audio synthesis failed or blocked:', e);
    }
  }, []);

  const playExamAlarm = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // 3 soft reminder pings (A4 - C#5 - E5)
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.25);
        gain.gain.setValueAtTime(0.3, now + idx * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.25 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.25);
        osc.stop(now + idx * 0.25 + 0.8);
      });
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }, []);

  return { playGentleChime, playExamAlarm };
}
