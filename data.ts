import { Question, ResultItem } from './types';

// Updated to 6 questions.
// Path Logic: 
// 1. Format (L/R)
// 2. Popularity (L=Famous/Major, R=Hidden/Cult) -> Used to split the pool of 8 movies.
// 3. Mood
// 4. World
// 5. Tone
// 6. Style
// Total paths = 64. Each path selects from a sub-pool of 4 movies (Total 256 unique outcomes).

export const QUESTIONS: Question[] = [
  { 
    id: 1, 
    text: "作品のフォーマットは？", 
    icon: "📺", 
    L: { label: "アニメ", sub: "Animation" }, 
    R: { label: "実写", sub: "Live Action" } 
  },
  { 
    id: 2, 
    text: "知名度は？", 
    icon: "💎", 
    L: { label: "有名・王道", sub: "Blockbuster" }, 
    R: { label: "隠れた名作", sub: "Hidden/Cult" } 
  },
  { 
    id: 3, 
    text: "今の気分は？", 
    icon: "🧠", 
    L: { label: "熱狂・興奮", sub: "High Energy" }, 
    R: { label: "没入・思索", sub: "Deep Dive" } 
  },
  { 
    id: 4, 
    text: "求める世界観は？", 
    icon: "🌐", 
    L: { label: "非日常・SF", sub: "Fiction" }, 
    R: { label: "現実・ドラマ", sub: "Realism" } 
  },
  { 
    id: 5, 
    text: "ストーリーの雰囲気は？", 
    icon: "⚖️", 
    L: { label: "明るい・希望", sub: "Bright" }, 
    R: { label: "シリアス・重厚", sub: "Dark" } 
  },
  { 
    id: 6, 
    text: "映像・演出の好みは？", 
    icon: "🎬", 
    L: { label: "派手・エンタメ", sub: "Pop / Action" }, 
    R: { label: "芸術・情緒", sub: "Artistic" } 
  }
];

// Reusable Image Categories (Unsplash) - Used as placeholders/fallbacks
const IMG = {
  ADVENTURE: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
  CYBERPUNK: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1600&auto=format&fit=crop",
  SUMMER: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop",
  DREAM: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
  DARK: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1600&auto=format&fit=crop",
  CHAOS: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=1600&auto=format&fit=crop",
  FIRE: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600&auto=format&fit=crop",
  CITY_NIGHT: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1600&auto=format&fit=crop",
  SPORTS: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1600&auto=format&fit=crop",
  ACTION: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1600&auto=format&fit=crop",
  WAR: "https://images.unsplash.com/photo-1612152605332-94bc53e5e337?q=80&w=1600&auto=format&fit=crop",
  RURAL: "https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=1600&auto=format&fit=crop",
  FANTASY: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
  RAIN: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1600&auto=format&fit=crop",
  CASTLE: "https://images.unsplash.com/photo-1524397057410-1e775ed476f3?q=80&w=1600&auto=format&fit=crop",
  SPACE: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
  NATURE: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1600&auto=format&fit=crop",
  CYBER: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
  RED: "https://images.unsplash.com/photo-1480044965905-83275966c9ed?q=80&w=1600&auto=format&fit=crop",
  ROOM: "https://images.unsplash.com/photo-1555596899-d6444781fa12?q=80&w=1600&auto=format&fit=crop",
  SAKURA: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1600&auto=format&fit=crop",
  SCHOOL: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1600&auto=format&fit=crop",
  BRIDGE: "https://images.unsplash.com/photo-1437422061949-f6efbde0a471?q=80&w=1600&auto=format&fit=crop",
  STAGE: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop",
  ACTRESS: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
  HERO: "https://images.unsplash.com/photo-1535446202401-778391090002?q=80&w=1600&auto=format&fit=crop",
  VR: "https://images.unsplash.com/photo-1624514134741-a3025dfc7296?q=80&w=1600&auto=format&fit=crop",
  PINK: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop",
  DESERT: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop",
  JOKER: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=1600&auto=format&fit=crop",
  DUNE: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?q=80&w=1600&auto=format&fit=crop",
  NOIR: "https://images.unsplash.com/photo-1565626424178-c699f660ba26?q=80&w=1600&auto=format&fit=crop",
  JET: "https://images.unsplash.com/photo-1559819614-81ea9e28de84?q=80&w=1600&auto=format&fit=crop",
  LA: "https://images.unsplash.com/photo-1533036814979-99a385202613?q=80&w=1600&auto=format&fit=crop",
  ROCK: "https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=1600&auto=format&fit=crop",
  MONEY: "https://images.unsplash.com/photo-1560252829-804f1a530379?q=80&w=1600&auto=format&fit=crop",
  DANCE: "https://images.unsplash.com/photo-1545959744-8d9982dc5645?q=80&w=1600&auto=format&fit=crop",
  FIGHT: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1600&auto=format&fit=crop",
  DRUM: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=1600&auto=format&fit=crop",
  STAIRS: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1600&auto=format&fit=crop",
  CLOCK: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=1600&auto=format&fit=crop",
  HOTEL: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1600&auto=format&fit=crop",
  WATER: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1600&auto=format&fit=crop",
  BLACKHOLE: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
  MONOLITH: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=1600&auto=format&fit=crop",
  INK: "https://images.unsplash.com/photo-1562916124-6752763266d6?q=80&w=1600&auto=format&fit=crop",
  DREAM_CITY: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  FRIENDS: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
  BENCH: "https://images.unsplash.com/photo-1504194916966-3d7580795c47?q=80&w=1600&auto=format&fit=crop",
  TOKYO: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop",
  PRISON: "https://images.unsplash.com/photo-1508493183577-94c6536ae529?q=80&w=1600&auto=format&fit=crop",
  MAFIA: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1600&auto=format&fit=crop",
  BASEMENT: "https://images.unsplash.com/photo-1555502251-874288b2eb60?q=80&w=1600&auto=format&fit=crop",
  CAR: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop",
  NEON_NOIR: "https://images.unsplash.com/photo-1585856407639-50970a00d41e?q=80&w=1600&auto=format&fit=crop",
  BUS: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop",
  CAVE: "https://images.unsplash.com/photo-1506158669146-619067262a00?q=80&w=1600&auto=format&fit=crop",
  CYBER_WIRE: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
  JUNGLE: "https://images.unsplash.com/photo-1564357718919-69f3d6c07a38?q=80&w=1600&auto=format&fit=crop",
  TV: "https://images.unsplash.com/photo-1593784991095-a20506948430?q=80&w=1600&auto=format&fit=crop"
};

