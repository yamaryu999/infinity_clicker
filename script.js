// ゲーム状態
let gameState = {
    points: 0,
    autoClickerLevel: 0,
    clickMultiplierLevel: 1,
    clickMultiplier: 1, // 追加
    autoClickerSpeedLevel: 1,
    criticalClickLevel: 0,
    criticalClickChance: 0, // 追加
    totalClicks: 0,
    totalPoints: 0,
    achievements: [],
    clickEffect: 'default', // 追加
    // ソーシャル機能データ
    playerId: generatePlayerId(),
    playerName: generatePlayerName(),
    friends: [],
    receivedGifts: [],
    sentGifts: [],
    socialStats: {
        giftsReceived: 0,
        giftsSent: 0,
        friendsCount: 0,
        lastActive: Date.now()
    },
    // ミニゲームデータ
    minigames: {
        slotMachine: {
            lastPlayed: 0,
            totalWins: 0,
            totalSpent: 0,
            jackpotWins: 0
        },
        lottery: {
            lastPlayed: 0,
            totalWins: 0,
            totalSpent: 0,
            biggestWin: 0
        },
        quiz: {
            lastPlayed: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            streak: 0,
            bestStreak: 0
        },
        puzzle: {
            lastPlayed: 0,
            totalCompleted: 0,
            totalSpent: 0,
            bestTime: 0
        }
    }
};

// アップグレードコスト計算
const upgradeCosts = {
    autoClicker: (level) => Math.floor(10 * Math.pow(1.15, level)),
    clickMultiplier: (level) => Math.floor(50 * Math.pow(1.2, level)),
    autoClickerSpeed: (level) => Math.floor(100 * Math.pow(1.25, level)),
    criticalClick: (level) => Math.floor(200 * Math.pow(1.3, level))
};

// 実績定義
const achievements = [
    { id: 'first_click', name: '初回クリック', description: '初めてクリックしました', requirement: 1, type: 'clicks' },
    { id: 'hundred_clicks', name: 'クリックマスター', description: '100回クリックしました', requirement: 100, type: 'clicks' },
    { id: 'thousand_clicks', name: 'クリック伝説', description: '1000回クリックしました', requirement: 1000, type: 'clicks' },
    { id: 'first_point', name: '最初の一歩', description: '最初のポイントを獲得しました', requirement: 1, type: 'points' },
    { id: 'hundred_points', name: 'ポイント収集家', description: '100ポイントを獲得しました', requirement: 100, type: 'points' },
    { id: 'thousand_points', name: 'ポイント富豪', description: '1000ポイントを獲得しました', requirement: 1000, type: 'points' },
    { id: 'first_upgrade', name: 'アップグレード開始', description: '最初のアップグレードを購入しました', requirement: 1, type: 'upgrades' },
    { id: 'auto_clicker', name: '自動化の始まり', description: '自動クリッカーを購入しました', requirement: 1, type: 'autoClicker' },
    { id: 'critical_hit', name: 'クリティカルヒット', description: '初めてクリティカルヒットを出しました', requirement: 1, type: 'criticalHits' }
];

// DOM要素
const pointsElement = document.getElementById('points');
const pointsPerSecondElement = document.getElementById('pointsPerSecond');
const clickMultiplierElement = document.getElementById('clickMultiplier');
const clickButton = document.getElementById('clickButton');
const clickEffect = document.getElementById('clickEffect');
const notification = document.getElementById('notification');
const mainCharacter = document.getElementById('mainCharacter');
const achievementsElement = document.getElementById('achievements');

// アップグレード要素
const autoClickerLevelElement = document.getElementById('autoClickerLevel');
const autoClickerCostElement = document.getElementById('autoClickerCost');
const clickMultiplierLevelElement = document.getElementById('clickMultiplierLevel');
const clickMultiplierCostElement = document.getElementById('clickMultiplierCost');
const autoClickerSpeedLevelElement = document.getElementById('autoClickerSpeedLevel');
const autoClickerSpeedCostElement = document.getElementById('autoClickerSpeedCost');
const criticalClickLevelElement = document.getElementById('criticalClickLevel');
const criticalClickCostElement = document.getElementById('criticalClickCost');

// 装飾システム要素
const decorationBtn = document.getElementById('decorationBtn');
const decorationPanel = document.getElementById('decorationPanel');
const closeDecorationBtn = document.getElementById('closeDecorationBtn');
const hatsGrid = document.getElementById('hatGrid');
const ribbonsGrid = document.getElementById('ribbonGrid');
const glassesGrid = document.getElementById('glassesGrid');
const backgroundsGrid = document.getElementById('backgroundGrid');
const effectsGrid = document.getElementById('effectGrid');

// モバイル検出
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ソーシャル機能ヘルパー関数
function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}

function generatePlayerName() {
    const names = ['ねこマスター', 'クリッカー王', 'ポイントハンター', '無限プレイヤー', 'ゲームマスター', 'クリック伝説', 'ポイント富豪', '自動化マスター', 'クリティカル王', '実績コレクター'];
    return names[Math.floor(Math.random() * names.length)];
}

// ソーシャル機能のモックデータ（実際のアプリではサーバーから取得）
const mockSocialData = {
    globalRanking: [
        { id: 'player_1', name: 'ねこマスター', score: 15000, rank: 1 },
        { id: 'player_2', name: 'クリッカー王', score: 12000, rank: 2 },
        { id: 'player_3', name: 'ポイントハンター', score: 10000, rank: 3 },
        { id: 'player_4', name: '無限プレイヤー', score: 8000, rank: 4 },
        { id: 'player_5', name: 'ゲームマスター', score: 6000, rank: 5 }
    ],
    mockFriends: [
        { id: 'friend_1', name: 'フレンド1', status: 'online', lastActive: Date.now() - 300000 },
        { id: 'friend_2', name: 'フレンド2', status: 'offline', lastActive: Date.now() - 3600000 },
        { id: 'friend_3', name: 'フレンド3', status: 'online', lastActive: Date.now() - 60000 }
    ]
};

// アップグレードコスト計算関数
function calculateUpgradeCost(level, baseCost) {
    // 安全性チェック
    if (typeof level !== 'number' || typeof baseCost !== 'number' || isNaN(level) || isNaN(baseCost)) {
        return 0;
    }
    
    // 各アップグレードの成長率を調整
    let growthRate = 1.15; // デフォルト
    
    // アップグレードの種類に応じて成長率を調整
    if (baseCost === 10) { // 自動クリッカー
        growthRate = 1.15;
    } else if (baseCost === 50) { // クリック倍率
        growthRate = 1.2;
    } else if (baseCost === 100) { // 自動クリッカー速度
        growthRate = 1.25;
    } else if (baseCost === 200) { // クリティカルクリック
        growthRate = 1.3;
    }
    
    return Math.floor(baseCost * Math.pow(growthRate, level));
}

