/**
 * 深渊轮回直播间 - 游戏数据定义
 * 所有角色、副本、道具、对话数据
 */

// ========== 角色数据库 ==========
const CHARACTERS = {
  laiyi: {
    id: 'laiyi',
    name: '莱伊',
    title: '沉默守望者',
    route: 'combat',
    element: 'shadow',
    rarity: 'sr',
    spirit: 90,
    hp: 800,
    personality: '冷漠寡言，行动力极强，相信直觉胜过一切',
    background: '深渊中独自生存多年的神秘战士，右手腕有着不可磨灭的深渊刻印。不善言辞但总在关键时刻保护同伴。',
    ability: '「暗影裁决」—— 战斗伤害加成30%，对诡异的直觉预判能力',
    quote: '"...别怕。我在。"',
    halfBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/莱伊半身.png',
    fullBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/莱伊全身.png',
    cardFace: '精美抽卡卡面（独立精致插画，带氛围背景，不能用基础立绘替代）/莱伊.png',
    unlocked: true,
    bondLevel: 0,
    bondMax: 5,
  },
  helun: {
    id: 'helun',
    name: '赫伦',
    title: '深渊领航者',
    route: 'strategy',
    element: 'light',
    rarity: 'ssr',
    spirit: 100,
    hp: 500,
    personality: '冷静理性，擅长分析与规划，对深渊机制了如指掌',
    background: '曾经是深渊研究机构的首席分析师，为寻找失踪的妹妹主动踏入深渊。携带大量研究笔记与仪器。',
    ability: '「全知之眼」—— 探查隐藏线索概率提升40%，关卡机制预判',
    quote: '"每一个选择都在改变命运的轨迹。"',
    halfBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/赫伦全身.png',
    fullBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/赫伦全身.png',
    cardFace: '精美抽卡卡面（独立精致插画，带氛围背景，不能用基础立绘替代）/赫伦.png',
    unlocked: true,
    bondLevel: 0,
    bondMax: 5,
  },
  lingjiu: {
    id: 'lingjiu',
    name: '凌咎',
    title: '深渊追迹者',
    route: 'investigation',
    element: 'void',
    rarity: 'ssr',
    spirit: 100,
    hp: 500,
    personality: '执着而敏锐，背负10年未解之债，全程追问真相',
    background: '唯一能接入深渊全频段感知的追迹者。十年前失去了最重要的搭档，从此独自追寻深渊的真相。',
    ability: '「深渊感知」—— 专属剧情线，可揭开隐藏真相与深层秘密',
    quote: '"真相...无论多痛，我都要亲手揭开。"',
    halfBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/凌咎半身.png',
    fullBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/凌咎全身.png',
    cardFace: '精美抽卡卡面（独立精致插画，带氛围背景，不能用基础立绘替代）/凌咎.png',
    unlocked: false,
    bondLevel: 0,
    bondMax: 5,
  },
  geyan: {
    id: 'geyan',
    name: '戈岩',
    title: '坚壁守护者',
    element: 'earth',
    rarity: 'r',
    spirit: 80,
    hp: 1200,
    personality: '沉稳可靠，不善言辞但永远站在最前面挡下危险',
    background: '曾是深渊边境的守卫队队长，在一次深渊爆发中失去整支小队。此后独自守护边境线十年。',
    ability: '「不破坚壁」—— 受到伤害减免40%，可替队友承受致命一击',
    quote: '"站我身后。只要我还在，就不会让你倒下。"',
    halfBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/戈岩半身.png',
    fullBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/戈岩全身.png',
    cardFace: '精美抽卡卡面（独立精致插画，带氛围背景，不能用基础立绘替代）/戈岩.png',
    unlocked: false,
    bondLevel: 0,
    bondMax: 5,
  },
  nuoen: {
    id: 'nuoen',
    name: '诺恩',
    title: '预知先知',
    element: 'psychic',
    rarity: 'sr',
    spirit: 110,
    hp: 350,
    personality: '温柔而神秘，总在危险发生前就预知到端倪',
    background: '天生拥有预知能力的少女，能看到未来数秒的碎片。被深渊力量吸引而来，为阻止更大的灾难。',
    ability: '「预知之眼」—— 提前预判敌方行动，全队闪避率提升30%',
    quote: '"我看到...前方有危险。请小心。"',
    halfBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/诺恩半身.png',
    fullBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/诺恩全身.png',
    cardFace: '精美抽卡卡面（独立精致插画，带氛围背景，不能用基础立绘替代）/诺恩.png',
    unlocked: false,
    bondLevel: 0,
    bondMax: 5,
  },
  yuque: {
    id: 'yuque',
    name: '屿雀',
    title: '治愈之翼',
    element: 'wind',
    rarity: 'r',
    spirit: 95,
    hp: 450,
    personality: '开朗乐观的治愈者，在绝望中也能找到希望的光',
    background: '拥有治愈之力的游医，穿梭于深渊边境救助伤员。天真外表下藏着看透生死的成熟。',
    ability: '「生命之歌」—— 全队恢复生命值40%，驱散负面状态',
    quote: '"别担心！只要有我在，大家都会好好的！"',
    halfBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/屿雀半身.png',
    fullBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/屿雀全身.png',
    cardFace: '精美抽卡卡面（独立精致插画，带氛围背景，不能用基础立绘替代）/屿雀.png',
    unlocked: false,
    bondLevel: 0,
    bondMax: 5,
  },
  jifeng: {
    id: 'jifeng',
    name: '疾风',
    title: '迅影游侠',
    element: 'wind',
    rarity: 'r',
    spirit: 85,
    hp: 550,
    personality: '自由不羁，行动如风，永远按自己的节奏行事',
    background: '来去如风的流浪者，没人知道他的真实来历。与屿雀有着不为人知的过往羁绊。',
    ability: '「风之加护」—— 全队行动速度提升25%，探索效率加成',
    quote: '"犹豫不决的时候，就跟着感觉走吧。风会指引方向。"',
    halfBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/疾风半身.png',
    fullBody: '透明底基础人物立绘（全身  半身都能用，剧情核心素材）/疾风全身.png',
    cardFace: '精美抽卡卡面（独立精致插画，带氛围背景，不能用基础立绘替代）/疾风.png',
    unlocked: false,
    bondLevel: 0,
    bondMax: 5,
  },
};