export const getResult = (key: string): ResultItem => {
  // key is now 6 characters.
  // key[0]: Format
  // key[1]: Popularity (L=Major, R=Hidden/Cult)
  // key[2..5]: Mood, World, Tone, Style
  
  // Construct lookup key for the original category mapping by removing the popularity bit
  const lookupKey = key[0] + key.slice(2);
  
  const pool = RESULTS_DATA[lookupKey] || RESULTS_DATA["LLLLL"];
  
  // Split pool based on popularity choice
  // First 4 items = Major/Famous
  // Last 4 items = Minor/Cult/Niche
  const isMajor = key[1] === 'L';
  const start = isMajor ? 0 : 4;
  const end = isMajor ? 4 : 8;
  
  const subset = pool.slice(start, end);
  const finalPool = subset.length > 0 ? subset : pool;

  const randomIndex = Math.floor(Math.random() * finalPool.length);
  return finalPool[randomIndex];
};

// Helper to shuffle array
const shuffle = (array: any[]) => {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

// Get all unique movies for Random Mode
export const getAllMovies = (): ResultItem[] => {
  const allMovies = Object.values(RESULTS_DATA).flat();
  const uniqueMovies = Array.from(new Map(allMovies.map(item => [item.title, item])).values());
  return shuffle(uniqueMovies);
};

const i = (t: string, d: string, img: string, m: number): ResultItem => ({ title: t, desc: d, image: img, matchRate: m });

// ==================== DATA CONFIGURATION ====================
// STRUCTURE:
// [Major 1, Major 2, Major 3, Major 4, Minor 1, Minor 2, Minor 3, Minor 4]
//
// POPULARITY DEFINITION:
// Major = Blockbuster, Household Name, Top Box Office
// Minor = Cult Classic, Indie Hit, Critical Darling, Niche but High Quality

export const RESULTS_DATA: Record<string, ResultItem[]> = {
  // ==================== ANIME ====================
  
  // Anime | High Energy | Fiction | Bright | Pop
  "LLLLL": [
    // Major
    i("ONE PIECE FILM RED", "圧倒的な歌唱とライブ感。エンタメの極致。", IMG.ADVENTURE, 98),
    i("ザ・スーパーマリオブラザーズ・ムービー", "世界中が熱狂したゲームの世界への没入体験。", IMG.SUMMER, 97),
    i("ドラゴンボール超 ブロリー", "作画崩壊寸前の超絶バトル。理屈抜きの興奮。", IMG.FIRE, 99),
    i("名探偵コナン 黒鉄の魚影", "シリーズ最高傑作の呼び声高い、海中サスペンス。", IMG.ADVENTURE, 96),
    // Minor/Cult (High Energy/Pop but less 'National Event' level)
    i("REDLINE", "手描きアニメの極北。7年かけた狂気のレース。", IMG.CAR, 95),
    i("プロメア", "色彩の暴力と熱すぎる魂のぶつかり合い。", IMG.CYBERPUNK, 94),
    i("サマーウォーズ", "ネットと田舎の大家族が世界を救う夏の定番。", IMG.SUMMER, 97),
    i("グリッドマン ユニバース", "ヒーローと怪獣と青春。特撮愛に溢れた祝祭。", IMG.HERO, 93)
  ],
  // Anime | High Energy | Fiction | Bright | Art
  "LLLLR": [
    // Major
    i("スパイダーマン：スパイダーバース", "コミックがそのまま動く。映像革命的アート。", IMG.CYBER, 99),
    i("すずめの戸締まり", "日本列島を巡る旅。圧倒的映像美のロードムービー。", IMG.RURAL, 97),
    i("竜とそばかすの姫", "ネット空間の歌姫。映像美と音楽の融合。", IMG.SPACE, 96),
    i("天気の子", "美しい雨の描写と、世界を変える選択。", IMG.RAIN, 95),
    // Minor
    i("マインド・ゲーム", "湯浅政明初監督。脳内麻薬のような奔放な映像。", IMG.CHAOS, 94),
    i("海獣の子供", "圧倒的な水の描写と生命の神秘。視覚的トリップ体験。", IMG.WATER, 93),
    i("夜は短し歩けよ乙女", "京都を舞台にした極彩色の恋の逃走劇。", IMG.SAKURA, 94),
    i("ペンギン・ハイウェイ", "少年の研究と不思議なペンギン。爽やかなSF。", IMG.SUMMER, 92)
  ],
  // Anime | High Energy | Fiction | Dark | Pop
  "LLLRL": [
    // Major
    i("劇場版 呪術廻戦 0", "愛と呪いの物語。スタイリッシュでダークなアクション。", IMG.DARK, 99),
    i("鬼滅の刃 無限列車編", "心を燃やせ。日本中が涙した直球の感情ドラマ。", IMG.FIRE, 98),
    i("シン・エヴァンゲリオン劇場版", "伝説の完結。全てのアニメファンへの回答。", IMG.CYBER, 99),
    i("チェンソーマン (TV/Select)", "混沌と狂気。バイオレンスな魅力に溢れたダークヒーロー。", IMG.CHAOS, 96),
    // Minor
    i("GANTZ:O", "大阪での妖怪サバイバル。驚異的な3DCGアクション。", IMG.CITY_NIGHT, 94),
    i("ストレンヂア 無皇刃譚", "邦画アクション最高峰。骨太なチャンバラ活劇。", IMG.FIGHT, 95),
    i("獣兵衛忍風帖", "川尻善昭の傑作。エログロバイオレンスの忍者活劇。", IMG.NOIR, 93),
    i("虐殺器官", "言葉で世界を虐殺する。近未来の軍事サスペンス。", IMG.WAR, 92)
  ],
  // Anime | High Energy | Fiction | Dark | Art
  "LLLRR": [
    // Major
    i("AKIRA", "ネオ東京の崩壊と再生。世界を震撼させたSFアニメの金字塔。", IMG.CYBERPUNK, 99),
    i("GHOST IN THE SHELL / 攻殻機動隊", "ネットの海とゴースト。哲学的問いを投げかける映像詩。", IMG.CYBER, 98),
    i("新世紀エヴァンゲリオン劇場版 Air/まごころを、君に", "理解を超えた映像体験と精神世界へのダイブ。", IMG.RED, 97),
    i("風の谷のナウシカ", "腐海と共に生きる少女。文明と自然の対立。", IMG.NATURE, 99),
    // Minor
    i("天使のたまご", "押井守×天野喜孝。台詞極少の難解で美しい芸術作品。", IMG.NOIR, 95),
    i("MEMORIES", "大友克洋総指揮。３つの異なる悪夢と幻想のオムニバス。", IMG.SPACE, 94),
    i("パプリカ", "夢と現実が混ざり合うサイケデリックパレード。", IMG.DREAM, 96),
    i("人狼 JIN-ROH", "架空の昭和史。赤い眼鏡の特殊部隊と悲恋のハードボイルド。", IMG.NOIR, 93)
  ],
  // Anime | High Energy | Realism | Bright | Pop (Sports/Music/Comedy)
  "LLRLL": [
    // Major
    i("THE FIRST SLAM DUNK", "伝説の試合が蘇る。CGと手描きの融合によるリアリティ。", IMG.SPORTS, 99),
    i("ハイキュー!! ゴミ捨て場の決戦", "青春と汗とバレーボール。臨場感あふれる試合描写。", IMG.SPORTS, 98),
    i("映画 けいおん！", "ロンドンへの卒業旅行。ゆるふわな日常と部活の終わり。", IMG.FRIENDS, 95),
    i("バケモノの子", "渋谷の裏側の異世界。師弟の絆と成長のアクション。", IMG.FIGHT, 96),
    // Minor
    i("ブルーサーマル", "空を飛ぶ部活「航空部」。爽快な飛行体験。", IMG.NATURE, 93),
    i("音楽 (2020)", "不良たちが思いつきでバンドを組む。ロトスコープの衝動。", IMG.ROCK, 95),
    i("宇宙ショーへようこそ", "田舎の小学生が宇宙へ。圧倒的な書き込みと冒険。", IMG.SPACE, 94),
    i("アイの歌声を聴かせて", "AIと高校生のミュージカル青春群像劇。", IMG.SCHOOL, 94)
  ],
  // Anime | High Energy | Realism | Bright | Art
  "LLRLR": [
    // Major
    i("BLUE GIANT", "ジャズに全てを懸ける青春。音が聞こえてくるような熱量。", IMG.DRUM, 97),
    i("聲の形", "コミュニケーションの難しさと贖罪。痛みを伴う希望の物語。", IMG.BRIDGE, 96),
    i("犬王", "室町時代のロックオペラ。湯浅政明監督による狂騒のミュージカル。", IMG.STAGE, 95),
    i("きみと、波にのれたら", "サーファーと消防士。水と愛のファンタジーロマンス。", IMG.SUMMER, 94),
    // Minor
    i("リズと青い鳥", "繊細すぎる少女たちの心情。言葉にできない感情の映像化。", IMG.SCHOOL, 96),
    i("夜明け告げるルーのうた", "閉塞感ある漁港と人魚。疾走感あふれるアニメーション。", IMG.WATER, 93),
    i("サイダーのように言葉が湧き上がる", "俳句とレコード。ポップでカラフルなひと夏のボーイミーツガール。", IMG.SUMMER, 94),
    i("映画大好きポンポさん", "映画創りへの狂気と愛。クリエイター賛歌。", IMG.ACTRESS, 95)
  ],
  // Anime | High Energy | Realism | Dark | Pop (Crime/War/Suspense)
  "LLRRL": [
    // Major
    i("東京リベンジャーズ", "タイムリープ×不良。運命を変えるために戦うリベンジ。", IMG.FIGHT, 96),
    i("名探偵コナン ベイカー街の亡霊", "ロンドンの霧と人工知能。シリーズ屈指のダークな傑作。", IMG.NOIR, 97),
    i("BLACK LAGOON", "東南アジアのクライムアクション。硝煙と悪徳の香り。", IMG.NOIR, 95),
    i("ルパン三世 カリオストロの城", "宮崎駿初監督作。冒険活劇の金字塔だが実はハードボイルド。", IMG.CASTLE, 98),
    // Minor
    i("ジョーカー・ゲーム", "戦時下のスパイ・ミステリー。スタイリッシュな頭脳戦。", IMG.NOIR, 94),
    i("ゴールデンカムイ", "北海道での金塊争奪戦。変態とアクションとグルメの闇鍋。", IMG.RURAL, 96),
    i("スプリガン", "超古代文明の遺産を守る。90年代アクションの最高峰。", IMG.ACTION, 93),
    i("LUPIN THE IIIRD 次元大介の墓標", "ハードでアダルトなルパン。シビアなガンアクション。", IMG.NOIR, 95)
  ],
  // Anime | High Energy | Realism | Dark | Art
  "LLRRR": [
    // Major
    i("機動戦士ガンダム 閃光のハサウェイ", "大人のガンダム。リアリティのある市街戦と苦悩。", IMG.CYBER, 97),
    i("スカイ・クロラ The Sky Crawlers", "永遠の子供たちが戦う空。押井守監督の静謐な戦闘。", IMG.JET, 94),
    i("機動警察パトレイバー2 the Movie", "東京に「戦争」という状況を作り出す。重厚な政治劇。", IMG.CITY_NIGHT, 98),
    i("この世界の片隅に", "戦時下の日常。柔らかな絵柄の中に宿る強烈なリアリティ。", IMG.RURAL, 99),
    // Minor
    i("PERFECT BLUE", "アイドルの虚像と実像。現実と幻覚が入り混じるサイコホラー。", IMG.ROOM, 96),
    i("残響のテロル", "東京を爆破する少年たち。切ない音楽と破壊の美学。", IMG.CITY_NIGHT, 94),
    i("ハーモニー", "優しさに殺される世界。伊藤計劃原作の管理社会ディストピア。", IMG.ROOM, 93),
    i("オネアミスの翼 王立宇宙軍", "架空の世界の宇宙開発史。圧倒的なディテール。", IMG.SPACE, 95)
  ],

  // ==================== LIVE ACTION (HIGH ENERGY) ====================

  // Live Action | High Energy | Fiction | Bright | Pop
  "RLLLL": [
    // Major
    i("アベンジャーズ/エンドゲーム", "10年の集大成。ヒーロー映画の頂点。", IMG.HERO, 99),
    i("バック・トゥ・ザ・フューチャー", "タイムトラベルの傑作。伏線回収の教科書。", IMG.CLOCK, 99),
    i("ジュラシック・パーク", "恐竜の脅威と生命の驚異。映画マジックの原点。", IMG.NATURE, 98),
    i("ガーディアンズ・オブ・ギャラクシー", "宇宙の落ちこぼれと70年代ヒット曲。最高にハッピー。", IMG.SPACE, 97),
    // Minor (Cult/Niche Fun)
    i("ギャラクシー・クエスト", "SFドラマの出演者が本物の宇宙戦争へ。愛すべきパロディ。", IMG.SPACE, 95),
    i("スコット・ピルグリム VS. 邪悪な元カレ軍団", "ゲーム演出×青春ラブコメ。視覚的快感。", IMG.FIGHT, 94),
    i("アタック・ザ・ブロック", "団地の不良vsエイリアン。低予算だが熱いSF。", IMG.CITY_NIGHT, 93),
    i("ラブ＆モンスターズ", "終末世界で彼女に会いに行く。意外とハートフルな怪獣映画。", IMG.NATURE, 92)
  ],
  // Live Action | High Energy | Fiction | Bright | Art
  "RLLLR": [
    // Major
    i("アバター：ウェイ・オブ・ウォーター", "異次元の映像美。海の世界への完全な没入。", IMG.WATER, 98),
    i("ラ・ラ・ランド", "夢と魔法のミュージカル。鮮やかな色彩とほろ苦い結末。", IMG.LA, 96),
    i("バービー", "ピンクの世界と実存的危機。鮮烈なビジュアルと社会風刺。", IMG.PINK, 96),
    i("チャーリーとチョコレート工場", "ティム・バートンの極彩色で奇妙な世界。", IMG.FANTASY, 95),
    // Minor
    i("エブリシング・エブリウェア・オール・アット・ワンス", "マルチバースと家族愛。カオスで哲学的な映像体験。", IMG.CHAOS, 97),
    i("グランド・ブダペスト・ホテル", "ウェス・アンダーソンの美的センスが爆発したミステリー。", IMG.HOTEL, 96),
    i("アメリ", "パリの不思議な女の子。赤と緑の独特な色彩設計。", IMG.ROOM, 95),
    i("ライフ・オブ・パイ", "漂流した少年とトラ。圧倒的に美しい映像哲学。", IMG.WATER, 94)
  ],
  // Live Action | High Energy | Fiction | Dark | Pop
  "RLLRL": [
    // Major
    i("ダークナイト", "正義と悪の境界線。ジョーカーの圧倒的存在感。", IMG.JOKER, 99),
    i("マトリックス", "世界は仮想現実。映像革命を起こしたSFアクション。", IMG.CYBER, 98),
    i("マッドマックス 怒りのデス・ロード", "行って帰ってくるだけの傑作。純粋なアクションの結晶。", IMG.DESERT, 98),
    i("デューン 砂の惑星 PART2", "救世主の覚醒と戦争。圧倒的なスケールの映像体験。", IMG.DUNE, 97),
    // Minor
    i("ジャッジ・ドレッド (2012)", "高層ビルでの処刑アクション。ハードでスタイリッシュ。", IMG.CYBERPUNK, 94),
    i("アップグレード", "AIを埋め込まれた男の復讐。カメラワークが斬新。", IMG.CYBER, 95),
    i("第9地区", "エイリアン差別と変身。ドキュメンタリータッチのSF。", IMG.RURAL, 96),
    i("スターシップ・トゥルーパーズ", "昆虫型宇宙生物との戦争。痛烈なプロパガンダ風刺。", IMG.WAR, 93)
  ],
  // Live Action | High Energy | Fiction | Dark | Art
  "RLLRR": [
    // Major
    i("インセプション", "夢の中へ潜入。重力が歪む圧倒的な映像表現。", IMG.DREAM_CITY, 98),
    i("ブレードランナー 2049", "美しくも孤独な未来。圧倒的な撮影美とVFX。", IMG.NEON_NOIR, 97),
    i("2001年宇宙の旅", "人類の進化とモノリス。説明を排した究極の映像体験。", IMG.MONOLITH, 96),
    i("メッセージ", "異星人の言語解読。時間と愛の概念を覆すSF。", IMG.INK, 95),
    // Minor
    i("エクス・マキナ", "美しいAIとの密室劇。静かで冷徹なスリラー。", IMG.ROOM, 94),
    i("アンダー・ザ・スキン 種の捕食", "異星人の視点。スコットランドの寒々しい風景と不条理。", IMG.NOIR, 92),
    i("アナイアレイション -全滅領域-", "変容する生態系。美しくも恐ろしいSFホラー。", IMG.JUNGLE, 93),
    i("ロスト・チルドレン", "夢を盗む科学者。ジュネ＆キャロの奇妙な世界観。", IMG.DREAM, 94)
  ],
  // Live Action | High Energy | Realism | Bright | Pop
  "RLRLL": [
    // Major
    i("トップガン マーヴェリック", "本物の戦闘機アクション。王道の感動と興奮。", IMG.JET, 99),
    i("ミッション：インポッシブル/フォールアウト", "トム・クルーズの命がけスタント。最高峰のアクション。", IMG.ACTION, 98),
    i("オーシャンズ11", "豪華キャストの犯罪ドリームチーム。お洒落で痛快。", IMG.HOTEL, 96),
    i("RRR", "友情！熱血！ダンス！インド映画のパワー全開。", IMG.DANCE, 98),
    // Minor
    i("ベイビー・ドライバー", "音楽とカーチェイスの完璧な同期。リズムに乗る快感。", IMG.CAR, 96),
    i("キングスマン", "英国紳士のスパイアクション。過激でポップな暴力。", IMG.ACTION, 95),
    i("ナイスガイズ！", "70年代の凸凹探偵コンビ。小気味良い会話とアクション。", IMG.LA, 94),
    i("ブレット・トレイン", "伊坂幸太郎原作。新幹線での殺し屋バトロワ。", IMG.TOKYO, 93)
  ],
  // Live Action | High Energy | Realism | Bright | Art
  "RLRLR": [
    // Major
    i("ボヘミアン・ラプソディ", "クイーンの栄光と孤独。魂を揺さぶるライブシーン。", IMG.ROCK, 98),
    i("エルヴィス", "キング・オブ・ロックンロール。バズ・ラーマンの煌びやかな演出。", IMG.STAGE, 96),
    i("グレイテスト・ショーマン", "サーカスと差別。圧倒的な楽曲とパフォーマンス。", IMG.STAGE, 97),
    i("ロケットマン", "エルトン・ジョンの半生。ファンタジックなミュージカル。", IMG.STAGE, 95),
    // Minor
    i("シング・ストリート 未来へのうた", "80年代ダブリン。バンド結成と初恋の甘酸っぱさ。", IMG.ROCK, 96),
    i("はじまりのうた", "NYの街角録音。音楽がつなぐ再生の物語。", IMG.CITY_NIGHT, 95),
    i("チック、チック...ブーン！", "「レント」作者の苦悩。アンドリュー・ガーフィールドの熱演。", IMG.ROOM, 94),
    i("イエスタデイ", "ビートルズが存在しない世界。名曲へのラブレター。", IMG.ROCK, 93)
  ],
  // Live Action | High Energy | Realism | Dark | Pop
  "RLRRL": [
    // Major
    i("ジョーカー", "悪の誕生。社会から疎外された男の狂気。", IMG.STAIRS, 98),
    i("ファイト・クラブ", "消費社会へのアンチテーゼ。衝撃のラストと暴力。", IMG.FIGHT, 97),
    i("パルプ・フィクション", "タランティーノの傑作。時間軸が交錯する会話劇。", IMG.CAR, 98),
    i("ウルフ・オブ・ウォールストリート", "金と欲望の狂乱。ディカプリオの怪演。", IMG.MONEY, 96),
    // Minor
    i("ナイトクローラー", "報道の闇。スクープに取り憑かれた男の狂気。", IMG.CAR, 95),
    i("アンカット・ダイヤモンド", "借金と宝石。息つく暇もない焦燥感。", IMG.MONEY, 94),
    i("ドライヴ", "寡黙なドライバー。スタイリッシュな映像とバイオレンス。", IMG.CAR, 96),
    i("グッド・タイム", "最底辺の兄弟愛。ネオン輝くNYでの逃走劇。", IMG.NEON_NOIR, 93)
  ],
  // Live Action | High Energy | Realism | Dark | Art
  "RLRRR": [
    // Major
    i("オッペンハイマー", "原爆の父の栄光と没落。クリストファー・ノーランの心理劇。", IMG.FIRE, 98),
    i("1917 命をかけた伝令", "全編ワンカット風の戦争体験。没入感が凄まじい。", IMG.WAR, 97),
    i("プライベート・ライアン", "冒頭のオマハ・ビーチ上陸。戦争映画の金字塔。", IMG.WAR, 98),
    i("地獄の黙示録", "狂気のカーツ大佐。ベトナムの奥地への悪夢の旅。", IMG.JUNGLE, 96),
    // Minor
    i("セッション", "狂気のリズム。完璧を求める師弟の壮絶なドラムバトル。", IMG.DRUM, 97),
    i("ハート・ロッカー", "爆発物処理班の日常。戦争中毒という病。", IMG.DESERT, 95),
    i("ボーダーライン", "メキシコ麻薬戦争の闇。善悪の彼岸。", IMG.DESERT, 96),
    i("トゥモロー・ワールド", "子供が生まれなくなった未来。長回しの戦闘シーン。", IMG.WAR, 94)
  ],

  // ==================== LIVE ACTION (DEEP DIVE) ====================

  // Live Action | Deep Dive | Fiction | Bright | Pop
  "RRLLL": [
    // Major
    i("フォレスト・ガンプ", "激動のアメリカ史を駆け抜けた純粋な男の物語。", IMG.BENCH, 99),
    i("トゥルーマン・ショー", "人生が全てTV番組だった男。自由への脱出。", IMG.TV, 98),
    i("ビッグ・フィッシュ", "父の語るホラ話。ファンタジーと父子の和解。", IMG.FANTASY, 97),
    i("アバウト・タイム", "タイムトラベルと日常。今日という日を大切にする物語。", IMG.CLOCK, 98),
    // Minor
    i("ミッドナイト・イン・パリ", "憧れの20年代パリへ。芸術家たちとの夢の邂逅。", IMG.CITY_NIGHT, 96),
    i("LIFE! / ライフ", "地味な男の壮大な旅。一歩踏み出す勇気。", IMG.NATURE, 95),
    i("パディントン2", "世界一礼儀正しいクマ。刑務所すら変える優しさ。", IMG.PRISON, 97),
    i("もしも昨日が選べたら", "人生を早送りできるリモコン。家族の大切さ。", IMG.CLOCK, 93)
  ],
  // Live Action | Deep Dive | Fiction | Bright | Art
  "RRLLR": [
    // Major
    i("シェイプ・オブ・ウォーター", "半魚人と清掃員の愛。ダークで美しい大人の寓話。", IMG.WATER, 97),
    i("エターナル・サンシャイン", "記憶除去手術。忘れたくない恋の記憶。", IMG.DREAM, 98),
    i("シザーハンズ", "ハサミの手を持つ人造人間。ティム・バートンの切ないお伽話。", IMG.CASTLE, 96),
    i("her/世界でひとつの彼女", "AIとの恋。近未来の孤独と愛の形。", IMG.ROOM, 95),
    // Minor
    i("ムーンライズ・キングダム", "少年少女の駆け落ち。ウェス・アンダーソンの箱庭。", IMG.NATURE, 95),
    i("うたかたの日々", "肺に睡蓮が咲く病気。ミシェル・ゴンドリーの映像魔術。", IMG.ROOM, 93),
    i("ロブスター", "独身者は動物に変えられる。シュールなディストピア。", IMG.HOTEL, 92),
    i("ビッグ・アイズ", "大きな目の少女の絵。ゴーストペインターの実話。", IMG.ROOM, 93)
  ],
  // Live Action | Deep Dive | Fiction | Dark | Pop
  "RRLRL": [
    // Major
    i("シックス・センス", "死者が見える少年。映画史に残るどんでん返し。", IMG.DARK, 98),
    i("クワイエット・プレイス", "音を立てたら即死。沈黙のサバイバル。", IMG.RURAL, 96),
    i("アイ・アム・レジェンド", "人類絶滅後のNY。孤独な男の戦い。", IMG.CITY_NIGHT, 95),
    i("セブン", "七つの大罪になぞらえた殺人。雨と絶望のサスペンス。", IMG.NOIR, 97),
    // Minor
    i("ミスト", "霧の中の怪物。後味の悪さで有名な衝撃のラスト。", IMG.NATURE, 94),
    i("10 クローバーフィールド・レーン", "シェルターでの密室劇。疑心暗鬼のスリラー。", IMG.BASEMENT, 93),
    i("ザ・メニュー", "孤島の高級レストラン。狂気のフルコース。", IMG.HOTEL, 92),
    i("バタフライ・エフェクト", "過去改変の代償。切ないラストが人気。", IMG.CLOCK, 95)
  ],
  // Live Action | Deep Dive | Fiction | Dark | Art
  "RRLRR": [
    // Major
    i("ブラック・スワン", "バレエの狂気。完璧を追い求めた果ての破滅。", IMG.STAGE, 96),
    i("パラサイト 半地下の家族", "格差社会の喜劇と悲劇。予測不能な展開。", IMG.BASEMENT, 99),
    i("時計じかけのオレンジ", "超暴力とベートーヴェン。キューブリックの美的悪夢。", IMG.ROOM, 95),
    i("ミッドサマー", "白夜のカルト村。明るいのに恐ろしい祝祭。", IMG.RURAL, 96),
    // Minor
    i("ドニー・ダーコ", "ウサギの幻覚と世界の終わり。カルト青春映画。", IMG.DARK, 94),
    i("ライトハウス", "孤島の灯台守。モノクロ映像と狂気。", IMG.NOIR, 93),
    i("ウィッチ", "17世紀の魔女狩り。不穏な空気と家族の崩壊。", IMG.RURAL, 92),
    i("マルホランド・ドライブ", "夢と現実の崩壊。デヴィッド・リンチの難解な迷宮。", IMG.LA, 94)
  ],
  // Live Action | Deep Dive | Realism | Bright | Pop
  "RRRLL": [
    // Major
    i("最強のふたり", "富豪とスラムの青年。正反対の二人の友情。", IMG.FRIENDS, 99),
    i("グリーンブック", "黒人ピアニストとイタリア系運転手。差別の南才への旅。", IMG.CAR, 98),
    i("グッド・ウィル・ハンティング", "天才青年と心理学者。旅立ちの物語。", IMG.BENCH, 98),
    i("ニュー・シネマ・パラダイス", "映画館と映写技師。映画愛に溢れたラスト。", IMG.ROOM, 99),
    // Minor
    i("コーダ あいのうた", "ろうあの家族と歌う少女。温かい涙と感動。", IMG.STAGE, 96),
    i("ワンダー 君は太陽", "顔に障害を持つ少年。家族と学校の優しさ。", IMG.SCHOOL, 97),
    i("マイ・インターン", "70歳のインターンと女社長。世代を超えた友情。", IMG.ROOM, 95),
    i("リトル・ミス・サンシャイン", "崩壊寸前の家族のロードムービー。負け犬たちの輝き。", IMG.CAR, 96)
  ],
  // Live Action | Deep Dive | Realism | Bright | Art
  "RRRLR": [
    // Major
    i("君の名前で僕を呼んで", "ひと夏の恋。イタリアの美しい風景と初恋の痛み。", IMG.SUMMER, 96),
    i("ロスト・イン・トランスレーション", "東京での孤独と出会い。ソフィア・コッポラの空気感。", IMG.TOKYO, 95),
    i("PERFECT DAYS", "公衆トイレ清掃員の日常。役所広司の圧倒的存在感。", IMG.TOKYO, 97),
    i("ノマドランド", "車上生活者の旅。ドキュメンタリーのようなリアリティ。", IMG.DESERT, 96),
    // Minor
    i("パターソン", "バス運転手の詩的な日常。何気ない毎日の美しさ。", IMG.BUS, 95),
    i("aftersun/アフターサン", "父と娘の最後のバカンス。記憶の断片。", IMG.SUMMER, 94),
    i("カモン カモン", "モノクロのNY。ラジオジャーナリストと甥っ子の旅。", IMG.CITY_NIGHT, 93),
    i("ミナリ", "アメリカに移住した韓国系家族。力強く生きる祖母。", IMG.RURAL, 92)
  ],
  // Live Action | Deep Dive | Realism | Dark | Pop
  "RRRRL": [
    // Major
    i("ショーシャンクの空に", "不条理な監獄と希望。友情と奇跡の物語。", IMG.PRISON, 99),
    i("シンドラーのリスト", "ホロコーストと一人の男。スピルバーグの渾身作。", IMG.NOIR, 99),
    i("ソーシャル・ネットワーク", "Facebook創設の裏側。早口な会話劇と孤独。", IMG.ROOM, 96),
    i("イミテーション・ゲーム", "エニグマ解読。天才数学者の栄光と悲劇。", IMG.CYBER, 97),
    // Minor
    i("スポットライト 世紀のスクープ", "カトリック教会のスキャンダルを追う記者たち。", IMG.ROOM, 96),
    i("マネーボール", "統計学で野球を変える。逆転のスポーツビジネス。", IMG.SPORTS, 95),
    i("プリズナーズ", "娘を誘拐された父の暴走。極限状態の倫理。", IMG.PRISON, 94),
    i("ゾディアック", "迷宮入りした連続殺人。未解決事件の不気味さ。", IMG.NOIR, 95)
  ],
  // Live Action | Deep Dive | Realism | Dark | Art
  "RRRRR": [
    // Major
    i("ゴッドファーザー", "マフィアのファミリー。映画史に輝く叙事詩。", IMG.MAFIA, 99),
    i("タクシードライバー", "孤独な男の暴走。スコセッシ×デ・ニーロ。", IMG.NOIR, 97),
    i("ノーカントリー", "純粋な悪との遭遇。コーエン兄弟の乾いた暴力。", IMG.DESERT, 96),
    i("ゼア・ウィル・ビー・ブラッド", "石油王の欲望と孤独。圧倒的な演技合戦。", IMG.DESERT, 95),
    // Minor
    i("ROMA/ローマ", "70年代メキシコの家政婦。キュアロンの自伝的傑作。", IMG.RURAL, 96),
    i("ザ・マスター", "新興宗教の教祖と元兵士。魂の彷徨。", IMG.WATER, 94),
    i("燃ゆる女の肖像", "18世紀の女性画家とモデル。静謐で激しい愛。", IMG.ROOM, 95),
    i("A GHOST STORY ア・ゴースト・ストーリー", "死んで幽霊になった男。永遠の時間を漂う。", IMG.ROOM, 93)
  ],
};