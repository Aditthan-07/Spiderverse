/**
 * Web Slinger: City Rush - Visual Effects & Particle System
 * Powers comic burst popups ("THWIP!", "POW!"), impact splatters, landing dust, and speed trails.
 */
(function(window) {
    'use strict';

    function Particle(opts) {
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.vx = opts.vx || 0;
        this.vy = opts.vy || 0;
        this.color = opts.color || '#fff';
        this.size = opts.size || 3;
        this.maxLife = opts.life || 0.5;
        this.life = this.maxLife;
        this.gravity = opts.gravity !== undefined ? opts.gravity : 200;
        this.drag = opts.drag || 0.96;
        this.shape = opts.shape || 'circle'; // 'circle', 'line', 'spark', 'web'
        this.angle = opts.angle || 0;
        this.vAngle = opts.vAngle || 0;
        this.length = opts.length || 8;
    }

    Particle.prototype.update = function(dt) {
        this.life -= dt;
        this.vx *= Math.pow(this.drag, dt * 60);
        this.vy += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.angle += this.vAngle * dt;
        return this.life > 0;
    };

    Particle.prototype.draw = function(ctx, cameraX) {
        var alpha = Math.max(0, this.life / this.maxLife);
        var rx = this.x - cameraX;
        var ry = this.y;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(rx, ry);
        ctx.rotate(this.angle);

        if (this.shape === 'circle') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(0.5, this.size * alpha), 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'web') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = Math.max(1, this.size * alpha);
            ctx.beginPath();
            ctx.moveTo(-this.length / 2, 0);
            ctx.lineTo(this.length / 2, 0);
            ctx.stroke();
        } else if (this.shape === 'spark') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 1.5);
            ctx.lineTo(this.size * 0.5, 0);
            ctx.lineTo(0, this.size * 1.5);
            ctx.lineTo(-this.size * 0.5, 0);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    };

    // Comic Burst Text (e.g. "THWIP!", "POW!", "COMBO x3!")
    function ComicPopup(opts) {
        this.text = opts.text || 'BAM!';
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.color = opts.color || '#f1c40f'; // Electric Yellow
        this.outlineColor = opts.outlineColor || '#000';
        this.maxLife = opts.life || 0.75;
        this.life = this.maxLife;
        this.vy = opts.vy || -55;
        this.size = opts.size || 22;
        this.scale = 0.2;
        this.targetScale = 1.0;
        this.angle = (Math.random() * 0.25 - 0.125);
    }

    ComicPopup.prototype.update = function(dt) {
        this.life -= dt;
        this.y += this.vy * dt;
        var progress = 1 - (this.life / this.maxLife);
        if (progress < 0.25) {
            this.scale = 0.3 + (progress / 0.25) * 0.9; // Overshoot pop
        } else if (progress < 0.4) {
            this.scale = 1.2 - ((progress - 0.25) / 0.15) * 0.2;
        } else {
            this.scale = 1.0;
        }
        return this.life > 0;
    };

    ComicPopup.prototype.draw = function(ctx, cameraX) {
        var alpha = Math.max(0, this.life / this.maxLife);
        var rx = this.x - cameraX;
        var ry = this.y;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(rx, ry);
        ctx.rotate(this.angle);
        ctx.scale(this.scale, this.scale);

        // Comic burst star outline behind major action words
        if (this.text === 'THWIP!' || this.text === 'POW!' || this.text === 'CRITICAL!') {
            ctx.fillStyle = 'rgba(255, 230, 0, 0.4)';
            ctx.beginPath();
            var points = 8;
            var outerR = this.size * 1.5;
            var innerR = this.size * 0.9;
            for (var i = 0; i < points * 2; i++) {
                var r = (i % 2 === 0) ? outerR : innerR;
                var a = (i / points) * Math.PI;
                var px = Math.cos(a) * r;
                var py = Math.sin(a) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }

        ctx.font = '900 ' + this.size + 'px "Impact", "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Outer Dark Shadow
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#0a0e17';
        ctx.strokeText(this.text, 0, 0);

        // Inner Thick Stroke
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.outlineColor;
        ctx.strokeText(this.text, 0, 0);

        // Fill
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, 0, 0);

        ctx.restore();
    };

    function EffectsManager() {
        this.particles = [];
        this.popups = [];
    }

    EffectsManager.prototype.reset = function() {
        this.particles = [];
        this.popups = [];
    };

    EffectsManager.prototype.addWebImpact = function(x, y) {
        // Burst of glowing web strands & sparks
        for (var i = 0; i < 14; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 80 + Math.random() * 160;
            this.particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: (Math.random() > 0.3) ? '#ffffff' : '#70d6ff',
                size: 2.5 + Math.random() * 2,
                life: 0.35 + Math.random() * 0.25,
                shape: (Math.random() > 0.5) ? 'web' : 'circle',
                length: 8 + Math.random() * 12,
                angle: angle,
                gravity: 80
            }));
        }
        this.addPopup(x, y - 10, 'THWIP!', '#70d6ff');
    };

    EffectsManager.prototype.addCombatHit = function(x, y, damage) {
        // Orange/Red spark burst
        for (var i = 0; i < 16; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 90 + Math.random() * 180;
            this.particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 40,
                color: (Math.random() > 0.4) ? '#ff4757' : '#ffa502',
                size: 3 + Math.random() * 2.5,
                life: 0.3 + Math.random() * 0.25,
                shape: 'spark',
                gravity: 250
            }));
        }
        var word = damage > 1 ? 'POW!' : 'BAM!';
        this.addPopup(x, y - 15, word, '#ff4757');
    };

    EffectsManager.prototype.addDustPuff = function(x, y, direction) {
        direction = direction || 0;
        for (var i = 0; i < 6; i++) {
            var vx = -direction * (30 + Math.random() * 40) + (Math.random() * 20 - 10);
            var vy = -(15 + Math.random() * 35);
            this.particles.push(new Particle({
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                color: 'rgba(210, 220, 235, 0.65)',
                size: 3.5 + Math.random() * 3,
                life: 0.25 + Math.random() * 0.2,
                shape: 'circle',
                gravity: -10, // Float slightly
                drag: 0.90
            }));
        }
    };

    EffectsManager.prototype.addLandingDust = function(x, y, width) {
        width = width || 30;
        for (var i = 0; i < 12; i++) {
            var side = (i % 2 === 0) ? 1 : -1;
            var vx = side * (40 + Math.random() * 70);
            var vy = -(20 + Math.random() * 30);
            this.particles.push(new Particle({
                x: x + (Math.random() * width - width / 2),
                y: y,
                vx: vx,
                vy: vy,
                color: 'rgba(230, 235, 245, 0.7)',
                size: 4 + Math.random() * 3.5,
                life: 0.3 + Math.random() * 0.2,
                shape: 'circle',
                gravity: 40,
                drag: 0.88
            }));
        }
    };

    EffectsManager.prototype.addExplosion = function(x, y) {
        for (var i = 0; i < 24; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 100 + Math.random() * 240;
            this.particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: ['#ff3838', '#ff9f1a', '#fff200', '#ffffff'][Math.floor(Math.random() * 4)],
                size: 4 + Math.random() * 4,
                life: 0.45 + Math.random() * 0.3,
                shape: 'spark',
                gravity: 180
            }));
        }
        this.addPopup(x, y - 20, 'BOOM!', '#ff9f1a');
    };

    EffectsManager.prototype.addSpeedTrail = function(x, y, color) {
        this.particles.push(new Particle({
            x: x + (Math.random() * 10 - 5),
            y: y + (Math.random() * 20 - 10),
            vx: -60 - Math.random() * 40,
            vy: (Math.random() * 20 - 10),
            color: color || 'rgba(11, 83, 148, 0.6)',
            size: 4 + Math.random() * 3,
            life: 0.2,
            shape: 'circle',
            gravity: 0,
            drag: 0.94
        }));
    };

    EffectsManager.prototype.addPopup = function(x, y, text, color, size) {
        this.popups.push(new ComicPopup({
            x: x,
            y: y,
            text: text,
            color: color || '#f1c40f',
            size: size || 22
        }));
    };

    EffectsManager.prototype.update = function(dt) {
        dt = dt || 1 / 60;
        this.particles = this.particles.filter(function(p) { return p.update(dt); });
        this.popups = this.popups.filter(function(pop) { return pop.update(dt); });
    };

    EffectsManager.prototype.draw = function(ctx, cameraX) {
        var settings = (window.WebSlingerStorage && window.WebSlingerStorage.getSettings()) || { particles: true };
        if (settings.particles) {
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].draw(ctx, cameraX);
            }
        }
        for (var j = 0; j < this.popups.length; j++) {
            this.popups[j].draw(ctx, cameraX);
        }
    };

    window.WebSlingerEffects = new EffectsManager();
})(window);
