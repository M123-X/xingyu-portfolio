/**
 * 深渊轮回直播间 - 动画特效系统
 * GSAP动画、粒子效果、场景过渡
 */
const Animations = {
  initIntro() {
    if (typeof gsap === 'undefined') {
      // GSAP未加载，直接显示所有元素
      document.querySelectorAll('.intro-title,.intro-subtitle,.intro-divider,.intro-tagline,.intro-buttons button,.intro-version').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }
    try {
      const tl = gsap.timeline();
      tl.from('.intro-title', { y: -60, opacity: 0, duration: 1.2, ease: 'power3.out' })
        .from('.intro-subtitle', { y: -30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .from('.intro-divider', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, '-=0.4')
        .from('.intro-tagline', { y: 20, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.intro-buttons button', { y: 30, opacity: 0, stagger: 0.2, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2')
        .from('.intro-version', { opacity: 0, duration: 0.5 }, '-=0.2');
      gsap.to('.intro-title', { y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    } catch(e) {
      console.warn('GSAP animation failed:', e);
    }
  },

  screenTransition(screen) {
    const activeScreen = document.querySelector('.screen.active, .sub-screen.active');
    if (!activeScreen) return;

    gsap.fromTo(activeScreen,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

    // 副本玩法画面特殊过渡
    if (screen === 'dungeon-play') {
      gsap.fromTo('#screen-dungeon-play',
        { opacity: 0, filter: 'brightness(0)' },
        { opacity: 1, filter: 'brightness(1)', duration: 1.5, ease: 'power2.inOut' }
      );
    }
  },

  // ========== 序章动画 ==========
  playPrologue() {
    const textEl = document.getElementById('prologue-text');
    if (!textEl) return;
    textEl.textContent = '';

    let delay = 0;
    PROLOGUE_TEXTS.forEach((item, i) => {
      delay += item.delay;
      setTimeout(() => {
        if (!document.getElementById('screen-prologue')?.classList.contains('active')) return;
        gsap.to(textEl, {
          opacity: 0, duration: 0.3,
          onComplete: () => {
            textEl.textContent = item.text;
            gsap.fromTo(textEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 });
          }
        });
        // 最后一句后进入大厅
        if (i === PROLOGUE_TEXTS.length - 1) {
          setTimeout(() => GameEngine.finishPrologue(), 2500);
        }
      }, delay);
    });
  },

  skipPrologue() {
    gsap.to('#screen-prologue', { opacity: 0, duration: 0.3 });
  },

  // ========== 角色切换动画 ==========
  characterSwitch() {
    const el = document.getElementById('lobby-current-character');
    if (!el) return;
    gsap.timeline()
      .to(el, { opacity: 0, scale: 0.95, duration: 0.2 })
      .to(el, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
  },

  // ========== 副本选项动画 ==========
  showChoices() {
    const btns = document.querySelectorAll('.dungeon-choice-btn');
    gsap.fromTo(btns,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out' }
    );
  },

  // ========== 游戏结束 ==========
  showGameOver() {
    const modal = document.getElementById('modal-gameover');
    gsap.fromTo(modal.querySelector('.gameover-modal'),
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
    );
  },

  // ========== 抽卡动画 ==========
  gachaReveal(card, index) {
    return new Promise(resolve => {
      gsap.fromTo(card,
        { rotateY: 180, opacity: 0, scale: 0.3 },
        {
          rotateY: 0, opacity: 1, scale: 1,
          duration: 0.8, delay: index * 0.3,
          ease: 'back.out(1.7)',
          onComplete: resolve,
        }
      );
    });
  },

  gachaRareGlow(cardEl, rarity) {
    if (rarity === 'legendary' || rarity === 'limited') {
      gsap.to(cardEl, {
        boxShadow: `0 0 30px ${rarity === 'limited' ? '#ff0044' : '#ff8c00'}`,
        duration: 0.5, repeat: 3, yoyo: true, ease: 'sine.inOut',
      });
    }
  },

  // ========== 通用弹窗动画 ==========
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'flex';
    gsap.fromTo(modal.querySelector('.modal-content'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
  },

  // ========== 按钮悬浮效果 ==========
  initButtonEffects() {
    document.addEventListener('mouseenter', e => {
      const btn = e.target.closest('.btn-primary, .btn-secondary, .btn-gacha, .func-card, .dungeon-card');
      if (!btn) return;
      gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power2.out' });
    }, true);

    document.addEventListener('mouseleave', e => {
      const btn = e.target.closest('.btn-primary, .btn-secondary, .btn-gacha, .func-card, .dungeon-card');
      if (!btn) return;
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
    }, true);
  },

  // ========== 数浮动效 ==========
  floatNumber(el, value, prefix = '') {
    const current = parseInt(el.textContent) || 0;
    gsap.to({ val: current }, {
      val: value, duration: 1, ease: 'power2.out',
      onUpdate: function() {
        el.textContent = prefix + Math.round(this.targets()[0].val).toLocaleString();
      }
    });
  },
};

// 粒子系统
const Particles = {
  canvas: null,
  ctx: null,
  particles: [],
  running: false,

  init() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // 只在intro画面显示粒子
    const observer = new MutationObserver(() => {
      const intro = document.getElementById('screen-intro');
      if (intro?.classList.contains('active')) {
        this.start();
      } else {
        this.stop();
      }
    });
    const intro = document.getElementById('screen-intro');
    if (intro) observer.observe(intro, { attributes: true, attributeFilter: ['class'] });

    // 初始化粒子
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5 - 0.2,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  },

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  start() {
    this.running = true;
    this.animate();
  },

  stop() {
    this.running = false;
    if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  animate() {
    if (!this.running || !this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(100, 140, 255, ${p.opacity})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  },
};

// 初始化按钮效果
window.addEventListener('DOMContentLoaded', () => {
  Animations.initButtonEffects();
});
