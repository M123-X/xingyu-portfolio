/**
 * 深渊轮回直播间 - 角色语音系统 v2
 * 每个角色独立声线 + 情感语调 + 文本情绪检测
 */
const TTSSystem = {
  enabled: true,
  speaking: false,
  voiceMap: {},   // 角色→语音实例缓存

  // 每个角色的声线配置
  characterProfiles: {
    // ====== 男性角色 ======
    '莱伊': {
      gender: 'male',
      pitch: 0.72,      // 极低，深沉
      rate: 0.82,       // 慢速，寡言
      vol: 1.0,
      voiceNames: ['Kangkang', 'Male', 'nan', '男', 'Zhiwei'], // 优先男声
      personality: 'cold',
    },
    '赫伦': {
      gender: 'male',
      pitch: 0.92,      // 中低，理性
      rate: 1.05,       // 正常偏快，分析型
      vol: 1.0,
      voiceNames: ['Kangkang', 'Male', 'nan', '男'],
      personality: 'rational',
    },
    '凌咎': {
      gender: 'male',
      pitch: 0.78,      // 低沉，执着
      rate: 0.88,       // 偏慢，每个字都用力
      vol: 1.0,
      voiceNames: ['Kangkang', 'Male', 'nan', '男', 'Zhiwei'],
      personality: 'intense',
    },
    '戈岩': {
      gender: 'male',
      pitch: 0.62,      // 最低，厚重如岩
      rate: 0.78,       // 最慢，一字一顿
      vol: 1.0,
      voiceNames: ['Kangkang', 'Male', 'nan', '男'],
      personality: 'stoic',
    },
    '疾风': {
      gender: 'male',
      pitch: 1.05,      // 中高，轻快
      rate: 1.12,       // 偏快，不羁
      vol: 1.0,
      voiceNames: ['Kangkang', 'Male', 'nan', '男'],
      personality: 'free',
    },

    // ====== 女性角色 ======
    '诺恩': {
      gender: 'female',
      pitch: 1.22,      // 略高，温柔
      rate: 0.88,       // 偏慢，神秘
      vol: 0.9,
      voiceNames: ['Huihui', 'Yaoyao', 'Tingting', 'Female', 'nv', '女', 'Google 普通话'],
      personality: 'gentle',
    },
    '屿雀': {
      gender: 'female',
      pitch: 1.32,      // 最高，活泼
      rate: 1.08,       // 快，开朗
      vol: 1.0,
      voiceNames: ['Huihui', 'Tingting', 'Female', 'nv', '女', 'Google 普通话'],
      personality: 'cheerful',
    },

    // ====== 中性/系统 ======
    '系统': {
      gender: 'neutral',
      pitch: 1.0,
      rate: 1.0,
      vol: 0.85,
      voiceNames: [], // 使用默认中文语音
      personality: 'neutral',
    },
  },

  // 每种性格的情绪调节参数
  personalityModifiers: {
    cold:      { excitement: -0.15, warmth: -0.1, tension: 0.1 },
    rational:  { excitement: 0,     warmth: 0,    tension: -0.05 },
    intense:   { excitement: 0.1,   warmth: -0.05, tension: 0.15 },
    stoic:     { excitement: -0.2,  warmth: 0.05,  tension: 0 },
    free:      { excitement: 0.1,   warmth: 0.05,  tension: -0.1 },
    gentle:    { excitement: -0.05, warmth: 0.15,  tension: -0.1 },
    cheerful:  { excitement: 0.15,  warmth: 0.1,   tension: -0.15 },
    neutral:   { excitement: 0,     warmth: 0,     tension: 0 },
  },

  // === 语音查找 ===
  _getVoiceForCharacter(charName) {
    const profile = this.characterProfiles[charName] || this.characterProfiles['系统'];
    if (!profile) return this._getDefaultVoice();

    const allVoices = speechSynthesis.getVoices();
    const zhVoices = allVoices.filter(v => v.lang.includes('zh'));

    // 如果系统语音很少（比如只有1个），直接用
    if (zhVoices.length <= 1) return zhVoices[0] || allVoices[0];

    // 按角色偏好的语音名称查找
    for (const namePattern of profile.voiceNames) {
      for (const v of zhVoices) {
        if (v.name.toLowerCase().includes(namePattern.toLowerCase())) {
          return v;
        }
      }
    }

    // 没找到偏好语音 → 从中文语音中按性别筛选
    if (profile.gender === 'male') {
      // 找男声或中性
      const male = zhVoices.find(v =>
        v.name.includes('Kang') || v.name.includes('Male') ||
        v.name.includes('nan') || v.name.includes('男') ||
        v.name.includes('Zhiwei')
      );
      if (male) return male;
      // 回退：用低音调模拟男声
    }

    if (profile.gender === 'female') {
      const female = zhVoices.find(v =>
        v.name.includes('Hui') || v.name.includes('Yao') ||
        v.name.includes('Ting') || v.name.includes('Female') ||
        v.name.includes('nv') || v.name.includes('女') ||
        v.name.includes('Meijia') || v.name.includes('普通话')
      );
      if (female) return female;
    }

    // 最终回退
    return zhVoices[0] || allVoices[0] || null;
  },

  _getDefaultVoice() {
    const allVoices = speechSynthesis.getVoices();
    const zh = allVoices.find(v => v.lang.includes('zh'));
    return zh || allVoices[0] || null;
  },

  // === 情感文本分析 ===
  _analyzeEmotion(text, profile) {
    const pMod = this.personalityModifiers[profile.personality] ||
                 this.personalityModifiers.neutral;

    let pitch = profile.pitch;
    let rate = profile.rate;
    let extraPause = 0; // 某些词后面加停顿

    // --- 标点情感检测 ---
    if (text.endsWith('！') || text.endsWith('!')) {
      pitch += 0.12 + pMod.excitement * 0.5;
      rate += 0.04;
    } else if (text.endsWith('？') || text.endsWith('?')) {
      pitch += 0.15;
      rate -= 0.02;
    } else if (text.endsWith('...') || text.endsWith('…')) {
      pitch -= 0.08;
      rate -= 0.1;
      extraPause = 0.3;
    }

    // --- 关键词情感检测 ---
    const patterns = [
      // 危险紧急 → 语速↑ 音调↑
      { regex: /危险|小心|快跑|快退|别|不要|住手|救命|糟糕|不好/, mod: { pitch: 0.1, rate: 0.08 } },
      // 愤怒决心 → 音调↑↑
      { regex: /绝不|死|杀|拼|决不|一定|必须/, mod: { pitch: 0.08, rate: 0.03 } },
      // 悲伤遗憾 → 音调↓ 语速↓
      { regex: /不在|失去|回不来|对不起|抱歉|遗憾|可惜|再也/, mod: { pitch: -0.1, rate: -0.1 } },
      // 温柔安慰 → 音调↑ 语速↓
      { regex: /没关系|别怕|我在|不要怕|会好的|放心|没事/, mod: { pitch: 0.05, rate: -0.05 } },
      // 高兴 → 音调↑ 语速↑
      { regex: /太好了|成功了|找到了|赢了|好|谢谢|棒|厉害/, mod: { pitch: 0.08, rate: 0.05 } },
      // 怀疑思考 → 音调微降 语速↓
      { regex: /难道|会不会|可能|也许|似乎|应该|大概/, mod: { pitch: -0.03, rate: -0.05 } },
      // 惊讶 → 音调↑
      { regex: /什么|怎么会|不可能|竟然|天啊|到底/, mod: { pitch: 0.12, rate: 0.05 } },
    ];

    for (const pat of patterns) {
      if (pat.regex.test(text)) {
        pitch += pat.mod.pitch;
        rate += pat.mod.rate;
        break; // 只匹配第一个模式
      }
    }

    // 性格加权
    pitch += pMod.excitement * 0.3;
    rate += pMod.tension * 0.2;

    return {
      pitch: Math.max(0.1, Math.min(2, pitch)),
      rate: Math.max(0.4, Math.min(1.8, rate)),
      volume: profile.vol,
      extraPause,
    };
  },

  // === 朗读 ===
  speak(text, speakerName) {
    if (!this.enabled) return;
    this.stop();

    const profile = this.characterProfiles[speakerName] ||
                    this.characterProfiles['系统'] ||
                    { pitch: 1.0, rate: 1.0, vol: 0.9, personality: 'neutral' };

    const emotion = this._analyzeEmotion(text, profile);
    const voice = this._getVoiceForCharacter(speakerName);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.pitch = emotion.pitch;
    utterance.rate = emotion.rate;
    utterance.volume = emotion.volume;
    if (voice) utterance.voice = voice;

    // 视觉指示器
    this.speaking = true;
    const indicator = document.getElementById('tts-indicator');
    if (indicator) {
      indicator.textContent = '📢';
      indicator.classList.add('active');
    }

    utterance.onend = () => {
      this.speaking = false;
      if (indicator) indicator.classList.remove('active');
    };
    utterance.onerror = (e) => {
      this.speaking = false;
      if (indicator) indicator.classList.remove('active');
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('TTS error:', e.error);
      }
    };

    // 某些情感词后加微小停顿
    if (emotion.extraPause > 0) {
      setTimeout(() => speechSynthesis.speak(utterance), emotion.extraPause * 200);
    } else {
      speechSynthesis.speak(utterance);
    }
  },

  stop() {
    speechSynthesis.cancel();
    this.speaking = false;
    const indicator = document.getElementById('tts-indicator');
    if (indicator) indicator.classList.remove('active');
  },

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    return this.enabled;
  },

  init() {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => {
      // 语音列表更新后，清除缓存以便重新匹配
      this.voiceMap = {};
    };
  },
};
