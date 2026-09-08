/**
 * Web Slinger: City Rush - Audio Manager
 * Features Web Audio API synthesis for zero-lag sound effects & Spider-Man meme song background music player.
 */
(function(window) {
    'use strict';

    var BGM_TRACKS = [
        { name: "Spiderman Theme (Alison Brown Quartet)", src: "audio/spiderman-theme-alison-brown.mp3" },
        { name: "Spider-Man Meme Song", src: "audio/spiderman-meme-song.mp3" },
        { name: "Amazing Hero", src: "audio/amazing-spider-man-2.mp3" },
        { name: "Animated Series", src: "audio/animated-series-theme.mp3" },
        { name: "Friendly Hero", src: "audio/60-theme-song.mp3" }
    ];

    function AudioManager() {
        this.ctx = null;
        this.currentTrackIndex = 0;
        this.bgmElement = null;
        this.unlocked = false;
        
        var settings = (window.WebSlingerStorage && window.WebSlingerStorage.getSettings()) || {
            soundEnabled: true,
            musicEnabled: true,
            soundVolume: 0.8,
            musicVolume: 0.7,
            soundtrackIndex: 0
        };

        this.soundEnabled = settings.soundEnabled;
        this.musicEnabled = settings.musicEnabled;
        this.soundVolume = settings.soundVolume !== undefined ? settings.soundVolume : 0.8;
        this.musicVolume = settings.musicVolume !== undefined ? settings.musicVolume : 0.7;
        this.currentTrackIndex = settings.soundtrackIndex !== undefined ? settings.soundtrackIndex : 0;
        
        this.initAudioContext();
        this.initBgm();
    }

    AudioManager.prototype.initAudioContext = function() {
        var self = this;
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            try {
                this.ctx = new AudioContextClass();
            } catch (e) {
                console.warn('Web Audio API not supported:', e);
            }
        }

        var unlock = function() {
            if (self.ctx && self.ctx.state === 'suspended') {
                self.ctx.resume();
            }
            self.unlocked = true;
            if (self.musicEnabled && self.bgmElement && self.bgmElement.paused) {
                self.playMusic();
            }
            ['click', 'keydown', 'touchstart'].forEach(function(ev) {
                window.removeEventListener(ev, unlock);
            });
        };

        ['click', 'keydown', 'touchstart'].forEach(function(ev) {
            window.addEventListener(ev, unlock, { passive: true });
        });
    };

    AudioManager.prototype.initBgm = function() {
        var self = this;
        this.bgmElement = new Audio();
        this.bgmElement.loop = true; // Seamless loop for theme
        this.bgmElement.volume = this.musicEnabled ? this.musicVolume : 0;

        this.bgmElement.addEventListener('ended', function() {
            if (!self.bgmElement.loop) {
                self.nextTrack();
            }
        });

        this.setTrack(this.currentTrackIndex);
    };

    AudioManager.prototype.setTrack = function(index) {
        this.currentTrackIndex = (index + BGM_TRACKS.length) % BGM_TRACKS.length;
        if (this.bgmElement) {
            this.bgmElement.src = BGM_TRACKS[this.currentTrackIndex].src;
            this.bgmElement.volume = this.musicEnabled ? this.musicVolume : 0;
            if (this.musicEnabled && this.unlocked) {
                var playPromise = this.bgmElement.play();
                if (playPromise) playPromise.catch(function() {});
            }
        }
        if (window.WebSlingerStorage) {
            window.WebSlingerStorage.updateSettings({ soundtrackIndex: this.currentTrackIndex });
        }
    };

    AudioManager.prototype.nextTrack = function() {
        this.setTrack(this.currentTrackIndex + 1);
    };

    AudioManager.prototype.playMusic = function() {
        if (!this.musicEnabled || !this.bgmElement) return;
        this.bgmElement.volume = this.musicVolume;
        var playPromise = this.bgmElement.play();
        if (playPromise) playPromise.catch(function() {});
    };

    AudioManager.prototype.pauseMusic = function() {
        if (this.bgmElement) {
            this.bgmElement.pause();
        }
    };

    AudioManager.prototype.setMusicEnabled = function(enabled) {
        this.musicEnabled = enabled;
        if (this.bgmElement) {
            this.bgmElement.volume = enabled ? this.musicVolume : 0;
            if (enabled) {
                this.playMusic();
            } else {
                this.pauseMusic();
            }
        }
        if (window.WebSlingerStorage) {
            window.WebSlingerStorage.updateSettings({ musicEnabled: enabled });
        }
    };

    AudioManager.prototype.setSoundEnabled = function(enabled) {
        this.soundEnabled = enabled;
        if (window.WebSlingerStorage) {
            window.WebSlingerStorage.updateSettings({ soundEnabled: enabled });
        }
    };

    AudioManager.prototype.setMusicVolume = function(vol) {
        this.musicVolume = Math.max(0, Math.min(1, vol));
        if (this.bgmElement && this.musicEnabled) {
            this.bgmElement.volume = this.musicVolume;
        }
        if (window.WebSlingerStorage) {
            window.WebSlingerStorage.updateSettings({ musicVolume: this.musicVolume });
        }
    };

    AudioManager.prototype.setSoundVolume = function(vol) {
        this.soundVolume = Math.max(0, Math.min(1, vol));
        if (window.WebSlingerStorage) {
            window.WebSlingerStorage.updateSettings({ soundVolume: this.soundVolume });
        }
    };

    // --- PROCEDURAL SOUND EFFECTS (Web Audio API) ---

    AudioManager.prototype.playSfx = function(name) {
        if (!this.soundEnabled || !this.ctx || this.soundVolume <= 0) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        var t = this.ctx.currentTime;
        var vol = this.soundVolume;

        switch (name) {
            case 'thwip':
                this.synthThwip(t, vol);
                break;
            case 'jump':
                this.synthJump(t, vol);
                break;
            case 'land':
                this.synthLand(t, vol);
                break;
            case 'hit':
                this.synthHit(t, vol);
                break;
            case 'enemyDefeat':
                this.synthEnemyDefeat(t, vol);
                break;
            case 'powerup':
                this.synthPowerup(t, vol);
                break;
            case 'boost':
                this.synthBoost(t, vol);
                break;
            case 'gameover':
                this.synthGameOver(t, vol);
                break;
            case 'click':
                this.synthClick(t, vol);
                break;
            case 'combo':
                this.synthCombo(t, vol);
                break;
        }
    };

    AudioManager.prototype.synthThwip = function(t, vol) {
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();
        var filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, t);
        filter.frequency.exponentialRampToValueAtTime(400, t + 0.12);
        filter.Q.setValueAtTime(4, t);

        gain.gain.setValueAtTime(0.35 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.12);
    };

    AudioManager.prototype.synthJump = function(t, vol) {
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(550, t + 0.15);

        gain.gain.setValueAtTime(0.3 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.15);
    };

    AudioManager.prototype.synthLand = function(t, vol) {
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);

        gain.gain.setValueAtTime(0.25 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.08);
    };

    AudioManager.prototype.synthHit = function(t, vol) {
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);

        gain.gain.setValueAtTime(0.4 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
    };

    AudioManager.prototype.synthEnemyDefeat = function(t, vol) {
        var osc1 = this.ctx.createOscillator();
        var osc2 = this.ctx.createOscillator();
        var gain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(600, t);
        osc1.frequency.exponentialRampToValueAtTime(100, t + 0.2);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(250, t);
        osc2.frequency.exponentialRampToValueAtTime(40, t + 0.25);

        gain.gain.setValueAtTime(0.4 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.2);
        osc2.stop(t + 0.25);
    };

    AudioManager.prototype.synthPowerup = function(t, vol) {
        var notes = [523.25, 659.25, 783.99, 1046.50];
        var self = this;
        notes.forEach(function(freq, i) {
            var osc = self.ctx.createOscillator();
            var gain = self.ctx.createGain();
            var start = t + i * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.25 * vol, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

            osc.connect(gain);
            gain.connect(self.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.15);
        });
    };

    AudioManager.prototype.synthCombo = function(t, vol) {
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);

        gain.gain.setValueAtTime(0.3 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.15);
    };

    AudioManager.prototype.synthBoost = function(t, vol) {
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.3);

        gain.gain.setValueAtTime(0.35 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.3);
    };

    AudioManager.prototype.synthGameOver = function(t, vol) {
        var notes = [440, 415.3, 392, 349.2];
        var self = this;
        notes.forEach(function(freq, i) {
            var osc = self.ctx.createOscillator();
            var gain = self.ctx.createGain();
            var start = t + i * 0.12;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.3 * vol, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

            osc.connect(gain);
            gain.connect(self.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.25);
        });
    };

    AudioManager.prototype.synthClick = function(t, vol) {
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);

        gain.gain.setValueAtTime(0.2 * vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.04);
    };

    window.WebSlingerAudio = new AudioManager();
})(window);
