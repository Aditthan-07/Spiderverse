/**
 * Web Slinger: City Rush - Level & Wave Encounter Manager
 * Paces villain spawns one at a time with structured level progression, boss alerts, and Spider-Sense warnings.
 */
(function(window) {
    'use strict';

    var LEVEL_DEFINITIONS = [
        {
            level: 1,
            name: 'DISTRICT PATROL',
            villainsRequired: 3,
            enemyPool: ['DRONE'],
            maxConcurrentEnemies: 1,
            description: 'Hover Drones detected in the financial district.'
        },
        {
            level: 2,
            name: 'GLIDER INVASION',
            villainsRequired: 4,
            enemyPool: ['GLIDER'],
            maxConcurrentEnemies: 1,
            description: 'Glider Rogue (Green Goblin) spotted over skyscraper canyon!'
        },
        {
            level: 3,
            name: 'SYMBIOTE OUTBREAK',
            villainsRequired: 5,
            enemyPool: ['BRUTE'],
            maxConcurrentEnemies: 1,
            description: 'Venom / Symbiote brute clinging to skyscraper walls!'
        },
        {
            level: 4,
            name: 'DUAL THREAT',
            villainsRequired: 6,
            enemyPool: ['GLIDER', 'DRONE'],
            maxConcurrentEnemies: 2,
            description: 'Coordinated rogue assault!'
        },
        {
            level: 5,
            name: 'CITY UNDER SIEGE',
            villainsRequired: 8,
            enemyPool: ['GLIDER', 'DRONE', 'BRUTE'],
            maxConcurrentEnemies: 2,
            description: 'Maximum security threat! Defend New York!'
        }
    ];

    function LevelManager(game) {
        this.game = game;
        this.currentLevel = 1;
        this.villainsDefeatedInLevel = 0;
        this.currentConfig = LEVEL_DEFINITIONS[0];
        this.spawnCooldown = 3.2;
        this.spawnTimer = 2.8;
    }

    LevelManager.prototype.reset = function() {
        this.currentLevel = 1;
        this.villainsDefeatedInLevel = 0;
        this.currentConfig = LEVEL_DEFINITIONS[0];
        this.spawnCooldown = 3.2;
        this.spawnTimer = 2.8;
    };

    LevelManager.prototype.onEnemyDefeated = function() {
        this.villainsDefeatedInLevel++;
        this.spawnTimer = this.spawnCooldown; // Generous breathing room after defeat

        if (this.villainsDefeatedInLevel >= this.currentConfig.villainsRequired) {
            this.levelUp();
        }
    };

    LevelManager.prototype.levelUp = function() {
        this.currentLevel++;
        this.villainsDefeatedInLevel = 0;

        var configIndex = Math.min(LEVEL_DEFINITIONS.length - 1, this.currentLevel - 1);
        this.currentConfig = LEVEL_DEFINITIONS[configIndex];

        // Level Up Reward: Full Web Refill & +1 Health
        this.game.player.addWeb(35);
        this.game.player.heal(1);

        var audio = window.WebSlingerAudio;
        if (audio) audio.playSfx('powerup');

        var fx = window.WebSlingerEffects;
        if (fx) {
            fx.addPopup(this.game.player.x + this.game.player.width / 2, this.game.player.y - 35, 'LEVEL ' + this.currentLevel + '!', '#f1c40f', 32);
            fx.addPopup(this.game.player.x + this.game.player.width / 2, this.game.player.y - 10, 'AMMO RECHARGED!', '#70d6ff', 20);
        }

        // Show wave alert banner
        var hudLevel = document.getElementById('hud-level-text');
        if (hudLevel) {
            hudLevel.textContent = 'LEVEL ' + this.currentLevel + ': ' + this.currentConfig.name;
            hudLevel.parentElement.classList.add('level-up-flash');
            setTimeout(function() {
                hudLevel.parentElement.classList.remove('level-up-flash');
            }, 2500);
        }
    };

    LevelManager.prototype.update = function(dt) {
        this.spawnTimer -= dt;

        // Check if we can spawn the next villain
        var activeEnemies = this.game.enemies.filter(function(e) { return !e.isDead; }).length;

        if (activeEnemies < this.currentConfig.maxConcurrentEnemies && this.spawnTimer <= 0) {
            this.spawnNextVillain();
            this.spawnTimer = 9.0; // Wait before next spawn if allowed
        }
    };

    LevelManager.prototype.spawnNextVillain = function() {
        var pool = this.currentConfig.enemyPool;
        var type = pool[Math.floor(Math.random() * pool.length)];

        var spawnX = this.game.camera.x + this.game.width + 240;
        var spawnY = 100 + Math.random() * 180;

        var enemy = new window.WebSlingerEnemy(this.game, {
            type: type,
            x: spawnX,
            y: spawnY
        });

        this.game.enemies.push(enemy);

        // Visual Incursion Warning
        var fx = window.WebSlingerEffects;
        if (fx) {
            fx.addPopup(spawnX - 60, spawnY - 20, '⚠️ ' + type + ' INCOMING!', '#ff4757', 22);
        }
    };

    window.WebSlingerLevelManager = LevelManager;
})(window);
