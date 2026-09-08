/**
 * Web Slinger: City Rush - UI Manager
 * Features interactive on-screen tutorial hints, clear mission tracker, and glassmorphism HUD.
 */
(function(window) {
    'use strict';

    function UIManager(game) {
        this.game = game;
        this.dom = {
            mainMenu: document.getElementById('main-menu'),
            hud: document.getElementById('hud'),
            modalOverlay: document.getElementById('modal-overlay'),
            pauseModal: document.getElementById('modal-pause'),
            gameoverModal: document.getElementById('modal-gameover'),
            howToPlayModal: document.getElementById('modal-how-to-play'),
            settingsModal: document.getElementById('modal-settings'),
            
            scoreDisplay: document.getElementById('hud-score'),
            highScoreDisplay: document.getElementById('hud-highscore'),
            healthContainer: document.getElementById('hud-health'),
            webBarFill: document.getElementById('hud-web-fill'),
            webText: document.getElementById('hud-web-text'),
            comboBadge: document.getElementById('hud-combo-badge'),
            comboText: document.getElementById('hud-combo-text'),
            boostBadge: document.getElementById('hud-boost-badge'),
            boostTimer: document.getElementById('hud-boost-timer'),

            missionText: document.getElementById('hud-level-text'),
            tutorialPrompt: document.getElementById('hud-tutorial-prompt'),

            finalScore: document.getElementById('go-final-score'),
            bestScore: document.getElementById('go-best-score'),
            goEnemies: document.getElementById('go-enemies'),
            goDistance: document.getElementById('go-distance'),
            goMaxCombo: document.getElementById('go-max-combo'),
            goNewRecord: document.getElementById('go-new-record'),
            goCause: document.getElementById('go-cause'),

            menuHighScore: document.getElementById('menu-high-score'),

            settingMusicToggle: document.getElementById('setting-music-toggle'),
            settingSoundtrack: document.getElementById('setting-soundtrack'),
            settingSoundToggle: document.getElementById('setting-sound-toggle'),
            settingMusicVol: document.getElementById('setting-music-vol'),
            settingSoundVol: document.getElementById('setting-sound-vol'),
            settingDifficulty: document.getElementById('setting-difficulty'),
            settingShake: document.getElementById('setting-shake'),
            settingParticles: document.getElementById('setting-particles'),
            settingResetStats: document.getElementById('setting-reset-stats')
        };

        this.initEventListeners();
        this.syncSettingsUI();
        this.updateMenuStats();
    }

    UIManager.prototype.initEventListeners = function() {
        var self = this;
        var audio = window.WebSlingerAudio;

        function clickSound() {
            if (audio) audio.playSfx('click');
        }

        var btnPlay = document.getElementById('btn-play');
        if (btnPlay) {
            btnPlay.addEventListener('click', function() {
                clickSound();
                self.game.start();
            });
        }

        var btnHowToPlay = document.getElementById('btn-how-to-play');
        if (btnHowToPlay) {
            btnHowToPlay.addEventListener('click', function() {
                clickSound();
                self.showModal('how-to-play');
            });
        }

        var btnSettings = document.getElementById('btn-settings');
        if (btnSettings) {
            btnSettings.addEventListener('click', function() {
                clickSound();
                self.showModal('settings');
            });
        }

        var btnResume = document.getElementById('btn-resume');
        if (btnResume) {
            btnResume.addEventListener('click', function() {
                clickSound();
                self.game.resume();
            });
        }

        var btnRestartPause = document.getElementById('btn-restart-pause');
        if (btnRestartPause) {
            btnRestartPause.addEventListener('click', function() {
                clickSound();
                self.game.restart();
            });
        }

        var btnMenuPause = document.getElementById('btn-menu-pause');
        if (btnMenuPause) {
            btnMenuPause.addEventListener('click', function() {
                clickSound();
                self.game.goToMenu();
            });
        }

        var btnRetry = document.getElementById('btn-retry');
        if (btnRetry) {
            btnRetry.addEventListener('click', function() {
                clickSound();
                self.game.restart();
            });
        }

        var btnMenuGo = document.getElementById('btn-menu-gameover');
        if (btnMenuGo) {
            btnMenuGo.addEventListener('click', function() {
                clickSound();
                self.game.goToMenu();
            });
        }

        var closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                clickSound();
                self.hideModals();
            });
        });

        var hudMute = document.getElementById('hud-mute-toggle');
        if (hudMute) {
            hudMute.addEventListener('click', function() {
                clickSound();
                var s = window.WebSlingerStorage.getSettings();
                var newState = !s.musicEnabled;
                if (audio) {
                    audio.setMusicEnabled(newState);
                    audio.setSoundEnabled(newState);
                }
                hudMute.innerHTML = newState ? '🔊' : '🔇';
            });
        }

        if (this.dom.settingMusicToggle) {
            this.dom.settingMusicToggle.addEventListener('change', function(e) {
                if (audio) audio.setMusicEnabled(e.target.checked);
            });
        }

        if (this.dom.settingSoundtrack) {
            this.dom.settingSoundtrack.addEventListener('change', function(e) {
                var idx = parseInt(e.target.value, 10);
                if (audio) audio.setTrack(idx);
            });
        }

        if (this.dom.settingSoundToggle) {
            this.dom.settingSoundToggle.addEventListener('change', function(e) {
                if (audio) audio.setSoundEnabled(e.target.checked);
            });
        }

        if (this.dom.settingMusicVol) {
            this.dom.settingMusicVol.addEventListener('input', function(e) {
                if (audio) audio.setMusicVolume(parseFloat(e.target.value));
            });
        }

        if (this.dom.settingSoundVol) {
            this.dom.settingSoundVol.addEventListener('input', function(e) {
                if (audio) audio.setSoundVolume(parseFloat(e.target.value));
            });
        }

        if (this.dom.settingDifficulty) {
            this.dom.settingDifficulty.addEventListener('change', function(e) {
                window.WebSlingerStorage.updateSettings({ difficulty: e.target.value });
                self.game.applyDifficulty();
            });
        }

        if (this.dom.settingShake) {
            this.dom.settingShake.addEventListener('change', function(e) {
                window.WebSlingerStorage.updateSettings({ screenShake: e.target.checked });
            });
        }

        if (this.dom.settingParticles) {
            this.dom.settingParticles.addEventListener('change', function(e) {
                window.WebSlingerStorage.updateSettings({ particles: e.target.checked });
            });
        }

        if (this.dom.settingResetStats) {
            this.dom.settingResetStats.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset all high scores and records?')) {
                    window.WebSlingerStorage.resetStats();
                    self.updateMenuStats();
                    clickSound();
                    alert('Stats reset successfully!');
                }
            });
        }
    };

    UIManager.prototype.syncSettingsUI = function() {
        var s = (window.WebSlingerStorage && window.WebSlingerStorage.getSettings()) || {};
        if (this.dom.settingMusicToggle) this.dom.settingMusicToggle.checked = !!s.musicEnabled;
        if (this.dom.settingSoundtrack) this.dom.settingSoundtrack.value = s.soundtrackIndex !== undefined ? s.soundtrackIndex : 0;
        if (this.dom.settingSoundToggle) this.dom.settingSoundToggle.checked = !!s.soundEnabled;
        if (this.dom.settingMusicVol) this.dom.settingMusicVol.value = s.musicVolume !== undefined ? s.musicVolume : 0.6;
        if (this.dom.settingSoundVol) this.dom.settingSoundVol.value = s.soundVolume !== undefined ? s.soundVolume : 0.8;
        if (this.dom.settingDifficulty) this.dom.settingDifficulty.value = s.difficulty || 'normal';
        if (this.dom.settingShake) this.dom.settingShake.checked = s.screenShake !== false;
        if (this.dom.settingParticles) this.dom.settingParticles.checked = s.particles !== false;
    };

    UIManager.prototype.updateMenuStats = function() {
        var high = (window.WebSlingerStorage && window.WebSlingerStorage.getHighScore()) || 0;
        if (this.dom.menuHighScore) this.dom.menuHighScore.textContent = high.toLocaleString();
        if (this.dom.highScoreDisplay) this.dom.highScoreDisplay.textContent = high.toLocaleString();
    };

    UIManager.prototype.showMainMenu = function() {
        this.dom.mainMenu.style.display = 'flex';
        this.dom.hud.style.display = 'none';
        this.hideModals();
        this.updateMenuStats();
    };

    UIManager.prototype.showGameHUD = function() {
        this.dom.mainMenu.style.display = 'none';
        this.dom.hud.style.display = 'flex';
        this.hideModals();
    };

    UIManager.prototype.showModal = function(name) {
        this.dom.modalOverlay.style.display = 'flex';
        var modals = [
            this.dom.pauseModal,
            this.dom.gameoverModal,
            this.dom.howToPlayModal,
            this.dom.settingsModal
        ];
        modals.forEach(function(m) { if (m) m.style.display = 'none'; });

        if (name === 'pause' && this.dom.pauseModal) this.dom.pauseModal.style.display = 'block';
        if (name === 'gameover' && this.dom.gameoverModal) this.dom.gameoverModal.style.display = 'block';
        if (name === 'how-to-play' && this.dom.howToPlayModal) this.dom.howToPlayModal.style.display = 'block';
        if (name === 'settings' && this.dom.settingsModal) this.dom.settingsModal.style.display = 'block';
    };

    UIManager.prototype.hideModals = function() {
        if (this.dom.modalOverlay) this.dom.modalOverlay.style.display = 'none';
    };

    UIManager.prototype.showGameOver = function(stats) {
        this.showModal('gameover');
        if (this.dom.finalScore) this.dom.finalScore.textContent = (stats.score || 0).toLocaleString();
        if (this.dom.bestScore) this.dom.bestScore.textContent = (stats.highScore || 0).toLocaleString();
        if (this.dom.goEnemies) this.dom.goEnemies.textContent = stats.enemiesDefeated || 0;
        if (this.dom.goDistance) this.dom.goDistance.textContent = (Math.floor(stats.distance || 0)) + ' m';
        if (this.dom.goMaxCombo) this.dom.goMaxCombo.textContent = 'x' + (stats.maxCombo || 1);
        if (this.dom.goCause) this.dom.goCause.textContent = stats.cause || 'MISSION FAILED';

        if (this.dom.goNewRecord) {
            this.dom.goNewRecord.style.display = stats.isNewHigh ? 'inline-block' : 'none';
        }
    };

    UIManager.prototype.updateHUD = function(player, score, highScore, distance, combo) {
        if (!player) return;

        if (this.dom.scoreDisplay) this.dom.scoreDisplay.textContent = Math.floor(score).toLocaleString();
        if (this.dom.highScoreDisplay) this.dom.highScoreDisplay.textContent = Math.floor(highScore).toLocaleString();

        if (this.dom.healthContainer) {
            var heartsHtml = '';
            for (var i = 0; i < player.maxHealth; i++) {
                if (i < player.health) {
                    heartsHtml += '<span class="hud-heart full">♥</span>';
                } else {
                    heartsHtml += '<span class="hud-heart empty">♡</span>';
                }
            }
            this.dom.healthContainer.innerHTML = heartsHtml;
        }

        if (this.dom.webBarFill && this.dom.webText) {
            var webPercent = Math.max(0, Math.min(100, (player.web / player.maxWeb) * 100));
            this.dom.webBarFill.style.width = webPercent + '%';
            this.dom.webText.textContent = player.web + ' / ' + player.maxWeb;
            if (player.web <= 10) {
                this.dom.webBarFill.classList.add('low-ammo');
            } else {
                this.dom.webBarFill.classList.remove('low-ammo');
            }
        }

        var lvl = this.game.levelManager;
        if (lvl && this.dom.missionText) {
            this.dom.missionText.textContent = 'LEVEL ' + lvl.currentLevel + ' — ' + lvl.currentConfig.name + ' (' + lvl.villainsDefeatedInLevel + '/' + lvl.currentConfig.villainsRequired + ' DEFEATED)';
        }

        if (this.dom.tutorialPrompt) {
            if (!player.isSwinging && player.y > 220) {
                this.dom.tutorialPrompt.innerHTML = '🕸️ <strong>HOLD [W / ↑ / CLICK] TO SWING</strong> ➔ <strong>RELEASE TO LAUNCH!</strong>';
                this.dom.tutorialPrompt.style.display = 'block';
            } else if (player.isSwinging) {
                this.dom.tutorialPrompt.innerHTML = '🚀 <strong>RELEASE [SWING] AT APEX TO CATAPULT ACROSS SKYLINE!</strong>';
                this.dom.tutorialPrompt.style.display = 'block';
            } else if (this.game.enemies.length > 0) {
                this.dom.tutorialPrompt.innerHTML = '🎯 <strong>PRESS [SPACEBAR] TO SHOOT WEBS & WEB-STRIKE VILLAINS!</strong>';
                this.dom.tutorialPrompt.style.display = 'block';
            } else {
                this.dom.tutorialPrompt.style.display = 'none';
            }
        }

        if (this.dom.comboBadge && this.dom.comboText) {
            if (combo > 1) {
                this.dom.comboBadge.style.display = 'flex';
                this.dom.comboText.textContent = 'COMBO x' + combo;
            } else {
                this.dom.comboBadge.style.display = 'none';
            }
        }

        if (this.dom.boostBadge && this.dom.boostTimer) {
            if (player.spiderSenseTimer > 0) {
                this.dom.boostBadge.style.display = 'flex';
                this.dom.boostTimer.textContent = player.spiderSenseTimer.toFixed(1) + 's';
            } else {
                this.dom.boostBadge.style.display = 'none';
            }
        }
    };

    window.WebSlingerUI = UIManager;
})(window);