const DEFAULT_UNLOCKED = ['laiyi', 'helun'];

// ========== 副本数据库 ==========
const DUNGEONS = {
  fogschool: {
    id: 'fogschool',
    name: '雾锁校舍',
    chapter: 1,
    difficulty: '简单',
    difficultyStars: 1,
    bg: 'fogschool 雾锁校舍副本主背景.png',
    bgDetail: 'fogschool_cls 教室细分背景.png',
    description: '浓雾笼罩的废弃校舍，时间被恶意篡改，遍布诡异与谎言。失踪的学生、被篡改的公告、以及那间绝不能踏入的教师办公室...',
    rewards: { gold: 500, diamond: 50, tickets: 3, item: '初级精神稳定剂' },
    bonusRewards: { gold: 800, diamond: 100, tickets: 5, item: '高级幻境抵抗符' },
    clueReward: 'clue_school_1',
    requires: [],
    status: 'unlocked', // unlocked, completed, locked
  },
  library: {
    id: 'library',
    name: '死寂图书馆',
    chapter: 2,
    difficulty: '普通',
    difficultyStars: 2,
    bg: 'library 死寂图书馆副本背景.png',
    bgDetail: 'library 死寂图书馆副本背景.png',
    description: '亘古封闭的地下图书馆，书籍被篡改、记忆被替换。暗夜中暗影游荡，书架间的刻痕记录着前人的死亡路线...',
    rewards: { gold: 1000, diamond: 200, tickets: 3, item: '羁绊信物' },
    bonusRewards: { gold: 2000, diamond: 500, tickets: 8, item: '高级精神稳定剂' },
    clueReward: 'clue_library_1',
    requires: ['fogschool'],
    status: 'locked',
  },
};

