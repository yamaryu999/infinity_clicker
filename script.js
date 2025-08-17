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
    totalPoints: 0,
    // コンボシステム
    comboCount: 0,
    maxCombo: 0,
    comboMultiplier: 1,
    lastClickTime: 0,
    comboTimeout: 2000 // 2秒でコンボリセット
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
let comboElement, comboMultiplierElement;
let loadingScreen, gameContainer, progressFill, loadingText, loadingTip, tooltip;

// ローディング画面のヒント
const loadingTips = [
    "ヒント: 連続クリックでコンボを積み重ねよう！",
    "ヒント: 自動クリッカーで効率的にポイントを稼ごう！",
    "ヒント: クリティカルヒットで3倍のポイントを獲得！",
    "ヒント: アップグレードの順序を考えて効率化しよう！",
    "ヒント: コンボを維持すると倍率が上がります！"
];

// 初期化
function initializeGame() {
    initializeDOMElements();
    setupMobileViewport();
    setupLoadingScreen();
    setupEventListeners();
    setupTooltips();
    startGameLoop();
    startComboCheck();
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
    
    // コンボ要素
    comboElement = document.getElementById('combo');
    comboMultiplierElement = document.getElementById('comboMultiplier');
    
    // ローディング要素
    loadingScreen = document.getElementById('loadingScreen');
    gameContainer = document.getElementById('gameContainer');
    progressFill = document.getElementById('progressFill');
    loadingText = document.getElementById('loadingText');
    loadingTip = document.getElementById('loadingTip');
    
    // ツールチップ
    tooltip = document.getElementById('tooltip');
}

// ローディング画面の設定
function setupLoadingScreen() {
    let progress = 0;
    const loadingSteps = [
        { progress: 20, text: "ゲームデータを読み込み中..." },
        { progress: 40, text: "アセットを初期化中..." },
        { progress: 60, text: "UIを構築中..." },
        { progress: 80, text: "ゲームシステムを起動中..." },
        { progress: 100, text: "完了！" }
    ];
    
    let currentStep = 0;
    
    const updateProgress = () => {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            progress = step.progress;
            
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
            
            if (loadingText) {
                loadingText.textContent = step.text;
            }
            
            currentStep++;
            
            if (progress < 100) {
                setTimeout(updateProgress, 800);
            } else {
                setTimeout(completeLoading, 500);
            }
        }
    };
    
    // ヒントの切り替え
    let tipIndex = 0;
    const updateTip = () => {
        if (loadingTip) {
            loadingTip.textContent = loadingTips[tipIndex];
            tipIndex = (tipIndex + 1) % loadingTips.length;
        }
    };
    
    setInterval(updateTip, 3000);
    
    // ローディング開始
    setTimeout(updateProgress, 500);
}

// ローディング完了
function completeLoading() {
    loadGame();
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (gameContainer) {
            gameContainer.style.opacity = '1';
        }
        
        updateDisplay();
        showNotification('🎉 ゲームの準備が完了しました！', 'success');
    }, 300);
}

// ツールチップの設定
function setupTooltips() {
    // モバイルではツールチップを無効化
    if (window.innerWidth <= 768) return;
    
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltipText = e.target.getAttribute('data-tooltip');
            showTooltip(tooltipText, e);
        });
        
        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

// ツールチップ表示
function showTooltip(text, event) {
    if (!tooltip) return;
    
    tooltip.textContent = text;
    tooltip.classList.add('show');
    
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 8;
    
    // 画面外に出ないように調整
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 8) {
        top = rect.bottom + 8;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// ツールチップ非表示
function hideTooltip() {
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    if (clickButton) {
        clickButton.addEventListener('click', handleClick);
        
        // モバイル最適化されたタッチイベント
        if ('ontouchstart' in window) {
            setupMobileTouchEvents();
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
    
    // リップルエフェクト
    setupRippleEffects();
    
    // スワイプジェスチャー
    setupSwipeGestures();
}

// モバイルタッチイベントの設定
function setupMobileTouchEvents() {
    let touchStartTime = 0;
    let touchStartY = 0;
    let isScrolling = false;
    
    // タッチ開始
    clickButton.addEventListener('touchstart', function(event) {
        event.preventDefault();
        touchStartTime = Date.now();
        touchStartY = event.touches[0].clientY;
        isScrolling = false;
        
        // タッチフィードバック
        this.classList.add('touch-active');
        createTouchFeedback(this, event.touches[0]);
    }, { passive: false });
    
    // タッチ移動
    clickButton.addEventListener('touchmove', function(event) {
        const touchY = event.touches[0].clientY;
        const deltaY = Math.abs(touchY - touchStartY);
        
        // スクロール判定
        if (deltaY > 10) {
            isScrolling = true;
            this.classList.remove('touch-active');
        }
    }, { passive: true });
    
    // タッチ終了
    clickButton.addEventListener('touchend', function(event) {
        event.preventDefault();
        const touchDuration = Date.now() - touchStartTime;
        
        this.classList.remove('touch-active');
        
        // スクロールでない場合のみクリック処理
        if (!isScrolling && touchDuration < 500) {
            handleClick();
        }
    }, { passive: false });
    
    // タッチキャンセル
    clickButton.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
    }, { passive: true });
}

// タッチフィードバック作成
function createTouchFeedback(element, touch) {
    const feedback = document.createElement('div');
    feedback.className = 'touch-feedback';
    
    const rect = element.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    feedback.style.left = x + 'px';
    feedback.style.top = y + 'px';
    
    element.appendChild(feedback);
    
    // アニメーション開始
    requestAnimationFrame(() => {
        feedback.classList.add('active');
    });
    
    // アニメーション終了
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 300);
}

