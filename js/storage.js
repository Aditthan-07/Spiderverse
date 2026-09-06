/**
 * Web Slinger: City Rush - Storage Manager
 * Handles persistent game settings, statistics, and high scores using localStorage.
 */
(function(window) {
    'use strict';

    var STORAGE_KEY = 'webslinger_game_save_v2';

    var defaultData = {
        highScore: 0,
        bestDistance: 0,
        bestCombo: 0,
        enemiesDefeatedTotal: 0,
        gamesPlayed: 0,
        settings: {
            musicEnabled: true,
            soundEnabled: true,
            musicVolume: 0.6,
            soundVolume: 0.8,
            difficulty: 'normal', // 'easy', 'normal', 'hard'
            screenShake: true,
            particles: true
        }
    };

    var Storage = {
        data: null,

        init: function() {
            try {
                var stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    this.data = JSON.parse(stored);
                    this.data.settings = Object.assign({}, defaultData.settings, this.data.settings || {});
                } else {
                    this.data = JSON.parse(JSON.stringify(defaultData));
                    this.save();
                }
            } catch (e) {
                console.warn('LocalStorage not accessible, using memory state:', e);
                this.data = JSON.parse(JSON.stringify(defaultData));
            }
            return this;
        },

        save: function() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }
        },

        getHighScore: function() {
            if (!this.data) this.init();
            return (this.data && this.data.highScore) || 0;
        },

        setHighScore: function(score) {
            if (!this.data) this.init();
            if (score > (this.data.highScore || 0)) {
                this.data.highScore = score;
                this.save();
                return true; // New record
            }
            return false;
        },

        recordGameStats: function(stats) {
            if (!this.data) this.init();
            this.data.gamesPlayed = (this.data.gamesPlayed || 0) + 1;
            if (stats.distance > (this.data.bestDistance || 0)) {
                this.data.bestDistance = stats.distance;
            }
            if (stats.combo > (this.data.bestCombo || 0)) {
                this.data.bestCombo = stats.combo;
            }
            if (stats.enemiesDefeated) {
                this.data.enemiesDefeatedTotal = (this.data.enemiesDefeatedTotal || 0) + stats.enemiesDefeated;
            }
            var isNewHigh = this.setHighScore(stats.score || 0);
            this.save();
            return isNewHigh;
        },

        getSettings: function() {
            if (!this.data) this.init();
            return this.data.settings;
        },

        updateSettings: function(newSettings) {
            if (!this.data) this.init();
            this.data.settings = Object.assign(this.data.settings, newSettings);
            this.save();
            return this.data.settings;
        },

        resetStats: function() {
            if (!this.data) this.init();
            this.data.highScore = 0;
            this.data.bestDistance = 0;
            this.data.bestCombo = 0;
            this.data.enemiesDefeatedTotal = 0;
            this.save();
        }
    };

    Storage.init();
    window.WebSlingerStorage = Storage;
})(window);