// キャラクター管理
const CharacterManager = {
    // 猫の表情を変更
    changeExpression: function(expression) {
        const mouth = mainCharacter.querySelector('.cat-mouth');
        const eyes = mainCharacter.querySelectorAll('.cat-eye');
        const ears = mainCharacter.querySelectorAll('.cat-ear');
        const cheeks = mainCharacter.querySelectorAll('.cat-cheek');
        
        switch(expression) {
            case 'happy':
                mouth.setAttribute('d', 'M100 85 Q95 90 100 95 Q105 90 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '8');
                    eye.style.fill = '#87CEEB';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(0deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '0.6');
                break;
            case 'excited':
                mouth.setAttribute('d', 'M100 85 Q95 88 100 92 Q105 88 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '6');
                    eye.style.fill = '#FFD700';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(5deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '1');
                break;
            case 'surprised':
                mouth.setAttribute('d', 'M100 85 Q95 82 100 85 Q105 82 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '10');
                    eye.style.fill = '#FF6B6B';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(10deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '0.9');
                break;
            case 'cool':
                mouth.setAttribute('d', 'M100 85 Q95 87 100 89 Q105 87 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '7');
                    eye.style.fill = '#9370DB';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(-3deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '0.6');
                break;
            case 'sleepy':
                mouth.setAttribute('d', 'M100 85 Q95 86 100 87 Q105 86 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '4');
                    eye.style.fill = '#A9A9A9';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(-5deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '0.5');
                break;
            case 'hungry':
                mouth.setAttribute('d', 'M100 85 Q95 88 100 91 Q105 88 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '9');
                    eye.style.fill = '#FFA500';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(3deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '0.8');
                break;
            case 'angry':
                mouth.setAttribute('d', 'M100 85 Q95 83 100 85 Q105 83 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '5');
                    eye.style.fill = '#FF0000';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(-8deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '0.4');
                break;
            case 'love':
                mouth.setAttribute('d', 'M100 85 Q95 90 100 95 Q105 90 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '8');
                    eye.style.fill = '#FF69B4';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(2deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '1');
                break;
            default:
                mouth.setAttribute('d', 'M100 85 Q95 90 100 95 Q105 90 100 85');
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '8');
                    eye.style.fill = '#87CEEB';
                });
                ears.forEach(ear => ear.style.transform = 'rotate(0deg)');
                cheeks.forEach(cheek => cheek.style.opacity = '0.6');
        }
    },

    // キャラクターをクリックアニメーション
    clickAnimation: function() {
        mainCharacter.classList.add('clicked');
        this.changeExpression('excited');
        
        // 尻尾を振る
        const tail = mainCharacter.querySelector('.cat-tail');
        tail.style.animation = 'tailWag 0.5s ease-in-out';
        
        // キラキラエフェクト
        this.createSparkleEffect();
        
        // ランダムな追加アニメーション
        this.randomSpecialAnimation();
        
        setTimeout(() => {
            mainCharacter.classList.remove('clicked');
            this.changeExpression('happy');
            tail.style.animation = 'tailWag 2s ease-in-out infinite';
        }, 300);
    },

    // レベルアップアニメーション
    levelUpAnimation: function() {
        mainCharacter.classList.add('levelup');
        this.changeExpression('love');
        
        // 特別なパーティクルエフェクト
        this.createParticleBurst(50, 50, 15);
        
        // キラキラエフェクト強化
        this.createSparkleEffect(true);
        
        // 特別なアニメーション
        this.specialLevelUpAnimation();
        
        setTimeout(() => {
            mainCharacter.classList.remove('levelup');
            this.changeExpression('happy');
        }, 1000);
    },

    // ランダムな特別アニメーション
    randomSpecialAnimation: function() {
        const animations = [
            'stretching', 'bouncing', 'spinning', 'shaking', 
            'wiggling', 'pulsing', 'rocking', 'dancing', 
            'swaying', 'hopping', 'twitching', 'glowing'
        ];
        
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        
        // 30%の確率で特別アニメーションを実行
        if (Math.random() < 0.3) {
            this.playSpecialAnimation(randomAnimation);
        }
    },

    // 特別アニメーションを再生
    playSpecialAnimation: function(animationType) {
        // 既存のアニメーションクラスをクリア
        mainCharacter.className = 'character';
        
        // 新しいアニメーションクラスを追加
        mainCharacter.classList.add(animationType);
        
        // アニメーション終了後に通常の浮遊アニメーションに戻す
        setTimeout(() => {
            mainCharacter.className = 'character';
            mainCharacter.style.animation = 'characterFloat 3s ease-in-out infinite';
        }, this.getAnimationDuration(animationType));
    },

    // アニメーションの持続時間を取得
    getAnimationDuration: function(animationType) {
        const durations = {
            'stretching': 2000,
            'bouncing': 1500,
            'spinning': 1000,
            'shaking': 500,
            'wiggling': 1000,
            'pulsing': 2000,
            'rocking': 3000,
            'dancing': 2000,
            'swaying': 4000,
            'hopping': 1000,
            'twitching': 300,
            'glowing': 2000
        };
        return durations[animationType] || 1000;
    },

    // レベルアップ時の特別アニメーション
    specialLevelUpAnimation: function() {
        // 複数のアニメーションを順番に再生
        const animations = ['spinning', 'glowing', 'dancing'];
        let currentIndex = 0;
        
        const playNextAnimation = () => {
            if (currentIndex < animations.length) {
                this.playSpecialAnimation(animations[currentIndex]);
                currentIndex++;
                setTimeout(playNextAnimation, 500);
            }
        };
        
        playNextAnimation();
    },

    // キラキラエフェクト
    createSparkleEffect: function(intense = false) {
        const sparkles = mainCharacter.querySelectorAll('.sparkle');
        sparkles.forEach((sparkle, index) => {
            sparkle.style.animation = intense ? 'sparkleTwinkle 0.5s ease-in-out' : 'sparkleTwinkle 1s ease-in-out';
            setTimeout(() => {
                sparkle.style.animation = 'sparkleTwinkle 3s ease-in-out infinite';
            }, intense ? 500 : 1000);
        });
    },

    // ランダムな表情変化
    randomExpression: function() {
        const expressions = ['happy', 'excited', 'surprised', 'cool', 'hungry', 'love'];
        const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
        this.changeExpression(randomExpression);
        
        // 表情変化時に特別アニメーションも追加
        if (Math.random() < 0.4) {
            this.randomSpecialAnimation();
        }
        
        setTimeout(() => {
            this.changeExpression('happy');
        }, 2000);
    },

    // パーティクルエフェクトを生成
    createParticle: function(x, y, emoji) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emoji;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const characterContainer = document.querySelector('.character-container');
        characterContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    },

    // 複数パーティクルを生成
    createParticleBurst: function(x, y, count = 5) {
        const emojis = ['⭐', '💎', '🚀', '🌟', '🎯', '🎉', '✨', '🔥', '🌸', '🍀', '🌈', '🎪'];
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                const randomX = x + (Math.random() - 0.5) * 100;
                const randomY = y + (Math.random() - 0.5) * 100;
                this.createParticle(randomX, randomY, randomEmoji);
            }, i * 100);
        }
    },

    // 浮遊キャラクターをランダムに変更
    randomizeFloatingChars: function() {
        const floatingChars = document.querySelectorAll('.floating-char');
        const animalEmojis = ['🦋', '🐝', '🦜', '🐿️', '🦊', '🐰', '🦝', '🦘', '🦒', '🦛', '🦘', '🦡', '🦃', '🦚', '🦜', '🦢'];
        
        floatingChars.forEach(char => {
            const randomEmoji = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
            char.textContent = randomEmoji;
            char.setAttribute('data-char', randomEmoji);
        });
    },

    // 環境エフェクトの更新
    updateEnvironment: function() {
        const grass = document.querySelectorAll('.grass');
        const clouds = document.querySelectorAll('.cloud');
        const flowers = document.querySelectorAll('.flower');
        
        // 草の色をランダムに変更
        grass.forEach(g => {
            const grassTypes = ['🌱', '🌿', '🍃', '🌾', '🌺', '🌸'];
            if (Math.random() < 0.1) { // 10%の確率で変更
                g.textContent = grassTypes[Math.floor(Math.random() * grassTypes.length)];
            }
        });
        
        // 雲の形をランダムに変更
        clouds.forEach(c => {
            const cloudTypes = ['☁️', '⛅', '🌤️', '🌥️'];
            if (Math.random() < 0.05) { // 5%の確率で変更
                c.textContent = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
            }
        });
        
        // 花の色をランダムに変更
        flowers.forEach(f => {
            const flowerTypes = ['🌸', '🌺', '🌼', '🌻', '🌹', '🌷'];
            if (Math.random() < 0.15) { // 15%の確率で変更
                f.textContent = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
            }
        });
    }
};

// 装飾システム
const DecorationSystem = {
    // 装飾データ
    decorations: {
        hats: [
            { id: 'none', name: 'なし', icon: '❌', unlocked: true },
            { id: 'crown', name: '王冠', icon: '👑', unlocked: true },
            { id: 'hat', name: '帽子', icon: '🎩', unlocked: true },
            { id: 'party', name: 'パーティ帽', icon: '🎉', unlocked: true },
            { id: 'santa', name: 'サンタ帽', icon: '🎅', unlocked: false, requirement: 1000 },
            { id: 'wizard', name: '魔法使いの帽子', icon: '🧙‍♂️', unlocked: false, requirement: 5000 },
            { id: 'cowboy', name: 'カウボーイハット', icon: '🤠', unlocked: false, requirement: 10000 },
            { id: 'pirate', name: '海賊帽', icon: '🏴‍☠️', unlocked: false, requirement: 25000 }
        ],
        ribbons: [
            { id: 'none', name: 'なし', icon: '❌', unlocked: true },
            { id: 'pink', name: 'ピンクリボン', icon: '🎀', unlocked: true },
            { id: 'blue', name: 'ブルーリボン', icon: '💙', unlocked: true },
            { id: 'rainbow', name: 'レインボーリボン', icon: '🌈', unlocked: true },
            { id: 'gold', name: 'ゴールドリボン', icon: '💛', unlocked: false, requirement: 2000 },
            { id: 'diamond', name: 'ダイヤリボン', icon: '💎', unlocked: false, requirement: 7500 },
            { id: 'star', name: 'スターリボン', icon: '⭐', unlocked: false, requirement: 15000 },
            { id: 'crown', name: 'クラウンリボン', icon: '👑', unlocked: false, requirement: 30000 }
        ],
        glasses: [
            { id: 'none', name: 'なし', icon: '❌', unlocked: true },
            { id: 'sunglasses', name: 'サングラス', icon: '🕶️', unlocked: true },
            { id: 'reading', name: '老眼鏡', icon: '👓', unlocked: true },
            { id: 'cool', name: 'クールメガネ', icon: '😎', unlocked: true },
            { id: 'nerd', name: 'オタクメガネ', icon: '🤓', unlocked: false, requirement: 1500 },
            { id: 'monocle', name: 'モノクル', icon: '🧐', unlocked: false, requirement: 6000 },
            { id: 'vr', name: 'VRゴーグル', icon: '🥽', unlocked: false, requirement: 12000 },
            { id: 'laser', name: 'レーザーアイ', icon: '👁️', unlocked: false, requirement: 25000 }
        ],
        backgrounds: [
            { id: 'default', name: 'デフォルト', icon: '🏠', unlocked: true },
            { id: 'garden', name: 'ガーデン', icon: '🌸', unlocked: true },
            { id: 'beach', name: 'ビーチ', icon: '🏖️', unlocked: true },
            { id: 'forest', name: '森', icon: '🌲', unlocked: true },
            { id: 'space', name: '宇宙', icon: '🚀', unlocked: false, requirement: 3000 },
            { id: 'underwater', name: '海中', icon: '🐠', unlocked: false, requirement: 8000 },
            { id: 'castle', name: 'お城', icon: '🏰', unlocked: false, requirement: 18000 },
            { id: 'volcano', name: '火山', icon: '🌋', unlocked: false, requirement: 35000 }
        ],
        effects: [
            { id: 'default', name: 'デフォルト', icon: '⭐', unlocked: true },
            { id: 'sparkle', name: 'キラキラ', icon: '✨', unlocked: true },
            { id: 'firework', name: '花火', icon: '🎆', unlocked: true },
            { id: 'rainbow', name: 'レインボー', icon: '🌈', unlocked: true },
            { id: 'magic', name: '魔法', icon: '🔮', unlocked: false, requirement: 2500 },
            { id: 'laser', name: 'レーザー', icon: '⚡', unlocked: false, requirement: 7000 },
            { id: 'galaxy', name: '銀河', icon: '🌌', unlocked: false, requirement: 15000 },
            { id: 'dragon', name: 'ドラゴン', icon: '🐉', unlocked: false, requirement: 30000 }
        ]
    },

    // 現在の装飾
    currentDecorations: {
        hat: 'none',
        ribbon: 'none',
        glasses: 'none',
        background: 'default',
        effect: 'default'
    },

    // 初期化
    init: function() {
        this.loadDecorations();
        this.renderDecorationItems();
        this.setupEventListeners();
        this.applyDecorations();
    },

    // 装飾を読み込み
    loadDecorations: function() {
        const saved = localStorage.getItem('decorations');
        if (saved) {
            this.currentDecorations = JSON.parse(saved);
        }
    },

    // 装飾を保存
    saveDecorations: function() {
        localStorage.setItem('decorations', JSON.stringify(this.currentDecorations));
    },

    // 装飾アイテムをレンダリング
    renderDecorationItems: function() {
        Object.keys(this.decorations).forEach(category => {
            const grid = document.getElementById(category + 'Grid');
            if (!grid) {
                console.warn(`Decoration grid not found: ${category}Grid`);
                return;
            }

            grid.innerHTML = '';
            this.decorations[category].forEach(item => {
                const isUnlocked = this.isItemUnlocked(item);
                const isSelected = this.currentDecorations[category] === item.id;
                
                const itemElement = document.createElement('div');
                itemElement.className = `decoration-item ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
                itemElement.setAttribute('data-type', category);
                itemElement.setAttribute('data-item', item.id);
                
                itemElement.innerHTML = `
                    <span class="decoration-icon">${item.icon}</span>
                    <span class="decoration-name">${item.name}</span>
                `;
                
                if (isUnlocked) {
                    itemElement.addEventListener('click', () => this.selectDecoration(category, item.id));
                }
                
                grid.appendChild(itemElement);
            });
        });
    },

    // アイテムがアンロックされているかチェック
    isItemUnlocked: function(item) {
        if (item.unlocked) return true;
        if (!item.requirement) return false;
        return gameState.points >= item.requirement;
    },

    // 装飾を選択
    selectDecoration: function(category, itemId) {
        this.currentDecorations[category] = itemId;
        this.saveDecorations();
        this.renderDecorationItems();
        this.applyDecorations();
        
        // 通知
        const item = this.decorations[category].find(i => i.id === itemId);
        showNotification(`🎨 ${item.name}を装備しました！`);
    },

    // 装飾を適用
    applyDecorations: function() {
        // 帽子の適用
        this.applyHat();
        
        // リボンの適用
        this.applyRibbon();
        
        // メガネの適用
        this.applyGlasses();
        
        // 背景の適用
        this.applyBackground();
        
        // エフェクトの適用
        this.applyEffect();
    },

    // 帽子を適用
    applyHat: function() {
        const hatElement = document.querySelector('.cat-hat');
        if (hatElement) hatElement.remove();
        
        const hat = this.decorations.hats.find(h => h.id === this.currentDecorations.hat);
        if (hat && hat.id !== 'none') {
            const character = document.getElementById('mainCharacter');
            if (!character) return;
            
            const hatElement = document.createElement('div');
            hatElement.className = 'cat-hat';
            hatElement.textContent = hat.icon;
            hatElement.style.cssText = `
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 2rem;
                z-index: 10;
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
            `;
            
            character.appendChild(hatElement);
        }
    },

    // リボンを適用
    applyRibbon: function() {
        const ribbonElement = document.querySelector('.cat-ribbon');
        if (ribbonElement) ribbonElement.remove();
        
        const ribbon = this.decorations.ribbons.find(r => r.id === this.currentDecorations.ribbon);
        if (ribbon && ribbon.id !== 'none') {
            const character = document.getElementById('mainCharacter');
            if (!character) return;
            
            const ribbonElement = document.createElement('div');
            ribbonElement.className = 'cat-ribbon';
            ribbonElement.textContent = ribbon.icon;
            ribbonElement.style.cssText = `
                position: absolute;
                top: 20px;
                right: -5px;
                font-size: 1.5rem;
                z-index: 10;
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
            `;
            
            character.appendChild(ribbonElement);
        }
    },

    // メガネを適用
    applyGlasses: function() {
        const glassesElement = document.querySelector('.cat-glasses');
        if (glassesElement) glassesElement.remove();
        
        const glasses = this.decorations.glasses.find(g => g.id === this.currentDecorations.glasses);
        if (glasses && glasses.id !== 'none') {
            const character = document.getElementById('mainCharacter');
            if (!character) return;
            
            const glassesElement = document.createElement('div');
            glassesElement.className = 'cat-glasses';
            glassesElement.textContent = glasses.icon;
            glassesElement.style.cssText = `
                position: absolute;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 1.8rem;
                z-index: 10;
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
            `;
            
            character.appendChild(glassesElement);
        }
    },

    // 背景を適用
    applyBackground: function() {
        const background = this.decorations.backgrounds.find(b => b.id === this.currentDecorations.background);
        if (background && background.id !== 'default') {
            document.body.className = `background-${background.id}`;
        } else {
            document.body.className = '';
        }
    },

    // エフェクトを適用
    applyEffect: function() {
        const effect = this.decorations.effects.find(e => e.id === this.currentDecorations.effect);
        if (effect && effect.id !== 'default') {
            // エフェクトの適用ロジック
            this.applyClickEffect(effect.id);
        }
    },

    // クリックエフェクトを適用
    applyClickEffect: function(effectId) {
        // エフェクトに応じたクリック時のパーティクルを変更
        gameState.clickEffect = effectId;
    },

    // イベントリスナーを設定
    setupEventListeners: function() {
        const decorationBtn = document.getElementById('decorationBtn');
        const decorationPanel = document.getElementById('decorationPanel');
        const closeBtn = document.getElementById('closeDecorationBtn');

        if (decorationBtn && decorationPanel) {
            decorationBtn.addEventListener('click', () => {
                decorationPanel.classList.add('show');
                this.renderDecorationItems(); // 最新の状態を反映
            });
        }

        if (closeBtn && decorationPanel) {
            closeBtn.addEventListener('click', () => {
                decorationPanel.classList.remove('show');
            });
        }

        // パネル外クリックで閉じる
        if (decorationPanel) {
            decorationPanel.addEventListener('click', (e) => {
                if (e.target === decorationPanel) {
                    decorationPanel.classList.remove('show');
                }
            });
        }
    },

    // 新しい装飾をアンロック
    unlockDecoration: function(category, itemId) {
        const item = this.decorations[category].find(i => i.id === itemId);
        if (item) {
            item.unlocked = true;
            this.renderDecorationItems();
            showNotification(`🎉 新しい装飾「${item.name}」をアンロックしました！`);
        }
    },

    // 装飾の進捗をチェック
    checkDecorationProgress: function() {
        Object.keys(this.decorations).forEach(category => {
            this.decorations[category].forEach(item => {
                if (!item.unlocked && item.requirement && gameState.points >= item.requirement) {
                    this.unlockDecoration(category, item.id);
                }
            });
        });
    }
};

// ビジュアル強化システム
const VisualEnhancementSystem = {
    // パーティクルシステム
    particleSystem: null,
    
    // 初期化
    init: function() {
        this.particleSystem = document.getElementById('particleSystem');
        this.startFloatingParticles();
        this.createLightEffects();
        this.createStarEffects();
    },
    
    // 浮遊パーティクルを開始
    startFloatingParticles: function() {
        if (!this.particleSystem) return;
        
        const particles = ['✨', '💫', '⭐', '🌟', '🎀', '🌸', '🍀', '🌈'];
        
        setInterval(() => {
            if (Math.random() < 0.3) { // 30%の確率でパーティクル生成
                this.createFloatingParticle(particles[Math.floor(Math.random() * particles.length)]);
            }
        }, 2000);
    },
    
    // 浮遊パーティクルを作成
    createFloatingParticle: function(emoji) {
        if (!this.particleSystem) return;
        
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.textContent = emoji;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 0.5 + 0.8) + 'rem';
        
        this.particleSystem.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    },
    
    // 光のエフェクトを作成
    createLightEffects: function() {
        const lightPositions = [
            { x: '10%', y: '20%' },
            { x: '80%', y: '30%' },
            { x: '50%', y: '70%' },
            { x: '20%', y: '80%' },
            { x: '90%', y: '60%' }
        ];
        
        lightPositions.forEach((pos, index) => {
            setTimeout(() => {
                this.createLightEffect(pos.x, pos.y);
            }, index * 1000);
        });
    },
    
    // 光のエフェクトを作成
    createLightEffect: function(x, y) {
        const light = document.createElement('div');
        light.className = 'light-effect';
        light.style.left = x;
        light.style.top = y;
        
        document.body.appendChild(light);
        
        setTimeout(() => {
            if (light.parentNode) {
                light.remove();
            }
        }, 3000);
    },
    
    // 星のエフェクトを作成
    createStarEffects: function() {
        setInterval(() => {
            if (Math.random() < 0.2) { // 20%の確率で星を生成
                this.createStarEffect();
            }
        }, 3000);
    },
    
    // 星のエフェクトを作成
    createStarEffect: function() {
        const star = document.createElement('div');
        star.className = 'star-effect';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        document.body.appendChild(star);
        
        setTimeout(() => {
            if (star.parentNode) {
                star.remove();
            }
        }, 2000);
    },
    
    // 強化されたクリックエフェクト
    createEnhancedClickEffect: function(x, y, type = 'default') {
        const effect = document.createElement('div');
        effect.className = 'enhanced-click-effect';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        
        // エフェクトタイプに応じて内容を変更
        switch(type) {
            case 'rainbow':
                effect.innerHTML = '<div class="rainbow-effect"></div>';
                break;
            case 'magic':
                effect.innerHTML = '<div class="magic-effect"></div>';
                break;
            case 'fire':
                effect.innerHTML = '<div class="fire-effect"></div>';
                break;
            case 'water':
                effect.innerHTML = '<div class="water-effect"></div>';
                break;
            default:
                effect.innerHTML = '<div class="light-effect"></div>';
        }
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 600);
    },
    
    // レベルアップエフェクト強化
    createLevelUpEffect: function() {
        const effect = document.createElement('div');
        effect.className = 'level-up-effect';
        effect.innerHTML = `
            <div style="font-size: 3rem; color: #FFD700; text-shadow: 0 0 20px #FFD700;">🎉</div>
            <div style="font-size: 1.5rem; color: white; text-shadow: 0 0 10px white; margin-top: 10px;">LEVEL UP!</div>
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 2000);
    },
    
    // 物理演算パーティクル
    createPhysicsParticle: function(x, y, emoji) {
        const particle = document.createElement('div');
        particle.className = 'physics-particle';
        particle.textContent = emoji;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = (Math.random() * 0.5 + 1) + 'rem';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 2000);
    },
    
    // 魔法のエフェクト
    createMagicEffect: function(x, y) {
        const magic = document.createElement('div');
        magic.className = 'magic-effect';
        magic.style.left = (x - 75) + 'px';
        magic.style.top = (y - 75) + 'px';
        
        document.body.appendChild(magic);
        
        setTimeout(() => {
            if (magic.parentNode) {
                magic.remove();
            }
        }, 5000);
    },
    
    // 炎のエフェクト
    createFireEffect: function(x, y) {
        const fire = document.createElement('div');
        fire.className = 'fire-effect';
        fire.style.left = (x - 50) + 'px';
        fire.style.top = (y - 60) + 'px';
        
        document.body.appendChild(fire);
        
        setTimeout(() => {
            if (fire.parentNode) {
                fire.remove();
            }
        }, 3000);
    },
    
    // 水のエフェクト
    createWaterEffect: function(x, y) {
        const water = document.createElement('div');
        water.className = 'water-effect';
        water.style.left = (x - 100) + 'px';
        water.style.top = (y - 100) + 'px';
        
        document.body.appendChild(water);
        
        setTimeout(() => {
            if (water.parentNode) {
                water.remove();
            }
        }, 3000);
    },
    
    // 虹色エフェクト
    createRainbowEffect: function(x, y) {
        const rainbow = document.createElement('div');
        rainbow.className = 'rainbow-effect';
        rainbow.style.left = (x - 100) + 'px';
        rainbow.style.top = (y - 100) + 'px';
        
        document.body.appendChild(rainbow);
        
        setTimeout(() => {
            if (rainbow.parentNode) {
                rainbow.remove();
            }
        }, 4000);
    }
};

// イベントリスナー設定
function setupEventListeners() {
    // クリックイベント
    if (clickButton) {
        clickButton.addEventListener('click', handleClick);
        
        // タッチイベント（スマホ最適化）
        if (isTouchDevice) {
            clickButton.addEventListener('touchstart', function(event) {
                event.preventDefault();
                clickButton.classList.add('touch-active');
            }, { passive: true });
            
            clickButton.addEventListener('touchend', function(event) {
                event.preventDefault();
                clickButton.classList.remove('touch-active');
                handleClick();
            }, { passive: true });
        }
    }
    
    // キーボードショートカット（モバイル以外）
    if (!isMobile) {
        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space') {
                event.preventDefault();
                handleClick();
            }
        });
    }
}

