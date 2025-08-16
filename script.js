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
    achievements: []
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

// モバイル検出
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// アップグレードコスト計算関数
function calculateUpgradeCost(level, baseCost) {
    return Math.floor(baseCost * Math.pow(1.15, level));
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
        const emojis = ['⭐', '💎', '🚀', '🌟', '🎯', '💫', '✨', '🔥', '🌸', '🍀', '🌈', '🎪'];
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

// 初期化
function init() {
    loadGame();
    updateDisplay();
    setupEventListeners();
    startAutoClicker();
    renderAchievements();
    setupMobileOptimizations();
    
    // 1秒ごとに自動クリッカーを実行
    setInterval(() => {
        autoClick();
        updateDisplay();
    }, 1000);
}

// イベントリスナー設定
function setupEventListeners() {
    // クリックイベント
    clickButton.addEventListener('click', handleClick);
    
    // タッチイベント（スマホ最適化）
    if (isTouchDevice) {
        clickButton.addEventListener('touchstart', handleTouchStart, { passive: true });
        clickButton.addEventListener('touchend', handleTouchEnd, { passive: true });
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

// タッチ開始時の処理
function handleTouchStart(event) {
    event.preventDefault();
    clickButton.classList.add('touch-active');
}

// タッチ終了時の処理
function handleTouchEnd(event) {
    event.preventDefault();
    clickButton.classList.remove('touch-active');
    handleClick();
}

// クリック処理を更新
function handleClick() {
    const points = gameState.clickMultiplier;
    gameState.points += points;
    gameState.totalClicks++;
    gameState.totalPoints += points;
    
    // クリティカルヒット判定
    if (Math.random() < gameState.criticalClickChance) {
        const criticalPoints = points * 3;
        gameState.points += criticalPoints * 2; // 追加で3倍
        gameState.totalPoints += criticalPoints * 2;
        showNotification(`💥 クリティカルヒット! +${formatNumber(criticalPoints * 3)}`, 'critical');
        CharacterManager.changeExpression('surprised');
        CharacterManager.createParticleBurst(50, 50, 8);
    } else {
        showNotification(`+${formatNumber(points)}`, 'click');
        CharacterManager.createParticle(50, 50, '⭐');
    }
    
    // キャラクターアニメーション
    CharacterManager.clickAnimation();
    
    // クリックエフェクト
    createClickEffect();
    
    updateDisplay();
    checkAchievements();
}

// クリックエフェクト作成
function createClickEffect() {
    const effect = document.createElement('span');
    effect.textContent = `+${gameState.clickMultiplier}`;
    effect.style.color = '#ff6b6b';
    effect.style.fontSize = '1.2rem';
    effect.style.fontWeight = 'bold';
    effect.style.position = 'absolute';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '1000';
    
    // ランダムな位置に配置
    const rect = clickButton.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    clickEffect.appendChild(effect);
    
    // アニメーション終了後に要素を削除
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// 自動クリッカー
function autoClick() {
    if (gameState.autoClickerLevel > 0) {
        const autoPoints = gameState.autoClickerLevel * gameState.autoClickerSpeedLevel;
        gameState.points += autoPoints;
        gameState.totalPoints += autoPoints;
    }
}

// アップグレード購入関数を更新
function buyAutoClicker() {
    const cost = calculateUpgradeCost(gameState.autoClickerLevel, 10);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerLevel++;
        showNotification(`🤖 自動クリッカー Lv.${gameState.autoClickerLevel} 購入!`, 'upgrade');
        CharacterManager.changeExpression('excited');
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        CharacterManager.changeExpression('sleepy');
    }
}

function buyClickMultiplier() {
    const cost = calculateUpgradeCost(gameState.clickMultiplierLevel, 50);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.clickMultiplierLevel++;
        gameState.clickMultiplier = gameState.clickMultiplierLevel; // 確実に更新
        showNotification(`⚡ クリック倍率 Lv.${gameState.clickMultiplierLevel} 購入!`, 'upgrade');
        CharacterManager.changeExpression('cool');
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        CharacterManager.changeExpression('sleepy');
    }
}

function buyAutoClickerSpeed() {
    const cost = calculateUpgradeCost(gameState.autoClickerSpeedLevel, 100);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerSpeedLevel++;
        showNotification(`🚀 自動クリッカー速度 Lv.${gameState.autoClickerSpeedLevel} 購入!`, 'upgrade');
        CharacterManager.changeExpression('excited');
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        CharacterManager.changeExpression('sleepy');
    }
}

function buyCriticalClick() {
    const cost = calculateUpgradeCost(gameState.criticalClickLevel, 200);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.criticalClickLevel++;
        gameState.criticalClickChance = gameState.criticalClickLevel * 0.01;
        showNotification(`💥 クリティカルクリック Lv.${gameState.criticalClickLevel} 購入!`, 'upgrade');
        CharacterManager.changeExpression('surprised');
        updateDisplay();
        checkAchievements();
    } else {
        showNotification('❌ ポイントが足りません!', 'error');
        CharacterManager.changeExpression('sleepy');
    }
}