// ========== 线索数据库 ==========
const CLUES = {
  clue_school_1: {
    id: 'clue_school_1',
    name: '被篡改的公告',
    source: '雾锁校舍',
    description: '学校的官方公告被恶意篡改，原本文本中隐藏着"教师办公室为全校唯一安全区域"的虚假信息。真正的安全区域恰好在相反方向。',
    importance: '关键',
  },
  clue_school_2: {
    id: 'clue_school_2',
    name: '墙中时钟',
    source: '雾锁校舍·隐藏墙壁',
    description: '隐藏在墙壁中的老旧时钟仍在运转，时间指向与校舍内被篡改的时间完全相反。这是破解时间诡异的关键道具。',
    importance: '核心',
  },
  clue_library_1: {
    id: 'clue_library_1',
    name: '地板刻痕',
    source: '死寂图书馆',
    description: '图书馆石质地板上布满细微刻痕，记录了前人的移动路径。避开刻痕断裂处可安全通过。',
    importance: '关键',
  },
  clue_library_2: {
    id: 'clue_library_2',
    name: '被替换的书页',
    source: '死寂图书馆·古书',
    description: '古书中的关键页面被替换成了空白页。书页边缘残留黑色墨迹，触碰会消耗精神值。',
    importance: '核心',
  },
};

// ========== 道具数据库 ==========
const ITEMS = {
  'revive_shard': { id: 'revive_shard', name: '复活碎片', desc: '战斗失败时可复活一次', price: 300, currency: 'diamond', icon: '道具缩略图复活碎片.png' },
  'resist_talisman': { id: 'resist_talisman', name: '幻境抵抗符', desc: '降低精神值消耗30%', price: 200, currency: 'diamond', icon: '道具缩略图幻境抵抗符.png' },
  'stabilizer': { id: 'stabilizer', name: '精神稳定剂', desc: '恢复50点精神值', price: 150, currency: 'diamond', icon: '道具缩略图精神稳定剂.png' },
  'bond_token': { id: 'bond_token', name: '羁绊信物', desc: '提升指定角色羁绊等级', price: 500, currency: 'diamond', icon: '道具缩略图羁绊信物.png' },
};

const SHOP_ITEMS = [
  ITEMS.revive_shard,
  ITEMS.resist_talisman,
  ITEMS.stabilizer,
  ITEMS.bond_token,
];

// ========== 主页装饰 ==========
const DECORATIONS = [
  { id: 'default', name: '默认背景', icon: '主页纹理背景磨砂黑.png', unlocked: true },
  { id: 'ancient', name: '古书纹理', icon: '主页纹理背景古书纹理.png', unlocked: false, price: 200 },
  { id: 'mist', name: '浓雾纹理', icon: '主页纹理背景浓雾纹理.png', unlocked: false, price: 300 },
  { id: 'cloud', name: '云流纹理', icon: '主页纹理背景浅黑蓝色云流动纹理.png', unlocked: false, price: 400 },
  { id: 'clock', name: '破碎时钟', icon: '主页纹理背景破碎时钟.png', unlocked: false, price: 500 },
];

// ========== Gacha 概率配置 ==========
const GACHA_RATES = {
  limited: 0.006,   // 0.6%
  legendary: 0.024, // 2.4%
  rare: 0.12,       // 12%
  normal: 0.85,     // 85%
};

// 卡牌边框对应
const RARITY_BORDERS = {
  normal: '卡牌边框普通.png',
  rare: '卡牌边框稀有.png',
  legendary: '卡牌边框极品.png',
  limited: '卡牌边框限定.png',
};

const RARITY_COLORS = {
  normal: '#8a8a8a',
  rare: '#4a9eff',
  legendary: '#ff8c00',
  limited: '#ff0044',
};

// ========== 聊天频道预设消息 ==========
const CHAT_PRESETS = {
  world: [
    { user: '暗影行者', msg: '雾锁校舍那个隐藏墙壁怎么找啊？', time: '3分钟前' },
    { user: '月光旅人', msg: '莱伊路线简直太帅了！战斗体验满分', time: '5分钟前' },
    { user: '深渊研究者', msg: '图书馆那个暗影太吓人了，精神值差点归零...', time: '8分钟前' },
    { user: '卡牌收藏家', msg: '终于抽到赫伦的限定卡面了！三十连才出', time: '12分钟前' },
    { user: '小透明', msg: '新人有推荐的角色路线吗？', time: '15分钟前' },
    { user: '老深渊人', msg: '提醒新人：教师办公室绝对不能进！血的教训', time: '20分钟前' },
  ],
  friends: [
    { user: '系统', msg: '好友功能即将开放，敬请期待', time: '系统' },
  ],
  system: [
    { user: '系统公告', msg: '欢迎来到深渊轮回直播间！请谨慎选择你的每一步。', time: '置顶' },
    { user: '系统提示', msg: '通关第一章后可解锁第二章死寂图书馆。', time: '公告' },
    { user: '系统提示', msg: '每日登录奖励已发放至邮箱。', time: '公告' },
  ],
};