// クリック処理を更新
function handleClick() {
    // クリック数を増加
    gameState.totalClicks++;
    
    // 基本ポイント
    let pointsGained = gameState.clickMultiplier;
    
    // クリティカルヒットの判定
    if (Math.random() < gameState.criticalClickChance) {
        pointsGained *= 3;
        showNotification('💥 クリティカルヒット！3倍のポイント！');
        
        // クリティカルヒットの実績をチェック
        const criticalHitAchievement = achievements.find(a => a.id === 'critical_hit');
        if (criticalHitAchievement && !gameState.achievements.includes('critical_hit')) {
            unlockAchievement('critical_hit');
        }
    }
    
    // ポイントを加算
    gameState.points += pointsGained;
    gameState.totalPoints += pointsGained;
    
    // キャラクターアニメーション
    if (CharacterManager && typeof CharacterManager.clickAnimation === 'function') {
        CharacterManager.clickAnimation();
    }
    
    // クリックエフェクト
    if (clickButton) {
        const rect = clickButton.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        createClickEffect(x, y);
    }
    
    // 表示を更新
    updateDisplay();
    updateUpgradeButtons();
    
    // 実績をチェック
    checkAchievements();
}

// クリックエフェクト作成
function createClickEffect(x, y) {
    // 座標の安全性チェック
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
        console.warn('Invalid coordinates for click effect');
        return;
    }
    
    // 装飾システムのエフェクトに応じてパーティクルを変更
    const effectType = gameState.clickEffect || 'default';
    let particles = ['⭐', '✨', '💫'];
    
    switch(effectType) {
        case 'sparkle':
            particles = ['✨', '💫', '⭐', '🌟'];
            break;
        case 'firework':
            particles = ['🎆', '🎇', '💥', '🔥'];
            break;
        case 'rainbow':
            particles = ['🌈', '🎨', '💖', '💙', '💚', '💛', '🧡', '💜'];
            break;
        case 'magic':
            particles = ['🔮', '✨', '💫', '🌟', '⭐'];
            break;
        case 'laser':
            particles = ['⚡', '💥', '🔥', '⚡'];
            break;
        case 'galaxy':
            particles = ['🌌', '⭐', '🌟', '✨', '💫'];
            break;
        case 'dragon':
            particles = ['🐉', '🔥', '💥', '⚡'];
            break;
        default:
            particles = ['⭐', '✨', '💫'];
    }
    
    // 強化されたクリックエフェクト
    if (typeof VisualEnhancementSystem !== 'undefined') {
        VisualEnhancementSystem.createEnhancedClickEffect(x, y, effectType);
        
        // 物理演算パーティクル
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = particles[Math.floor(Math.random() * particles.length)];
                const offsetX = (Math.random() - 0.5) * 150;
                const offsetY = (Math.random() - 0.5) * 150;
                VisualEnhancementSystem.createPhysicsParticle(x + offsetX, y + offsetY, particle);
            }, i * 100);
        }
        
        // エフェクトタイプに応じた特別なエフェクト
        switch(effectType) {
            case 'rainbow':
                VisualEnhancementSystem.createRainbowEffect(x, y);
                break;
            case 'magic':
                VisualEnhancementSystem.createMagicEffect(x, y);
                break;
            case 'fire':
            case 'dragon':
                VisualEnhancementSystem.createFireEffect(x, y);
                break;
            case 'water':
                VisualEnhancementSystem.createWaterEffect(x, y);
                break;
        }
    }
    
    // 従来のパーティクルエフェクト（後方互換性）
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            
            // 安全な座標計算
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            const particleX = x + offsetX;
            const particleY = y + offsetY;
            
            particle.style.left = particleX + 'px';
            particle.style.top = particleY + 'px';
            particle.style.animation = `particleFloat 1s ease-out forwards`;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }, i * 100);
    }
}

// アップグレード購入関数を更新
function buyAutoClicker() {
    const cost = calculateUpgradeCost(gameState.autoClickerLevel, 10);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerLevel++;
        showNotification(`🤖 自動クリッカー Lv.${gameState.autoClickerLevel} 購入!`, 'upgrade');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('excited');
        }
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('sleepy');
        }
    }
}

function buyClickMultiplier() {
    const cost = calculateUpgradeCost(gameState.clickMultiplierLevel, 50);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.clickMultiplierLevel++;
        gameState.clickMultiplier = gameState.clickMultiplierLevel; // 確実に更新
        showNotification(`⚡ クリック倍率 Lv.${gameState.clickMultiplierLevel} 購入!`, 'upgrade');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('cool');
        }
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('sleepy');
        }
    }
}

function buyAutoClickerSpeed() {
    const cost = calculateUpgradeCost(gameState.autoClickerSpeedLevel, 100);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerSpeedLevel++;
        showNotification(`🚀 自動クリッカー速度 Lv.${gameState.autoClickerSpeedLevel} 購入!`, 'upgrade');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('excited');
        }
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('sleepy');
        }
    }
}

function buyCriticalClick() {
    const cost = calculateUpgradeCost(gameState.criticalClickLevel, 200);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.criticalClickLevel++;
        gameState.criticalClickChance = gameState.criticalClickLevel * 0.01;
        showNotification(`💥 クリティカルクリック Lv.${gameState.criticalClickLevel} 購入!`, 'upgrade');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('surprised');
        }
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
            CharacterManager.changeExpression('sleepy');
        }
    }
}

