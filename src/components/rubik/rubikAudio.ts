/**
 * Procedural Web Audio synthesizer for relaxing, tactile magnetic Rubik's Cube clicks & chimes.
 * Zero external audio files required.
 */

class RubikAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  private ensureContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Tactile magnetic speedcube turn snap (warm muted click + subtle magnetic settle).
   */
  public playTurn(fast = false): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitchJitter = 0.94 + Math.random() * 0.12;

    // 1. Short filtered noise burst (plastic glide friction)
    const bufferLength = Math.floor(ctx.sampleRate * (fast ? 0.028 : 0.045));
    const noiseBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferLength; i++) {
      const env = Math.pow(1 - i / bufferLength, 2.2);
      output[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime((fast ? 1650 : 1280) * pitchJitter, now);
    bandpass.Q.setValueAtTime(2.4, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(fast ? 0.11 : 0.14, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (fast ? 0.028 : 0.045));

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 2. Soft magnetic detent thump (warm low-mid sine drop)
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const baseFreq = (fast ? 520 : 410) * pitchJitter;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.42, now + 0.036);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(fast ? 0.08 : 0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Gentle chime when requesting a step-by-step hint.
   */
  public playHint(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Warm pentatonic relaxation chord when the Rubik's Cube is solved.
   */
  public playSolved(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.075;
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.085, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.72);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.76);
    });
  }
}

export const rubikAudio = new RubikAudioEngine();
