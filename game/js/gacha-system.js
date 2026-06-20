/**
 * 深渊轮回直播间 - 抽卡系统
 */
const GachaSystem = {
  performDraw(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
      GameEngine.state.gachaPity++;

      // 90抽保底至少稀有以上
      let roll = Math.random();
      let rarity;

      if (GameEngine.state.gachaPity >= 90) {
        roll = Math.random() * 0.15; // 保底：至少稀有
        GameEngine.state.gachaPity = 0;
      }

      if (roll < GACHA_RATES.limited) {
        rarity = 'limited';
        GameEngine.state.gachaPity = 0;
      } else if (roll < GACHA_RATES.limited + GACHA_RATES.legendary) {
        rarity = 'legendary';
        GameEngine.state.gachaPity = 0;
      } else if (roll < GACHA_RATES.limited + GACHA_RATES.legendary + GACHA_RATES.rare) {
        rarity = 'rare';
      } else {
        rarity = 'normal';
      }

      // 选择对应稀有度的角色
      const pool = Object.values(CHARACTERS).filter(c => c.rarity === rarity ||
        (rarity === 'limited' && c.rarity === 'ssr') ||
        (rarity === 'legendary' && (c.rarity === 'ssr' || c.rarity === 'sr'))
      );

      const char = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] :
        Object.values(CHARACTERS)[Math.floor(Math.random() * Object.values(CHARACTERS).length)];

      // 实际稀有度（根据角色的真实稀有度微调）
      const actualRarity = rarity === 'limited' ? 'limited' :
        char.rarity === 'ssr' ? (rarity === 'normal' ? 'rare' : rarity) :
        char.rarity === 'sr' ? (rarity === 'normal' ? 'normal' : rarity) : rarity;

      const card = {
        charId: char.id,
        rarity: actualRarity,
        isNew: !GameEngine.state.gachaCollection.includes(char.id),
      };

      // 更新收藏
      if (card.isNew && !GameEngine.state.unlockedCharacters.includes(char.id)) {
        GameEngine.state.unlockedCharacters.push(char.id);
      }
      if (!GameEngine.state.gachaCollection.includes(char.id)) {
        GameEngine.state.gachaCollection.push(char.id);
      }

      results.push(card);
    }
    return results;
  },

  showResults(results) {
    const resultContainer = document.getElementById('gacha-result');
    const cardsContainer = document.getElementById('gacha-result-cards');
    if (!resultContainer || !cardsContainer) return;

    cardsContainer.innerHTML = '';
    resultContainer.style.display = 'block';

    results.forEach((card, i) => {
      const char = CHARACTERS[card.charId];
      if (!char) return;

      const cardEl = document.createElement('div');
      cardEl.className = `gacha-result-card rarity-${card.rarity}`;
      cardEl.style.cssText = `
        background: ${RARITY_COLORS[card.rarity]}22;
        border: 3px solid ${RARITY_COLORS[card.rarity]};
        border-radius: 12px; overflow: hidden; width: 120px;
        text-align: center; margin: 5px;
      `;
      cardEl.innerHTML = `
        <div class="gacha-card-inner" style="position:relative;">
          <img src="${char.cardFace}" alt="${char.name}" style="width:100%;height:auto;">
          <div class="gacha-card-label" style="background:${RARITY_COLORS[card.rarity]};color:#fff;padding:4px 8px;font-size:11px;">
            ${card.rarity.toUpperCase()} · ${char.name}
          </div>
          ${card.isNew ? '<div class="new-badge">NEW</div>' : ''}
        </div>
      `;
      cardsContainer.appendChild(cardEl);

      // 翻牌动画
      setTimeout(() => {
        Animations.gachaReveal(cardEl, i);
        if (card.rarity === 'legendary' || card.rarity === 'limited') {
          Animations.gachaRareGlow(cardEl, card.rarity);
        }
      }, 100);
    });

    // 滚动到结果
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  },

  zoomCard(charId) {
    const char = CHARACTERS[charId];
    if (!char) return;
    const modal = document.getElementById('card-zoom-modal');
    const img = document.getElementById('card-zoom-img');
    if (modal && img) {
      img.src = char.cardFace;
      img.alt = char.name;
      modal.style.display = 'flex';
    }
  },

  updateGachaUI() {
    const diamondEl = document.getElementById('gacha-diamond');
    const ticketsEl = document.getElementById('gacha-tickets');
    if (diamondEl) diamondEl.textContent = GameEngine.state.diamond;
    if (ticketsEl) ticketsEl.textContent = GameEngine.state.gachaTickets;

    // 更新收藏展示
    const collectionGrid = document.getElementById('gacha-collection-grid');
    if (collectionGrid) {
      collectionGrid.innerHTML = GameEngine.state.gachaCollection.map(charId => {
        const char = CHARACTERS[charId];
        if (!char) return '';
        return `
          <div class="collection-card" onclick="GachaSystem.zoomCard('${charId}')" title="点击放大欣赏">
            <img src="${char.cardFace}" alt="${char.name}" loading="lazy">
            <span>${char.name}</span>
            <div class="zoom-hint">🔍 点击放大</div>
          </div>
        `;
      }).join('');
      if (GameEngine.state.gachaCollection.length === 0) {
        collectionGrid.innerHTML = '<p class="empty-hint">还没有抽到任何角色卡牌，前往深渊召唤获取吧！</p>';
      }
    }
  },
};
