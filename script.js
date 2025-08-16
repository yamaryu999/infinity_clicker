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
    // キャラクターの表情を変更
    changeExpression: function(expression) {
        const mouth = mainCharacter.querySelector('.character-mouth');
        const eyes = mainCharacter.querySelectorAll('.eye');
        
        switch(expression) {
            case 'happy':
                mouth.textContent = '😊';
                eyes.forEach(eye => eye.textContent = '👁️');
                break;
            case 'excited':
                mouth.textContent = '😄';
                eyes.forEach(eye => eye.textContent = '🤩');
                break;
            case 'surprised':
                mouth.textContent = '😲';
                eyes.forEach(eye => eye.textContent = '😳');
                break;
            case 'cool':
                mouth.textContent = '😎';
                eyes.forEach(eye => eye.textContent = '😏');
                break;
            case 'sleepy':
                mouth.textContent = '😴';
                eyes.forEach(eye => eye.textContent = '😪');
                break;
            default:
                mouth.textContent = '😊';
                eyes.forEach(eye => eye.textContent = '👁️');
        }
    },

    // キャラクターをクリックアニメーション
    clickAnimation: function() {
        mainCharacter.classList.add('clicked');
        setTimeout(() => {
            mainCharacter.classList.remove('clicked');
        }, 300);
    },

    // レベルアップアニメーション
    levelUpAnimation: function() {
        mainCharacter.classList.add('levelup');
        this.changeExpression('excited');
        setTimeout(() => {
            mainCharacter.classList.remove('levelup');
            this.changeExpression('happy');
        }, 1000);
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
        const emojis = ['⭐', '💎', '🚀', '🌟', '🎯', '💫', '✨', '🔥'];
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
        const emojis = ['🚀', '⭐', '💎', '🎯', '🌟', '💫', '✨', '🔥', '🎪', '🎨', '🎭', '🎪'];
        
        floatingChars.forEach(char => {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            char.textContent = randomEmoji;
            char.setAttribute('data-char', randomEmoji);
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
    
    // ゲームループ開始
    setInterval(gameLoop, 1000);
    updateDisplay();
    renderAchievements();
});

// ページ離脱時に自動保存
window.addEventListener('beforeunload', saveGame);
