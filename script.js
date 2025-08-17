// ゲーム状態
let gameState = {
    points: 0,
    autoClickerLevel: 0,
    clickMultiplierLevel: 1,
    clickMultiplier: 1,
    autoClickerSpeedLevel: 1,
    criticalClickLevel: 0,
    criticalClickChance: 0,
    totalClicks: 0,
    totalPoints: 0
};

// アップグレードコスト計算
const upgradeCosts = {
    autoClicker: (level) => Math.floor(10 * Math.pow(1.15, level)),
    clickMultiplier: (level) => Math.floor(25 * Math.pow(1.2, level)),
    autoClickerSpeed: (level) => Math.floor(75 * Math.pow(1.25, level)),
    criticalClick: (level) => Math.floor(150 * Math.pow(1.3, level))
};

// DOM要素
let pointsElement, pointsPerSecondElement, clickMultiplierElement, clickButton, clickEffect;
let notification, autoClickerLevelElement, autoClickerCostElement, clickMultiplierLevelElement, clickMultiplierCostElement;
let autoClickerSpeedLevelElement, autoClickerSpeedCostElement, criticalClickLevelElement, criticalClickCostElement;

// 初期化
function initializeGame() {
    initializeDOMElements();
    loadGame();
    setupEventListeners();
    updateDisplay();
    startGameLoop();
}

// DOM要素の初期化
function initializeDOMElements() {
    pointsElement = document.getElementById('points');
    pointsPerSecondElement = document.getElementById('pointsPerSecond');
    clickMultiplierElement = document.getElementById('clickMultiplier');
    clickButton = document.getElementById('clickButton');
    clickEffect = document.getElementById('clickEffect');
    notification = document.getElementById('notification');
    
    // アップグレード要素
    autoClickerLevelElement = document.getElementById('autoClickerLevel');
    autoClickerCostElement = document.getElementById('autoClickerCost');
    clickMultiplierLevelElement = document.getElementById('clickMultiplierLevel');
    clickMultiplierCostElement = document.getElementById('clickMultiplierCost');
    autoClickerSpeedLevelElement = document.getElementById('autoClickerSpeedLevel');
    autoClickerSpeedCostElement = document.getElementById('autoClickerSpeedCost');
    criticalClickLevelElement = document.getElementById('criticalClickLevel');
    criticalClickCostElement = document.getElementById('criticalClickCost');
}

// イベントリスナーの設定
function setupEventListeners() {
    if (clickButton) {
        clickButton.addEventListener('click', handleClick);
        
        // タッチイベント（モバイル最適化）
        if ('ontouchstart' in window) {
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
    
    // キーボードショートカット
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            handleClick();
        }
    });
    
    // ナビゲーションメニュー
    setupNavigationMenu();
}

// ナビゲーションメニューの設定
function setupNavigationMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
        
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        }
        
        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (navMenu && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
        
        // ESCキーでメニューを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// クリック処理
function handleClick() {
    gameState.totalClicks++;
    
    // 基本ポイント計算
    let pointsGained = gameState.clickMultiplier;
    
    // クリティカルヒット判定
    if (Math.random() < gameState.criticalClickChance) {
        pointsGained *= 3;
        showNotification('💥 クリティカルヒット！3倍のポイント！', 'success');
        createFloatingNumber(`+${formatNumber(pointsGained)}`, clickButton, 'critical');
    } else {
        createFloatingNumber(`+${formatNumber(pointsGained)}`, clickButton, 'normal');
    }
    
    // ポイント加算
    gameState.points += pointsGained;
    gameState.totalPoints += pointsGained;
    
    // クリックエフェクト
    createClickEffect();
    
    // 表示更新
    updateDisplay();
    updateUpgradeButtons();
}

// クリックエフェクト作成
function createClickEffect() {
    if (!clickButton) return;
    
    const rect = clickButton.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    
    const effect = document.createElement('span');
    effect.textContent = '✨';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    
    clickEffect.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.remove();
        }
    }, 1000);
}

// アップグレード購入関数
function buyAutoClicker() {
    const cost = upgradeCosts.autoClicker(gameState.autoClickerLevel);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerLevel++;
        showNotification(`🤖 自動クリッカー Lv.${gameState.autoClickerLevel} 購入！`, 'success');
        updateDisplay();
        updateUpgradeButtons();
    } else {
        showNotification('❌ ポイントが足りません！', 'error');
    }
}

function buyClickMultiplier() {
    const cost = upgradeCosts.clickMultiplier(gameState.clickMultiplierLevel);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.clickMultiplierLevel++;
        gameState.clickMultiplier = gameState.clickMultiplierLevel;
        showNotification(`⚡ クリック倍率 Lv.${gameState.clickMultiplierLevel} 購入！`, 'success');
        updateDisplay();
        updateUpgradeButtons();
    } else {
        showNotification('❌ ポイントが足りません！', 'error');
    }
}

function buyAutoClickerSpeed() {
    const cost = upgradeCosts.autoClickerSpeed(gameState.autoClickerSpeedLevel);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.autoClickerSpeedLevel++;
        showNotification(`🚀 自動クリッカー速度 Lv.${gameState.autoClickerSpeedLevel} 購入！`, 'success');
        updateDisplay();
        updateUpgradeButtons();
    } else {
        showNotification('❌ ポイントが足りません！', 'error');
    }
}

