/**
 * 深渊轮回直播间 - UI组件系统
 * 渲染所有功能面板
 */
const UIComponents = {
  // ========== 人物图鉴 ==========
  renderArchive() {
    const grid = document.getElementById('archive-grid');
    if (!grid) return;

    grid.innerHTML = '';
    Object.values(CHARACTERS).forEach(char => {
      const card = document.createElement('div');
      card.className = `archive-card ${char.unlocked || GameEngine.state.unlockedCharacters.includes(char.id) ? '' : 'locked'}`;
      card.onclick = () => {
        if (char.unlocked || GameEngine.state.unlockedCharacters.includes(char.id)) {
          this.showCharacterDetail(char);
        } else {
          GameEngine.showToast('该角色尚未解锁');
        }
      };

      const isLocked = !char.unlocked && !GameEngine.state.unlockedCharacters.includes(char.id);
      card.innerHTML = `
        <div class="archive-card-img">
          <img src="${isLocked ? '黑色纯人物剪影素材（无细节，仅遮挡未解锁内容）/人物剪影.png' : char.halfBody}" alt="${char.name}">
          ${isLocked ? '<div class="archive-lock-overlay"><span>???</span><small>等待探索</small></div>' : ''}
        </div>
        <div class="archive-card-name">${isLocked ? '??? · 未知' : char.name + ' · ' + char.title}</div>
        <div class="archive-card-rarity">
          <span class="rarity-${char.rarity}">${char.rarity.toUpperCase()}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  showCharacterDetail(char) {
    const detail = document.getElementById('archive-detail');
    const illust = document.getElementById('archive-detail-illust');
    const info = document.getElementById('archive-detail-info');

    if (!detail) return;

    const owned = GameEngine.state.unlockedCharacters.includes(char.id);
    illust.innerHTML = `<img src="${char.fullBody}" alt="${char.name}">`;
    info.innerHTML = `
      <h3>${char.name} <span class="rarity-${char.rarity}">${char.rarity.toUpperCase()}</span></h3>
      <p class="char-title">${char.title}</p>
      <p class="char-element">元素: ${char.element} | 精神: ${char.spirit} | 生命: ${char.hp}</p>
      <p class="char-personality">${char.personality}</p>
      <p class="char-background">${char.background}</p>
      <p class="char-ability">⚡ ${char.ability}</p>
      <p class="char-quote">${char.quote}</p>
      ${!owned ? '<p class="char-locked-hint">🔒 完成相关副本解锁此角色</p>' :
        `<p class="char-bond">羁绊等级: ${'❤️'.repeat(Math.min(char.bondLevel || 0, char.bondMax))}${'🖤'.repeat(Math.max(0, char.bondMax - (char.bondLevel || 0)))}</p>`}
    `;
    detail.style.display = 'flex';
    gsap.fromTo(detail.querySelector('.archive-detail-content'),
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
  },

  // ========== 聊天频道 ==========
  renderChat() {
    this.renderChatMessages('world');
    this.renderFriendsList();
  },

  renderChatMessages(tab) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const presets = CHAT_PRESETS[tab] || [];
    const history = tab === 'world' ? GameEngine.state.chatHistory : [];
    const all = [...history, ...presets];

    container.innerHTML = all.map((m, i) => {
      const avatarChar = m.user.charAt(0);
      return `
        <div class="chat-msg">
          <div class="chat-msg-avatar">${avatarChar}</div>
          <div class="chat-msg-body">
            <div>
              <span class="chat-msg-user">${m.user}</span>
              <span class="chat-msg-time">${m.time}</span>
            </div>
            <div class="chat-msg-text">${m.msg}</div>
          </div>
          <button class="chat-msg-reply" onclick="GameEngine.replyTo('${m.user.replace(/'/g, "\\'")}')" title="回复">💬 回复</button>
        </div>
      `;
    }).join('');
    container.scrollTop = container.scrollHeight;
  },

  renderFriendsList() {
    const container = document.getElementById('friends-list');
    if (!container) return;

    if (GameEngine.state.friends.length === 0) {
      container.innerHTML = '<p class="empty-hint">暂无好友。在聊天频道点击其他玩家头像可添加好友。</p>';
      return;
    }
    container.innerHTML = GameEngine.state.friends.map(f => `
      <div class="friend-item">
        <span>👤 ${f.name}</span>
        <span class="friend-status ${f.online ? 'online' : 'offline'}">${f.online ? '在线' : '离线'}</span>
      </div>
    `).join('');
  },

  // ========== 线索黑板 ==========
  renderClueBoard() {
    const container = document.getElementById('clue-list');
    if (!container) return;

    const hasClues = GameEngine.state.clues.length > 0;

    if (!hasClues) {
      container.innerHTML = `
        <div class="clue-empty">
          <p>📋 尚未发现任何线索</p>
          <small>通关副本可以获得关键线索</small>
        </div>
      `;
      return;
    }

    container.innerHTML = GameEngine.state.clues.map(clueId => {
      const clue = CLUES[clueId];
      if (!clue) return '';
      return `
        <div class="clue-card">
          <div class="clue-card-header">
            <span class="clue-importance ${clue.importance === '核心' ? 'core' : 'key'}">${clue.importance}</span>
            <span class="clue-source">${clue.source}</span>
          </div>
          <h4>${clue.name}</h4>
          <p>${clue.description}</p>
        </div>
      `;
    }).join('');
  },

  // ========== 商城 ==========
  renderShop() {
    const container = document.getElementById('shop-items');
    if (!container) return;

    container.innerHTML = SHOP_ITEMS.map(item => {
      const owned = GameEngine.state.inventory[item.id] || 0;
      return `
        <div class="shop-item-card">
          <div class="shop-item-icon">
            <img src="${item.icon}" alt="${item.name}" loading="lazy">
          </div>
          <div class="shop-item-info">
            <h4>${item.name} ${owned > 0 ? `<small style="color:#4f8">×${owned}</small>` : ''}</h4>
            <p>${item.desc}</p>
          </div>
          <div class="shop-item-price">
            <span>💎 ${item.price}</span>
            <button class="btn-buy" onclick="GameEngine.buyItem('${item.id}')">购买</button>
          </div>
        </div>
      `;
    }).join('');
  },

  // ========== 个人主页 ==========
  renderProfile() {
    const showcase = document.getElementById('profile-showcase');
    const nameEl = document.getElementById('profile-name');
    const idChanges = document.getElementById('profile-id-changes');
    const dungeonsEl = document.getElementById('profile-dungeons-cleared');
    const charsEl = document.getElementById('profile-characters-owned');
    const decoOptions = document.getElementById('decoration-options');
    const privacyLabel = document.getElementById('privacy-label');

    if (nameEl) nameEl.textContent = `玩家ID: ${GameEngine.state.playerID}`;
    if (idChanges) idChanges.textContent = GameEngine.state.playerIDChanges;
    if (dungeonsEl) dungeonsEl.textContent = GameEngine.state.completedDungeons.length;
    if (charsEl) charsEl.textContent = GameEngine.state.unlockedCharacters.length;
    if (privacyLabel) {
      const labels = { 'public': '公开', 'friends-only': '仅好友', 'private': '私密' };
      privacyLabel.textContent = labels[GameEngine.state.profilePrivacy] || '公开';
    }

    // 展示角色
    if (showcase) {
      const char = CHARACTERS[GameEngine.state.currentCharacter];
      if (char) {
        showcase.innerHTML = `<img src="${char.fullBody}" alt="${char.name}">`;
      }
    }

    // 装饰选项
    if (decoOptions) {
      decoOptions.innerHTML = DECORATIONS.map(d => `
        <div class="deco-option ${d.unlocked ? 'unlocked' : 'locked'} ${GameEngine.state.decoration === d.id ? 'active' : ''}"
             onclick="GameEngine.state.unlockedDecorations.includes('${d.id}') ? (GameEngine.state.decoration='${d.id}',GameEngine.updateProfile(),GameEngine.saveState()) : GameEngine.buyDecoration('${d.id}')">
          <img src="${d.icon}" alt="${d.name}">
          <span>${d.name}</span>
          ${!d.unlocked ? `<small>💎${d.price}</small>` : ''}
        </div>
      `).join('');
    }
  },
};
