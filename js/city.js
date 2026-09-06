/**
 * Web Slinger: City Rush - Skyscraper City & Web Anchor System
 * Generates clean, atmospheric skyscrapers with solid rooftops and anchor points for seamless web-swinging.
 */
(function(window) {
    'use strict';

    function Skyscraper(game, x, opts) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        opts = opts || {};

        this.x = x || 0;
        this.width = opts.width || Math.floor(220 + Math.random() * 160);
        this.topY = opts.topY !== undefined ? opts.topY : Math.floor(80 + Math.random() * 160);
        this.height = this.canvas.height - this.topY + 120;

        this.wallColor = '#0b1120';
        this.ledgeColor = '#1e293b';

        this.hasSpire = Math.random() > 0.4;
        this.hasCrane = Math.random() > 0.65;
        this.anchors = [];

        this.generateAnchors();
    }

    Skyscraper.prototype.generateAnchors = function() {
        // Rooftop anchors
        this.anchors.push({
            x: this.x + 25,
            y: this.topY - 15,
            type: 'ROOF_EDGE'
        });
        this.anchors.push({
            x: this.x + this.width - 25,
            y: this.topY - 15,
            type: 'ROOF_EDGE'
        });

        // High antenna spire
        if (this.hasSpire) {
            this.spireHeight = 55 + Math.random() * 45;
            this.anchors.push({
                x: this.x + this.width / 2,
                y: this.topY - this.spireHeight,
                type: 'SPIRE'
            });
        }

        // Crane boom
        if (this.hasCrane) {
            this.craneLength = 75 + Math.random() * 45;
            this.craneHeight = 45;
            this.anchors.push({
                x: this.x + this.width + this.craneLength * 0.7,
                y: this.topY - this.craneHeight,
                type: 'CRANE'
            });
        }
    };

    Skyscraper.prototype.draw = function(ctx, cameraX, time) {
        var rx = this.x - cameraX;
        var ry = this.topY;
        var w = this.width;
        var h = this.height;

        if (rx + w < -100 || rx > this.canvas.width + 150) return;

        // --- 1. PROPS ON ROOF ---

        // Antenna Spire
        if (this.hasSpire) {
            var spireX = rx + w / 2;
            var spireTopY = ry - this.spireHeight;

            ctx.strokeStyle = '#2b3952';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(spireX, ry);
            ctx.lineTo(spireX, spireTopY);
            ctx.stroke();

            // Calm red indicator dot
            ctx.fillStyle = '#ff4757';
            ctx.beginPath();
            ctx.arc(spireX, spireTopY, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Construction Crane
        if (this.hasCrane) {
            var craneBaseX = rx + w * 0.75;
            var craneTopY = ry - this.craneHeight;
            var craneArmX = craneBaseX + this.craneLength;

            ctx.strokeStyle = '#d35400';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(craneBaseX, ry);
            ctx.lineTo(craneBaseX, craneTopY);
            ctx.lineTo(craneArmX, craneTopY);
            ctx.moveTo(craneBaseX - 20, craneTopY);
            ctx.lineTo(craneBaseX, craneTopY);
            ctx.stroke();

            ctx.strokeStyle = '#7f8c8d';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(craneBaseX, craneTopY - 10);
            ctx.lineTo(craneArmX, craneTopY);
            ctx.moveTo(craneBaseX, craneTopY - 10);
            ctx.lineTo(craneBaseX - 20, craneTopY);
            ctx.stroke();
        }

        // --- 2. SKYSCRAPER MAIN BODY ---
        ctx.fillStyle = this.wallColor;
        ctx.fillRect(rx, ry, w, h);

        // Calm static windows (no harsh glittering)
        ctx.fillStyle = 'rgba(255, 225, 150, 0.08)';
        for (var wy = ry + 22; wy < this.canvas.height; wy += 22) {
            for (var wx = rx + 16; wx < rx + w - 16; wx += 20) {
                ctx.fillRect(wx, wy, 9, 11);
            }
        }

        // --- 3. ROOFTOP SOLID LEDGE & TOP LIP ---
        ctx.fillStyle = this.ledgeColor;
        ctx.fillRect(rx - 2, ry, w + 4, 10);
        ctx.fillStyle = '#060a14';
        ctx.fillRect(rx, ry + 10, w, 4);
    };

    function CityCanyon(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.buildings = [];
        this.init();
    }

    CityCanyon.prototype.init = function() {
        this.buildings = [];
        var curX = 0;
        // First starting rooftop
        var first = new Skyscraper(this.game, curX, { width: 450, topY: 180 });
        this.buildings.push(first);
        curX += first.width;

        for (var i = 0; i < 5; i++) {
            curX += Math.floor(70 + Math.random() * 80); // Gap
            var b = new Skyscraper(this.game, curX);
            this.buildings.push(b);
            curX += b.width;
        }
    };

    CityCanyon.prototype.update = function(cameraX) {
        var lastB = this.buildings[this.buildings.length - 1];
        var viewRight = cameraX + this.canvas.width + 400;

        while (lastB.x + lastB.width < viewRight) {
            var gap = Math.floor(70 + Math.random() * 90);
            var nextX = lastB.x + lastB.width + gap;
            var nextB = new Skyscraper(this.game, nextX);
            this.buildings.push(nextB);
            lastB = nextB;
        }

        var leftBound = cameraX - 450;
        this.buildings = this.buildings.filter(function(b) {
            return (b.x + b.width) > leftBound;
        });
    };

    CityCanyon.prototype.findBestAnchor = function(playerX, playerY) {
        var bestAnchor = null;
        var minScore = Infinity;

        for (var i = 0; i < this.buildings.length; i++) {
            var b = this.buildings[i];
            for (var a = 0; a < b.anchors.length; a++) {
                var anchor = b.anchors[a];

                var dx = anchor.x - playerX;
                var dy = anchor.y - playerY;

                if (dy > -20) continue;
                if (dx < -40 || dx > 380) continue;

                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 60 || dist > 440) continue;

                var forwardBias = Math.abs(dx - 120);
                var score = dist + forwardBias * 0.7;

                if (score < minScore) {
                    minScore = score;
                    bestAnchor = anchor;
                }
            }
        }

        if (!bestAnchor) {
            bestAnchor = {
                x: playerX + 130,
                y: Math.max(20, playerY - 220),
                type: 'SKY_ANCHOR'
            };
        }

        return bestAnchor;
    };

    CityCanyon.prototype.draw = function(ctx, cameraX, time) {
        for (var i = 0; i < this.buildings.length; i++) {
            this.buildings[i].draw(ctx, cameraX, time);
        }
    };

    window.WebSlingerCity = CityCanyon;
    window.WebSlingerSkyscraper = Skyscraper;
})(window);
