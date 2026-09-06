/**
 * Web Slinger: City Rush - Camera System
 * Handles smooth horizontal tracking, lead lookahead, and trauma-based screen shake.
 */
(function(window) {
    'use strict';

    function Camera(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.targetX = 0;
        this.y = 0;
        
        // Screen Shake / Trauma system
        this.trauma = 0; // 0 to 1
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeAngle = 0;
        this.maxOffset = 18;
        this.maxAngle = 0.04; // radians
        this.traumaDecay = 1.6; // per second
    }

    Camera.prototype.reset = function() {
        this.x = 0;
        this.targetX = 0;
        this.y = 0;
        this.trauma = 0;
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeAngle = 0;
    };

    Camera.prototype.addTrauma = function(amount) {
        var settings = (window.WebSlingerStorage && window.WebSlingerStorage.getSettings()) || { screenShake: true };
        if (!settings.screenShake) return;
        this.trauma = Math.min(1.0, this.trauma + amount);
    };

    Camera.prototype.update = function(playerX, dt) {
        dt = dt || 1 / 60;

        // Lead camera ahead of player so the player sees obstacles in front
        var desiredX = playerX - 180;
        if (desiredX < 0) desiredX = 0;

        // Smooth camera lerp
        var lerpFactor = 8.0 * dt;
        this.x += (desiredX - this.x) * Math.min(1.0, lerpFactor);

        // Screen Shake calculation
        if (this.trauma > 0) {
            this.trauma = Math.max(0, this.trauma - this.traumaDecay * dt);
            var shake = this.trauma * this.trauma; // Non-linear response curve

            this.shakeX = (Math.random() * 2 - 1) * this.maxOffset * shake;
            this.shakeY = (Math.random() * 2 - 1) * this.maxOffset * shake;
            this.shakeAngle = (Math.random() * 2 - 1) * this.maxAngle * shake;
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
            this.shakeAngle = 0;
        }
    };

    Camera.prototype.applyTransform = function(ctx) {
        ctx.save();
        if (this.trauma > 0) {
            var centerX = this.canvas.width / 2;
            var centerY = this.canvas.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.shakeAngle);
            ctx.translate(-centerX + this.shakeX, -centerY + this.shakeY);
        }
    };

    Camera.prototype.restoreTransform = function(ctx) {
        ctx.restore();
    };

    window.WebSlingerCamera = Camera;
})(window);
