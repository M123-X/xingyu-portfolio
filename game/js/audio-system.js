/**
 * 深渊轮回直播间 - 程序化音效系统
 * 使用 Web Audio API 生成，无需外部音频文件
 */
const AudioSystem = {
  ctx: null,
  bgmGain: null,
  sfxGain: null,
  bgmNode: null,
  ambientNode: null,
  enabled: true,
  initialized: false,

  // 初始化音频上下文（必须在用户交互后调用）
  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.25;
      this.bgmGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.4;
      this.sfxGain.connect(this.ctx.destination);
      this.initialized = true;
      console.log('🔊 音频系统就绪');
    } catch(e) {
      console.warn('音频初始化失败:', e);
    }
  },

  // 恢复被浏览器挂起的音频上下文
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  setBgmVolume(v) { if (this.bgmGain) this.bgmGain.gain.value = v / 100 * 0.3; },
  setSfxVolume(v) { if (this.sfxGain) this.sfxGain.gain.value = v / 100 * 0.5; },

  // ==================== BGM ====================

  // 大厅氛围：柔和深渊回响 —— 低频铺底，不抢戏
  playLobbyAmbient() {
    if (!this.ctx || !this.enabled) return;
    this.stopBGM();
    this.resume();

    const now = this.ctx.currentTime;
    // 柔和低频嗡鸣
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;
    const g1 = this.ctx.createGain();
    g1.gain.setValueAtTime(0, now);
    g1.gain.linearRampToValueAtTime(0.08, now + 2);
    osc1.connect(g1);
    g1.connect(this.bgmGain);
    osc1.start(now);

    // 温暖泛音
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 82;
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(0.04, now + 3);
    osc2.connect(g2);
    g2.connect(this.bgmGain);
    osc2.start(now);

    // 极低频轻微震颤
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 33;
    const g3 = this.ctx.createGain();
    g3.gain.setValueAtTime(0.02, now);
    g3.gain.linearRampToValueAtTime(0.05, now + 3);
    g3.gain.linearRampToValueAtTime(0.02, now + 5);
    osc3.connect(g3);
    g3.connect(this.bgmGain);
    osc3.start(now);

    this.bgmNode = [osc1, osc2, osc3];
  },

  // 副本氛围：深沉恐怖 —— 低频嗡鸣+缓慢心跳+幽暗风噪
  playDungeonAmbient() {
    if (!this.ctx || !this.enabled) return;
    this.stopBGM();
    this.resume();

    const now = this.ctx.currentTime;

    // 1. 极低频深渊嗡鸣（正弦波，干净不刺耳）
    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(28, now);
    sub.frequency.linearRampToValueAtTime(31, now + 4);
    sub.frequency.linearRampToValueAtTime(26, now + 8);
    sub.frequency.linearRampToValueAtTime(30, now + 12);
    const gSub = this.ctx.createGain();
    gSub.gain.setValueAtTime(0, now);
    gSub.gain.linearRampToValueAtTime(0.15, now + 3);
    sub.connect(gSub);
    gSub.connect(this.bgmGain);
    sub.start(now);

    // 2. 缓慢不规则心跳（低频正弦脉冲，间隔拉长）
    const heart = this.ctx.createOscillator();
    heart.type = 'sine';
    heart.frequency.value = 35;
    const gHeart = this.ctx.createGain();
    gHeart.gain.setValueAtTime(0, now);
    // 不规则心跳节奏：咚...咚....咚..咚
    [0.6, 2.4, 4.2, 5.8, 8.0, 10.5, 12.0, 14.8].forEach(t => {
      gHeart.gain.setValueAtTime(0.06, now + t);
      gHeart.gain.exponentialRampToValueAtTime(0.001, now + t + 0.25);
    });
    heart.connect(gHeart);
    gHeart.connect(this.bgmGain);
    heart.start(now);

    // 3. 幽暗风噪（白噪声 → 低通滤波 → 非常轻）
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }
    const wind = this.ctx.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 300;
    const gWind = this.ctx.createGain();
    gWind.gain.setValueAtTime(0, now);
    gWind.gain.linearRampToValueAtTime(0.04, now + 2);
    wind.connect(windFilter);
    windFilter.connect(gWind);
    gWind.connect(this.bgmGain);
    wind.start(now);

    // 4. 偶尔的遥远金属回响（极轻的高频泛音）
    const eerie = this.ctx.createOscillator();
    eerie.type = 'sine';
    eerie.frequency.value = 880;
    const gEerie = this.ctx.createGain();
    gEerie.gain.setValueAtTime(0, now);
    [3.5, 7.2, 11.8, 15.0].forEach(t => {
      gEerie.gain.setValueAtTime(0.015, now + t);
      gEerie.gain.exponentialRampToValueAtTime(0.001, now + t + 1.5);
      eerie.frequency.setValueAtTime(660 + Math.random() * 440, now + t);
    });
    eerie.connect(gEerie);
    gEerie.connect(this.bgmGain);
    eerie.start(now);

    this.bgmNode = [sub, heart, wind, eerie];
  },

  stopBGM() {
    if (this.bgmNode) {
      this.bgmNode.forEach(n => { try { n.stop(); } catch(e) {} });
      this.bgmNode = null;
    }
  },

  stopAmbient() {
    if (this.ambientNode) {
      try { this.ambientNode.stop(); } catch(e) {}
      this.ambientNode = null;
    }
  },

  // ==================== SFX ====================

  _playTone(freq, type, duration, volume, delay = 0, glide = 0) {
    if (!this.ctx || !this.enabled) return;
    this.resume();
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (glide) osc.frequency.linearRampToValueAtTime(freq + glide, now + duration);
    gain.gain.setValueAtTime(volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  },

  _playNoise(duration, volume) {
    if (!this.ctx || !this.enabled) return;
    this.resume();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    source.start(now);
  },

  // UI点击
  uiClick() { this._playTone(800, 'sine', 0.06, 0.3); },
  uiHover() { this._playTone(600, 'sine', 0.04, 0.15); },

  // 对话推进
  dialogueNext() { this._playTone(440, 'sine', 0.05, 0.2, 0, 80); },

  // 选项出现
  choiceAppear() { this._playTone(660, 'triangle', 0.12, 0.25); },

  // 选择确认
  choiceConfirm() {
    this._playTone(520, 'sine', 0.1, 0.3);
    setTimeout(() => this._playTone(660, 'sine', 0.08, 0.25), 80);
  },

  // 抽卡 - 单抽
  gachaSingle() {
    this._playTone(330, 'sine', 0.3, 0.3, 0, 660);
    setTimeout(() => this._playTone(880, 'triangle', 0.5, 0.4), 200);
  },

  // 抽卡 - 十连
  gachaTen() {
    for (let i = 0; i < 10; i++) {
      const freq = 400 + i * 60;
      setTimeout(() => this._playTone(freq, 'sine', 0.15, 0.25, 0, 30), i * 80);
    }
  },

  // 抽到稀有/限定
  gachaRare() {
    this._playTone(660, 'triangle', 0.4, 0.5, 0, 220);
    setTimeout(() => this._playTone(880, 'triangle', 0.5, 0.5), 200);
    setTimeout(() => this._playTone(1100, 'sine', 0.6, 0.6, 0, 220), 400);
  },

  // 获得物品
  itemGet() {
    this._playTone(660, 'sine', 0.08, 0.25);
    setTimeout(() => this._playTone(880, 'sine', 0.1, 0.3), 80);
    setTimeout(() => this._playTone(1100, 'sine', 0.12, 0.25), 160);
  },

  // 副本通关
  dungeonClear() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 'triangle', 0.3, 0.35), i * 150);
    });
  },

  // 完美通关
  dungeonPerfect() {
    const notes = [392, 523, 659, 784, 880, 1047, 1175];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 'triangle', 0.35, 0.4), i * 120);
    });
  },

  // 游戏结束
  gameOver() {
    this._playTone(330, 'sawtooth', 0.5, 0.3, 0, -110);
    setTimeout(() => this._playTone(220, 'sawtooth', 0.6, 0.3, 0, -80), 400);
    setTimeout(() => this._playTone(110, 'sawtooth', 0.8, 0.35, 0, -55), 800);
  },

  // 开场音效
  introBoom() {
    if (!this.ctx || !this.enabled) return;
    this.resume();
    const now = this.ctx.currentTime;
    // 低频深沉轰鸣
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.8);
    osc.frequency.linearRampToValueAtTime(30, now + 2);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 2.1);
  },

  // 充值成功
  purchaseSuccess() {
    this._playTone(880, 'sine', 0.1, 0.3);
    setTimeout(() => this._playTone(1100, 'triangle', 0.2, 0.4), 100);
    setTimeout(() => this._playTone(1320, 'sine', 0.3, 0.3), 200);
  },
};
