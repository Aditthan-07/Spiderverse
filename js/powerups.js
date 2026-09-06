/**
 * Web Slinger: City Rush - Collectibles & Powerups System
 * Manages Web Cartridges, Health Medkits, Spider-Sense Boosts, and Score Tokens.
 */
(function(window) {
    'use strict';

    var POWERUP_TYPES = {
        AMMO: {
            name: 'AMMO',
            color: '#70d6ff',
            glowColor: 'rgba(112, 214, 255, 0.6)',
            label: 'WEB +20',
            weight: 45
        },
        HEALTH: {
            name: 'HEALTH',
            color: '#ff4757',
            glowColor: 'rgba(255, 71, 87, 0.6)',
            label: 'HEALTH +1',
            weight: 25
        },
        BOOST: {
            name: 'BOOST',
            color: '#f1c40f',
            glowColor: 'rgba(241, 196, 15, 0.7)',
            label: 'SPIDER-SENSE!',
            weight: 15
        },
        SCORE: {
            name: 'SCORE',
            color: '#2ed573',
            glowColor: 'rgba(46, 213, 115, 0.6)',
            label: '+500 PTS',
            weight: 15
        }
    };

    function Powerup(opts) {
        this.x = opts.x || 0;
        this.baseY = opts.y || 0;
        this.y = this.baseY;
        this.type = opts.type || this.getRandomType();
        this.radius = 14;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.collected = false;
        this.scale = 1.0;
    }

    Powerup.prototype.getRandomType = function() {
        var rand = Math.random() * 100;
        if (rand < 45) return POWERUP_TYPES.AMMO;
        if (rand < 70) return POWERUP_TYPES.HEALTH;
        if (rand < 85) return POWERUP_TYPES.BOOST;
        return POWERUP_TYPES.SCORE;
    };

    Powerup.prototype.update = function(time, dt) {
        // Floating sinusoidal hover
        this.y = this.baseY + Math.sin(time * 3 + this.bobOffset) * 6;
    };

    Powerup.prototype.draw = function(ctx, cameraX, time) {
        if (this.collected) return;

        var rx = this.x - cameraX;
        var ry = this.y;

        ctx.save();
        ctx.translate(rx, ry);

        // Pulsing glow ring
        var pulse = Math.sin(time * 5 + this.bobOffset) * 4 + 18;
        var grad = ctx.createRadialGradient(0, 0, 4, 0, 0, pulse);
        grad.addColorStop(0, this.type.glowColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.fill();

        // Outer Hex / Diamond Frame
        ctx.fillStyle = '#0a0e17';
        ctx.strokeStyle = this.type.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Icon inside
        ctx.fillStyle = this.type.color;
        if (this.type.name === 'AMMO') {
            // Web cartridge vial icon
            ctx.fillRect(-4, -6, 8, 12);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-2, -8, 4, 3);
        } else if (this.type.name === 'HEALTH') {
            // Heart / Medical cross
            ctx.fillRect(-2, -6, 4, 12);
            ctx.fillRect(-6, -2, 12, 4);
        } else if (this.type.name === 'BOOST') {
            // Lightning / Star
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.lineTo(3, -1);
            ctx.lineTo(7, 0);
            ctx.lineTo(2, 4);
            ctx.lineTo(3, 8);
            ctx.lineTo(0, 5);
            ctx.lineTo(-3, 8);
            ctx.lineTo(-2, 4);
            ctx.lineTo(-7, 0);
            ctx.lineTo(-3, -1);
            ctx.closePath();
            ctx.fill();
        } else if (this.type.name === 'SCORE') {
            // S coin
            ctx.font = 'bold 12px "Arial Black", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 1);
        }

        ctx.restore();
    };

    Powerup.prototype.checkCollisionWithPlayer = function(player) {
        if (this.collected) return false;
        var pBox = player.getHitbox();
        // Circle to AABB overlap
        var closestX = Math.max(pBox.x, Math.min(this.x, pBox.x + pBox.width));
        var closestY = Math.max(pBox.y, Math.min(this.y, pBox.y + pBox.height));
        var distanceX = this.x - closestX;
        var distanceY = this.y - closestY;
        var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        if (distanceSquared < (this.radius * this.radius)) {
            this.collected = true;
            this.applyToPlayer(player);
            return true;
        }
        return false;
    };

    Powerup.prototype.applyToPlayer = function(player) {
        var fx = window.WebSlingerEffects;
        var audio = window.WebSlingerAudio;

        if (this.type.name === 'AMMO') {
            player.addWeb(20);
            if (audio) audio.playSfx('powerup');
            if (fx) fx.addPopup(this.x, this.y - 15, 'AMMO +20!', '#70d6ff', 24);
        } else if (this.type.name === 'HEALTH') {
            player.heal(1);
            if (audio) audio.playSfx('powerup');
            if (fx) fx.addPopup(this.x, this.y - 15, 'HEALTH +1!', '#ff4757', 24);
        } else if (this.type.name === 'BOOST') {
            player.activateSpiderSense(9); // 9 seconds
            if (audio) audio.playSfx('boost');
            if (fx) fx.addPopup(this.x, this.y - 15, 'SPIDER-SENSE!', '#f1c40f', 26);
        } else if (this.type.name === 'SCORE') {
            player.game.addScore(500);
            if (audio) audio.playSfx('combo');
            if (fx) fx.addPopup(this.x, this.y - 15, '+500 PTS!', '#2ed573', 24);
        }
    };

    window.WebSlingerPowerup = Powerup;
    window.WebSlingerPowerupTypes = POWERUP_TYPES;
})(window);
