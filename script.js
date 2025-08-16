// ゲーム状態
let gameState = {
    points: 0,
    autoClickerLevel: 0,
    clickMultiplierLevel: 1,
    autoClickerSpeedLevel: 1,
    criticalClickLevel: 0,
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
const elements = {
    points: document.getElementById('points'),
    pointsPerSecond: document.getElementById('pointsPerSecond'),
    clickMultiplier: document.getElementById('clickMultiplier'),
    clickButton: document.getElementById('clickButton'),
    clickEffect: document.getElementById('clickEffect'),
    autoClickerLevel: document.getElementById('autoClickerLevel'),
    autoClickerCost: document.getElementById('autoClickerCost'),
    clickMultiplierLevel: document.getElementById('clickMultiplierLevel'),
    clickMultiplierCost: document.getElementById('clickMultiplierCost'),
    autoClickerSpeedLevel: document.getElementById('autoClickerSpeedLevel'),
    autoClickerSpeedCost: document.getElementById('autoClickerSpeedCost'),
    criticalClickLevel: document.getElementById('criticalClickLevel'),
    criticalClickCost: document.getElementById('criticalClickCost'),
    achievements: document.getElementById('achievements'),
    notification: document.getElementById('notification')
};

// スマホ最適化のための設定
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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

// スマホ最適化の設定
function setupMobileOptimizations() {
    // スマホでのダブルタップズームを無効化
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // スマホでのスクロールを滑らかに
    document.addEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });

    // スマホでのタッチフィードバック
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // クリックイベント
    elements.clickButton.addEventListener('click', handleClick);
    
    // タッチイベント（スマホ最適化）
    if (isTouchDevice) {
        elements.clickButton.addEventListener('touchstart', handleTouchStart, { passive: true });
        elements.clickButton.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // キーボードショートカット（デスクトップのみ）
    if (!isMobile) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleClick();
            }
        });
    }
}

// タッチ開始時の処理
function handleTouchStart(event) {
    event.preventDefault();
    elements.clickButton.classList.add('touch-active');
}

// タッチ終了時の処理
function handleTouchEnd(event) {
    event.preventDefault();
    elements.clickButton.classList.remove('touch-active');
    handleClick();
}

// クリック処理
function handleClick() {
    const basePoints = 1;
    let pointsGained = basePoints * gameState.clickMultiplierLevel;
    
    // クリティカルヒット判定
    const criticalChance = gameState.criticalClickLevel * 0.1; // 10% per level
    const isCritical = Math.random() < criticalChance;
    
    if (isCritical) {
        pointsGained *= 3; // クリティカルヒットは3倍
        showClickEffect(pointsGained, true);
        unlockAchievement('critical_hit');
    } else {
        showClickEffect(pointsGained, false);
    }
    
    gameState.points += pointsGained;
    gameState.totalClicks++;
    gameState.totalPoints += pointsGained;
    
    // アニメーション効果
    elements.clickButton.classList.add('pulse');
    setTimeout(() => {
        elements.clickButton.classList.remove('pulse');
    }, 300);
    
    updateDisplay();
    checkAchievements();
}

// クリックエフェクト表示
function showClickEffect(points, isCritical) {
    const effect = document.createElement('span');
    effect.textContent = `+${Math.floor(points)}`;
    effect.style.color = isCritical ? '#ffd700' : '#ff6b6b';
    effect.style.fontSize = isCritical ? '1.5rem' : '1.2rem';
    effect.style.fontWeight = 'bold';
    
    // ランダムな位置に配置
    const rect = elements.clickButton.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    elements.clickEffect.appendChild(effect);
    
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

// アップグレード購入関数
function buyAutoClicker() {
    const cost = upgradeCosts.autoClicker(gameState.autoClickerLevel);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerLevel++;
        unlockAchievement('auto_clicker');
        showNotification('自動クリッカーを購入しました！');
        updateDisplay();
    } else {
        showNotification('ポイントが足りません！', 'error');
    }
}

