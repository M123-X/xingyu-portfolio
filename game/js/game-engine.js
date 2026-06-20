/**
 * 深渊轮回直播间 - 游戏引擎核心
 * 状态管理、画面路由、存档系统
 */
const GameEngine = {
  // 游戏状态
  state: {
    screen: 'intro',
    chosenRoute: null,       // 'combat', 'strategy', 'investigation'
    spirit: 100,
    hp: 500,
    gold: 1000,
    diamond: 300,
    gachaTickets: 5,
    currentCharacter: 'laiyi',
    unlockedCharacters: [...DEFAULT_UNLOCKED],
    completedDungeons: [],
    dungeonProgress: {},      // { dungeonId: { phase, routeResults } }
    clues: [],
    inventory: {},            // { itemId: count }
    gachaCollection: [],      // 已收集卡牌ID列表
    gachaPity: 0,             // 保底计数器
    chatHistory: [...CHAT_PRESETS.world],
    friends: [],
    friendRequests: [],
    playerID: '深渊行者',
    playerIDChanges: 1,
    profilePrivacy: 'public',
    decoration: 'default',
    unlockedDecorations: ['default'],
    dailyLogin: null,
    settings: { bgm: 80, sfx: 100, voice: 100 },
    soundEnabled: true,
  },

  // 屏幕历史（用于返回导航）
  screenHistory: [],

  // 副本进行中状态
  activeDungeon: null,
  activeScript: null,
  activePhase: null,
  activeSeqIndex: 0,
  activeEnding: null,

  // 确认回调
  confirmCallback: null,

  // ========== 初始化 ==========
  init() {
    console.log('🔮 深渊轮回直播间 - 游戏引擎初始化');
    this.loadState();
    this.updateAllUI();
    Particles.init();
    Animations.initIntro();
  },

  // ========== 画面导航 ==========
  navigateTo(screen) {
    if (this.state.screen === screen && screen !== 'lobby') return;

    // 记录历史
    if (this.state.screen !== screen) {
      this.screenHistory.push(this.state.screen);
    }

    // 隐藏所有画面
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sub-screen').forEach(s => s.classList.remove('active'));

    // 显示目标画面
    const target = document.getElementById(`screen-${screen}`);
    if (target) {
      target.classList.add('active');
      this.state.screen = screen;
    }

    // 画面切换动画
    Animations.screenTransition(screen);

    // 画面特定初始化
    switch(screen) {
      case 'lobby': this.updateLobby(); AudioSystem.playLobbyAmbient(); break;
      case 'dungeon': this.updateDungeonDirectory(); break;
      case 'archive': this.updateArchive(); break;
      case 'chat': this.updateChat(); break;
      case 'clueboard': this.updateClueBoard(); break;
      case 'gacha': this.updateGacha(); break;
      case 'shop': this.updateShop(); break;
      case 'profile': this.updateProfile(); break;
    }

    this.saveState();
  },

  navigateBack() {
    if (this.screenHistory.length > 0) {
      const prev = this.screenHistory.pop();
      this.navigateTo(prev);
      this.screenHistory.pop(); // 去掉navigateTo添加的
    } else {
      this.navigateTo('lobby');
    }
  },

  // ========== 开始游戏 ==========
  startNewGame() {
    AudioSystem.init();
    TTSSystem.init();
    AudioSystem.introBoom();
    // 重置状态
    this.state = {
      ...this.state,
      screen: 'prologue',
      chosenRoute: null,
      spirit: 100,
      hp: 500,
      gold: 1000,
      diamond: 300,
      gachaTickets: 5,
      currentCharacter: 'laiyi',
      unlockedCharacters: [...DEFAULT_UNLOCKED],
      completedDungeons: [],
      dungeonProgress: {},
      clues: [],
      inventory: {},
      gachaCollection: [],
      gachaPity: 0,
      decoration: 'default',
      unlockedDecorations: ['default'],
      playerID: '深渊行者',
      playerIDChanges: 1,
    };

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-prologue').classList.add('active');
    this.state.screen = 'prologue';

    Animations.playPrologue();
    this.saveState();
  },

  skipPrologue() {
    Animations.skipPrologue();
    setTimeout(() => this.navigateTo('lobby'), 500);
  },

  finishPrologue() {
    this.navigateTo('lobby');
  },

  // ========== 加载/存档 ==========
  loadGame() {
    const saved = this.loadState();
    if (saved && saved.screen !== 'intro') {
      this.navigateTo(saved.screen || 'lobby');
      this.showToast('存档加载成功');
    } else {
      this.startNewGame();
    }
  },

  saveState() {
    try {
      localStorage.setItem('abyss_reincarnation_save', JSON.stringify(this.state));
    } catch(e) { console.warn('存档失败:', e); }
  },

  loadState() {
    try {
      const raw = localStorage.getItem('abyss_reincarnation_save');
      if (raw) {
        const saved = JSON.parse(raw);
        this.state = { ...this.state, ...saved };
        return saved;
      }
    } catch(e) { console.warn('读档失败:', e); }
    return null;
  },

  resetGame() {
    this.confirmCallback = () => {
      localStorage.removeItem('abyss_reincarnation_save');
      location.reload();
    };
    this.showConfirm('确定要重置所有游戏数据吗？此操作不可撤销！');
  },

  // ========== 路径选择 ==========
  chooseRoute(route) {
    this.state.chosenRoute = route;
    this.saveState();
  },

  // ========== 角色切换 ==========
  cycleCharacter() {
    const chars = Object.keys(CHARACTERS).filter(id =>
      this.state.unlockedCharacters.includes(id)
    );
    if (chars.length <= 1) return;

    const idx = chars.indexOf(this.state.currentCharacter);
    const next = chars[(idx + 1) % chars.length];
    this.state.currentCharacter = next;
    this.updateLobbyCharacter();
    this.saveState();
    Animations.characterSwitch();
  },

  // ========== UI 更新 ==========
  updateAllUI() {
    this.updateStatusBar();
    this.updateLobbyCharacter();
  },

  updateStatusBar() {
    const s = this.state;
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('stat-spirit', s.spirit);
    setVal('stat-hp', s.hp);
    setVal('stat-gold', s.gold.toLocaleString());
    setVal('stat-diamond', s.diamond.toLocaleString());
  },

  updateLobby() {
    this.updateStatusBar();
    this.updateLobbyCharacter();
  },

  updateLobbyCharacter() {
    const char = CHARACTERS[this.state.currentCharacter];
    if (!char) return;

    const imgEl = document.getElementById('lobby-current-character');
    const nameEl = document.getElementById('lobby-character-name');
    const quoteEl = document.getElementById('lobby-character-quote');

    if (imgEl) {
      imgEl.src = char.fullBody || char.halfBody;
      imgEl.alt = char.name;
    }
    if (nameEl) nameEl.textContent = char.name;
    if (quoteEl) {
      const quotes = CHARACTER_QUOTES[this.state.currentCharacter] || [char.quote];
      quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }
  },

  // ========== 副本目录 ==========
  updateDungeonDirectory() {
    const cards = document.querySelectorAll('.dungeon-card');
    cards.forEach(card => {
      const dungeonId = card.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      if (!dungeonId) return;
      const d = DUNGEONS[dungeonId];
      if (!d) return;

      // 检查前置条件
      const allReqMet = (d.requires || []).every(req =>
        this.state.completedDungeons.includes(req)
      );

      if (this.state.completedDungeons.includes(dungeonId)) {
        card.classList.add('completed');
        card.classList.remove('locked');
      } else if (allReqMet || d.requires?.length === 0) {
        card.classList.add('unlocked');
        card.classList.remove('locked');
      }

      // 更新状态标记
      const statusEl = card.querySelector('.dungeon-status');
      if (statusEl) {
        if (this.state.completedDungeons.includes(dungeonId)) {
          statusEl.textContent = '✓ 已通关';
          statusEl.className = 'dungeon-status completed';
        } else if (card.classList.contains('unlocked')) {
          statusEl.textContent = '▶ 可挑战';
          statusEl.className = 'dungeon-status available';
        }
      }
    });
  },

  // ========== 启动副本 ==========
  // ========== 副本入口 ==========
  startDungeon(dungeonId) {
    const d = DUNGEONS[dungeonId];
    if (!d) return;

    const allReqMet = (d.requires || []).every(req =>
      this.state.completedDungeons.includes(req)
    );
    if (!allReqMet) { this.showToast('请先通关前置副本'); return; }

    this.activeDungeon = dungeonId;
    const rawScript = dungeonId === 'fogschool' ? DUNGEON_SCRIPT_FOGSCHOOL : DUNGEON_SCRIPT_LIBRARY;

    // ★ 全新：启动时一次性预展开全部剧情
    this._dungeonEvents = [];
    this._expandedPhases = new Map(); // 防止循环引用
    this._expandPhase(rawScript, 'intro');
    this._dungeonEventIndex = 0;

    AudioSystem.playDungeonAmbient();

    // 切换画面
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-dungeon-play').classList.add('active');
    this.state.screen = 'dungeon-play';

    const bgEl = document.getElementById('dungeon-play-bg');
    if (bgEl) bgEl.style.backgroundImage = `url('${d.bg}')`;

    this.updateDungeonPlayStatus();
    this._showEvent(0);
    this.saveState();
  },

  // ★ 预展开一个阶段，将所有对话+选择+结局展平
  _expandPhase(script, phaseKey) {
    // 防止循环引用（如 phase2_c_result → phase2）
    if (this._expandedPhases.has(phaseKey)) {
      return;
    }
    // 记录此阶段的起始索引
    this._expandedPhases.set(phaseKey, this._dungeonEvents.length);

    const phase = script[phaseKey];
    if (!phase) return;

    // 1. 添加对话序列
    if (phase.sequences && phase.sequences.length > 0) {
      const phasePenalty = phase.spiritPenalty || 0;
      const lastIdx = phase.sequences.length - 1;
      phase.sequences.forEach((seq, i) => {
        this._dungeonEvents.push({
          type: 'dialogue',
          speaker: seq.speaker || '',
          text: seq.text,
          character: seq.character || null,
          bg: (i === 0 && phase.bg) ? phase.bg : null,
          spiritCost: (seq.spiritCost || 0) + (i === lastIdx ? phasePenalty : 0),
        });
      });
    }

    // 2. 有ending属性的阶段：添加ending事件，不再继续
    if (phase.ending) {
      this._dungeonEvents.push({ type: 'ending', ending: phase.ending });
      return;
    }

    // 3. 有选项的阶段：为每个选项预展开结果路径，记录跳转索引
    if (phase.choices && phase.choices.length > 0) {
      const choiceEventIdx = this._dungeonEvents.length;
      this._dungeonEvents.push({ type: 'choice', choices: [], _placeholder: true });

      const resolvedChoices = phase.choices.map(choice => {
        if (choice.next) {
          if (this._expandedPhases.has(choice.next)) {
            // 已展开 → 跳转到已有位置
            if (choice.result === 'deadly' || choice.next.includes('deadly')) {
              return { text: choice.text, spiritCost: choice.spiritCost || 0, result: 'deadly', route: choice.route, jumpTo: -1 };
            }
            return { text: choice.text, spiritCost: choice.spiritCost || 0, result: choice.result, route: choice.route, jumpTo: this._expandedPhases.get(choice.next) };
          }
          const jumpIdx = this._dungeonEvents.length;
          this._expandPhase(script, choice.next);
          return { text: choice.text, spiritCost: choice.spiritCost || 0, result: choice.result, route: choice.route, jumpTo: jumpIdx };
        }
        return { text: choice.text, spiritCost: choice.spiritCost || 0, result: choice.result, route: choice.route, jumpTo: this._dungeonEvents.length };
      });

      this._dungeonEvents[choiceEventIdx] = { type: 'choice', choices: resolvedChoices };
      return;
    }

    // 4. 自动延续到下一个阶段（即使下一阶段已被展开，也添加跳转）
    if (phase.nextPhase) {
      if (this._expandedPhases.has(phase.nextPhase)) {
        // 下一阶段已被展开 → 添加一个内部跳转事件，确保剧情继续
        this._dungeonEvents.push({ type: 'jump', jumpTo: this._expandedPhases.get(phase.nextPhase) });
      } else {
        this._expandPhase(script, phase.nextPhase);
      }
    }
  },

  // ★ 显示指定索引的事件（自动跟随跳转）
  _showEvent(idx) {
    if (!this._dungeonEvents || idx >= this._dungeonEvents.length) return;
    this._dungeonEventIndex = idx;
    const evt = this._dungeonEvents[idx];

    // 内部跳转事件 → 自动跟随，对玩家透明
    if (evt.type === 'jump') {
      this._showEvent(evt.jumpTo);
      return;
    }

    if (evt.type === 'dialogue') {
      const speakerEl = document.getElementById('dungeon-dialogue-speaker');
      const textEl = document.getElementById('dungeon-dialogue-text');
      const charEl = document.getElementById('dungeon-dialogue-character');
      const choicesEl = document.getElementById('dungeon-choices');
      const nextBtn = document.getElementById('dungeon-dialogue-next-btn');

      if (choicesEl) choicesEl.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'inline-block';
      if (speakerEl) speakerEl.textContent = evt.speaker;
      if (textEl) {
        textEl.textContent = evt.text;
        textEl.classList.remove('typing');
        void textEl.offsetWidth;
        textEl.classList.add('typing');
      }
      // TTS语音朗读 — 仅系统旁白
      if (evt.speaker === '系统' && evt.text) {
        TTSSystem.speak(evt.text, evt.speaker);
      }
      if (charEl) {
        if (evt.character && CHARACTERS[evt.character]) {
          const c = CHARACTERS[evt.character];
          charEl.innerHTML = `<img src="${c.halfBody || c.fullBody}" alt="${c.name}">`;
          charEl.style.display = 'block';
        } else {
          charEl.style.display = 'none';
        }
      }
      if (evt.bg) {
        const bgEl = document.getElementById('dungeon-play-bg');
        if (bgEl) bgEl.style.backgroundImage = `url('${evt.bg}')`;
      }
      if (evt.spiritCost > 0) {
        this.state.spirit = Math.max(0, this.state.spirit - evt.spiritCost);
        this.updateDungeonPlayStatus();
      }
      if (this.state.spirit <= 0) this.handleDeadlyEnding();

    } else if (evt.type === 'choice') {
      const container = document.getElementById('dungeon-choices');
      const nextBtn = document.getElementById('dungeon-dialogue-next-btn');
      if (nextBtn) nextBtn.style.display = 'none';
      if (!container) return;
      container.innerHTML = '';
      container.style.display = 'flex';
      AudioSystem.choiceAppear();

      evt.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'dungeon-choice-btn';
        btn.textContent = ch.text;
        if (ch.spiritCost) {
          const badge = document.createElement('span');
          badge.className = 'choice-cost';
          badge.textContent = '精神值 -' + ch.spiritCost;
          btn.appendChild(badge);
        }
        btn.addEventListener('click', () => {
          AudioSystem.choiceConfirm();
          container.style.display = 'none';
          if (ch.spiritCost) {
            this.state.spirit = Math.max(0, this.state.spirit - ch.spiritCost);
            this.updateDungeonPlayStatus();
          }
          if (ch.result === 'deadly' || ch.jumpTo === -1 || this.state.spirit <= 0) {
            this.state.spirit = 0;
            this.handleDeadlyEnding();
            return;
          }
          if (ch.route && ch.route !== 'default' && !this.state.chosenRoute) {
            this.state.chosenRoute = ch.route;
          }
          this._showEvent(ch.jumpTo);
          this.saveState();
        });
        container.appendChild(btn);
      });

    } else if (evt.type === 'ending') {
      this.handleEnding(evt.ending);
    }
  },

  // ★ 点击"继续" → 下一个事件（自动跳过jump事件）
  advanceDialogue() {
    if (!this._dungeonEvents) return;
    if (this._dungeonEvents[this._dungeonEventIndex]?.type === 'choice') return;
    AudioSystem.dialogueNext();
    this._showEvent(this._dungeonEventIndex + 1);
    this.saveState();
  },

  // ========== 通关/结束处理 ==========
  handleEnding(ending) {
    this.activeEnding = ending;
    const dungeonId = this.activeDungeon;
    const d = DUNGEONS[dungeonId];

    if (ending === 'deadly') {
      this.handleDeadlyEnding();
      return;
    }

    // 记录通关
    if (!this.state.completedDungeons.includes(dungeonId)) {
      this.state.completedDungeons.push(dungeonId);
    }

    // 解锁后续副本
    if (dungeonId === 'fogschool') {
      DUNGEONS.library.status = 'unlocked';
      // 解锁凌咎
      if (!this.state.unlockedCharacters.includes('lingjiu')) {
        this.state.unlockedCharacters.push('lingjiu');
      }
    }

    // 发放奖励
    const rewards = ending === 'hard' ? d.bonusRewards : d.rewards;
    this.state.gold += rewards.gold || 0;
    this.state.diamond += rewards.diamond || 0;
    this.state.gachaTickets += rewards.tickets || 0;

    // 解锁线索
    if (d.clueReward && !this.state.clues.includes(d.clueReward)) {
      this.state.clues.push(d.clueReward);
    }

    this.updateStatusBar();
    this.showDungeonResult(ending, rewards);
    if (ending === 'hard') AudioSystem.dungeonPerfect();
    else AudioSystem.dungeonClear();
    this.saveState();
  },

  handleDeadlyEnding() {
    this.state.spirit = 0;
    AudioSystem.gameOver();
    document.getElementById('gameover-reason').textContent =
      '你的精神值降到了0。深渊吞噬了你的意识...';
    document.getElementById('modal-gameover').style.display = 'flex';
    Animations.showGameOver();
  },

  showDungeonResult(ending, rewards) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-dungeon-result').classList.add('active');
    this.state.screen = 'dungeon-result';

    const titleEl = document.getElementById('result-title');
    if (titleEl) {
      titleEl.textContent = ending === 'hard' ? '完美通关！' : '副本通关';
      titleEl.className = ending === 'hard' ? 'result-title result-hard' : 'result-title';
    }

    const rewardsEl = document.getElementById('result-rewards');
    if (rewardsEl) {
      rewardsEl.innerHTML = `
        <h3>获得奖励</h3>
        <div class="reward-items">
          <span>🪙 金币 +${rewards.gold}</span>
          <span>💎 钻石 +${rewards.diamond}</span>
          <span>🃏 抽卡券 +${rewards.tickets || 0}</span>
          ${rewards.item ? `<span>🎁 ${rewards.item}</span>` : ''}
        </div>
      `;
    }
  },

  updateDungeonPlayStatus() {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('dungeon-play-spirit', this.state.spirit);
    setVal('dungeon-play-hp', this.state.hp);
  },

  restartFromCheckpoint() {
    document.getElementById('modal-gameover').style.display = 'none';
    this.state.spirit = 50;
    this.state.hp = Math.max(100, this.state.hp);
    const rawScript = this.activeDungeon === 'fogschool' ? DUNGEON_SCRIPT_FOGSCHOOL : DUNGEON_SCRIPT_LIBRARY;
    this._dungeonEvents = [];
    this._expandPhase(rawScript, 'intro');
    this._dungeonEventIndex = 0;
    this.updateDungeonPlayStatus();
    this._showEvent(0);
  },

  returnToLobby() {
    document.getElementById('modal-gameover').style.display = 'none';
    this.activeDungeon = null;
    this._dungeonEvents = null;
    this._dungeonEventIndex = 0;
    TTSSystem.stop();
    AudioSystem.playLobbyAmbient();
    this.navigateTo('lobby');
  },

  // ========== 其他系统（占位） ==========
  updateArchive() { UIComponents.renderArchive(); },
  updateChat() { UIComponents.renderChat(); },
  updateClueBoard() { UIComponents.renderClueBoard(); },
  updateGacha() { GachaSystem.updateGachaUI(); },
  updateShop() { UIComponents.renderShop(); },
  updateProfile() { UIComponents.renderProfile(); },

  switchChatTab(tab, el) {
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    UIComponents.renderChatMessages(tab);
  },

  switchShopTab(tab, el) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    const itemsEl = document.getElementById('shop-items');
    const rechargeEl = document.getElementById('shop-recharge');
    if (itemsEl) itemsEl.style.display = tab === 'items' ? 'grid' : 'none';
    if (rechargeEl) rechargeEl.style.display = tab === 'recharge' ? 'block' : 'none';
    // 皮肤tab暂不实现，显示道具
    if (tab === 'skins') {
      if (itemsEl) itemsEl.style.display = 'none';
      if (rechargeEl) rechargeEl.style.display = 'none';
      GameEngine.showToast('皮肤功能即将开放');
    }
  },

  replyTo(playerName) {
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = `@${playerName} `;
      input.focus();
    }
  },

  sendChat() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    this.state.chatHistory.unshift({
      user: this.state.playerID,
      msg: input.value.trim(),
      time: '刚刚',
    });
    input.value = '';
    UIComponents.renderChatMessages('world');
    this.saveState();
  },

  // ========== 抽卡 ==========
  gachaDraw(count) {
    const cost = count === 10 ? 2700 : 300;
    if (this.state.diamond < cost && this.state.gachaTickets < count) {
      this.showToast('钻石或抽卡券不足！');
      return;
    }

    if (this.state.gachaTickets >= count) {
      this.state.gachaTickets -= count;
    } else {
      this.state.diamond -= cost;
    }

    const results = GachaSystem.performDraw(count);
    if (count === 10) AudioSystem.gachaTen(); else AudioSystem.gachaSingle();
    const hasRare = results.some(r => r.rarity === 'legendary' || r.rarity === 'limited');
    if (hasRare) setTimeout(() => AudioSystem.gachaRare(), count === 10 ? 900 : 300);
    GachaSystem.showResults(results);
    this.updateStatusBar();
    this.saveState();
  },

  closeGachaResult() {
    document.getElementById('gacha-result').style.display = 'none';
    this.updateGacha();
  },

  // ========== 充值 ==========
  recharge(amount) {
    const diamondMap = { 6: 60, 30: 300, 290: 2900, 368: 3680, 648: 6480 };
    this.confirmCallback = () => {
      this.state.diamond += diamondMap[amount] || 0;
      AudioSystem.purchaseSuccess();
      this.updateStatusBar();
      this.updateShop();
      this.closeConfirm();
      this.showToast(`充值成功！获得 ${diamondMap[amount]} 钻石`);
      this.saveState();
    };
    this.showConfirm(`确认充值 ${amount} 元？\n将获得 ${diamondMap[amount]} 钻石`);
  },

  // ========== 购买道具 ==========
  buyItem(itemId) {
    const item = ITEMS[itemId];
    if (!item) return;

    if (this.state.diamond < item.price) {
      this.showToast('钻石不足！');
      return;
    }

    this.confirmCallback = () => {
      this.state.diamond -= item.price;
      this.state.inventory[itemId] = (this.state.inventory[itemId] || 0) + 1;
      AudioSystem.itemGet();
      this.updateStatusBar();
      this.updateShop();
      this.closeConfirm();
      this.showToast(`购买成功！获得 ${item.name}`);
      this.saveState();
    };
    this.showConfirm(`确认购买 ${item.name}？\n花费 💎${item.price} 钻石`);
  },

  // ========== 主页装饰 ==========
  buyDecoration(decId) {
    const dec = DECORATIONS.find(d => d.id === decId);
    if (!dec || dec.unlocked) return;

    if (this.state.diamond < dec.price) {
      this.showToast('钻石不足！');
      return;
    }

    this.confirmCallback = () => {
      this.state.diamond -= dec.price;
      this.state.unlockedDecorations.push(decId);
      dec.unlocked = true;
      this.state.decoration = decId;
      this.updateProfile();
      this.closeConfirm();
      this.showToast(`解锁成功！已应用 ${dec.name}`);
      this.saveState();
    };
    this.showConfirm(`确认解锁 ${dec.name}？\n花费 💎${dec.price} 钻石`);
  },

  // ========== 设置 ==========
  toggleTTS() {
    const enabled = TTSSystem.toggle();
    this.state.settings.voice = enabled ? 100 : 0;
    const btn = document.getElementById('tts-toggle-btn');
    if (btn) btn.textContent = enabled ? '🗣️ 语音朗读: 开' : '🔇 语音朗读: 关';
    this.showToast(enabled ? '🗣️ 语音朗读: 开' : '🔇 语音朗读: 关');
    this.saveState();
  },

  setVolume(type, value) {
    const val = parseInt(value);
    this.state.settings[type] = val;
    if (type === 'bgm') AudioSystem.setBgmVolume(val);
    if (type === 'sfx') AudioSystem.setSfxVolume(val);
    if (type === 'voice') {
      TTSSystem.enabled = val > 0;
      if (val === 0) TTSSystem.stop();
    }
    this.saveState();
  },

  toggleSound() {
    this.state.soundEnabled = !this.state.soundEnabled;
    AudioSystem.enabled = this.state.soundEnabled;
    if (!this.state.soundEnabled) {
      AudioSystem.stopBGM();
    } else {
      if (this.state.screen === 'lobby') AudioSystem.playLobbyAmbient();
      else if (this.state.screen === 'dungeon-play') AudioSystem.playDungeonAmbient();
    }
    this.saveState();
    this.showToast(this.state.soundEnabled ? '🔊 声音: 开' : '🔇 声音: 关');
  },

  toggleProfilePrivacy() {
    const modes = ['public', 'friends-only', 'private'];
    const labels = ['公开', '仅好友', '私密'];
    const idx = modes.indexOf(this.state.profilePrivacy);
    this.state.profilePrivacy = modes[(idx + 1) % 3];
    document.getElementById('privacy-label').textContent = labels[(idx + 1) % 3];
    this.saveState();
  },

  changePlayerID() {
    if (this.state.playerIDChanges <= 0) {
      if (this.state.diamond < 98) {
        this.showToast('钻石不足！再次修改ID需要98钻石');
        return;
      }
      this.confirmCallback = () => {
        const newID = prompt('请输入新的玩家ID（2-12字符）:');
        if (newID && newID.length >= 2 && newID.length <= 12) {
          this.state.diamond -= 98;
          this.state.playerID = newID;
          this.updateProfile();
          this.updateStatusBar();
          this.closeConfirm();
          this.showToast('ID修改成功！');
          this.saveState();
        }
      };
      this.showConfirm('再次修改ID将花费98钻石，确定继续？');
    } else {
      const newID = prompt('请输入新的玩家ID（2-12字符）:');
      if (newID && newID.length >= 2 && newID.length <= 12) {
        this.state.playerIDChanges--;
        this.state.playerID = newID;
        this.updateProfile();
        this.showToast('ID修改成功！');
        this.saveState();
      }
    }
  },

  // ========== 弹窗 ==========
  showConfirm(msg) {
    document.getElementById('confirm-message').textContent = msg;
    document.getElementById('modal-confirm').style.display = 'flex';
  },

  confirmAction() {
    if (this.confirmCallback) {
      this.confirmCallback();
      this.confirmCallback = null;
    }
  },

  closeConfirm() {
    document.getElementById('modal-confirm').style.display = 'none';
    this.confirmCallback = null;
  },

  // ========== Toast ==========
  showToast(msg) {
    let toast = document.getElementById('game-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'game-toast';
      toast.style.cssText = `
        position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:10000;
        background:rgba(0,0,0,0.9);color:#fff;padding:12px 24px;border-radius:8px;
        font-size:14px;pointer-events:none;opacity:0;transition:opacity 0.3s;
        border:1px solid rgba(255,255,255,0.2);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  },
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => GameEngine.init());
