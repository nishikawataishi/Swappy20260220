class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    try {
      // Initialize AudioContext lazily
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.6; // Master volume
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  public async resume() {
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
    } catch (e) {
      // Ignore errors during resume (often due to lack of user interaction yet)
      console.warn("Audio resume pending user interaction");
    }
  }

  private async ensureContext() {
    await this.resume();
  }

  // Generate a "Netflix-style" cinematic boom
  public async playIntro() {
    await this.ensureContext();
    if (!this.ctx || !this.masterGain || this.ctx.state === 'suspended') return;

    try {
      const t = this.ctx.currentTime;
      
      // 1. The "Thud" (Low Kick)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(this.masterGain);

      osc1.frequency.setValueAtTime(150, t);
      osc1.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
      
      gain1.gain.setValueAtTime(0.8, t);
      gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

      osc1.start(t);
      osc1.stop(t + 0.5);

      // 2. The "Swell" (Drone)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc2.type = 'sawtooth';
      osc2.frequency.value = 60;
      // Detune for richness
      osc2.detune.setValueAtTime(-10, t);
      osc2.detune.linearRampToValueAtTime(10, t + 2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, t);
      filter.frequency.linearRampToValueAtTime(2000, t + 0.2); // Open up
      filter.frequency.exponentialRampToValueAtTime(100, t + 2.5); // Close down

      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(this.masterGain);

      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.4, t + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 3);

      osc2.start(t);
      osc2.stop(t + 3);
    } catch (e) {
      // Suppress playback errors
    }
  }

  // Generate a "Whoosh" sound for swiping
  public async playSwipe() {
    await this.ensureContext();
    if (!this.ctx || !this.masterGain || this.ctx.state === 'suspended') return;

    try {
      const t = this.ctx.currentTime;
      const duration = 0.3;

      // Create White Noise Buffer
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter to make it sound like "Air"
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 0.5;
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(100, t + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.linearRampToValueAtTime(0, t + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(t);
    } catch (e) {
       // Suppress errors
    }
  }

  // Generate a distinct sound for skipping/clicking
  public async playSkip() {
    await this.ensureContext();
    if (!this.ctx || !this.masterGain || this.ctx.state === 'suspended') return;
    
    try {
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain);

      // Quick chirp
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) {
       // Suppress errors
    }
  }

  // Generate a celebratory "Ta-da" / Fanfare chord
  public async playResult() {
    await this.ensureContext();
    if (!this.ctx || !this.masterGain || this.ctx.state === 'suspended') return;

    try {
      const t = this.ctx.currentTime;

      // Dramatic Chord: C Major Add9 (C, E, G, D) for a hopeful/cinematic feel
      const freqs = [261.63, 329.63, 392.00, 523.25, 587.33]; // C4, E4, G4, C5, D5

      freqs.forEach((f) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();
        
        osc.type = 'sawtooth'; // Rich timbre for brass/strings effect
        osc.frequency.value = f;
        
        // Slight detune for ensemble effect
        osc.detune.value = (Math.random() - 0.5) * 15;

        // Filter movement for "wah" opening
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.exponentialRampToValueAtTime(5000, t + 0.2); // Open up quickly
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);
        
        // Envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.05); // Fast attack
        gain.gain.exponentialRampToValueAtTime(0.001, t + 4); // Long decay

        osc.start(t);
        osc.stop(t + 4.5);
      });

      // Add a high sparkle
      const spark = this.ctx.createOscillator();
      const sparkGain = this.ctx.createGain();
      spark.type = 'sine';
      spark.frequency.setValueAtTime(1046.50, t); // C6
      
      sparkGain.gain.setValueAtTime(0, t);
      sparkGain.gain.linearRampToValueAtTime(0.05, t + 0.1);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, t + 2);

      spark.connect(sparkGain);
      sparkGain.connect(this.masterGain);
      spark.start(t);
      spark.stop(t + 2);
    } catch (e) {
       // Suppress errors
    }
  }
}

export const audioManager = new AudioManager();