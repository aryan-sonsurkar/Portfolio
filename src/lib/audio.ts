// Web Audio API Procedural Synthesizer for Modcodes District
"use client";

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private spaceHum: { oscA: OscillatorNode; oscB: OscillatorNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private rainNoise: { source: AudioWorkletNode | ScriptProcessorNode; gain: GainNode } | null = null;
  private ambience: { source: OscillatorNode | null; lfo: OscillatorNode | null; gain: GainNode } | null = null;
  private isMuted: boolean = false;

  private init() {
    if (this.ctx) return;
    const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) return;

    this.ctx = new AudioContextCtor();
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.masterVolume.connect(this.ctx.destination);
  }

  public getContext(): AudioContext | null {
    this.init();
    return this.ctx;
  }

  public playBootSequence() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;

    // Synthesize a beautiful modular system boot chord: C major 9 (C3, G3, D4, E4, B4)
    const freqs = [130.81, 196.0, 293.66, 329.63, 493.88];
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 3.0);
    filter.Q.setValueAtTime(4, now);
    filter.connect(this.masterVolume);

    freqs.forEach((f, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = index % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.5 + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      osc.stop(now + 5);
    });
  }

  public startSpaceHum() {
    this.init();
    if (!this.ctx || !this.masterVolume || this.spaceHum) return;

    const now = this.ctx.currentTime;
    const oscA = this.ctx.createOscillator();
    const oscB = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    oscA.type = "sine";
    oscA.frequency.setValueAtTime(55, now); // Low A

    oscB.type = "triangle";
    oscB.frequency.setValueAtTime(110, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 2.0);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    oscA.start();
    oscB.start();

    this.spaceHum = { oscA, oscB, filter, gain };
  }

  public stopSpaceHum() {
    if (!this.spaceHum || !this.ctx) return;
    const now = this.ctx.currentTime;
    const { oscA, oscB, gain } = this.spaceHum;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.0);

    setTimeout(() => {
      try {
        oscA.stop();
        oscB.stop();
      } catch (e) {}
    }, 1200);

    this.spaceHum = null;
  }

  public startRainSound() {
    this.init();
    if (!this.ctx || !this.masterVolume || this.rainNoise) return;

    const now = this.ctx.currentTime;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate Pink/White Noise for Rain
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(0.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 1.5);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    noiseNode.start();

    this.rainNoise = { source: noiseNode as any, gain };
  }

  public stopRainSound() {
    if (!this.rainNoise || !this.ctx) return;
    const now = this.ctx.currentTime;
    const { source, gain } = this.rainNoise;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.0);

    setTimeout(() => {
      try {
        (source as any).stop();
      } catch (e) {}
    }, 1200);

    this.rainNoise = null;
  }

  public playFootstep(material: "concrete" | "metal" | "wood" = "concrete") {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    if (material === "metal") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(4, now);
    } else if (material === "wood") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(90, now);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, now);
    } else {
      // Concrete
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);
    }

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playKeyClick() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(1500, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public toggleMute() {
    if (!this.masterVolume || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.isMuted = !this.isMuted;
    this.masterVolume.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.35, now + 0.2);
    return this.isMuted;
  }

  public playHoverSound() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.06);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playClickSound() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playEnterDistrict() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    // Ascending chord sweep
    const freqs = [220, 330, 440, 660, 880];
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.masterVolume) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.06);

      gain.gain.setValueAtTime(0, now + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.04, now + i * 0.06 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterVolume);

      osc.start(now + i * 0.06);
      osc.stop(now + 1.5);
    });
  }

  public playMonitorOpen() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playMonitorClose() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playTeleportWhoosh() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;

    // Sweeping noise whoosh
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.8);
    filter.Q.setValueAtTime(2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.15);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    source.start(now);
    source.stop(now + 0.9);

    // Add tonal sweep
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.8);
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.04, now + 0.15);
    oscGain.gain.linearRampToValueAtTime(0, now + 0.8);
    osc.connect(oscGain);
    oscGain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  public startAmbience(type: "industrial" | "lab" | "outdoor" | "office" | "apartment" = "office") {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    this.stopAmbience();
    const now = this.ctx.currentTime;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 1.5);

    if (type === "industrial") {
      // Low drone + occasional clank
      const osc = this.ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(45, now);
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(100, now);
      osc.connect(filter);
      filter.connect(gain);
      osc.start();
      this.ambience = { source: osc, lfo: null, gain };
    } else if (type === "lab") {
      // High hum + oscillating tone
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      const lfo = this.ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.3, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(15, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      osc.start();
      lfo.start();
      this.ambience = { source: osc, lfo, gain };
    } else if (type === "outdoor") {
      // Wind-like filtered noise
      const bufferSize = 2 * this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 3.5;
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      (source as any).loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);
      source.connect(filter);
      filter.connect(gain);
      source.start();
      this.ambience = { source: source as any, lfo: null, gain };
    } else {
      // Office / apartment — gentle hum
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(60, now);
      osc.connect(gain);
      osc.start();
      this.ambience = { source: osc, lfo: null, gain };
    }

    gain.connect(this.masterVolume);
  }

  public stopAmbience() {
    if (!this.ambience || !this.ctx) return;
    const now = this.ctx.currentTime;
    const { source, lfo, gain } = this.ambience;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);
    setTimeout(() => {
      try { if (source) (source as any).stop(); } catch (e) {}
      try { if (lfo) lfo.stop(); } catch (e) {}
    }, 1000);
    this.ambience = null;
  }

  public playAchievementUnlock() {
    this.init();
    if (!this.ctx || !this.masterVolume) return;
    const now = this.ctx.currentTime;
    const master = this.masterVolume;

    // Triumphant ascending arpeggio
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.06, now + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.6);
    });
  }
}

export const audioManager = new AudioManager();

// Web Speech API Voice Narrator
export function speakAI(text: string, onStart?: () => void, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel(); // Terminate ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 0.95;

  // Search for a voice that sounds futuristic or clean
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(
    (v) =>
      v.name.includes("Google") ||
      v.name.includes("Natural") ||
      v.name.includes("Zira") ||
      v.name.includes("Samantha")
  );

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
}