// 表示更新
function updateDisplay() {
    // ポイント表示
    pointsElement.textContent = formatNumber(gameState.points);
    pointsPerSecondElement.textContent = formatNumber(gameState.autoClickerLevel * gameState.autoClickerSpeedLevel);
    clickMultiplierElement.textContent = gameState.clickMultiplier;
    
    // アップグレード情報更新
    autoClickerLevelElement.textContent = gameState.autoClickerLevel;
    autoClickerCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.autoClickerLevel, 10));
    
    clickMultiplierLevelElement.textContent = gameState.clickMultiplierLevel;
    clickMultiplierCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.clickMultiplierLevel, 50));
    
    autoClickerSpeedLevelElement.textContent = gameState.autoClickerSpeedLevel;
    autoClickerSpeedCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.autoClickerSpeedLevel, 100));
    
    criticalClickLevelElement.textContent = gameState.criticalClickLevel;
    criticalClickCostElement.textContent = formatNumber(calculateUpgradeCost(gameState.criticalClickLevel, 200));
    
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
        button.disabled = gameState.points < costs[index];
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
                    // この実績は別途処理
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
            CharacterManager.levelUpAnimation();
            CharacterManager.createParticleBurst(50, 50, 10);
            renderAchievements();
        }
    }
}

// 実績表示
function renderAchievements() {
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
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 数値フォーマット
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

// ゲーム保存
function saveGame() {
    localStorage.setItem('idleClickerSave', JSON.stringify(gameState));
    showNotification('ゲームを保存しました！');
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
            
            gameState = loadedState;
            showNotification('ゲームを読み込みました！');
        } catch (e) {
            console.error('セーブデータの読み込みに失敗しました:', e);
            // エラーが発生した場合はデフォルト状態で開始
            gameState = {
                points: 0,
                autoClickerLevel: 0,
                clickMultiplierLevel: 1,
                clickMultiplier: 1,
                autoClickerSpeedLevel: 1,
                criticalClickLevel: 0,
                criticalClickChance: 0,
                totalClicks: 0,
                totalPoints: 0,
                achievements: []
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
            achievements: []
        };
        localStorage.removeItem('idleClickerSave');
        updateDisplay();
        renderAchievements();
        showNotification('ゲームをリセットしました');
    }
}

// 自動クリッカー開始
function startAutoClicker() {
    // 既に設定済み
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
    loadGame();
    setupEventListeners();
    setupMobileOptimizations();
    
    // キャラクターの初期設定
    CharacterManager.changeExpression('happy');
    
    // 定期的に浮遊キャラクターを変更
    setInterval(() => {
        CharacterManager.randomizeFloatingChars();
    }, 10000);
    
    // 定期的に環境エフェクトを更新
    setInterval(() => {
        CharacterManager.updateEnvironment();
    }, 15000);
    
    // 定期的にランダムな表情変化
    setInterval(() => {
        if (Math.random() < 0.3) { // 30%の確率
            CharacterManager.randomExpression();
        }
    }, 8000);
    
    // 定期的にランダムな特別アニメーション
    setInterval(() => {
        if (Math.random() < 0.2) { // 20%の確率
            const animations = ['stretching', 'bouncing', 'wiggling', 'pulsing', 'rocking', 'swaying', 'hopping'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            CharacterManager.playSpecialAnimation(randomAnimation);
        }
    }, 12000);
    
    // 定期的にキラキラエフェクト
    setInterval(() => {
        if (Math.random() < 0.15) { // 15%の確率
            CharacterManager.createSparkleEffect(true);
        }
    }, 6000);
    
    // ゲームループ開始
    setInterval(gameLoop, 1000);
    updateDisplay();
    renderAchievements();
});

// ページ離脱時に自動保存
window.addEventListener('beforeunload', saveGame);