// 表示更新
function updateDisplay() {
    // ポイント表示
    if (pointsElement) pointsElement.textContent = formatNumber(gameState.points);
    if (pointsPerSecondElement) pointsPerSecondElement.textContent = formatNumber(gameState.autoClickerLevel * gameState.autoClickerSpeedLevel);
    if (clickMultiplierElement) clickMultiplierElement.textContent = gameState.clickMultiplier;
    
    // アップグレード情報更新
    if (autoClickerLevelElement) autoClickerLevelElement.textContent = gameState.autoClickerLevel;
    if (autoClickerCostElement) autoClickerCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.autoClickerLevel, 10));
    
    if (clickMultiplierLevelElement) clickMultiplierLevelElement.textContent = gameState.clickMultiplierLevel;
    if (clickMultiplierCostElement) clickMultiplierCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.clickMultiplierLevel, 50));
    
    if (autoClickerSpeedLevelElement) autoClickerSpeedLevelElement.textContent = gameState.autoClickerSpeedLevel;
    if (autoClickerSpeedCostElement) autoClickerSpeedCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.autoClickerSpeedLevel, 100));
    
    if (criticalClickLevelElement) criticalClickLevelElement.textContent = gameState.criticalClickLevel;
    if (criticalClickCostElement) criticalClickCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.criticalClickLevel, 200));
    
    // ボタンの有効/無効状態更新
    updateUpgradeButtons();
}

// アップグレードボタンの状態更新
function updateUpgradeButtons() {
    const buttons = document.querySelectorAll('.upgrade-btn');
    const costs = [
        calculateUpgradeCost(gameState.autoClickerLevel, 10),
        calculateUpgradeCost(gameState.clickMultiplierLevel, 50),
        calculateUpgradeCost(gameState.autoClickerSpeedLevel, 100),
        calculateUpgradeCost(gameState.criticalClickLevel, 200)
    ];
    
    buttons.forEach((button, index) => {
        if (button) {
            button.disabled = gameState.points < costs[index];
        }
    });
}

// 実績チェック
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id)) {
            let unlocked = false;
            
            switch (achievement.type) {
                case 'clicks':
                    unlocked = gameState.totalClicks >= achievement.requirement;
                    break;
                case 'points':
                    unlocked = gameState.totalPoints >= achievement.requirement;
                    break;
                case 'upgrades':
                    const totalUpgrades = gameState.autoClickerLevel + gameState.clickMultiplierLevel + 
                                        gameState.autoClickerSpeedLevel + gameState.criticalClickLevel;
                    unlocked = totalUpgrades >= achievement.requirement;
                    break;
                case 'autoClicker':
                    unlocked = gameState.autoClickerLevel >= achievement.requirement;
                    break;
                case 'criticalHits':
                    // クリティカルヒットの実績は別途処理（クリック時にチェック）
                    break;
            }
            
            if (unlocked) {
                unlockAchievement(achievement.id);
            }
        }
    });
}

// 実績解除関数を更新
function unlockAchievement(achievementId) {
    if (!gameState.achievements.includes(achievementId)) {
        gameState.achievements.push(achievementId);
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
            showNotification(`🏆 実績解除: ${achievement.name}`, 'achievement');
            
            // 強化されたレベルアップエフェクト
            if (typeof VisualEnhancementSystem !== 'undefined') {
                VisualEnhancementSystem.createLevelUpEffect();
            }
            
            if (CharacterManager && typeof CharacterManager.levelUpAnimation === 'function') {
                CharacterManager.levelUpAnimation();
            }
            if (CharacterManager && typeof CharacterManager.createParticleBurst === 'function') {
                CharacterManager.createParticleBurst(50, 50, 10);
            }
            renderAchievements();
        }
    }
}

// 実績表示
function renderAchievements() {
    if (!achievementsElement) return;
    
    achievementsElement.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = gameState.achievements.includes(achievement.id);
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
        achievementElement.innerHTML = `
            <div>${achievement.name}</div>
            <div style="font-size: 0.8rem; opacity: 0.8;">${achievement.description}</div>
        `;
        achievementsElement.appendChild(achievementElement);
    });
}

// 通知表示
function showNotification(message, type = 'success') {
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        if (notification) {
            notification.classList.remove('show');
        }
    }, 3000);
}

// 数値フォーマット
function formatNumber(num) {
    // 安全性チェック
    if (typeof num !== 'number' || isNaN(num)) {
        return '0';
    }
    
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

// ゲーム保存
function saveGame() {
    try {
        localStorage.setItem('idleClickerSave', JSON.stringify(gameState));
        showNotification('ゲームを保存しました！');
    } catch (e) {
        console.error('ゲームの保存に失敗しました:', e);
        showNotification('❌ ゲームの保存に失敗しました', 'error');
    }
}

// ゲーム読み込み
function loadGame() {
    const saved = localStorage.getItem('idleClickerSave');
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            
            // 新しいプロパティのデフォルト値を設定
            if (typeof loadedState.clickMultiplier === 'undefined') {
                loadedState.clickMultiplier = loadedState.clickMultiplierLevel || 1;
            }
            if (typeof loadedState.criticalClickChance === 'undefined') {
                loadedState.criticalClickChance = (loadedState.criticalClickLevel || 0) * 0.01;
            }
            if (typeof loadedState.totalClicks === 'undefined') {
                loadedState.totalClicks = 0;
            }
            if (typeof loadedState.totalPoints === 'undefined') {
                loadedState.totalPoints = loadedState.points || 0;
            }
            if (typeof loadedState.achievements === 'undefined') {
                loadedState.achievements = [];
            }
            if (typeof loadedState.clickEffect === 'undefined') {
                loadedState.clickEffect = 'default';
            }
            
            // ミニゲームデータの初期化
            if (typeof loadedState.minigames === 'undefined') {
                loadedState.minigames = {
                    slotMachine: {
                        lastPlayed: 0,
                        totalWins: 0,
                        totalSpent: 0,
                        jackpotWins: 0
                    },
                    lottery: {
                        lastPlayed: 0,
                        totalWins: 0,
                        totalSpent: 0,
                        biggestWin: 0
                    },
                    quiz: {
                        lastPlayed: 0,
                        totalCorrect: 0,
                        totalQuestions: 0,
                        streak: 0,
                        bestStreak: 0
                    },
                    puzzle: {
                        lastPlayed: 0,
                        totalCompleted: 0,
                        totalSpent: 0,
                        bestTime: 0
                    }
                };
            }
            
            // ソーシャル機能のデータを初期化
            if (typeof loadedState.playerId === 'undefined') {
                loadedState.playerId = generatePlayerId();
            }
            if (typeof loadedState.playerName === 'undefined') {
                loadedState.playerName = generatePlayerName();
            }
            if (typeof loadedState.friends === 'undefined') {
                loadedState.friends = [];
            }
            if (typeof loadedState.receivedGifts === 'undefined') {
                loadedState.receivedGifts = [];
            }
            if (typeof loadedState.sentGifts === 'undefined') {
                loadedState.sentGifts = [];
            }
            if (typeof loadedState.socialStats === 'undefined') {
                loadedState.socialStats = {
                    giftsReceived: 0,
                    giftsSent: 0,
                    friendsCount: 0,
                    lastActive: Date.now()
                };
            }
            
            gameState = loadedState;
            showNotification('ゲームを読み込みました！');
        } catch (e) {
            console.error('セーブデータの読み込みに失敗しました:', e);
            // エラーが発生した場合はデフォルト状態で開始
            gameState = {
                points: 0,
                autoClickerLevel: 0,
                clickMultiplierLevel: 1,
                clickMultiplier: 1, // 追加
                autoClickerSpeedLevel: 1,
                criticalClickLevel: 0,
                criticalClickChance: 0, // 追加
                totalClicks: 0,
                totalPoints: 0,
                achievements: [],
                clickEffect: 'default',
                // ミニゲームデータ
                minigames: {
                    slotMachine: {
                        lastPlayed: 0,
                        totalWins: 0,
                        totalSpent: 0,
                        jackpotWins: 0
                    },
                    lottery: {
                        lastPlayed: 0,
                        totalWins: 0,
                        totalSpent: 0,
                        biggestWin: 0
                    },
                    quiz: {
                        lastPlayed: 0,
                        totalCorrect: 0,
                        totalQuestions: 0,
                        streak: 0,
                        bestStreak: 0
                    },
                    puzzle: {
                        lastPlayed: 0,
                        totalCompleted: 0,
                        totalSpent: 0,
                        bestTime: 0
                    }
                },
                // ソーシャル機能データ
                playerId: generatePlayerId(),
                playerName: generatePlayerName(),
                friends: [],
                receivedGifts: [],
                sentGifts: [],
                socialStats: {
                    giftsReceived: 0,
                    giftsSent: 0,
                    friendsCount: 0,
                    lastActive: Date.now()
                }
            };
        }
    }
}

// ゲームリセット
function resetGame() {
    if (confirm('本当にゲームをリセットしますか？この操作は取り消せません。')) {
        gameState = {
            points: 0,
            autoClickerLevel: 0,
            clickMultiplierLevel: 1,
            clickMultiplier: 1, // 追加
            autoClickerSpeedLevel: 1,
            criticalClickLevel: 0,
            criticalClickChance: 0, // 追加
            totalClicks: 0,
            totalPoints: 0,
            achievements: [],
            clickEffect: 'default',
            // ソーシャル機能データ
            playerId: generatePlayerId(),
            playerName: generatePlayerName(),
            friends: [],
            receivedGifts: [],
            sentGifts: [],
            socialStats: {
                giftsReceived: 0,
                giftsSent: 0,
                friendsCount: 0,
                lastActive: Date.now()
            }
        };
        localStorage.removeItem('idleClickerSave');
        updateDisplay();
        renderAchievements();
        showNotification('ゲームをリセットしました');
    }
}

// ゲームループ
function gameLoop() {
    // 自動クリッカーの処理
    const autoClickerPoints = gameState.autoClickerLevel * gameState.autoClickerSpeedLevel;
    gameState.points += autoClickerPoints;
    gameState.totalPoints += autoClickerPoints;
    
    // 装飾の進捗をチェック
    if (typeof DecorationSystem !== 'undefined' && typeof DecorationSystem.checkDecorationProgress === 'function') {
        DecorationSystem.checkDecorationProgress();
    }
    
    // 表示を更新
    updateDisplay();
    updateUpgradeButtons();
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
    loadGame();
    setupEventListeners();
    
    // キャラクターの初期設定
    if (CharacterManager && typeof CharacterManager.changeExpression === 'function') {
        CharacterManager.changeExpression('happy');
    }
    
    // 定期的に浮遊キャラクターを変更
    setInterval(() => {
        if (CharacterManager && typeof CharacterManager.randomizeFloatingChars === 'function') {
            CharacterManager.randomizeFloatingChars();
        }
    }, 10000);
    
    // 定期的に環境エフェクトを更新
    setInterval(() => {
        if (CharacterManager && typeof CharacterManager.updateEnvironment === 'function') {
            CharacterManager.updateEnvironment();
        }
    }, 15000);
    
    // 定期的にランダムな表情変化
    setInterval(() => {
        if (Math.random() < 0.3 && CharacterManager && typeof CharacterManager.randomExpression === 'function') { // 30%の確率
            CharacterManager.randomExpression();
        }
    }, 8000);
    
    // 定期的にランダムな特別アニメーション
    setInterval(() => {
        if (Math.random() < 0.2 && CharacterManager && typeof CharacterManager.playSpecialAnimation === 'function') { // 20%の確率
            const animations = ['stretching', 'bouncing', 'wiggling', 'pulsing', 'rocking', 'swaying', 'hopping'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            CharacterManager.playSpecialAnimation(randomAnimation);
        }
    }, 12000);
    
    // 定期的にキラキラエフェクト
    setInterval(() => {
        if (Math.random() < 0.15 && CharacterManager && typeof CharacterManager.createSparkleEffect === 'function') { // 15%の確率
            CharacterManager.createSparkleEffect(true);
        }
    }, 6000);
    
    // 装飾システムの初期化
    if (typeof DecorationSystem !== 'undefined') {
        DecorationSystem.init();
        DecorationSystem.checkDecorationProgress();
    }

    // ビジュアル強化システムの初期化
    if (typeof VisualEnhancementSystem !== 'undefined') {
        VisualEnhancementSystem.init();
    }

    // ソーシャルシステムの初期化
    if (typeof SocialSystem !== 'undefined') {
        SocialSystem.init();
    }

    // 楽天アフィリエイトシステムの初期化
    if (typeof RakutenAffiliate !== 'undefined') {
        RakutenAffiliate.init();
    }

    // ミニゲームシステムの初期化
    if (typeof MinigameSystem !== 'undefined') {
        MinigameSystem.init();
    }

    // ゲームループ開始
    setInterval(gameLoop, 1000);
    updateDisplay();
    renderAchievements();
});

// ページ離脱時に自動保存
window.addEventListener('beforeunload', function() {
    try {
        saveGame();
    } catch (e) {
        console.error('自動保存に失敗しました:', e);
    }
});