// スワイプジェスチャーの設定
function setupSwipeGestures() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    let startX = 0;
    let startY = 0;
    let isSwiping = false;
    
    // スワイプ開始
    document.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        isSwiping = false;
    }, { passive: true });
    
    // スワイプ移動
    document.addEventListener('touchmove', function(event) {
        if (!startX || !startY) return;
        
        const deltaX = event.touches[0].clientX - startX;
        const deltaY = event.touches[0].clientY - startY;
        
        // 水平スワイプ判定
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            isSwiping = true;
            
            // 右から左へのスワイプでメニューを開く
            if (deltaX < -50 && !navMenu.classList.contains('active')) {
                navMenu.classList.add('active');
            }
            // 左から右へのスワイプでメニューを閉じる
            else if (deltaX > 50 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    }, { passive: true });
    
    // スワイプ終了
    document.addEventListener('touchend', function() {
        startX = 0;
        startY = 0;
        isSwiping = false;
    }, { passive: true });
}

// リップルエフェクトの設定（モバイル対応）
function setupRippleEffects() {
    const buttons = document.querySelectorAll('.upgrade-btn, .nav-btn, .menu-btn, .close-menu');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                // タッチイベントとマウスイベントの座標取得
                let x, y;
                if (e.touches && e.touches[0]) {
                    x = e.touches[0].clientX - rect.left - size / 2;
                    y = e.touches[0].clientY - rect.top - size / 2;
                } else {
                    x = e.clientX - rect.left - size / 2;
                    y = e.clientY - rect.top - size / 2;
                }
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.transform = 'scale(0)';
                ripple.style.opacity = '1';
                
                setTimeout(() => {
                    ripple.style.transform = 'scale(4)';
                    ripple.style.opacity = '0';
                }, 10);
            }
        });
    });
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
    const currentTime = Date.now();
    gameState.totalClicks++;
    
    // コンボシステム
    if (currentTime - gameState.lastClickTime < gameState.comboTimeout) {
        gameState.comboCount++;
        if (gameState.comboCount > gameState.maxCombo) {
            gameState.maxCombo = gameState.comboCount;
        }
    } else {
        gameState.comboCount = 1;
    }
    gameState.lastClickTime = currentTime;
    
    // コンボ倍率計算（最大5倍）
    gameState.comboMultiplier = Math.min(1 + (gameState.comboCount - 1) * 0.1, 5);
    
    // 基本ポイント計算
    let pointsGained = gameState.clickMultiplier * gameState.comboMultiplier;
    
    // クリティカルヒット判定
    if (Math.random() < gameState.criticalClickChance) {
        pointsGained *= 3;
        showNotification('💥 クリティカルヒット！3倍のポイント！', 'success');
        createFloatingNumber(`+${formatNumber(pointsGained)}`, clickButton, 'critical');
    } else {
        createFloatingNumber(`+${formatNumber(pointsGained)}`, clickButton, 'normal');
    }
    
    // コンボ表示
    if (gameState.comboCount > 1) {
        showComboNotification();
        createFloatingNumber(`${gameState.comboCount}x COMBO!`, clickButton, 'combo');
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

// コンボ通知表示
function showComboNotification() {
    if (gameState.comboCount >= 10) {
        showNotification(`🔥 ${gameState.comboCount}コンボ！x${gameState.comboMultiplier.toFixed(1)}倍率！`, 'success');
    } else if (gameState.comboCount >= 5) {
        showNotification(`⚡ ${gameState.comboCount}コンボ！`, 'success');
    }
}

// コンボチェック（タイムアウト処理）
function startComboCheck() {
    setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - gameState.lastClickTime >= gameState.comboTimeout && gameState.comboCount > 0) {
            if (gameState.comboCount >= 5) {
                showNotification(`💔 コンボ終了！最大${gameState.comboCount}コンボでした`, 'error');
            }
            gameState.comboCount = 0;
            gameState.comboMultiplier = 1;
            updateDisplay();
        }
    }, 100);
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
    
    // モバイルでは短い時間で表示
    const duration = window.innerWidth <= 768 ? 800 : 1000;
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.remove();
        }
    }, duration);
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
    
    // コンボ表示更新
    updateComboDisplay();
    
    updateUpgradeUI();
}