// ========== 剧情序列 (雾锁校舍) ==========
const DUNGEON_SCRIPT_FOGSCHOOL = {
  intro: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    sequences: [
      { speaker: '系统', text: '你踏入了雾锁校舍。浓雾从窗外涌入，能见度不足三米。', character: null },
      { speaker: '系统', text: '副本难度：简单 | 精神值消耗：每阶段10点', character: null },
      { speaker: '莱伊', text: '...雾很浓。跟紧我。', character: 'laiyi' },
      { speaker: '赫伦', text: '墙壁上的公告被篡改了。上面写着"教师办公室为全校唯一安全区域"。', character: 'helun' },
      { speaker: '赫伦', text: '但根据我的分析——这是一个陷阱。真正的安全区域应该在反方向。', character: 'helun' },
      { speaker: '戈岩', text: '我闻到...诡异的气息。从走廊尽头传来。', character: 'geyan' },
      { speaker: '诺恩', text: '等一下...我看到一个画面——教室里，有学生在哭...', character: 'nuoen' },
    ],
    nextPhase: 'phase1',
  },
  phase1: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    title: '阶段一：迷雾入场',
    sequences: [
      { speaker: '系统', text: '你站在教学楼一楼走廊。浓雾从不远处的教室涌出，周围的能见度极低。', character: null },
      { speaker: '系统', text: '墙上粉笔写着一行字："教师办公室是全校唯一安全的地方"。但赫伦说这是陷阱。', character: null },
      { speaker: '莱伊', text: '...远处有个身影。像是女人的轮廓。', character: 'laiyi' },
      { speaker: '系统', text: '走廊尽头迷雾中，一个模糊的女性身影若隐若现。她似乎在向你招手...', character: null },
    ],
    choices: [
      {
        id: 'phase1_a',
        text: '走向那个身影，尝试对话',
        route: 'laiyi',
        spiritCost: 5,
        result: 'success',
        next: 'phase1_a_result',
      },
      {
        id: 'phase1_b',
        text: '检查墙上的粉笔字，寻找线索',
        route: 'helun',
        spiritCost: 3,
        result: 'clue',
        next: 'phase1_b_result',
      },
      {
        id: 'phase1_c',
        text: '无视一切，直接往走廊深处前进',
        route: 'lingjiu',
        spiritCost: 10,
        result: 'risky',
        next: 'phase1_c_result',
      },
    ],
  },
  phase1_a_result: {
    bg: 'fogschool_cls 教室细分背景.png',
    sequences: [
      { speaker: '莱伊', text: '等一下——那不是人。', character: 'laiyi' },
      { speaker: '系统', text: '身影在浓雾中消散，原地留下一本学生名册。上面记录着失踪学生的名字。', character: null },
      { speaker: '系统', text: '莱伊翻开名册，里面夹着一张褪色的照片——学生们在教室前的合影。', character: null },
      { speaker: '莱伊', text: '这些孩子...全都不在了吧。', character: 'laiyi' },
    ],
    nextPhase: 'phase2',
    reward: '获得线索：失踪学生名册',
  },
  phase1_b_result: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    sequences: [
      { speaker: '赫伦', text: '粉笔字下面有被擦掉的痕迹...让我看看。', character: 'helun' },
      { speaker: '系统', text: '赫伦用仪器扫描墙壁，被覆盖的原文字显现出来：', character: null },
      { speaker: '系统', text: '"教师办公室是禁区。绝对不要踏入。安全出口在体育馆后门。"', character: null },
      { speaker: '赫伦', text: '果然。公告被人蓄意篡改过。有人在引诱我们进入陷阱。', character: 'helun' },
    ],
    nextPhase: 'phase2',
    reward: '获得线索：被篡改的公告真相',
  },
  phase1_c_result: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    sequences: [
      { speaker: '系统', text: '你无视警告向前冲去。浓雾中突然涌出无数黑色的手臂，试图抓住你的脚踝。', character: null },
      { speaker: '系统', text: '精神值 - 22点', character: null },
      { speaker: '莱伊', text: '...快退回来！这些东西在吸收你的精神！', character: 'laiyi' },
      { speaker: '系统', text: '你们勉强退回安全地带。但那些手臂的触感依然残留...', character: null },
    ],
    nextPhase: 'phase2',
    spiritPenalty: 22,
    reward: null,
  },
  phase2: {
    bg: 'fogschool_cls 教室细分背景.png',
    title: '阶段二：教室抉择',
    sequences: [
      { speaker: '系统', text: '雾气暂时消退了一些。你们站在教室门口，里面有翻倒的桌椅和散落的试卷。', character: null },
      { speaker: '系统', text: '教室后方有一面墙壁看起来不太自然——微微隆起，像是后面藏着什么。', character: null },
      { speaker: '戈岩', text: '那面墙...有问题。后面有东西。', character: 'geyan' },
      { speaker: '诺恩', text: '我感应到墙后面...是一个隐藏的房间。但进去可能会有危险。', character: 'nuoen' },
      { speaker: '屿雀', text: '别担心！不管遇到什么，我都能治疗大家！', character: 'yuque' },
    ],
    choices: [
      {
        id: 'phase2_a',
        text: '在教室内安静等到天亮（普通通关路线）',
        route: 'default',
        spiritCost: 5,
        result: 'normal_clear',
        next: 'ending_normal',
      },
      {
        id: 'phase2_b',
        text: '砸开隐藏墙壁，寻找控制时间的钟表（高难通关路线）',
        route: 'helun',
        spiritCost: 15,
        result: 'hard_clear',
        next: 'phase2_b_result',
      },
      {
        id: 'phase2_c',
        text: '观察墙壁上的诡异镜子（精神值危险路线）',
        route: 'lingjiu',
        spiritCost: 30,
        result: 'danger',
        next: 'phase2_c_result',
      },
      {
        id: 'phase2_d',
        text: '强行闯入教师办公室（致命路线）',
        route: 'laiyi',
        spiritCost: 50,
        result: 'deadly',
        next: 'ending_deadly',
      },
    ],
  },
  phase2_b_result: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    sequences: [
      { speaker: '系统', text: '墙壁碎裂，露出一台锈迹斑斑的旧式钟表。表盘上的指针正在逆向转动。', character: null },
      { speaker: '赫伦', text: '就是这个——它在篡改整个校舍的时间！', character: 'helun' },
      { speaker: '系统', text: '赫伦小心翼翼地调整钟表齿轮。指针缓缓停住，然后开始顺时针运转。', character: null },
      { speaker: '系统', text: '浓雾开始消散。校舍内的诡异力量正在减弱。', character: null },
      { speaker: '莱伊', text: '...雾散了。我们成功了。', character: 'laiyi' },
    ],
    nextPhase: 'ending_hard',
    reward: '获得核心线索：墙中时钟',
  },
  phase2_c_result: {
    bg: 'fogschool_cls 教室细分背景.png',
    sequences: [
      { speaker: '系统', text: '你凝视镜子。镜中的倒影开始扭曲——那不是你。', character: null },
      { speaker: '系统', text: '镜中的"你"嘴角裂开，露出诡异的笑容。精神值急剧下降...', character: null },
      { speaker: '系统', text: '精神值 - 30点！', character: null },
      { speaker: '诺恩', text: '别看镜子！那是深渊的幻象！', character: 'nuoen' },
      { speaker: '系统', text: '好在诺恩及时将你拉回。但精神值已经严重受损...', character: null },
    ],
    nextPhase: 'phase2',
    spiritPenalty: 30,
  },
  ending_normal: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    sequences: [
      { speaker: '系统', text: '你们安静地在教室内等待。浓雾在黎明前最浓密，然后在晨光中缓缓消散。', character: null },
      { speaker: '系统', text: '虽然找到了安全通过的办法，但你隐约感觉错过了什么重要的东西...', character: null },
      { speaker: '莱伊', text: '...活着回去就够了。下次再来。', character: 'laiyi' },
    ],
    ending: 'normal',
  },
  ending_hard: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    sequences: [
      { speaker: '系统', text: '时间恢复正常！校舍内的所有诡异现象一同消失。', character: null },
      { speaker: '系统', text: '你们在校舍深处发现了一份被封印的档案——关于深渊起源的机密文件。', character: null },
      { speaker: '赫伦', text: '这份档案...揭示了一个更大的阴谋。校舍只是一个开始。', character: 'helun' },
      { speaker: '莱伊', text: '...走吧。该去图书馆了。', character: 'laiyi' },
    ],
    ending: 'hard',
  },
  ending_deadly: {
    bg: 'fogschool 雾锁校舍副本主背景.png',
    sequences: [
      { speaker: '系统', text: '你们推开了教师办公室的门。', character: null },
      { speaker: '系统', text: '浓雾瞬间爆涌而出！数百名学生的哀嚎声将你们淹没——', character: null },
      { speaker: '系统', text: '这个房间是整个校舍诡异的源头。所有失踪的学生都在这里...', character: null },
      { speaker: '系统', text: '精神值直接归零。深渊吞噬了你的意识。', character: null },
      { speaker: '莱伊', text: '不——！', character: 'laiyi' },
    ],
    ending: 'deadly',
  },
};

