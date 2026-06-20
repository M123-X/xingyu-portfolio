/**
 * 深渊轮回直播间 - 主入口
 * 初始化游戏，注册全局事件
 */
(function() {
  'use strict';

  console.log('%c🔮 深渊轮回直播间 %cv1.0',
    'font-size:20px;color:#c8a0ff;',
    'font-size:14px;color:#888;');

  // ========== 图片预加载 ==========
  const criticalImages = [
    'cover 游戏封面图.png',
    'fogschool 雾锁校舍副本主背景.png',
  ];

  const allImages = [];
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !allImages.includes(src)) allImages.push(src);
  });
  // 合并关键图
  criticalImages.forEach(src => {
    if (!allImages.includes(src)) allImages.unshift(src);
  });

  let loadedCount = 0;
  const totalCount = allImages.length || 1;
  const statusEl = document.getElementById('loading-status');
  const fillEl = document.getElementById('loading-fill');
  const percentEl = document.getElementById('loading-percent');
  const loadingScreen = document.getElementById('loading-screen');

  function updateProgress() {
    loadedCount++;
    const pct = Math.round((loadedCount / totalCount) * 100);
    if (fillEl) fillEl.style.width = pct + '%';
    if (percentEl) percentEl.textContent = pct + '%';
    if (statusEl) {
      if (pct < 30) statusEl.textContent = '正在加载场景素材...';
      else if (pct < 60) statusEl.textContent = '正在加载角色立绘...';
      else if (pct < 90) statusEl.textContent = '正在加载卡牌与UI...';
      else statusEl.textContent = '即将进入深渊...';
    }
    if (loadedCount >= totalCount) {
      setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add('hidden');
      }, 400);
    }
  }

  function preloadImage(src) {
    const img = new Image();
    img.onload = updateProgress;
    img.onerror = updateProgress; // 即使失败也继续
    img.src = src;
  }

  // 分批加载：关键图优先
  setTimeout(() => {
    criticalImages.forEach(src => preloadImage(src));
    setTimeout(() => {
      allImages.forEach(src => {
        if (!criticalImages.includes(src)) preloadImage(src);
      });
    }, 100);
  }, 200);

  // 兜底：5秒后强制隐藏加载画面
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
    }
  }, 8000);

  // ========== 键盘快捷键 ==========
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'Escape':
        if (GameEngine.state.screen === 'dungeon-play') {
          GameEngine.returnToLobby();
        } else if (GameEngine.state.screen !== 'intro' && GameEngine.state.screen !== 'lobby') {
          GameEngine.navigateTo('lobby');
        }
        break;
      case ' ':
      case 'Enter':
        if (GameEngine.state.screen === 'dungeon-play') {
          e.preventDefault();
          GameEngine.advanceDialogue();
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        // 快速选择副本选项
        if (GameEngine.state.screen === 'dungeon-play') {
          const idx = parseInt(e.key) - 1;
          const btns = document.querySelectorAll('.dungeon-choice-btn');
          if (btns[idx]) btns[idx].click();
        }
        break;
    }
  });

  // ========== 触摸/点击优化 ==========
  document.addEventListener('touchstart', function(e) {
    // 防止双击缩放
    if (e.target.closest('button')) {
      e.preventDefault();
      e.target.click();
    }
  }, { passive: false });

  // ========== 窗口大小变化处理 ==========
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // 重绘粒子画布
      if (Particles.canvas) {
        Particles.resize();
      }
    }, 250);
  });

  // ========== 防止意外退出 ==========
  window.addEventListener('beforeunload', (e) => {
    GameEngine.saveState();
  });

  // ========== 定时保存 ==========
  setInterval(() => {
    if (GameEngine.state.screen !== 'intro') {
      GameEngine.saveState();
    }
  }, 30000); // 30秒自动保存

  // ========== 暴露API到全局 ==========
  window.GameEngine = GameEngine;
  window.GachaSystem = GachaSystem;
  window.UIComponents = UIComponents;
  window.SocialSystem = SocialSystem;
  window.DungeonSystem = DungeonSystem;

  console.log('%c✅ 所有系统初始化完成', 'color:#4f8;');
})();
