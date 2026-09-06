/**
 * Web Slinger: City Rush - Calm Atmospheric Cityscape Background
 * Features a clean, non-distracting dusk/night skyline providing rich depth without competing with gameplay.
 */
(function(window) {
    'use strict';

    function CityBackground(canvas) {
        this.canvas = canvas;
        this.stars = [];
        this.distantBuildings = [];
        this.midBuildings = [];
        this.clouds = [];
        this.time = 0;
        this.initStaticElements();
    }

    CityBackground.prototype.initStaticElements = function() {
        // Soft, non-flashing stars
        this.stars = [];
        for (var i = 0; i < 45; i++) {
            this.stars.push({
                x: Math.random() * 2000,
                y: Math.random() * 180,
                size: Math.random() * 1.5 + 0.6,
                alpha: Math.random() * 0.4 + 0.2
            });
        }

        // Drifting background clouds
        this.clouds = [];
        for (var c = 0; c < 4; c++) {
            this.clouds.push({
                x: Math.random() * 1600,
                y: 35 + Math.random() * 70,
                width: 160 + Math.random() * 120,
                height: 30 + Math.random() * 20,
                speed: 4 + Math.random() * 6,
                alpha: 0.12
            });
        }

        // Layer 1: Distant Spire Silhouettes
        this.distantBuildings = [];
        var curX = 0;
        for (var d = 0; d < 25; d++) {
            var width = 50 + Math.random() * 50;
            var height = 130 + Math.random() * 90;
            this.distantBuildings.push({
                x: curX,
                width: width,
                height: height,
                hasAntenna: Math.random() > 0.5,
                antennaHeight: 18 + Math.random() * 20
            });
            curX += width + 10;
        }
        this.distantTotalWidth = curX;

        // Layer 2: Mid-ground Silhouettes with calm, subtle windows
        this.midBuildings = [];
        var midX = 0;
        for (var m = 0; m < 20; m++) {
            var mWidth = 75 + Math.random() * 70;
            var mHeight = 100 + Math.random() * 70;
            this.midBuildings.push({
                x: midX,
                width: mWidth,
                height: mHeight,
                color: (m % 2 === 0) ? '#080d18' : '#0b1220',
                windowRows: Math.floor(mHeight / 20),
                windowCols: Math.floor(mWidth / 16)
            });
            midX += mWidth + 18;
        }
        this.midTotalWidth = midX;
    };

    CityBackground.prototype.update = function(dt) {
        this.time += dt;
        for (var i = 0; i < this.clouds.length; i++) {
            this.clouds[i].x += this.clouds[i].speed * dt;
            if (this.clouds[i].x > 2000) {
                this.clouds[i].x = -this.clouds[i].width;
            }
        }
    };

    CityBackground.prototype.draw = function(ctx, cameraX) {
        var w = this.canvas.width;
        var h = this.canvas.height;

        // --- LAYER 0: SMOOTH NIGHT SKY GRADIENT ---
        var skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#04070f');   // Deep Night Navy
        skyGrad.addColorStop(0.5, '#0b1122'); // Midnight Indigo
        skyGrad.addColorStop(0.85, '#19152b'); // Dusk Violet
        skyGrad.addColorStop(1, '#110c1e');

        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // Calm static stars (no distracting flickering)
        for (var s = 0; s < this.stars.length; s++) {
            var star = this.stars[s];
            var sx = (star.x - cameraX * 0.02) % (w + 200);
            if (sx < 0) sx += (w + 200);

            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = star.alpha;
            ctx.beginPath();
            ctx.arc(sx, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Moon with soft ambient halo
        var moonX = 640 - (cameraX * 0.012) % 900;
        var moonY = 60;
        var moonGlow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 50);
        moonGlow.addColorStop(0, 'rgba(255, 250, 230, 0.25)');
        moonGlow.addColorStop(1, 'rgba(255, 230, 180, 0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fffdf2';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Slow soft clouds
        for (var c = 0; c < this.clouds.length; c++) {
            var cloud = this.clouds[c];
            var cx = (cloud.x - cameraX * 0.04) % (w + 300);
            if (cx < -cloud.width) cx += (w + 300);

            ctx.fillStyle = 'rgba(35, 30, 55, ' + cloud.alpha + ')';
            ctx.beginPath();
            ctx.ellipse(cx + cloud.width / 2, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- LAYER 1: FAR DISTANT SILHOUETTES (Parallax 0.06) ---
        var farFactor = 0.06;
        var farOffset = (cameraX * farFactor) % this.distantTotalWidth;
        var repeatCount = Math.ceil(w / this.distantTotalWidth) + 2;

        for (var r = -1; r < repeatCount; r++) {
            var baseFarX = r * this.distantTotalWidth - farOffset;
            for (var d = 0; d < this.distantBuildings.length; d++) {
                var b = this.distantBuildings[d];
                var bx = baseFarX + b.x;
                if (bx + b.width < 0 || bx > w) continue;

                var by = h - b.height - 30;

                ctx.fillStyle = '#060a14';
                ctx.fillRect(bx, by, b.width, b.height + 30);

                if (b.hasAntenna) {
                    var antX = bx + b.width / 2;
                    ctx.strokeStyle = '#060a14';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(antX, by);
                    ctx.lineTo(antX, by - b.antennaHeight);
                    ctx.stroke();

                    ctx.fillStyle = 'rgba(255, 60, 60, 0.6)';
                    ctx.beginPath();
                    ctx.arc(antX, by - b.antennaHeight, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // --- LAYER 2: MID-GROUND SKYLINE (Parallax 0.16) ---
        var midFactor = 0.16;
        var midOffset = (cameraX * midFactor) % this.midTotalWidth;
        var midRepeat = Math.ceil(w / this.midTotalWidth) + 2;

        for (var mr = -1; mr < midRepeat; mr++) {
            var baseMidX = mr * this.midTotalWidth - midOffset;
            for (var m = 0; m < this.midBuildings.length; m++) {
                var mb = this.midBuildings[m];
                var mbx = baseMidX + mb.x;
                if (mbx + mb.width < 0 || mbx > w) continue;

                var mby = h - mb.height - 15;

                ctx.fillStyle = mb.color;
                ctx.fillRect(mbx, mby, mb.width, mb.height + 15);

                // Subtle, calm static windows (NOT flashing)
                ctx.fillStyle = 'rgba(255, 235, 160, 0.08)';
                for (var rIndex = 0; rIndex < mb.windowRows; rIndex++) {
                    var winY = mby + 12 + rIndex * 18;
                    if (winY > h - 25) break;
                    for (var cIndex = 0; cIndex < mb.windowCols; cIndex++) {
                        var winX = mbx + 10 + cIndex * 15;
                        if (winX + 6 > mbx + mb.width) break;
                        ctx.fillRect(winX, winY, 5, 7);
                    }
                }
            }
        }

        // Ambient low mist glow
        var fogGrad = ctx.createLinearGradient(0, h - 70, 0, h);
        fogGrad.addColorStop(0, 'rgba(20, 15, 35, 0)');
        fogGrad.addColorStop(1, 'rgba(10, 8, 20, 0.5)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, h - 70, w, 70);
    };

    window.WebSlingerBackground = CityBackground;
})(window);