// ===== ソーシャル機能 =====

// ソーシャルパネルの管理
const SocialSystem = {
    init: function() {
        this.setupSocialEventListeners();
        this.updateSocialData();
    },

    setupSocialEventListeners: function() {
        const socialBtn = document.getElementById('socialBtn');
        const socialPanel = document.getElementById('socialPanel');
        const closeSocialBtn = document.getElementById('closeSocialBtn');
        const socialTabs = document.querySelectorAll('.social-tab');

        if (socialBtn) {
            socialBtn.addEventListener('click', () => this.openSocialPanel());
        }

        if (closeSocialBtn) {
            closeSocialBtn.addEventListener('click', () => this.closeSocialPanel());
        }

        if (socialTabs) {
            socialTabs.forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
            });
        }

        // パネル外クリックで閉じる
        if (socialPanel) {
            socialPanel.addEventListener('click', (e) => {
                if (e.target === socialPanel) {
                    this.closeSocialPanel();
                }
            });
        }
    },

    openSocialPanel: function() {
        const socialPanel = document.getElementById('socialPanel');
        if (socialPanel) {
            socialPanel.classList.add('active');
            this.updateSocialData();
        }
    },

    closeSocialPanel: function() {
        const socialPanel = document.getElementById('socialPanel');
        if (socialPanel) {
            socialPanel.classList.remove('active');
        }
    },

    switchTab: function(tabName) {
        // タブボタンのアクティブ状態を更新
        const tabs = document.querySelectorAll('.social-tab');
        const contents = document.querySelectorAll('.social-tab-content');

        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabName + 'Tab') {
                content.classList.add('active');
            }
        });

        // タブに応じてデータを更新
        switch(tabName) {
            case 'ranking':
                this.updateRanking();
                break;
            case 'friends':
                this.updateFriends();
                break;
            case 'gifts':
                this.updateGifts();
                break;
            case 'share':
                this.updateShare();
                break;
        }
    },

    updateSocialData: function() {
        this.updateRanking();
        this.updateFriends();
        this.updateGifts();
        this.updateShare();
    },

    updateRanking: function() {
        const rankingList = document.getElementById('globalRanking');
        const myRank = document.getElementById('myRank');
        const myScore = document.getElementById('myScore');

        if (rankingList) {
            rankingList.innerHTML = '';
            
            // 現在のプレイヤーをランキングに追加
            const currentPlayer = {
                id: gameState.playerId,
                name: gameState.playerName,
                score: gameState.totalPoints,
                rank: 0
            };

            // ランキングを更新
            let allPlayers = [...mockSocialData.globalRanking, currentPlayer];
            allPlayers.sort((a, b) => b.score - a.score);
            
            // ランクを再計算
            allPlayers.forEach((player, index) => {
                player.rank = index + 1;
            });

            // 上位10位を表示
            allPlayers.slice(0, 10).forEach(player => {
                const rankingItem = document.createElement('div');
                rankingItem.className = 'ranking-item';
                if (player.id === gameState.playerId) {
                    rankingItem.classList.add('self');
                }

                let rankClass = '';
                if (player.rank === 1) rankClass = 'gold';
                else if (player.rank === 2) rankClass = 'silver';
                else if (player.rank === 3) rankClass = 'bronze';

                rankingItem.innerHTML = `
                    <div class="ranking-rank ${rankClass}">${player.rank}</div>
                    <div class="ranking-info">
                        <div class="ranking-name">${player.name}</div>
                        <div class="ranking-score">${formatNumber(player.score)} ポイント</div>
                    </div>
                `;

                rankingList.appendChild(rankingItem);
            });
        }

        if (myScore) {
            myScore.textContent = formatNumber(gameState.totalPoints);
        }

        if (myRank) {
            const playerRank = allPlayers.find(p => p.id === gameState.playerId)?.rank || '-';
            myRank.textContent = playerRank;
        }
    },

    updateFriends: function() {
        const friendsList = document.getElementById('friendsList');
        const giftFriend = document.getElementById('giftFriend');

        if (friendsList) {
            friendsList.innerHTML = '';
            
            gameState.friends.forEach(friend => {
                const friendItem = document.createElement('div');
                friendItem.className = 'friend-item';
                
                const status = this.getFriendStatus(friend.lastActive);
                
                friendItem.innerHTML = `
                    <div>
                        <div class="friend-name">${friend.name}</div>
                        <div class="friend-status">${status}</div>
                    </div>
                    <button class="remove-friend" onclick="removeFriend('${friend.id}')">削除</button>
                `;

                friendsList.appendChild(friendItem);
            });
        }

        if (giftFriend) {
            giftFriend.innerHTML = '<option value="">フレンドを選択</option>';
            gameState.friends.forEach(friend => {
                const option = document.createElement('option');
                option.value = friend.id;
                option.textContent = friend.name;
                giftFriend.appendChild(option);
            });
        }
    },

    updateGifts: function() {
        const receivedGifts = document.getElementById('receivedGifts');

        if (receivedGifts) {
            receivedGifts.innerHTML = '';
            
            gameState.receivedGifts.forEach(gift => {
                const giftItem = document.createElement('div');
                giftItem.className = 'gift-item';
                
                giftItem.innerHTML = `
                    <div class="gift-info">
                        <div class="gift-from">${gift.fromName}</div>
                        <div class="gift-amount">${formatNumber(gift.amount)} ポイント</div>
                    </div>
                    <button class="accept-gift" onclick="acceptGift('${gift.id}')">受け取る</button>
                `;

                receivedGifts.appendChild(giftItem);
            });
        }
    },

    updateShare: function() {
        const sharePoints = document.getElementById('sharePoints');
        const shareClicks = document.getElementById('shareClicks');
        const shareAchievements = document.getElementById('shareAchievements');

        if (sharePoints) sharePoints.textContent = formatNumber(gameState.totalPoints);
        if (shareClicks) shareClicks.textContent = formatNumber(gameState.totalClicks);
        if (shareAchievements) shareAchievements.textContent = gameState.achievements.length;
    },

    getFriendStatus: function(lastActive) {
        const now = Date.now();
        const diff = now - lastActive;
        
        if (diff < 300000) { // 5分以内
            return '🟢 オンライン';
        } else if (diff < 3600000) { // 1時間以内
            return '🟡 最近アクティブ';
        } else {
            return '🔴 オフライン';
        }
    }
};

// フレンド機能
function addFriend() {
    const friendInput = document.getElementById('friendSearch');
    const friendId = friendInput.value.trim();

    if (!friendId) {
        showNotification('フレンドIDを入力してください');
        return;
    }

    // 既にフレンドかチェック
    if (gameState.friends.some(f => f.id === friendId)) {
        showNotification('既にフレンドです');
        return;
    }

    // 自分自身かチェック
    if (friendId === gameState.playerId) {
        showNotification('自分自身をフレンドに追加できません');
        return;
    }

    // モックフレンドを追加
    const mockFriend = mockSocialData.mockFriends.find(f => f.id === friendId);
    if (mockFriend) {
        gameState.friends.push({
            id: mockFriend.id,
            name: mockFriend.name,
            lastActive: mockFriend.lastActive
        });
        gameState.socialStats.friendsCount = gameState.friends.length;
        SocialSystem.updateFriends();
        showNotification(`${mockFriend.name}をフレンドに追加しました`);
        friendInput.value = '';
    } else {
        showNotification('フレンドが見つかりません');
    }
}

function removeFriend(friendId) {
    const friend = gameState.friends.find(f => f.id === friendId);
    if (friend) {
        gameState.friends = gameState.friends.filter(f => f.id !== friendId);
        gameState.socialStats.friendsCount = gameState.friends.length;
        SocialSystem.updateFriends();
        showNotification(`${friend.name}をフレンドから削除しました`);
    }
}

// ギフト機能
function sendGift() {
    const giftFriend = document.getElementById('giftFriend');
    const giftAmount = document.getElementById('giftAmount');
    
    const friendId = giftFriend.value;
    const amount = parseInt(giftAmount.value);

    if (!friendId) {
        showNotification('フレンドを選択してください');
        return;
    }

    if (!amount || amount <= 0) {
        showNotification('有効なポイント数を入力してください');
        return;
    }

    if (amount > gameState.points) {
        showNotification('ポイントが不足しています');
        return;
    }

    const friend = gameState.friends.find(f => f.id === friendId);
    if (!friend) {
        showNotification('フレンドが見つかりません');
        return;
    }

    // ポイントを減らす
    gameState.points -= amount;
    gameState.socialStats.giftsSent++;

    // ギフトを記録
    const gift = {
        id: 'gift_' + Date.now(),
        toId: friendId,
        toName: friend.name,
        amount: amount,
        timestamp: Date.now()
    };
    gameState.sentGifts.push(gift);

    // モックで受け取ったギフトを追加
    const receivedGift = {
        id: gift.id,
        fromId: gameState.playerId,
        fromName: gameState.playerName,
        amount: amount,
        timestamp: Date.now()
    };
    gameState.receivedGifts.push(receivedGift);

    SocialSystem.updateGifts();
    updateDisplay();
    showNotification(`${friend.name}に${formatNumber(amount)}ポイントを送りました`);
    
    giftAmount.value = '';
}

function acceptGift(giftId) {
    const gift = gameState.receivedGifts.find(g => g.id === giftId);
    if (gift) {
        gameState.points += gift.amount;
        gameState.socialStats.giftsReceived++;
        gameState.receivedGifts = gameState.receivedGifts.filter(g => g.id !== giftId);
        
        SocialSystem.updateGifts();
        updateDisplay();
        showNotification(`${gift.fromName}からの${formatNumber(gift.amount)}ポイントを受け取りました`);
    }
}

// シェア機能
function shareToX() {
    const text = `🚀 無限クリッカー 2024で${formatNumber(gameState.totalPoints)}ポイントを獲得しました！総クリック数: ${formatNumber(gameState.totalClicks)}回、実績: ${gameState.achievements.length}個 #無限クリッカー #IdleGame`;
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    showNotification('𝕏 Xでシェアウィンドウを開きました！');
}

function shareToLine() {
    const text = `🚀 無限クリッカー 2024で${formatNumber(gameState.totalPoints)}ポイントを獲得しました！総クリック数: ${formatNumber(gameState.totalClicks)}回、実績: ${gameState.achievements.length}個`;
    const url = window.location.href;
    const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    showNotification('💬 LINEでシェアウィンドウを開きました！');
}

function shareToInstagram() {
    const text = `🚀 無限クリッカー 2024で${formatNumber(gameState.totalPoints)}ポイントを獲得しました！総クリック数: ${formatNumber(gameState.totalClicks)}回、実績: ${gameState.achievements.length}個 #無限クリッカー #IdleGame #ゲーム`;
    const url = window.location.href;
    
    // Instagramのシェア方法（コピーして手動投稿）
    const shareText = `${text}\n\n${url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Instagram投稿用テキストをコピーしました！Instagramアプリで貼り付けて投稿してください');
        });
    } else {
        // フォールバック
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Instagram投稿用テキストをコピーしました！Instagramアプリで貼り付けて投稿してください');
    }
}

function copyShareLink() {
    const text = `🚀 無限クリッカー 2024で${formatNumber(gameState.totalPoints)}ポイントを獲得しました！総クリック数: ${formatNumber(gameState.totalClicks)}回、実績: ${gameState.achievements.length}個\n${window.location.href}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('📋 シェアリンクをコピーしました！');
        });
    } else {
        // フォールバック
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('📋 シェアリンクをコピーしました！');
    }
}

// グローバル関数として公開
window.openSocialPanel = function() {
    SocialSystem.openSocialPanel();
};

window.addFriend = addFriend;
window.removeFriend = removeFriend;
window.sendGift = sendGift;
window.acceptGift = acceptGift;
window.shareToX = shareToX;
window.shareToLine = shareToLine;
window.shareToInstagram = shareToInstagram;
window.copyShareLink = copyShareLink;

// フレンドIDコピー機能
function copyFriendId(friendId) {
    const friendInput = document.getElementById('friendSearch');
    if (friendInput) {
        friendInput.value = friendId;
        friendInput.focus();
        showNotification(`フレンドID "${friendId}" を入力欄にコピーしました`);
    }
}

window.copyFriendId = copyFriendId;

// ===== 楽天アフィリエイトシステム =====

// 楽天アフィリエイトID
const RAKUTEN_AFFILIATE_ID = '4b5e6cd5.ac0265fe.4b5e6cd6.caeebcf2';