function buyClickMultiplier() {
    const cost = upgradeCosts.clickMultiplier(gameState.clickMultiplierLevel - 1);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.clickMultiplierLevel++;
        showNotification('クリック倍率をアップグレードしました！');
        updateDisplay();
    } else {
        showNotification('ポイントが足りません！', 'error');
    }
}

function buyAutoClickerSpeed() {
    const cost = upgradeCosts.autoClickerSpeed(gameState.autoClickerSpeedLevel - 1);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerSpeedLevel++;
        showNotification('自動クリッカー速度をアップグレードしました！');
        updateDisplay();
    } else {
        showNotification('ポイントが足りません！', 'error');
    }
}

function buyCriticalClick() {
    const cost = upgradeCosts.criticalClick(gameState.criticalClickLevel);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.criticalClickLevel++;
        showNotification('クリティカルヒット確率をアップグレードしました！');
        updateDisplay();
    } else {
        showNotification('ポイントが足りません！', 'error');
    }
}

// 表示更新
function updateDisplay() {
    // ポイント表示
    elements.points.textContent = formatNumber(gameState.points);
    elements.pointsPerSecond.textContent = formatNumber(gameState.autoClickerLevel * gameState.autoClickerSpeedLevel);
    elements.clickMultiplier.textContent = gameState.clickMultiplierLevel;
    
    // アップグレード情報更新
    elements.autoClickerLevel.textContent = gameState.autoClickerLevel;
    elements.autoClickerCost.textContent = formatNumber(upgradeCosts.autoClicker(gameState.autoClickerLevel));
    
    elements.clickMultiplierLevel.textContent = gameState.clickMultiplierLevel;
    elements.clickMultiplierCost.textContent = formatNumber(upgradeCosts.clickMultiplier(gameState.clickMultiplierLevel - 1));
    
    elements.autoClickerSpeedLevel.textContent = gameState.autoClickerSpeedLevel;
    elements.autoClickerSpeedCost.textContent = formatNumber(upgradeCosts.autoClickerSpeed(gameState.autoClickerSpeedLevel - 1));
    
    elements.criticalClickLevel.textContent = gameState.criticalClickLevel;
    elements.criticalClickCost.textContent = formatNumber(upgradeCosts.criticalClick(gameState.criticalClickLevel));
    
    // ボタンの有効/無効状態更新
    updateUpgradeButtons();
}

// アップグレードボタンの状態更新
function updateUpgradeButtons() {
    const buttons = document.querySelectorAll('.upgrade-btn');
    const costs = [
        upgradeCosts.autoClicker(gameState.autoClickerLevel),
        upgradeCosts.clickMultiplier(gameState.clickMultiplierLevel - 1),
        upgradeCosts.autoClickerSpeed(gameState.autoClickerSpeedLevel - 1),
        upgradeCosts.criticalClick(gameState.criticalClickLevel)
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

// 実績解除
function unlockAchievement(achievementId) {
    if (!gameState.achievements.includes(achievementId)) {
        gameState.achievements.push(achievementId);
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
            showNotification(`🏆 実績解除: ${achievement.name}`, 'achievement');
            renderAchievements();
        }
    }
}

// 実績表示
function renderAchievements() {
    elements.achievements.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = gameState.achievements.includes(achievement.id);
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
        achievementElement.innerHTML = `
            <div>${achievement.name}</div>
            <div style="font-size: 0.8rem; opacity: 0.8;">${achievement.description}</div>
        `;
        elements.achievements.appendChild(achievementElement);
    });
}

// 通知表示
function showNotification(message, type = 'success') {
    elements.notification.textContent = message;
    elements.notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
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
            gameState = JSON.parse(saved);
            showNotification('ゲームを読み込みました！');
        } catch (e) {
            console.error('セーブデータの読み込みに失敗しました:', e);
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
            autoClickerSpeedLevel: 1,
            criticalClickLevel: 0,
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
document.addEventListener('DOMContentLoaded', init);

// ページ離脱時に自動保存
window.addEventListener('beforeunload', saveGame);