// ========== 剧情序列 (死寂图书馆) ==========
const DUNGEON_SCRIPT_LIBRARY = {
  intro: {
    bg: 'library 死寂图书馆副本背景.png',
    sequences: [
      { speaker: '系统', text: '你踏入了死寂图书馆。腐烂纸张的气味混合着潮湿的空气扑面而来。', character: null },
      { speaker: '系统', text: '副本难度：普通 | 精神值消耗：每阶段15点', character: null },
      { speaker: '赫伦', text: '注意脚下。地板上的刻痕...是前人留下的死亡路线。', character: 'helun' },
      { speaker: '莱伊', text: '...暗处有东西在动。', character: 'laiyi' },
      { speaker: '诺恩', text: '这些书...它们在低语。我听到了。', character: 'nuoen' },
    ],
    nextPhase: 'phase1',
  },
  phase1: {
    bg: 'library 死寂图书馆副本背景.png',
    title: '阶段一：暗影入场',
    sequences: [
      { speaker: '系统', text: '昏暗的大厅中只有几盏残破的壁灯发出微弱的光。远处书架的阴影里，有什么在缓慢移动。', character: null },
      { speaker: '系统', text: '墙上挂着一幅告示："禁止阅读任何标注红色标签的书籍。违者后果自负。"', character: null },
      { speaker: '屿雀', text: '那边...那个影子，它好像在跟着我们？', character: 'yuque' },
      { speaker: '疾风', text: '别紧张。影子而已，又不是没见过。', character: 'jifeng' },
    ],
    choices: [
      {
        id: 'lib_phase1_a',
        text: '原地等待，观察暗影的移动规律（普通通关路线）',
        route: 'default',
        spiritCost: 5,
        result: 'normal_clear',
        next: 'lib_ending_normal',
      },
      {
        id: 'lib_phase1_b',
        text: '沿地板刻痕追踪前人的安全路线（高难通关路线）',
        route: 'helun',
        spiritCost: 15,
        result: 'hard_clear',
        next: 'lib_phase1_b_result',
      },
      {
        id: 'lib_phase1_c',
        text: '翻看一本红标古籍（精神值危险路线）',
        route: 'lingjiu',
        spiritCost: 30,
        result: 'danger',
        next: 'lib_phase1_c_result',
      },
      {
        id: 'lib_phase1_d',
        text: '走向暗影，直面未知存在（致命路线）',
        route: 'laiyi',
        spiritCost: 50,
        result: 'deadly',
        next: 'lib_ending_deadly',
      },
    ],
  },
  lib_phase1_b_result: {
    bg: 'library 死寂图书馆副本背景.png',
    sequences: [
      { speaker: '赫伦', text: '刻痕的规律是...每三步左转，遇到断裂就停下。', character: 'helun' },
      { speaker: '系统', text: '你们沿着刻痕前行。暗影始终无法靠近——它们似乎被某种力量束缚在特定区域。', character: null },
      { speaker: '系统', text: '走到图书馆最深处，你们发现了一间密室。里面保存着未被篡改的原始古籍。', character: null },
      { speaker: '赫伦', text: '太好了。这些原始文献...揭示了深渊的真正历史。', character: 'helun' },
    ],
    nextPhase: 'lib_ending_hard',
    reward: '获得核心线索：深渊起源古籍',
  },
  lib_phase1_c_result: {
    bg: 'library 死寂图书馆副本背景.png',
    sequences: [
      { speaker: '系统', text: '你翻开红标古籍。书页上的文字开始蠕动，像活物一样爬进你的眼睛。', character: null },
      { speaker: '系统', text: '脑海里涌入无数不属于你的记忆——图书馆内逝去之人的临终片段。', character: null },
      { speaker: '系统', text: '精神值 - 30点！', character: null },
      { speaker: '诺恩', text: '快合上书！这些记忆会吞噬你！', character: 'nuoen' },
    ],
    nextPhase: 'phase1',
    spiritPenalty: 30,
  },
  lib_ending_normal: {
    bg: 'library 死寂图书馆副本背景.png',
    sequences: [
      { speaker: '系统', text: '你们耐心等待了数小时。暗影在午夜最活跃，但在黎明前最后一小时隐入书架缝隙。', character: null },
      { speaker: '系统', text: '趁着安全窗口期，你们安全离开图书馆。虽然没有获得深层秘密，但活着最重要。', character: null },
      { speaker: '莱伊', text: '...下次准备更充分再来。', character: 'laiyi' },
    ],
    ending: 'normal',
  },
  lib_ending_hard: {
    bg: 'library 死寂图书馆副本背景.png',
    sequences: [
      { speaker: '系统', text: '密室中的古籍揭示了一个惊人的真相——深渊并非自然形成，而是某个古代文明的产物。', character: null },
      { speaker: '系统', text: '图书馆就是那个文明用来储存知识的设施。暗影是守卫，保护着这些秘密。', character: null },
      { speaker: '赫伦', text: '这就解释了为什么深渊会有如此系统的诡异规则...它是有设计者的。', character: 'helun' },
      { speaker: '莱伊', text: '...看来真相比我们想象的更复杂。', character: 'laiyi' },
    ],
    ending: 'hard',
  },
  lib_ending_deadly: {
    bg: 'library 死寂图书馆副本背景.png',
    sequences: [
      { speaker: '系统', text: '你走向暗影。它缓缓转过身——', character: null },
      { speaker: '系统', text: '那张脸是一片空白。没有五官，没有表情，只有无尽的虚无。', character: null },
      { speaker: '系统', text: '你的意识被瞬间清空。深渊吞噬了你。', character: null },
      { speaker: '系统', text: '精神值直接归零。游戏失败。', character: null },
    ],
    ending: 'deadly',
  },
};