// 楽天商品データ
const RakutenProducts = [
    {
        id: 'gaming_chair',
        name: 'ゲーミングチェア',
        price: 15800,
        originalPrice: 19800,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=240&fit=crop&crop=center',
        description: '長時間のゲームプレイに最適な快適なチェア',
        link: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%25E3%2582%25B2%25E3%2583%25BC%25E3%2583%259F%25E3%2583%25B3%25E3%2582%25B0%25E3%2583%2581%25E3%2582%25A7%25E3%2582%25A2%2F`,
        category: 'furniture',
        badge: '🔥 限定セール',
        urgency: '残り2時間'
    },
    {
        id: 'nintendo_switch',
        name: 'Nintendo Switch',
        price: 29800,
        originalPrice: 34800,
        discount: 14,
        image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=240&fit=crop&crop=center',
        description: '人気のゲーム機、どこでも楽しめる',
        link: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2Fnintendo%2Bswitch%2F`,
        category: 'gaming',
        badge: '🎮 人気商品',
        urgency: '在庫残り少'
    },
    {
        id: 'gaming_mouse',
        name: 'ゲーミングマウス',
        price: 8980,
        originalPrice: 12980,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=240&fit=crop&crop=center',
        description: '高精度センサー搭載のゲーミングマウス',
        link: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%25E3%2582%25B2%25E3%2583%25BC%25E3%2583%259F%25E3%2583%25B3%25E3%2582%25B0%25E3%2583%259E%25E3%2582%25A6%25E3%2582%25B9%2F`,
        category: 'accessory',
        badge: '⚡ 激安特価',
        urgency: '本日限定'
    },
    {
        id: 'gaming_keyboard',
        name: 'ゲーミングキーボード',
        price: 12800,
        originalPrice: 16800,
        discount: 24,
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=240&fit=crop&crop=center',
        description: 'メカニカルスイッチ搭載の高級キーボード',
        link: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%25E3%2582%25B2%25E3%2583%25BC%25E3%2583%259F%25E3%2583%25B3%25E3%2582%25B0%25E3%2582%25AD%25E3%2583%25BC%25E3%2583%259C%25E3%2583%25BC%25E3%2583%2589%2F`,
        category: 'accessory',
        badge: '💎 プレミアム',
        urgency: '数量限定'
    },
    {
        id: 'gaming_headset',
        name: 'ゲーミングヘッドセット',
        price: 6800,
        originalPrice: 9800,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=240&fit=crop&crop=center',
        description: '高音質で長時間使用に最適',
        link: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%25E3%2582%25B2%25E3%2583%25BC%25E3%2583%259F%25E3%2583%25B3%25E3%2582%25B0%25E3%2583%2598%25E3%2583%2583%25E3%2583%2589%25E3%2582%25BB%25E3%2583%2583%25E3%2583%2588%2F`,
        category: 'accessory',
        badge: '🎧 音質重視',
        urgency: 'セール終了間近'
    },
    {
        id: 'gaming_monitor',
        name: 'ゲーミングモニター',
        price: 25800,
        originalPrice: 35800,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=240&fit=crop&crop=center',
        description: '高リフレッシュレートで滑らかな映像',
        link: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%25E3%2582%25B2%25E3%2583%25BC%25E3%2583%259F%25E3%2583%25B3%25E3%2582%25B0%25E3%2583%25A2%25E3%2583%258B%25E3%2582%25BF%25E3%2583%25BC%2F`,
        category: 'accessory',
        badge: '🖥️ 高画質',
        urgency: '今だけ特価'
    }
];

// 楽天アフィリエイト管理システム
const RakutenAffiliate = {
    isSidebarOpen: false,
    lastPopupTime: 0,
    
    // 初期化
    init: function() {
        this.loadProducts();
        this.setupEventListeners();
        this.startPeriodicPopup();
    },
    
    // 商品を読み込み
    loadProducts: function() {
        const content = document.getElementById('rakutenContent');
        if (!content) return;
        
        content.innerHTML = '';
        
        // ランダムに商品を選択（最大4個）
        const shuffled = [...RakutenProducts].sort(() => 0.5 - Math.random());
        const selectedProducts = shuffled.slice(0, 4);
        
        selectedProducts.forEach(product => {
            const productElement = this.createProductElement(product);
            content.appendChild(productElement);
        });
    },
    
    // 商品要素を作成
    createProductElement: function(product) {
        const div = document.createElement('div');
        div.className = 'rakuten-product';
        
        // 割引情報の計算
        const savings = product.originalPrice - product.price;
        const savingsText = savings > 0 ? `¥${savings.toLocaleString()}お得！` : '';
        
        div.innerHTML = `
            <div class="product-badge">${product.badge}</div>
            <div class="urgency-badge">${product.urgency}</div>
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h5>${product.name}</h5>
            <div class="price-container">
                <div class="current-price">¥${product.price.toLocaleString()}</div>
                ${product.originalPrice ? `<div class="original-price">¥${product.originalPrice.toLocaleString()}</div>` : ''}
                ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            </div>
            ${savingsText ? `<div class="savings">${savingsText}</div>` : ''}
            <div class="description">${product.description}</div>
            <a href="${product.link}" target="_blank" onclick="RakutenAffiliate.trackClick('${product.id}')">
                🛒 今すぐ購入
            </a>
        `;
        return div;
    },
    
    // サイドバーの表示/非表示を切り替え
    toggleSidebar: function() {
        const sidebar = document.getElementById('rakutenSidebar');
        if (!sidebar) return;
        
        this.isSidebarOpen = !this.isSidebarOpen;
        
        if (this.isSidebarOpen) {
            sidebar.classList.add('active');
            this.loadProducts(); // 商品を更新
        } else {
            sidebar.classList.remove('active');
        }
    },
    
    // ポップアップを表示
    showPopup: function() {
        const now = Date.now();
        if (now - this.lastPopupTime < 300000) return; // 5分間隔
        
        this.lastPopupTime = now;
        
        // ランダムに商品を選択
        const randomProducts = [...RakutenProducts].sort(() => 0.5 - Math.random()).slice(0, 2);
        
        const popup = document.createElement('div');
        popup.className = 'rakuten-popup';
        popup.id = 'rakutenPopup';
        popup.innerHTML = `
            <div class="rakuten-popup-header">
                <h3>🎁 ボーナス獲得チャンス！</h3>
            </div>
            <div class="rakuten-popup-content">
                <p>楽天商品をチェックしてボーナスポイントを獲得しよう！</p>
                <div class="rakuten-popup-products">
                    ${randomProducts.map(product => `
                        <a href="${product.link}" target="_blank" class="rakuten-popup-product" onclick="RakutenAffiliate.trackClick('${product.id}')">
                            <img src="${product.image}" alt="${product.name}">
                            <span>¥${product.price.toLocaleString()}</span>
                        </a>
                    `).join('')}
                </div>
                <button class="check-products-btn" onclick="RakutenAffiliate.openSidebar()">
                    もっと見る
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // アニメーション表示
        setTimeout(() => {
            popup.classList.add('active');
        }, 100);
        
        // 5秒後に自動で閉じる
        setTimeout(() => {
            this.closePopup();
        }, 5000);
    },
    
    // ポップアップを閉じる
    closePopup: function() {
        const popup = document.getElementById('rakutenPopup');
        if (popup) {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    },
    
    // サイドバーを開く
    openSidebar: function() {
        this.closePopup();
        this.toggleSidebar();
    },
    
    // クリック追跡
    trackClick: function(productId) {
        // アナリティクス送信
        if (typeof gtag !== 'undefined') {
            gtag('event', 'rakuten_click', {
                'product_id': productId,
                'user_score': gameState.totalPoints,
                'timestamp': Date.now()
            });
        }
        
        // ローカル統計
        if (!gameState.rakutenStats) {
            gameState.rakutenStats = {
                clicks: 0,
                lastClick: 0
            };
        }
        
        gameState.rakutenStats.clicks++;
        gameState.rakutenStats.lastClick = Date.now();
        
        showNotification('🛒 楽天商品ページを開きました！');
    },
    
    // イベントリスナーを設定
    setupEventListeners: function() {
        // サイドバー外クリックで閉じる
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('rakutenSidebar');
            if (sidebar && this.isSidebarOpen) {
                if (!sidebar.contains(e.target) && !e.target.closest('.rakuten-btn')) {
                    this.toggleSidebar();
                }
            }
        });
        
        // ESCキーでポップアップを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
                if (this.isSidebarOpen) {
                    this.toggleSidebar();
                }
            }
        });
    },
    
    // 定期的なポップアップ表示
    startPeriodicPopup: function() {
        // 10分ごとにポップアップ表示（30%の確率）
        setInterval(() => {
            if (Math.random() < 0.3 && !this.isSidebarOpen) {
                this.showPopup();
            }
        }, 600000); // 10分
    },
    
    // ゲーム進行に応じた商品推薦
    showContextualProducts: function() {
        const score = gameState.totalPoints;
        let category = 'accessory';
        
        if (score > 50000) {
            category = 'gaming'; // 高スコアならゲーム機
        } else if (score > 10000) {
            category = 'furniture'; // 中スコアなら家具
        }
        
        const categoryProducts = RakutenProducts.filter(p => p.category === category);
        if (categoryProducts.length > 0) {
            const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
            this.showProductNotification(randomProduct);
        }
    },
    
    // 商品通知を表示
    showProductNotification: function(product) {
        showNotification(`🛒 ${product.name}がおすすめ！¥${product.price.toLocaleString()}`);
    }
};

// グローバル関数
window.toggleRakutenSidebar = function() {
    RakutenAffiliate.toggleSidebar();
};

// ===== ミニゲームシステム =====

// ミニゲーム管理システム
const MinigameSystem = {
    currentGame: null,
    isActive: false,
    
    // 初期化
    init: function() {
        this.setupEventListeners();
        this.updateMinigameStats();
    },
    
    // イベントリスナー設定
    setupEventListeners: function() {
        const minigameBtn = document.getElementById('minigameBtn');
        const minigamePanel = document.getElementById('minigamePanel');
        const closeMinigameBtn = document.getElementById('closeMinigameBtn');
        
        if (minigameBtn) {
            minigameBtn.addEventListener('click', () => this.openMinigamePanel());
        }
        
        if (closeMinigameBtn) {
            closeMinigameBtn.addEventListener('click', () => this.closeMinigamePanel());
        }
        
        // パネル外クリックで閉じる
        if (minigamePanel) {
            minigamePanel.addEventListener('click', (e) => {
                if (e.target === minigamePanel) {
                    this.closeMinigamePanel();
                }
            });
        }
    },
    
    // ミニゲームパネルを開く
    openMinigamePanel: function() {
        const minigamePanel = document.getElementById('minigamePanel');
        if (minigamePanel) {
            minigamePanel.classList.add('active');
            this.updateMinigameStats();
        }
    },
    
    // ミニゲームパネルを閉じる
    closeMinigamePanel: function() {
        const minigamePanel = document.getElementById('minigamePanel');
        if (minigamePanel) {
            minigamePanel.classList.remove('active');
        }
        this.closeCurrentGame();
    },
    
    // 現在のゲームを閉じる
    closeCurrentGame: function() {
        if (this.currentGame) {
            this.currentGame.close();
            this.currentGame = null;
            this.isActive = false;
        }
    },
    
    // ミニゲーム統計を更新
    updateMinigameStats: function() {
        const stats = gameState.minigames;
        
        // スロットマシン統計
        const slotStats = document.getElementById('slotStats');
        if (slotStats) {
            slotStats.innerHTML = `
                <div>総勝利: ${stats.slotMachine.totalWins}</div>
                <div>ジャックポット: ${stats.slotMachine.jackpotWins}</div>
                <div>総消費: ${formatNumber(stats.slotMachine.totalSpent)}</div>
            `;
        }
        
        // 宝くじ統計
        const lotteryStats = document.getElementById('lotteryStats');
        if (lotteryStats) {
            lotteryStats.innerHTML = `
                <div>総勝利: ${stats.lottery.totalWins}</div>
                <div>最大勝利: ${formatNumber(stats.lottery.biggestWin)}</div>
                <div>総消費: ${formatNumber(stats.lottery.totalSpent)}</div>
            `;
        }
        
        // クイズ統計
        const quizStats = document.getElementById('quizStats');
        if (quizStats) {
            const accuracy = stats.quiz.totalQuestions > 0 ? 
                Math.round((stats.quiz.totalCorrect / stats.quiz.totalQuestions) * 100) : 0;
            quizStats.innerHTML = `
                <div>正解率: ${accuracy}%</div>
                <div>最高連続: ${stats.quiz.bestStreak}</div>
                <div>総問題: ${stats.quiz.totalQuestions}</div>
            `;
        }
        
        // パズル統計
        const puzzleStats = document.getElementById('puzzleStats');
        if (puzzleStats) {
            const bestTimeStr = stats.puzzle.bestTime > 0 ? 
                `${Math.floor(stats.puzzle.bestTime / 60)}:${(stats.puzzle.bestTime % 60).toString().padStart(2, '0')}` : 'なし';
            puzzleStats.innerHTML = `
                <div>完成数: ${stats.puzzle.totalCompleted}</div>
                <div>最短時間: ${bestTimeStr}</div>
                <div>総消費: ${formatNumber(stats.puzzle.totalSpent)}</div>
            `;
        }
    },
    
    // ミニゲームを開始
    startGame: function(gameType) {
        this.closeCurrentGame();
        
        switch(gameType) {
            case 'slot':
                this.currentGame = new SlotMachine();
                break;
            case 'lottery':
                this.currentGame = new Lottery();
                break;
            case 'quiz':
                this.currentGame = new Quiz();
                break;
            case 'puzzle':
                this.currentGame = new Puzzle();
                break;
        }
        
        if (this.currentGame) {
            this.currentGame.start();
            this.isActive = true;
        }
    }
};

// スロットマシン
class SlotMachine {
    constructor() {
        this.symbols = ['🍎', '🍊', '🍇', '🍓', '🍒', '🍋', '🍉', '🍍', '🥝', '🫐'];
        this.reels = 3;
        this.cost = 10;
        this.isSpinning = false;
        this.container = null;
    }
    
    start() {
        this.createUI();
        this.show();
    }
    
    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'minigame-container slot-machine';
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>🎰 スロットマシン</h3>
                <button class="close-minigame" onclick="MinigameSystem.closeCurrentGame()">×</button>
            </div>
            <div class="slot-machine-content">
                <div class="slot-reels">
                    <div class="slot-reel" id="reel1">🎰</div>
                    <div class="slot-reel" id="reel2">🎰</div>
                    <div class="slot-reel" id="reel3">🎰</div>
                </div>
                <div class="slot-controls">
                    <div class="slot-cost">コスト: ${this.cost} ポイント</div>
                    <button class="spin-btn" onclick="slotMachine.spin()" ${this.isSpinning ? 'disabled' : ''}>
                        ${this.isSpinning ? '回転中...' : '🎰 スピン！'}
                    </button>
                </div>
                <div class="slot-payouts">
                    <h4>🎁 配当表</h4>
                    <div class="payout-list">
                        <div>3つ揃い: 50ポイント</div>
                        <div>2つ揃い: 5ポイント</div>
                        <div>🍎🍎🍎: 100ポイント</div>
                        <div>🎰🎰🎰: ジャックポット！</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // グローバル参照を設定
        window.slotMachine = this;
    }
    
    show() {
        this.container.classList.add('active');
    }
    
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    spin() {
        if (this.isSpinning || gameState.points < this.cost) {
            if (gameState.points < this.cost) {
                showNotification('❌ ポイントが足りません！', 'error');
            }
            return;
        }
        
        this.isSpinning = true;
        gameState.points -= this.cost;
        gameState.minigames.slotMachine.totalSpent += this.cost;
        gameState.minigames.slotMachine.lastPlayed = Date.now();
        
        updateDisplay();
        
        const spinBtn = this.container.querySelector('.spin-btn');
        spinBtn.disabled = true;
        spinBtn.textContent = '回転中...';
        
        // リールを回転
        const reels = [
            this.container.querySelector('#reel1'),
            this.container.querySelector('#reel2'),
            this.container.querySelector('#reel3')
        ];
        
        const results = [];
        const spinPromises = [];
        
        reels.forEach((reel, index) => {
            const spinPromise = this.spinReel(reel, index);
            spinPromises.push(spinPromise);
        });
        
        Promise.all(spinPromises).then((reelResults) => {
            results.push(...reelResults);
            this.checkWin(results);
            
            this.isSpinning = false;
            spinBtn.disabled = false;
            spinBtn.textContent = '🎰 スピン！';
        });
    }
    
    spinReel(reel, index) {
        return new Promise((resolve) => {
            const duration = 1000 + (index * 200);
            const symbols = [...this.symbols];
            
            // アニメーション
            let startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // イージング関数
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                const symbolIndex = Math.floor(easeOut * symbols.length * 10) % symbols.length;
                reel.textContent = symbols[symbolIndex];
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // 最終結果を決定
                    const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.textContent = finalSymbol;
                    resolve(finalSymbol);
                }
            };
            
            animate();
        });
    }
    
    checkWin(results) {
        const [symbol1, symbol2, symbol3] = results;
        let winAmount = 0;
        let message = '';
        
        // 3つ揃い
        if (symbol1 === symbol2 && symbol2 === symbol3) {
            if (symbol1 === '🎰') {
                // ジャックポット
                winAmount = 1000;
                message = '🎉 ジャックポット！1000ポイント獲得！';
                gameState.minigames.slotMachine.jackpotWins++;
                
                // 特別エフェクト
                this.createJackpotEffect();
            } else {
                // 通常の3つ揃い
                winAmount = 50;
                message = `🎉 3つ揃い！${symbol1}で50ポイント獲得！`;
            }
        }
        // 2つ揃い
        else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
            winAmount = 5;
            message = `🎉 2つ揃い！5ポイント獲得！`;
        }
        
        if (winAmount > 0) {
            gameState.points += winAmount;
            gameState.minigames.slotMachine.totalWins++;
            showNotification(message, 'success');
            
            // 勝利エフェクト
            this.createWinEffect(winAmount);
        } else {
            showNotification('💔 ハズレ...', 'info');
        }
        
        updateDisplay();
        MinigameSystem.updateMinigameStats();
    }
    
    createJackpotEffect() {
        const effect = document.createElement('div');
        effect.className = 'jackpot-effect';
        effect.innerHTML = `
            <div class="jackpot-text">🎉 JACKPOT! 🎉</div>
            <div class="jackpot-particles"></div>
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 3000);
    }
    
    createWinEffect(amount) {
        const effect = document.createElement('div');
        effect.className = 'win-effect';
        effect.textContent = `+${amount}`;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }
}

