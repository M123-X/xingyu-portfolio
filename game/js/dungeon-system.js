/**
 * 深渊轮回直播间 - 副本剧情系统
 * 副本阶段管理、分支剧情推进
 */
const DungeonSystem = {
  // 获取当前副本对话状态
  getCurrentSequence() {
    if (!GameEngine.activeScript || !GameEngine.activePhase) return null;
    const phase = GameEngine.activeScript[GameEngine.activePhase];
    if (!phase) return null;

    if (phase.sequences && GameEngine.activeSeqIndex < phase.sequences.length) {
      return phase.sequences[GameEngine.activeSeqIndex];
    }
    return null;
  },

  // 检查是否在选项阶段
  isAtChoices() {
    if (!GameEngine.activeScript || !GameEngine.activePhase) return false;
    const phase = GameEngine.activeScript[GameEngine.activePhase];
    if (!phase) return false;
    return phase.choices && GameEngine.activeSeqIndex >= (phase.sequences?.length || 0);
  },

  // 获取当前阶段标题
  getCurrentPhaseTitle() {
    if (!GameEngine.activeScript || !GameEngine.activePhase) return '';
    const phase = GameEngine.activeScript[GameEngine.activePhase];
    return phase?.title || '';
  },

  // 获取阶段背景图
  getPhaseBackground() {
    if (!GameEngine.activeScript || !GameEngine.activePhase) return '';
    const phase = GameEngine.activeScript[GameEngine.activePhase];
    return phase?.bg || '';
  },

  // 更新副本背景
  updateBackground() {
    const bg = this.getPhaseBackground();
    if (bg) {
      const bgEl = document.getElementById('dungeon-play-bg');
      if (bgEl) bgEl.style.backgroundImage = `url('${bg}')`;
    }
  },

  // 获取精神值消耗（用于UI提示）
  getSpiritCost() {
    if (!this.isAtChoices()) return 0;
    const phase = GameEngine.activeScript[GameEngine.activePhase];
    if (!phase?.choices) return 0;
    return Math.min(...phase.choices.map(c => c.spiritCost || 0));
  },

  // 获取当前角色的路线
  getCurrentRoute() {
    if (!GameEngine.activeScript || !GameEngine.activePhase) return '';
    const phase = GameEngine.activeScript[GameEngine.activePhase];

    // 检查当前序列是否有角色
    if (phase?.sequences && GameEngine.activeSeqIndex > 0) {
      const seq = phase.sequences[GameEngine.activeSeqIndex - 1];
      if (seq?.character) return CHARACTERS[seq.character]?.route || '';
    }

    // 检查选项的路线
    if (phase?.choices) {
      const routes = [...new Set(phase.choices.filter(c => c.route !== 'default').map(c => c.route))];
      if (routes.length > 0) return routes[0];
    }

    return '';
  },

  // 安全执行路线（用于特殊路线触发器）
  executeRouteSpecificAction(route) {
    switch(route) {
      case 'combat':
        // 战斗路线：精神值消耗降低
        GameEngine.state.spirit = Math.min(100, GameEngine.state.spirit + 5);
        break;
      case 'strategy':
        // 策略路线：获得额外线索提示
        break;
      case 'investigation':
        // 调查路线：揭示隐藏文本
        break;
    }
  },

  // 计算通关评级
  calculateRank(spiritRemaining, ending, route) {
    if (ending === 'deadly') return 'F';
    if (ending === 'hard' && spiritRemaining >= 70) return 'S';
    if (ending === 'hard') return 'A';
    if (spiritRemaining >= 60) return 'B';
    if (spiritRemaining >= 30) return 'C';
    return 'D';
  },
};
