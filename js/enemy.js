/**
 * Web Slinger: City Rush - Aerial Villain & Drone System
 * Features soaring Glider Rogues, Hover Attack Drones, and Wall-Clinging Symbiote Brutes for mid-air web combat.
 */
(function(window) {
    'use strict';

    var ENEMY_SPRITES = {
        GLIDER: 'images/goblin.png',
        DRONE: 'images/thug.png',
        BRUTE: 'images/venom.png',
        KNIFE: 'images/knife.png'
    };

    var enemyImages = {};
    for (var k in ENEMY_SPRITES) {
        var img = new Image();
        img.src = ENEMY_SPRITES[k];
        enemyImages[k] = img;
    }

    // --- ENEMY PROJECTILE (Pumpkin Bombs & Lasers) ---
    function EnemyProjectile(game, opts) {
        this.game = game;
        this.ctx = game.ctx;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.vx = opts.vx || -260;
        this.vy = opts.vy || 0;
        this.damage = opts.damage || 1;
        this.type = opts.type || 'BOMB'; // 'BOMB', 'LASER', 'KNIFE'
        this.radius = 8;
        this.angle = 0;
        this.life = 4.0;
        this.gravity = opts.gravity || 0;
    }

    EnemyProjectile.prototype.update = function(dt) {
        this.life -= dt;
        this.vy += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.angle += dt * 12;
        return this.life > 0;
    };

    EnemyProjectile.prototype.draw = function(ctx, cameraX) {
        var rx = this.x - cameraX;
        var ry = this.y;

        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(this.angle);

        if (this.type === 'BOMB') {
            // Glowing Pumpkin Bomb
            var grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 11);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#ff9f1a');
            grad.addColorStop(1, 'rgba(255, 60, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, 11, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#e67e22';
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'LASER') {
            // Energy Bolt
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(-10, -3, 20, 6);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-6, -1, 12, 2);
        } else {
            // Knife
            var knifeImg = enemyImages.KNIFE;
            if (knifeImg && knifeImg.complete && knifeImg.naturalWidth > 0) {
                ctx.drawImage(knifeImg, -10, -5, 20, 10);
            } else {
                ctx.fillStyle = '#cbd5e1';
                ctx.fillRect(-8, -3, 16, 6);
            }
        }

        ctx.restore();
    };

    EnemyProjectile.prototype.getHitbox = function() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    };

    // --- ENEMY MAIN CLASS ---
    function Enemy(game, opts) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        opts = opts || {};

        this.type = opts.type || 'GLIDER'; // 'GLIDER', 'DRONE', 'BRUTE'
        this.x = opts.x || 0;
        this.baseY = opts.y || 140;
        this.y = this.baseY;

        if (this.type === 'GLIDER') {
            this.maxHealth = 3;
            this.scale = 0.62;
            this.width = 48;
            this.height = 44;
            this.speed = 85;
            this.shootCooldown = 3.2; // Generous cooldown to let player fight back or escape
            this.scoreValue = 250;
            this.hoverOffset = Math.random() * Math.PI * 2;
        } else if (this.type === 'DRONE') {
            this.maxHealth = 2;
            this.scale = 0.55;
            this.width = 38;
            this.height = 38;
            this.speed = 55;
            this.shootCooldown = 2.8;
            this.scoreValue = 200;
            this.hoverOffset = Math.random() * Math.PI * 2;
        } else if (this.type === 'BRUTE') {
            this.maxHealth = 5;
            this.scale = 0.65;
            this.width = 46;
            this.height = 58;
            this.speed = 50;
            this.shootCooldown = 999;
            this.scoreValue = 450;
            this.isClinging = true;
        }

        this.health = this.maxHealth;
        this.shootTimer = 0.8; // Initial grace period upon spawn before shooting
        this.direction = -1;
        this.isWebbed = 0;
        this.wasDamagedTimer = 0;
        this.animTime = 0;
        this.isDead = false;
    }

    Enemy.prototype.update = function(dt, player) {
        this.animTime += dt;

        if (this.wasDamagedTimer > 0) this.wasDamagedTimer -= dt;

        if (this.isWebbed > 0) {
            this.isWebbed -= dt;
            // Fall slowly if webbed in mid-air
            this.y += 45 * dt;
            return;
        }

        var distToPlayerX = player.x - this.x;
        var distToPlayerY = player.y - this.y;
        this.direction = (distToPlayerX > 0) ? 1 : -1;

        if (this.type === 'GLIDER') {
            // Soaring sine-wave patrol through sky canyon
            this.y = this.baseY + Math.sin(this.animTime * 2.2 + this.hoverOffset) * 55;
            this.x += this.direction * this.speed * dt * 0.45;

            this.shootTimer += dt;
            if (this.shootTimer >= this.shootCooldown && Math.abs(distToPlayerX) < 520) {
                this.shootTimer = 0;
                this.firePumpkinBomb(player);
            }
        } else if (this.type === 'DRONE') {
            // Hovering drone keeping distance
            this.y = this.baseY + Math.sin(this.animTime * 3.0 + this.hoverOffset) * 30;
            this.x += this.direction * this.speed * dt * 0.35;

            this.shootTimer += dt;
            if (this.shootTimer >= this.shootCooldown && Math.abs(distToPlayerX) < 460) {
                this.shootTimer = 0;
                this.fireLaser(player);
            }
        } else if (this.type === 'BRUTE') {
            // Wall-clinger lunging when Spider-Man is in close proximity
            if (Math.abs(distToPlayerX) < 200 && Math.abs(distToPlayerY) < 160) {
                this.x += this.direction * 130 * dt;
                this.y += (distToPlayerY > 0 ? 1 : -1) * 90 * dt;
            }
        }
    };

    Enemy.prototype.firePumpkinBomb = function(player) {
        var angle = Math.atan2((player.y + 20) - (this.y + 20), player.x - this.x);
        var speed = 240;
        var p = new EnemyProjectile(this.game, {
            x: this.x + (this.direction > 0 ? this.width : 0),
            y: this.y + 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 1,
            type: 'BOMB',
            gravity: 130
        });
        this.game.addEnemyProjectile(p);
    };

    Enemy.prototype.fireLaser = function(player) {
        var angle = Math.atan2((player.y + 15) - (this.y + 15), player.x - this.x);
        var speed = 320;
        var p = new EnemyProjectile(this.game, {
            x: this.x + (this.direction > 0 ? this.width : 0),
            y: this.y + 15,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 1,
            type: 'LASER'
        });
        this.game.addEnemyProjectile(p);
    };

    Enemy.prototype.hitWithWeb = function(damage) {
        this.health -= damage;
        this.wasDamagedTimer = 0.2;
        this.isWebbed = 1.4; // Tangles enemy, giving player ample time to finish or swing away

        var fx = window.WebSlingerEffects;
        if (fx) {
            fx.addCombatHit(this.x + this.width / 2, this.y + this.height / 2, damage);
        }

        if (this.health <= 0) {
            this.die();
        }
    };

    Enemy.prototype.die = function() {
        this.isDead = true;
        this.game.addScore(this.scoreValue);
        this.game.enemiesDefeated++;

        var audio = window.WebSlingerAudio;
        if (audio) audio.playSfx('enemyDefeat');

        var fx = window.WebSlingerEffects;
        if (fx) {
            fx.addExplosion(this.x + this.width / 2, this.y + this.height / 2);
            fx.addPopup(this.x + this.width / 2, this.y - 20, '+' + this.scoreValue, '#f1c40f', 24);
        }

        // 40% chance to drop powerup in mid-air
        if (Math.random() < 0.40) {
            var PowerupClass = window.WebSlingerPowerup;
            if (PowerupClass) {
                var p = new PowerupClass({
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2
                });
                this.game.addPowerup(p);
            }
        }
    };

    Enemy.prototype.draw = function(ctx, cameraX, time) {
        if (this.isDead) return;

        var rx = this.x - cameraX;
        var ry = this.y;

        if (rx + this.width < -60 || rx > this.canvas.width + 60) return;

        // Draw Web-Strike Target Reticle if player is nearby
        var player = this.game.player;
        if (player && !player.isWebStriking) {
            var dx = (this.x + this.width / 2) - (player.x + player.width / 2);
            var dy = (this.y + this.height / 2) - (player.y + player.height / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dx > 0 && dist < 420) {
                ctx.save();
                ctx.strokeStyle = '#ff4757';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(rx + this.width / 2, ry + this.height / 2, 22 + Math.sin(time * 8) * 3, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#ff4757';
                ctx.font = 'bold 9px "Arial Black", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('[SPACE: STRIKE]', rx + this.width / 2, ry - 14);
                ctx.restore();
            }
        }

        var sprite = enemyImages[this.type];

        ctx.save();
        ctx.translate(rx + this.width / 2, ry + this.height / 2);

        if (this.wasDamagedTimer > 0) {
            ctx.shadowColor = '#ff4757';
            ctx.shadowBlur = 14;
        }

        if (this.direction > 0) {
            ctx.scale(-1, 1);
        }

        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            var sw = sprite.naturalWidth * this.scale;
            var sh = sprite.naturalHeight * this.scale;
            ctx.drawImage(sprite, -sw / 2, -sh / 2, sw, sh);
        } else {
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        // Web strands if tangled
        if (this.isWebbed > 0) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-this.width / 2, -this.height / 2); ctx.lineTo(this.width / 2, this.height / 2);
            ctx.moveTo(this.width / 2, -this.height / 2); ctx.lineTo(-this.width / 2, this.height / 2);
            ctx.stroke();
        }

        ctx.restore();

        this.drawHealthBar(ctx, rx, ry);
    };

    Enemy.prototype.drawHealthBar = function(ctx, rx, ry) {
        if (this.health >= this.maxHealth) return;

        var barW = 34;
        var barH = 5;
        var barX = rx + (this.width - barW) / 2;
        var barY = ry - 10;

        ctx.fillStyle = '#0a0e17';
        ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

        var fillW = Math.max(0, (this.health / this.maxHealth) * barW);
        ctx.fillStyle = (this.health > 1) ? '#ff4757' : '#ffa502';
        ctx.fillRect(barX, barY, fillW, barH);
    };

    Enemy.prototype.getHitbox = function() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    };

    window.WebSlingerEnemy = Enemy;
    window.WebSlingerEnemyProjectile = EnemyProjectile;
})(window);