// 宝くじ
class Lottery {
    constructor() {
        this.cost = 5;
        this.maxNumber = 100;
        this.container = null;
        this.isDrawing = false;
    }
    
    start() {
        this.createUI();
        this.show();
    }
    
    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'minigame-container lottery';
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>🎫 宝くじ</h3>
                <button class="close-minigame" onclick="MinigameSystem.closeCurrentGame()">×</button>
            </div>
            <div class="lottery-content">
                <div class="lottery-info">
                    <p>1-${this.maxNumber}の数字を選んで、ラッキーナンバーと一致すれば大勝利！</p>
                    <div class="lottery-cost">コスト: ${this.cost} ポイント</div>
                </div>
                <div class="lottery-controls">
                    <input type="number" id="lotteryNumber" min="1" max="${this.maxNumber}" placeholder="1-${this.maxNumber}" class="lottery-input">
                    <button class="draw-btn" onclick="lottery.draw()" ${this.isDrawing ? 'disabled' : ''}>
                        ${this.isDrawing ? '抽選中...' : '🎫 抽選！'}
                    </button>
                </div>
                <div class="lottery-results" id="lotteryResults">
                    <!-- 結果がここに表示される -->
                </div>
                <div class="lottery-payouts">
                    <h4>🎁 配当表</h4>
                    <div class="payout-list">
                        <div>完全一致: 1000ポイント</div>
                        <div>±1: 100ポイント</div>
                        <div>±5: 20ポイント</div>
                        <div>±10: 5ポイント</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // グローバル参照を設定
        window.lottery = this;
    }
    
    show() {
        this.container.classList.add('active');
    }
    
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    draw() {
        if (this.isDrawing || gameState.points < this.cost) {
            if (gameState.points < this.cost) {
                showNotification('❌ ポイントが足りません！', 'error');
            }
            return;
        }
        
        const input = this.container.querySelector('#lotteryNumber');
        const number = parseInt(input.value);
        
        if (!number || number < 1 || number > this.maxNumber) {
            showNotification('❌ 1-100の数字を入力してください！', 'error');
            return;
        }
        
        this.isDrawing = true;
        gameState.points -= this.cost;
        gameState.minigames.lottery.totalSpent += this.cost;
        gameState.minigames.lottery.lastPlayed = Date.now();
        
        updateDisplay();
        
        const drawBtn = this.container.querySelector('.draw-btn');
        drawBtn.disabled = true;
        drawBtn.textContent = '抽選中...';
        
        // 抽選アニメーション
        this.animateDraw(number);
    }
    
    animateDraw(playerNumber) {
        const resultsDiv = this.container.querySelector('#lotteryResults');
        let count = 0;
        const maxCount = 20;
        
        const animate = () => {
            const randomNumber = Math.floor(Math.random() * this.maxNumber) + 1;
            resultsDiv.innerHTML = `
                <div class="drawing-animation">
                    <div class="your-number">あなたの数字: ${playerNumber}</div>
                    <div class="lucky-number">ラッキーナンバー: ${randomNumber}</div>
                </div>
            `;
            
            count++;
            if (count < maxCount) {
                setTimeout(animate, 100);
            } else {
                // 最終結果
                const luckyNumber = Math.floor(Math.random() * this.maxNumber) + 1;
                this.showResult(playerNumber, luckyNumber);
            }
        };
        
        animate();
    }
    
    showResult(playerNumber, luckyNumber) {
        const resultsDiv = this.container.querySelector('#lotteryResults');
        const difference = Math.abs(playerNumber - luckyNumber);
        let winAmount = 0;
        let message = '';
        
        if (difference === 0) {
            winAmount = 1000;
            message = '🎉 完全一致！1000ポイント獲得！';
        } else if (difference === 1) {
            winAmount = 100;
            message = '🎉 ニアミス！100ポイント獲得！';
        } else if (difference <= 5) {
            winAmount = 20;
            message = '🎉 惜しい！20ポイント獲得！';
        } else if (difference <= 10) {
            winAmount = 5;
            message = '🎉 まあまあ！5ポイント獲得！';
        } else {
            message = '💔 ハズレ...';
        }
        
        resultsDiv.innerHTML = `
            <div class="lottery-result">
                <div class="your-number">あなたの数字: ${playerNumber}</div>
                <div class="lucky-number">ラッキーナンバー: ${luckyNumber}</div>
                <div class="result-message">${message}</div>
                ${winAmount > 0 ? `<div class="win-amount">+${winAmount} ポイント</div>` : ''}
            </div>
        `;
        
        if (winAmount > 0) {
            gameState.points += winAmount;
            gameState.minigames.lottery.totalWins++;
            if (winAmount > gameState.minigames.lottery.biggestWin) {
                gameState.minigames.lottery.biggestWin = winAmount;
            }
            
            this.createWinEffect(winAmount);
        }
        
        this.isDrawing = false;
        const drawBtn = this.container.querySelector('.draw-btn');
        drawBtn.disabled = false;
        drawBtn.textContent = '🎫 抽選！';
        
        updateDisplay();
        MinigameSystem.updateMinigameStats();
    }
    
    createWinEffect(amount) {
        const effect = document.createElement('div');
        effect.className = 'win-effect lottery-win';
        effect.textContent = `+${amount}`;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }
}

// クイズ
class Quiz {
    constructor() {
        this.questions = [
            {
                question: '無限クリッカーで最も効率的なアップグレードは？',
                options: ['自動クリッカー', 'クリック倍率', 'クリティカルクリック', '自動クリッカー速度'],
                correct: 0,
                explanation: '自動クリッカーは放置でもポイントを生成するため、最も効率的です！'
            },
            {
                question: 'クリティカルヒットの確率は何%から始まりますか？',
                options: ['0%', '1%', '5%', '10%'],
                correct: 0,
                explanation: 'クリティカルクリックの初期レベルは0%から始まります。'
            },
            {
                question: 'ゲームで使用されているキャラクターは？',
                options: ['犬', '猫', 'うさぎ', 'パンダ'],
                correct: 1,
                explanation: '可愛い猫キャラクターがゲームの主人公です！'
            },
            {
                question: '実績システムで最初に解除できる実績は？',
                options: ['初回クリック', '最初の一歩', 'アップグレード開始', 'クリックマスター'],
                correct: 0,
                explanation: '初回クリックが最初に解除できる実績です！'
            },
            {
                question: '自動クリッカーの基本コストは？',
                options: ['5ポイント', '10ポイント', '15ポイント', '20ポイント'],
                correct: 1,
                explanation: '自動クリッカーの基本コストは10ポイントです。'
            }
        ];
        this.currentQuestion = 0;
        this.container = null;
        this.isAnswered = false;
    }
    
