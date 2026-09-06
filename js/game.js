/**
 * Web Slinger: City Rush - Core Game Engine
 * Master game coordinator managing Level progression (one villain at a time), Web-Swinging, collisions, and scoring.
 */
(function(window) {
    'use strict';

    var STATE = {
        MENU: 'MENU',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        GAMEOVER: 'GAMEOVER'
    };

    function Game() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = STATE.MENU;

        this.width = 960;
        this.height = 540;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.time = 0;
        this.lastTime = performance.now();
        this.score = 0;
        this.distance = 0;
        this.enemiesDefeated = 0;
        this.maxCombo = 1;
        this.difficultyMultiplier = 1.0;

        // Subsystems
        this.camera = new window.WebSlingerCamera(this.canvas);
        this.background = new window.WebSlingerBackground(this.canvas);
        this.city = new window.WebSlingerCity(this);
        this.player = new window.WebSlingerPlayer(this);
        this.levelManager = new window.WebSlingerLevelManager(this);

        this.enemies = [];
        this.powerups = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];

        this.ui = new window.WebSlingerUI(this);
        this.input = window.WebSlingerInput;

        this.applyDifficulty();
        this.setupInitialScene();
        this.bindEvents();

        requestAnimationFrame(this.loop.bind(this));
    }

    Game.prototype.applyDifficulty = function() {
        var s = (window.WebSlingerStorage && window.WebSlingerStorage.getSettings()) || {};
        var diff = s.difficulty || 'normal';
        if (diff === 'easy') this.difficultyMultiplier = 0.8;
        else if (diff === 'hard') this.difficultyMultiplier = 1.35;
        else this.difficultyMultiplier = 1.0;
    };

    Game.prototype.setupInitialScene = function() {
        this.city.init();
        this.enemies = [];
        this.powerups = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.levelManager.reset();
    };

    Game.prototype.bindEvents = function() {
        var self = this;
        window.addEventListener('resize', function() {
            self.handleResize();
        });
        this.handleResize();
    };

    Game.prototype.handleResize = function() {
        var container = document.getElementById('canvas-container');
        if (!container) return;

        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var aspect = this.width / this.height;

        var targetW = winW;
        var targetH = winW / aspect;

        if (targetH > winH) {
            targetH = winH;
            targetW = winH * aspect;
        }

        this.canvas.style.width = Math.floor(targetW) + 'px';
        this.canvas.style.height = Math.floor(targetH) + 'px';
    };

    Game.prototype.start = function() {
        this.state = STATE.PLAYING;
        this.score = 0;
        this.distance = 0;
        this.enemiesDefeated = 0;
        this.maxCombo = 1;
        this.time = 0;

        this.camera.reset();
        this.player.reset();
        this.setupInitialScene();
        window.WebSlingerEffects.reset();

        this.ui.showGameHUD();

        var audio = window.WebSlingerAudio;
        if (audio && audio.musicEnabled) {
            audio.playMusic();
        }
    };

    Game.prototype.pause = function() {
        if (this.state !== STATE.PLAYING) return;
        this.state = STATE.PAUSED;
        this.ui.showModal('pause');
    };

    Game.prototype.resume = function() {
        if (this.state !== STATE.PAUSED) return;
        this.state = STATE.PLAYING;
        this.ui.hideModals();
        this.lastTime = performance.now();
    };

    Game.prototype.restart = function() {
        this.start();
    };

    Game.prototype.goToMenu = function() {
        this.state = STATE.MENU;
        this.ui.showMainMenu();
    };

    Game.prototype.addScore = function(points) {
        var comboMultiplier = Math.max(1, this.player.combo);
        var boostMultiplier = (this.player.spiderSenseTimer > 0) ? 2 : 1;
        var totalPoints = points * comboMultiplier * boostMultiplier;

        this.score += totalPoints;
        if (this.player.combo > this.maxCombo) {
            this.maxCombo = this.player.combo;
        }
    };

    Game.prototype.addPlayerProjectile = function(proj) {
        this.playerProjectiles.push(proj);
    };

    Game.prototype.addEnemyProjectile = function(proj) {
        this.enemyProjectiles.push(proj);
    };

    Game.prototype.addPowerup = function(powerup) {
        this.powerups.push(powerup);
    };

    Game.prototype.checkCollisions = function() {
        var self = this;
        var pBox = this.player.getHitbox();

        // 1. Player Projectiles vs Enemies
        for (var i = 0; i < this.playerProjectiles.length; i++) {
            var web = this.playerProjectiles[i];
            if (web.isDead) continue;

            for (var j = 0; j < this.enemies.length; j++) {
                var enemy = this.enemies[j];
                if (enemy.isDead) continue;

                var eBox = enemy.getHitbox();
                if (this.rectIntersect(web.getHitbox(), eBox)) {
                    web.isDead = true;
                    enemy.hitWithWeb(web.damage);
                    self.player.addComboHit();
                    if (enemy.isDead) {
                        self.levelManager.onEnemyDefeated();
                    }
                    break;
                }
            }
        }

        // 2. Enemy Projectiles vs Player
        for (var k = 0; k < this.enemyProjectiles.length; k++) {
            var ep = this.enemyProjectiles[k];
            if (this.rectIntersect(ep.getHitbox(), pBox)) {
                ep.life = 0;
                this.player.takeDamage(ep.damage);
            }
        }

        // 3. Player vs Enemies (Aerial Mid-air Ramming / Web Strike)
        for (var m = 0; m < this.enemies.length; m++) {
            var en = this.enemies[m];
            if (!en.isDead && en.isWebbed <= 0) {
                if (this.rectIntersect(pBox, en.getHitbox())) {
                    if (this.player.vx > 320 || this.player.isSwinging) {
                        en.hitWithWeb(3);
                        self.player.addComboHit();
                        var fx = window.WebSlingerEffects;
                        if (fx) fx.addPopup(en.x, en.y, 'SLAM!', '#f1c40f', 24);
                        if (en.isDead) {
                            self.levelManager.onEnemyDefeated();
                        }
                    } else {
                        this.player.takeDamage(1);
                    }
                }
            }
        }

        // 4. Player vs Powerups
        for (var n = 0; n < this.powerups.length; n++) {
            this.powerups[n].checkCollisionWithPlayer(this.player);
        }
    };

    Game.prototype.rectIntersect = function(r1, r2) {
        return !(r2.x > r1.x + r1.width ||
                 r2.x + r2.width < r1.x ||
                 r2.y > r1.y + r1.height ||
                 r2.y + r2.height < r1.y);
    };

    Game.prototype.gameover = function(cause) {
        if (this.state === STATE.GAMEOVER) return;
        this.state = STATE.GAMEOVER;

        var audio = window.WebSlingerAudio;
        if (audio) audio.playSfx('gameover');

        var isNewRecord = window.WebSlingerStorage.recordGameStats({
            score: Math.floor(this.score),
            distance: Math.floor(this.distance),
            combo: this.maxCombo,
            enemiesDefeated: this.enemiesDefeated
        });

        this.ui.showGameOver({
            score: Math.floor(this.score),
            highScore: window.WebSlingerStorage.getHighScore(),
            enemiesDefeated: this.enemiesDefeated,
            distance: this.distance,
            maxCombo: this.maxCombo,
            isNewHigh: isNewRecord,
            cause: cause || 'PATROL TERMINATED'
        });
    };

    Game.prototype.update = function(dt) {
        this.time += dt;

        if (this.input.pausePressed) {
            if (this.state === STATE.PLAYING) this.pause();
            else if (this.state === STATE.PAUSED) this.resume();
        }

        if (this.state === STATE.MENU) {
            this.background.update(dt);
            this.input.consumePresses();
            return;
        }

        if (this.state !== STATE.PLAYING) {
            this.input.consumePresses();
            return;
        }

        // Distance & Soaring Score
        var playerDist = Math.max(0, this.player.x - 80) * 0.1;
        if (playerDist > this.distance) {
            var diffDist = playerDist - this.distance;
            this.distance = playerDist;
            this.score += diffDist * 2.5;
        }

        // Shoot Web / Web-Strike Key
        if (this.input.shootPressed) {
            this.player.shoot();
        }

        // Subsystems update
        this.background.update(dt);
        this.city.update(this.camera.x);

        this.player.update(dt, this.input);
        this.player.resolveSkyscraperCollision(this.city.buildings);

        this.camera.update(this.player.x, dt);

        // Level & Wave Manager Spawner
        this.levelManager.update(dt);

        // Update Enemies
        for (var e = 0; e < this.enemies.length; e++) {
            this.enemies[e].update(dt, this.player);
        }

        // Clean up dead/offscreen enemies
        var leftBound = this.camera.x - 350;
        this.enemies = this.enemies.filter(function(en) { return !en.isDead && en.x > leftBound; });

        // Update Powerups
        for (var p = 0; p < this.powerups.length; p++) {
            this.powerups[p].update(this.time, dt);
        }
        this.powerups = this.powerups.filter(function(pw) { return !pw.collected && pw.x > leftBound; });

        // Update Projectiles
        this.playerProjectiles = this.playerProjectiles.filter(function(web) { return web.update(dt); });
        this.enemyProjectiles = this.enemyProjectiles.filter(function(ep) { return ep.update(dt); });

        // Update Collisions
        this.checkCollisions();

        // Update Effects
        window.WebSlingerEffects.update(dt);

        // Update HUD
        this.ui.updateHUD(
            this.player,
            this.score,
            window.WebSlingerStorage.getHighScore(),
            this.distance,
            this.player.combo
        );

        this.input.consumePresses();
    };

    Game.prototype.draw = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.camera.applyTransform(this.ctx);

        // 1. Background Parallax Skyline
        this.background.draw(this.ctx, this.camera.x);

        if (this.state !== STATE.MENU) {
            // 2. Skyscraper Canyons, Cranes, Spires
            this.city.draw(this.ctx, this.camera.x, this.time);

            // 3. Floating Powerups
            for (var p = 0; p < this.powerups.length; p++) {
                this.powerups[p].draw(this.ctx, this.camera.x, this.time);
            }

            // 4. Aerial Enemies & Villains
            for (var e = 0; e < this.enemies.length; e++) {
                this.enemies[e].draw(this.ctx, this.camera.x, this.time);
            }

            // 5. Enemy Projectiles
            for (var ep = 0; ep < this.enemyProjectiles.length; ep++) {
                this.enemyProjectiles[ep].draw(this.ctx, this.camera.x);
            }

            // 6. Spider-Man (with High-Tension Web Line & Spider-Sense Crown)
            this.player.draw(this.ctx, this.camera.x, this.time);

            // 7. Player Web Projectiles
            for (var wp = 0; wp < this.playerProjectiles.length; wp++) {
                this.playerProjectiles[wp].draw(this.ctx, this.camera.x);
            }

            // 8. Visual Effects (Comic Popups & Particles)
            window.WebSlingerEffects.draw(this.ctx, this.camera.x);
        }

        this.camera.restoreTransform(this.ctx);
    };

    Game.prototype.loop = function(timestamp) {
        var dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (dt > 0.1) dt = 0.1;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    };

    window.addEventListener('DOMContentLoaded', function() {
        window.WebSlinger = new Game();
    });

    window.WebSlingerGame = Game;
})(window);
