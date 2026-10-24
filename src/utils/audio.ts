// Multisensory ambient kitchen grill sizzle generator using Web Audio API
class KitchenSoundManager {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Generate gentle pink/brown noise filtered to sound like sizzling cast iron
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Filter for culinary sizzle frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 1.2;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 1);

      this.noiseNode.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.noiseNode.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio could not be initialized:', e);
    }
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.noiseNode?.stop();
          this.isPlaying = false;
        }, 500);
      } catch {
        this.noiseNode?.stop();
        this.isPlaying = false;
      }
    } else {
      this.isPlaying = false;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const kitchenSound = new KitchenSoundManager();