function buyCriticalClick() {
    const cost = upgradeCosts.criticalClick(gameState.criticalClickLevel);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        gameState.criticalClickLevel++;
        gameState.criticalClickChance = gameState.criticalClickLevel * 0.01;
        showNotification(`💥 クリティカルクリック Lv.${gameState.criticalClickLevel} 購入！`, 'success');
        updateDisplay();
        updateUpgradeButtons();
    } else {
        showNotification('❌ ポイントが足りません！', 'error');
    }
}

// 表示更新
function updateDisplay() {
    if (pointsElement) pointsElement.textContent = formatNumber(gameState.points);
    if (pointsPerSecondElement) {
        const pointsPerSecond = gameState.autoClickerLevel * gameState.autoClickerSpeedLevel;
        pointsPerSecondElement.textContent = formatNumber(pointsPerSecond);
    }
    if (clickMultiplierElement) clickMultiplierElement.textContent = gameState.clickMultiplier;
    
    updateUpgradeUI();
}

// アップグレードUI更新
function updateUpgradeUI() {
    if (autoClickerLevelElement) autoClickerLevelElement.textContent = gameState.autoClickerLevel;
    if (autoClickerCostElement) autoClickerCostElement.textContent = formatNumber(upgradeCosts.autoClicker(gameState.autoClickerLevel));
    
    if (clickMultiplierLevelElement) clickMultiplierLevelElement.textContent = gameState.clickMultiplierLevel;
    if (clickMultiplierCostElement) clickMultiplierCostElement.textContent = formatNumber(upgradeCosts.clickMultiplier(gameState.clickMultiplierLevel));
    
    if (autoClickerSpeedLevelElement) autoClickerSpeedLevelElement.textContent = gameState.autoClickerSpeedLevel;
    if (autoClickerSpeedCostElement) autoClickerSpeedCostElement.textContent = formatNumber(upgradeCosts.autoClickerSpeed(gameState.autoClickerSpeedLevel));
    
    if (criticalClickLevelElement) criticalClickLevelElement.textContent = (gameState.criticalClickChance * 100).toFixed(1);
    if (criticalClickCostElement) criticalClickCostElement.textContent = formatNumber(upgradeCosts.criticalClick(gameState.criticalClickLevel));
}

// アップグレードボタンの状態更新
function updateUpgradeButtons() {
    const buttons = document.querySelectorAll('.upgrade-btn');
    const costs = [
        upgradeCosts.autoClicker(gameState.autoClickerLevel),
        upgradeCosts.clickMultiplier(gameState.clickMultiplierLevel),
        upgradeCosts.autoClickerSpeed(gameState.autoClickerSpeedLevel),
        upgradeCosts.criticalClick(gameState.criticalClickLevel)
    ];
    
    buttons.forEach((button, index) => {
        if (button) {
            button.disabled = gameState.points < costs[index];
        }
    });
}

// ゲームループ
function gameLoop() {
    const autoClickerPoints = gameState.autoClickerLevel * gameState.autoClickerSpeedLevel;
    if (autoClickerPoints > 0) {
        gameState.points += autoClickerPoints;
        gameState.totalPoints += autoClickerPoints;
        updateDisplay();
    }
}

// ゲームループ開始
function startGameLoop() {
    setInterval(gameLoop, 1000);
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

// フローティング数値作成
function createFloatingNumber(text, element, type = 'normal') {
    const floatingContainer = document.getElementById('floatingNumbers');
    if (!floatingContainer || !element) return;
    
    const floating = document.createElement('div');
    floating.className = `floating-number ${type}`;
    floating.textContent = text;
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 50;
    const y = rect.top + rect.height / 2;
    
    floating.style.left = x + 'px';
    floating.style.top = y + 'px';
    
    floatingContainer.appendChild(floating);
    
    setTimeout(() => {
        if (floating.parentNode) {
            floating.parentNode.removeChild(floating);
        }
    }, 2000);
}

// 数値フォーマット
function formatNumber(num) {
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
        localStorage.setItem('stylishClickerSave', JSON.stringify(gameState));
        showNotification('💾 ゲームを保存しました！', 'success');
    } catch (e) {
        console.error('ゲームの保存に失敗しました:', e);
        showNotification('❌ ゲームの保存に失敗しました', 'error');
    }
}

// ゲーム読み込み
function loadGame() {
    const saved = localStorage.getItem('stylishClickerSave');
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
            
            gameState = loadedState;
            showNotification('📂 ゲームを読み込みました！', 'success');
        } catch (e) {
            console.error('セーブデータの読み込みに失敗しました:', e);
            showNotification('❌ セーブデータの読み込みに失敗しました', 'error');
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
            clickMultiplier: 1,
            autoClickerSpeedLevel: 1,
            criticalClickLevel: 0,
            criticalClickChance: 0,
            totalClicks: 0,
            totalPoints: 0
        };
        localStorage.removeItem('stylishClickerSave');
        updateDisplay();
        showNotification('🔄 ゲームをリセットしました', 'success');
    }
}

// シェア機能
function shareToX() {
    const text = `✨ スタイリッシュクリッカーで${formatNumber(gameState.totalPoints)}ポイント獲得！`;
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
}

function copyShareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('📋 リンクをコピーしました！', 'success');
    }).catch(() => {
        showNotification('❌ リンクのコピーに失敗しました', 'error');
    });
}

// ページ離脱時に自動保存
window.addEventListener('beforeunload', function() {
    try {
        saveGame();
    } catch (e) {
        console.error('自動保存に失敗しました:', e);
    }
});

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', initializeGame);