// ========== 序章动画文本 ==========
const PROLOGUE_TEXTS = [
  { text: '深夜。你独自在家。', delay: 2000 },
  { text: '手机屏幕突然亮起——', delay: 2500 },
  { text: '一条未知来源的直播通知弹出：', delay: 2000 },
  { text: '"欢迎来到深渊轮回直播间"', delay: 3000 },
  { text: '你想关掉它。但手指不听使唤。', delay: 2500 },
  { text: '屏幕中的画面开始扭曲——', delay: 2000 },
  { text: '一只手从屏幕中伸了出来。', delay: 3000 },
  { text: '你被拽入了深渊...', delay: 3500 },
];

// ========== 大厅角色轮播台词 ==========
const CHARACTER_QUOTES = {
  laiyi: ['"...别怕。我在。"', '"...雾散了。我们走吧。"', '"...你做得很好。"'],
  helun: ['"每一个选择都在改变命运的轨迹。"', '"数据不会说谎。相信我。"', '"真相需要耐心。"'],
  lingjiu: ['"真相...无论多痛，我都要亲手揭开。"', '"十年了...我不能停下。"', '"深渊在等我们。"'],
  geyan: ['"站我身后。只要我还在，就不会让你倒下。"', '"别怕。这墙，我挡着。"', '"...走，我跟你。"'],
  nuoen: ['"我看到...前方有危险。请小心。"', '"未来是可以改变的。"', '"不要害怕。"'],
  yuque: ['"别担心！只要有我在，大家都会好好的！"', '"笑一个嘛！绝望可不是我们的风格。"', '"你的伤，我来治。"'],
  jifeng: ['"犹豫不决的时候，就跟着感觉走吧。"', '"风会指引方向。"', '"没什么能困住风。"'],
};

// 导出到全局
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHARACTERS, DUNGEONS, CLUES, ITEMS, SHOP_ITEMS, DECORATIONS,
    GACHA_RATES, RARITY_BORDERS, RARITY_COLORS, CHAT_PRESETS,
    DUNGEON_SCRIPT_FOGSCHOOL, DUNGEON_SCRIPT_LIBRARY, PROLOGUE_TEXTS, CHARACTER_QUOTES, DEFAULT_UNLOCKED };
}