// コンボ表示更新
function updateComboDisplay() {
    const comboCard = document.getElementById('comboCard');
    
    if (comboElement) {
        if (gameState.comboCount > 1) {
            comboElement.textContent = `${gameState.comboCount}コンボ`;
            if (comboCard) comboCard.style.display = 'flex';
        } else {
            if (comboCard) comboCard.style.display = 'none';
        }
    }
    
    if (comboMultiplierElement) {
        if (gameState.comboCount > 1) {
            comboMultiplierElement.textContent = `x${gameState.comboMultiplier.toFixed(1)}`;
        }
    }
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
    
    // モバイルでは短い時間で表示
    const duration = window.innerWidth <= 768 ? 2000 : 3000;
    
    setTimeout(() => {
        if (notification) {
            notification.classList.remove('show');
        }
    }, duration);
}

// フローティング数値作成
function createFloatingNumber(text, element, type = 'normal') {
    const floatingContainer = document.getElementById('floatingNumbers');
    if (!floatingContainer || !element) return;
    
    const floating = document.createElement('div');
    floating.className = `floating-number ${type}`;
    floating.textContent = text;
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 30;
    const y = rect.top + rect.height / 2;
    
    floating.style.left = x + 'px';
    floating.style.top = y + 'px';
    
    floatingContainer.appendChild(floating);
    
    // モバイルでは短い時間で表示
    const duration = window.innerWidth <= 768 ? 1500 : 2000;
    
    setTimeout(() => {
        if (floating.parentNode) {
            floating.parentNode.removeChild(floating);
        }
    }, duration);
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
        localStorage.setItem('modernClickerSave', JSON.stringify(gameState));
        showNotification('💾 ゲームを保存しました！', 'success');
    } catch (e) {
        console.error('ゲームの保存に失敗しました:', e);
        showNotification('❌ ゲームの保存に失敗しました', 'error');
    }
}

// ゲーム読み込み
function loadGame() {
    const saved = localStorage.getItem('modernClickerSave');
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
            
            // コンボシステムの初期化
            if (typeof loadedState.comboCount === 'undefined') {
                loadedState.comboCount = 0;
            }
            if (typeof loadedState.maxCombo === 'undefined') {
                loadedState.maxCombo = 0;
            }
            if (typeof loadedState.comboMultiplier === 'undefined') {
                loadedState.comboMultiplier = 1;
            }
            if (typeof loadedState.lastClickTime === 'undefined') {
                loadedState.lastClickTime = 0;
            }
            if (typeof loadedState.comboTimeout === 'undefined') {
                loadedState.comboTimeout = 2000;
            }
            
            gameState = loadedState;
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
            clickMultiplier: 1,
            autoClickerSpeedLevel: 1,
            criticalClickLevel: 0,
            criticalClickChance: 0,
            totalClicks: 0,
            totalPoints: 0,
            comboCount: 0,
            maxCombo: 0,
            comboMultiplier: 1,
            lastClickTime: 0,
            comboTimeout: 2000
        };
        localStorage.removeItem('modernClickerSave');
        updateDisplay();
        showNotification('🔄 ゲームをリセットしました', 'success');
    }
}

// シェア機能
function shareToX() {
    const text = `✨ Modern Clickerで${formatNumber(gameState.totalPoints)}ポイント獲得！最大${gameState.maxCombo}コンボ達成！`;
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

// モバイルでのビューポート設定
function setupMobileViewport() {
    // モバイルでのズーム防止
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    
    // iOS Safariでのアドレスバー対応
    if ('standalone' in window.navigator && window.navigator.standalone) {
        document.body.classList.add('standalone');
    }
}