    start() {
        this.createUI();
        this.show();
        this.showQuestion();
    }
    
    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'minigame-container quiz';
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>🧠 クイズ</h3>
                <button class="close-minigame" onclick="MinigameSystem.closeCurrentGame()">×</button>
            </div>
            <div class="quiz-content">
                <div class="quiz-progress">
                    <span id="quizProgress">問題 1/5</span>
                    <span id="quizStreak">連続正解: 0</span>
                </div>
                <div class="quiz-question" id="quizQuestion">
                    <!-- 問題がここに表示される -->
                </div>
                <div class="quiz-options" id="quizOptions">
                    <!-- 選択肢がここに表示される -->
                </div>
                <div class="quiz-explanation" id="quizExplanation" style="display: none;">
                    <!-- 解説がここに表示される -->
                </div>
                <div class="quiz-controls">
                    <button class="next-btn" id="nextBtn" onclick="quiz.nextQuestion()" style="display: none;">
                        次の問題 →
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // グローバル参照を設定
        window.quiz = this;
    }
    
    show() {
        this.container.classList.add('active');
    }
    
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionDiv = this.container.querySelector('#quizQuestion');
        const optionsDiv = this.container.querySelector('#quizOptions');
        const progressDiv = this.container.querySelector('#quizProgress');
        const streakDiv = this.container.querySelector('#quizStreak');
        
        progressDiv.textContent = `問題 ${this.currentQuestion + 1}/${this.questions.length}`;
        streakDiv.textContent = `連続正解: ${gameState.minigames.quiz.streak}`;
        
        questionDiv.innerHTML = `<h4>${question.question}</h4>`;
        
        optionsDiv.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.onclick = () => this.selectAnswer(index);
            optionsDiv.appendChild(button);
        });
        
        this.isAnswered = false;
        this.container.querySelector('#quizExplanation').style.display = 'none';
        this.container.querySelector('#nextBtn').style.display = 'none';
    }
    
    selectAnswer(selectedIndex) {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        const question = this.questions[this.currentQuestion];
        const options = this.container.querySelectorAll('.quiz-option');
        const explanationDiv = this.container.querySelector('#quizExplanation');
        const nextBtn = this.container.querySelector('#nextBtn');
        
        gameState.minigames.quiz.totalQuestions++;
        gameState.minigames.quiz.lastPlayed = Date.now();
        
        // 選択肢のスタイルを更新
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex) {
                option.classList.add('incorrect');
            }
            option.disabled = true;
        });
        
        // 結果を表示
        if (selectedIndex === question.correct) {
            gameState.minigames.quiz.totalCorrect++;
            gameState.minigames.quiz.streak++;
            if (gameState.minigames.quiz.streak > gameState.minigames.quiz.bestStreak) {
                gameState.minigames.quiz.bestStreak = gameState.minigames.quiz.streak;
            }
            
            const winAmount = 10 + (gameState.minigames.quiz.streak * 5);
            gameState.points += winAmount;
            
            showNotification(`🎉 正解！+${winAmount}ポイント獲得！`, 'success');
            this.createWinEffect(winAmount);
        } else {
            gameState.minigames.quiz.streak = 0;
            showNotification('💔 不正解...', 'info');
        }
        
        // 解説を表示
        explanationDiv.innerHTML = `
            <div class="explanation-text">
                <strong>解説:</strong> ${question.explanation}
            </div>
        `;
        explanationDiv.style.display = 'block';
        
        // 次の問題ボタンを表示
        nextBtn.style.display = 'block';
        
        updateDisplay();
        MinigameSystem.updateMinigameStats();
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.questions.length) {
            // クイズ終了
            this.finishQuiz();
        } else {
            this.showQuestion();
        }
    }
    
    finishQuiz() {
        const accuracy = Math.round((gameState.minigames.quiz.totalCorrect / gameState.minigames.quiz.totalQuestions) * 100);
        const bonus = Math.floor(accuracy / 20) * 50; // 20%ごとに50ポイントボーナス
        
        if (bonus > 0) {
            gameState.points += bonus;
            showNotification(`🎉 クイズ完了！正確性ボーナス +${bonus}ポイント！`, 'success');
        }
        
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>🧠 クイズ完了</h3>
                <button class="close-minigame" onclick="MinigameSystem.closeCurrentGame()">×</button>
            </div>
            <div class="quiz-results">
                <h4>🎉 クイズ結果</h4>
                <div class="result-stats">
                    <div>正解数: ${gameState.minigames.quiz.totalCorrect}/${gameState.minigames.quiz.totalQuestions}</div>
                    <div>正確性: ${accuracy}%</div>
                    <div>最高連続: ${gameState.minigames.quiz.bestStreak}</div>
                    ${bonus > 0 ? `<div>ボーナス: +${bonus}ポイント</div>` : ''}
                </div>
            </div>
        `;
        
        updateDisplay();
    }
    
    createWinEffect(amount) {
        const effect = document.createElement('div');
        effect.className = 'win-effect quiz-win';
        effect.textContent = `+${amount}`;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }
}

// パズル（スライドパズル）
class Puzzle {
    constructor() {
        this.size = 3;
        this.cost = 15;
        this.container = null;
        this.tiles = [];
        this.emptyTile = { x: this.size - 1, y: this.size - 1 };
        this.startTime = 0;
        this.isPlaying = false;
    }
    
    start() {
        this.createUI();
        this.show();
        this.initPuzzle();
    }
    
    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'minigame-container puzzle';
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>🧩 スライドパズル</h3>
                <button class="close-minigame" onclick="MinigameSystem.closeCurrentGame()">×</button>
            </div>
            <div class="puzzle-content">
                <div class="puzzle-info">
                    <p>数字を正しい順序に並べて完成させよう！</p>
                    <div class="puzzle-cost">コスト: ${this.cost} ポイント</div>
                    <div class="puzzle-timer" id="puzzleTimer">時間: 00:00</div>
                </div>
                <div class="puzzle-board" id="puzzleBoard">
                    <!-- パズルボードがここに表示される -->
                </div>
                <div class="puzzle-controls">
                    <button class="start-puzzle-btn" onclick="puzzle.startPuzzle()" id="startPuzzleBtn">
                        パズル開始
                    </button>
                    <button class="reset-puzzle-btn" onclick="puzzle.resetPuzzle()" id="resetPuzzleBtn" style="display: none;">
                        リセット
                    </button>
                </div>
                <div class="puzzle-payouts">
                    <h4>🎁 配当表</h4>
                    <div class="payout-list">
                        <div>30秒以内: 200ポイント</div>
                        <div>1分以内: 100ポイント</div>
                        <div>2分以内: 50ポイント</div>
                        <div>完成: 20ポイント</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // グローバル参照を設定
        window.puzzle = this;
    }
    
    show() {
        this.container.classList.add('active');
    }
    
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    initPuzzle() {
        this.tiles = [];
        for (let y = 0; y < this.size; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.size; x++) {
                const value = y * this.size + x + 1;
                if (value < this.size * this.size) {
                    this.tiles[y][x] = value;
                } else {
                    this.tiles[y][x] = 0; // 空のタイル
                }
            }
        }
        this.emptyTile = { x: this.size - 1, y: this.size - 1 };
        this.renderPuzzle();
    }
    
    renderPuzzle() {
        const board = this.container.querySelector('#puzzleBoard');
        board.innerHTML = '';
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const tile = document.createElement('div');
                tile.className = 'puzzle-tile';
                
                if (this.tiles[y][x] === 0) {
                    tile.className += ' empty';
                    tile.textContent = '';
                } else {
                    tile.textContent = this.tiles[y][x];
                    tile.onclick = () => this.moveTile(x, y);
                }
                
                board.appendChild(tile);
            }
        }
    }
    
    moveTile(x, y) {
        if (!this.isPlaying) return;
        
        // 隣接するタイルかチェック
        const dx = Math.abs(x - this.emptyTile.x);
        const dy = Math.abs(y - this.emptyTile.y);
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // タイルを交換
            const temp = this.tiles[y][x];
            this.tiles[y][x] = 0;
            this.tiles[this.emptyTile.y][this.emptyTile.x] = temp;
            this.emptyTile = { x, y };
            
            this.renderPuzzle();
            
            // 完成チェック
            if (this.checkCompletion()) {
                this.completePuzzle();
            }
        }
    }
    
    checkCompletion() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const expected = y * this.size + x + 1;
                if (x === this.size - 1 && y === this.size - 1) {
                    if (this.tiles[y][x] !== 0) return false;
                } else {
                    if (this.tiles[y][x] !== expected) return false;
                }
            }
        }
        return true;
    }
    
    startPuzzle() {
        if (gameState.points < this.cost) {
            showNotification('❌ ポイントが足りません！', 'error');
            return;
        }
        
        gameState.points -= this.cost;
        gameState.minigames.puzzle.totalSpent += this.cost;
        gameState.minigames.puzzle.lastPlayed = Date.now();
        
        this.isPlaying = true;
        this.startTime = Date.now();
        
        // パズルをシャッフル
        this.shufflePuzzle();
        
        // ボタンを更新
        this.container.querySelector('#startPuzzleBtn').style.display = 'none';
        this.container.querySelector('#resetPuzzleBtn').style.display = 'block';
        
        // タイマー開始
        this.startTimer();
        
        updateDisplay();
    }
    
    shufflePuzzle() {
        // ランダムに100回移動
        for (let i = 0; i < 100; i++) {
            const directions = [
                { dx: 0, dy: -1 }, // 上
                { dx: 0, dy: 1 },  // 下
                { dx: -1, dy: 0 }, // 左
                { dx: 1, dy: 0 }   // 右
            ];
            
            const validMoves = directions.filter(dir => {
                const newX = this.emptyTile.x + dir.dx;
                const newY = this.emptyTile.y + dir.dy;
                return newX >= 0 && newX < this.size && newY >= 0 && newY < this.size;
            });
            
            if (validMoves.length > 0) {
                const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                const newX = this.emptyTile.x + move.dx;
                const newY = this.emptyTile.y + move.dy;
                
                // タイルを交換
                const temp = this.tiles[newY][newX];
                this.tiles[newY][newX] = 0;
                this.tiles[this.emptyTile.y][this.emptyTile.x] = temp;
                this.emptyTile = { x: newX, y: newY };
            }
        }
        
        this.renderPuzzle();
    }
    
    startTimer() {
        const timerDiv = this.container.querySelector('#puzzleTimer');
        
        const updateTimer = () => {
            if (!this.isPlaying) return;
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerDiv.textContent = `時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            requestAnimationFrame(updateTimer);
        };
        
        updateTimer();
    }
    
    resetPuzzle() {
        this.isPlaying = false;
        this.initPuzzle();
        this.container.querySelector('#startPuzzleBtn').style.display = 'block';
        this.container.querySelector('#resetPuzzleBtn').style.display = 'none';
        this.container.querySelector('#puzzleTimer').textContent = '時間: 00:00';
    }
    
    completePuzzle() {
        this.isPlaying = false;
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        let winAmount = 20; // 基本報酬
        let message = '🎉 パズル完成！20ポイント獲得！';
        
        if (elapsed <= 30) {
            winAmount = 200;
            message = '🎉 神速！30秒以内で完成！200ポイント獲得！';
        } else if (elapsed <= 60) {
            winAmount = 100;
            message = '🎉 素晴らしい！1分以内で完成！100ポイント獲得！';
        } else if (elapsed <= 120) {
            winAmount = 50;
            message = '🎉 よく頑張った！2分以内で完成！50ポイント獲得！';
        }
        
        gameState.points += winAmount;
        gameState.minigames.puzzle.totalCompleted++;
        
        if (gameState.minigames.puzzle.bestTime === 0 || elapsed < gameState.minigames.puzzle.bestTime) {
            gameState.minigames.puzzle.bestTime = elapsed;
        }
        
        showNotification(message, 'success');
        this.createWinEffect(winAmount);
        
        // 結果表示
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>🧩 パズル完成！</h3>
                <button class="close-minigame" onclick="MinigameSystem.closeCurrentGame()">×</button>
            </div>
            <div class="puzzle-results">
                <h4>🎉 おめでとう！</h4>
                <div class="result-stats">
                    <div>完成時間: ${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}</div>
                    <div>獲得ポイント: +${winAmount}</div>
                    <div>総完成数: ${gameState.minigames.puzzle.totalCompleted}</div>
                </div>
            </div>
        `;
        
        updateDisplay();
        MinigameSystem.updateMinigameStats();
    }
    
    createWinEffect(amount) {
        const effect = document.createElement('div');
        effect.className = 'win-effect puzzle-win';
        effect.textContent = `+${amount}`;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }
}

// ゲーム進行に応じた楽天商品推薦
const originalUnlockAchievement = unlockAchievement;
unlockAchievement = function(achievementId) {
    originalUnlockAchievement(achievementId);
    
    // 実績解除時に楽天商品を推薦（20%の確率）
    if (Math.random() < 0.2) {
        setTimeout(() => {
            RakutenAffiliate.showContextualProducts();
        }, 2000);
    }
};
