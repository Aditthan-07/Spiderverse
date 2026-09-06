/**
 * Web Slinger: City Rush - Spider-Man Controller & Web-Shooting Engine
 * Seamlessly combines Spacebar Web Shooting, physics-based Web-Swinging, and fluid rooftop locomotion.
 */
(function(window) {
    'use strict';

    var SPRITES = {
        STANDING: 'images/standing.png',
        RUNNING_RIGHT: 'images/running-right-step.png',
        RUNNING_CHANGE: 'images/running-change-step.png',
        RUNNING_LEFT: 'images/running-left-step.png',
        JUMP: 'images/jump.png',
        SHOOT: 'images/shoot.png',
        SHOOT_RIGHT: 'images/shoot-right-step.png',
        SHOOT_CHANGE: 'images/shoot-change-step.png',
        SHOOT_LEFT: 'images/shoot-left-step.png',
        SHOOT_JUMP: 'images/shoot-jump.png',
        SLIDE: 'images/slide.png',
        WEB: 'images/web.png'
    };

    var images = {};
    for (var key in SPRITES) {
        var img = new Image();
        img.src = SPRITES[key];
        images[key] = img;
    }

    // --- PLAYER WEB SHOOTER PROJECTILE ---
    function WebProjectile(game, opts) {
        this.game = game;
        this.ctx = game.ctx;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.direction = opts.direction || 1;
        this.speed = opts.speed || 880; // Fast, snappy web projectile
        this.damage = opts.damage || 2;
        this.radius = 9;
        this.life = 1.4;
        this.isDead = false;
        this.img = images.WEB;
    }

    WebProjectile.prototype.update = function(dt) {
        this.life -= dt;
        this.x += this.direction * this.speed * dt;
        if (this.life <= 0) this.isDead = true;
        return !this.isDead;
    };

    WebProjectile.prototype.draw = function(ctx, cameraX) {
        if (this.isDead) return;
        var rx = this.x - cameraX;
        var ry = this.y;

        ctx.save();
        // High-tension web trail
        ctx.strokeStyle = 'rgba(112, 214, 255, 0.6)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(rx - this.direction * 40, ry);
        ctx.lineTo(rx, ry);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(rx - this.direction * 40, ry);
        ctx.lineTo(rx, ry);
        ctx.stroke();

        // Web Sprite Head
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, rx - 10, ry - 10, 20, 20);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(rx, ry, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    };

    WebProjectile.prototype.getHitbox = function() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    };

    // --- SPIDER-MAN HERO CLASS ---
    function SpiderMan(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;

        this.scale = 0.62;
        this.width = 38;
        this.height = 54;
        this.x = 80;
        this.y = 120;
        this.vx = 220;
        this.vy = 0;

        // Locomotion & Swinging States
        this.isSwinging = false;
        this.isDiving = false;
        this.onGround = false;
        this.facing = 1;

        // Swing Pendulum Parameters
        this.anchor = null;
        this.webLength = 0;
        this.swingAngle = 0;
        this.angularVelocity = 0;

        // Physics Constants (Boosted +12% for swift, responsive momentum while keeping smooth control)
        this.gravity = 800;
        this.airResistance = 0.993;
        this.groundMoveSpeed = 265;
        this.swingPumpForce = 2.1;

        // Animation & Timers
        this.animTime = 0;
        this.runFrameIndex = 0;
        this.shootPoseTimer = 0;
        this.trailTimer = 0;
        this.hasDangerWarning = false;

        this.runningCycle = ['RUNNING_RIGHT', 'RUNNING_CHANGE', 'RUNNING_LEFT', 'RUNNING_CHANGE'];
        this.runningShootCycle = ['SHOOT_RIGHT', 'SHOOT_CHANGE', 'SHOOT_LEFT', 'SHOOT_CHANGE'];

        // Combat & Stats
        this.maxHealth = 5;
        this.health = this.maxHealth;
        this.maxWeb = 50;
        this.web = 35;
        this.invincibleTimer = 0;
        this.spiderSenseTimer = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.maxComboTimer = 3.5;
    }

    SpiderMan.prototype.reset = function() {
        this.x = 80;
        this.y = 120;
        this.vx = 220;
        this.vy = 0;
        this.isSwinging = false;
        this.isDiving = false;
        this.anchor = null;
        this.health = this.maxHealth;
        this.web = 35;
        this.invincibleTimer = 0;
        this.spiderSenseTimer = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.onGround = false;
        this.hasDangerWarning = false;
    };

    SpiderMan.prototype.heal = function(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    };

    SpiderMan.prototype.addWeb = function(amount) {
        this.web = Math.min(this.maxWeb, this.web + amount);
    };

    SpiderMan.prototype.activateSpiderSense = function(duration) {
        this.spiderSenseTimer = duration || 9;
    };

    SpiderMan.prototype.takeDamage = function(amount) {
        if (this.invincibleTimer > 0 || this.spiderSenseTimer > 0) return;

        this.health -= amount;
        this.invincibleTimer = 1.4;
        this.combo = 0;

        var audio = window.WebSlingerAudio;
        if (audio) audio.playSfx('hit');

        var cam = this.game.camera;
        if (cam) cam.addTrauma(0.5);

        var fx = window.WebSlingerEffects;
        if (fx) fx.addCombatHit(this.x + this.width / 2, this.y + this.height / 2, amount);

        if (this.health <= 0) {
            this.game.gameover('K.O. IN ACTION');
        }
    };

    SpiderMan.prototype.addComboHit = function() {
        this.combo++;
        this.comboTimer = this.maxComboTimer;
        var audio = window.WebSlingerAudio;
        if (audio && this.combo > 1) audio.playSfx('combo');

        var fx = window.WebSlingerEffects;
        if (fx && this.combo >= 2) {
            fx.addPopup(this.x + this.width / 2, this.y - 25, 'COMBO x' + this.combo + '!', '#f1c40f', 24);
        }
    };

    // --- SPACEBAR WEB SHOOTERS ---

    SpiderMan.prototype.shoot = function() {
        if (this.web <= 0) {
            var fx = window.WebSlingerEffects;
            if (fx) fx.addPopup(this.x + this.width / 2, this.y - 15, 'OUT OF WEB!', '#ff4757', 20);
            return;
        }

        this.web--;
        this.shootPoseTimer = 0.28; // Trigger authentic shooting pose

        var isBoosted = this.spiderSenseTimer > 0;
        var damage = isBoosted ? 4 : 2;

        var proj = new WebProjectile(this.game, {
            x: this.x + (this.facing > 0 ? this.width + 8 : -8),
            y: this.y + 20,
            direction: this.facing,
            damage: damage,
            speed: isBoosted ? 980 : 880
        });

        this.game.addPlayerProjectile(proj);

        var audio = window.WebSlingerAudio;
        if (audio) audio.playSfx('thwip');

        var fx2 = window.WebSlingerEffects;
        if (fx2) fx2.addWebImpact(proj.x, proj.y);
    };

    // --- WEB SWINGING & CATAPULT PHYSICS ---

    SpiderMan.prototype.startSwing = function() {
        if (this.isSwinging) return;

        var city = this.game.city;
        if (!city) return;

        var bestAnchor = city.findBestAnchor(this.x + this.width / 2, this.y);
        if (!bestAnchor) return;

        this.anchor = bestAnchor;
        this.isSwinging = true;
        this.isDiving = false;
        this.onGround = false;

        var dx = (this.x + this.width / 2) - this.anchor.x;
        var dy = (this.y + 10) - this.anchor.y;
        this.webLength = Math.max(115, Math.sqrt(dx * dx + dy * dy));
        this.swingAngle = Math.atan2(dx, dy);

        // Convert linear speed into pendulum angular velocity with smooth entry clamping
        var projectedSpeed = (this.vx * Math.cos(this.swingAngle) - this.vy * Math.sin(this.swingAngle));
        this.angularVelocity = projectedSpeed / this.webLength;
        
        // Fast, athletic entry (+12% boost) without uncontrollable snap
        if (this.angularVelocity < 1.0) {
            this.angularVelocity = 1.25;
        } else if (this.angularVelocity > 2.05) {
            this.angularVelocity = 2.05;
        }

        var audio = window.WebSlingerAudio;
        if (audio) audio.playSfx('thwip');

        var fx = window.WebSlingerEffects;
        if (fx) {
            fx.addWebImpact(this.anchor.x, this.anchor.y);
            fx.addPopup(this.x + this.width / 2, this.y - 15, 'SWING!', '#70d6ff', 18);
        }
    };

    SpiderMan.prototype.updateSwing = function(dt, input) {
        if (!this.anchor) {
            this.releaseSwing();
            return;
        }

        // Swift, athletic pendulum physics (+12% boost: swingGravity = 675)
        var swingGravity = 675;
        var gravityTorque = -(swingGravity / this.webLength) * Math.sin(this.swingAngle);

        // Interactive steering & momentum pumping:
        // Right/D or Swing pumps forward acceleration; Left/A applies controlled braking
        var pump = 0;
        if (input.right || input.swing) {
            pump = this.swingPumpForce * Math.cos(this.swingAngle);
        } else if (input.left) {
            pump = -this.swingPumpForce * Math.cos(this.swingAngle);
        }

        this.angularVelocity += (gravityTorque + pump) * dt;

        // Smooth air damping for natural pendulum deceleration at the apex
        this.angularVelocity *= Math.pow(0.993, dt * 60);

        // Max angular speed allows swift escape from villains while maintaining full visual control
        this.angularVelocity = Math.max(-2.65, Math.min(2.65, this.angularVelocity));

        this.swingAngle += this.angularVelocity * dt;

        // Calculate smooth position along swing arc
        this.x = (this.anchor.x + Math.sin(this.swingAngle) * this.webLength) - this.width / 2;
        this.y = (this.anchor.y + Math.cos(this.swingAngle) * this.webLength) - 10;

        var tangentSpeed = this.angularVelocity * this.webLength;
        this.vx = tangentSpeed * Math.cos(this.swingAngle);
        this.vy = -tangentSpeed * Math.sin(this.swingAngle);
        this.facing = (this.vx >= 0) ? 1 : -1;

        if (Math.abs(tangentSpeed) > 370) {
            var fx = window.WebSlingerEffects;
            if (fx) fx.addSpeedTrail(this.x + this.width / 2, this.y + this.height / 2, '#70d6ff');
        }

        // Smooth auto-release at apex if swinging forward too far
        if (this.swingAngle > 1.35 && this.angularVelocity > 0) {
            this.releaseSwing();
        }
    };

    SpiderMan.prototype.releaseSwing = function() {
        if (!this.isSwinging) return;
        this.isSwinging = false;

        if (this.vx > 50) {
            this.vx = Math.min(490, this.vx * 1.15 + 35); // Crisp catapult boost to easily outrun villains
            this.vy = Math.min(-240, this.vy - 80); // Clean upward arc

            var audio = window.WebSlingerAudio;
            if (audio) audio.playSfx('jump');

            var fx = window.WebSlingerEffects;
            if (fx) {
                fx.addPopup(this.x + this.width / 2, this.y - 15, 'CATAPULT!', '#f1c40f', 22);
                fx.addSpeedTrail(this.x + this.width / 2, this.y + this.height / 2, '#ffffff');
            }
        }
        this.anchor = null;
    };

    SpiderMan.prototype.checkSpiderSenseWarning = function() {
        this.hasDangerWarning = false;
        var enemyProj = this.game.enemyProjectiles;
        for (var i = 0; i < enemyProj.length; i++) {
            var p = enemyProj[i];
            var dx = p.x - this.x;
            var dy = p.y - this.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 240 && dx > -20) {
                this.hasDangerWarning = true;
                break;
            }
        }
    };

    SpiderMan.prototype.update = function(dt, input) {
        this.animTime += dt;

        if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
        if (this.shootPoseTimer > 0) this.shootPoseTimer -= dt;

        this.checkSpiderSenseWarning();

        if (this.spiderSenseTimer > 0) {
            this.spiderSenseTimer -= dt;
            this.trailTimer += dt;
            if (this.trailTimer > 0.05) {
                this.trailTimer = 0;
                var fx = window.WebSlingerEffects;
                if (fx) fx.addSpeedTrail(this.x + this.width / 2, this.y + this.height / 2, '#f1c40f');
            }
        }

        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) this.combo = 0;
        }

        // 1. Web-Swinging State
        if (input.swing) {
            if (!this.isSwinging) {
                this.startSwing();
            } else {
                this.updateSwing(dt, input);
            }
        } else if (this.isSwinging) {
            this.releaseSwing();
        }

        // 2. Rooftop / Free Airborne State
        if (!this.isSwinging) {
            if (this.onGround) {
                // Running across rooftop
                if (input.left) {
                    this.vx = -this.groundMoveSpeed;
                    this.facing = -1;
                } else if (input.right) {
                    this.vx = this.groundMoveSpeed;
                    this.facing = 1;
                } else {
                    this.vx *= 0.85;
                    if (Math.abs(this.vx) < 5) this.vx = 0;
                }

                // Jump from rooftop
                if (input.jumpPressed || input.swingPressed) {
                    this.vy = -480;
                    this.onGround = false;
                    var audio = window.WebSlingerAudio;
                    if (audio) audio.playSfx('jump');
                }

                this.x += this.vx * dt;
            } else {
                // Airborne Navigation
                if (input.down) {
                    this.isDiving = true;
                    this.vy += this.gravity * 2.0 * dt;
                    this.vx = Math.min(500, this.vx + 150 * dt); // Controlled dive momentum
                    var fx = window.WebSlingerEffects;
                    if (fx) fx.addSpeedTrail(this.x + this.width / 2, this.y + this.height / 2, '#ffffff');
                } else {
                    this.isDiving = false;
                    this.vy += this.gravity * dt;
                }

                if (input.left) {
                    this.vx = Math.max(-230, this.vx - 450 * dt);
                    this.facing = -1;
                } else if (input.right) {
                    this.vx = Math.min(480, this.vx + 520 * dt);
                    this.facing = 1;
                } else {
                    // Smooth forward cruise stabilization
                    this.vx += (260 - this.vx) * Math.min(1.0, 1.5 * dt);
                }

                this.vx *= Math.pow(this.airResistance, dt * 60);
                this.x += this.vx * dt;
                this.y += this.vy * dt;
            }
        }

        // Running animation frame cycle
        if (this.onGround && Math.abs(this.vx) > 10) {
            if (this.animTime % 0.12 < dt) {
                this.runFrameIndex = (this.runFrameIndex + 1) % this.runningCycle.length;
            }
        } else {
            this.runFrameIndex = 0;
        }

        // Camera Left Bound Clamping
        if (this.x < this.game.camera.x - 50) {
            this.x = this.game.camera.x - 50;
            this.vx = Math.max(120, this.vx);
        }

        // Street Canyon Web Safety Bounce
        if (this.y > this.canvas.height - 30) {
            this.y = this.canvas.height - 40;
            this.vy = -540;
            this.takeDamage(1);

            var audio = window.WebSlingerAudio;
            if (audio) audio.playSfx('thwip');

            var fx = window.WebSlingerEffects;
            if (fx) fx.addPopup(this.x + this.width / 2, this.y - 30, 'STREET BOUNCE!', '#ff4757', 22);
        }
    };

    // Clean, robust rooftop collision resolution without edge jitter
    SpiderMan.prototype.resolveSkyscraperCollision = function(buildings) {
        if (this.isSwinging) {
            this.onGround = false;
            return;
        }

        var wasOnGround = this.onGround;
        this.onGround = false;

        var feetY = this.y + this.height;
        var pLeft = this.x + 8;
        var pRight = this.x + this.width - 8;

        for (var i = 0; i < buildings.length; i++) {
            var b = buildings[i];
            var bLeft = b.x;
            var bRight = b.x + b.width;
            var bTop = b.topY;

            // Check if player is above the building roof surface
            if (pRight > bLeft && pLeft < bRight) {
                // Landing on the rooftop from above
                if (this.vy >= 0 && feetY >= bTop && feetY <= bTop + 24) {
                    this.y = bTop - this.height;
                    this.vy = 0;
                    this.onGround = true;
                    this.isDiving = false;

                    if (!wasOnGround) {
                        var audio = window.WebSlingerAudio;
                        if (audio) audio.playSfx('land');
                        var fx = window.WebSlingerEffects;
                        if (fx) fx.addLandingDust(this.x + this.width / 2, bTop, this.width);
                    }
                    break;
                }
            }
        }
    };

    SpiderMan.prototype.getCurrentSprite = function() {
        var isShooting = this.shootPoseTimer > 0;

        if (this.isSwinging) {
            return isShooting ? images.SHOOT_JUMP : images.JUMP;
        }

        if (this.isDiving) {
            return images.SLIDE;
        }

        if (!this.onGround) {
            return isShooting ? images.SHOOT_JUMP : images.JUMP;
        }

        // On Ground
        if (Math.abs(this.vx) > 15) {
            var frameKey = isShooting 
                ? this.runningShootCycle[this.runFrameIndex] 
                : this.runningCycle[this.runFrameIndex];
            return images[frameKey] || images.STANDING;
        }

        return isShooting ? images.SHOOT : images.STANDING;
    };

    SpiderMan.prototype.draw = function(ctx, cameraX, time) {
        var rx = this.x - cameraX;
        var ry = this.y;

        // 1. High-Tension Web Line when Swinging
        if (this.isSwinging && this.anchor) {
            var anchorRx = this.anchor.x - cameraX;
            var anchorRy = this.anchor.y;
            var handX = rx + (this.facing > 0 ? this.width * 0.7 : this.width * 0.3);
            var handY = ry + 8;

            ctx.save();
            ctx.strokeStyle = 'rgba(112, 214, 255, 0.5)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(anchorRx, anchorRy);
            ctx.lineTo(handX, handY);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(anchorRx, anchorRy);
            ctx.lineTo(handX, handY);
            ctx.stroke();

            ctx.fillStyle = '#70d6ff';
            ctx.beginPath();
            ctx.arc(anchorRx, anchorRy, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 2. Spider-Sense Threat Warning
        if (this.hasDangerWarning) {
            ctx.save();
            ctx.strokeStyle = (Math.sin(time * 25) > 0) ? '#ff4757' : '#f1c40f';
            ctx.lineWidth = 2.5;

            var headCenterX = rx + this.width / 2;
            var headCenterY = ry - 4;

            for (var angleDeg = -60; angleDeg <= 60; angleDeg += 30) {
                var rad = (angleDeg - 90) * (Math.PI / 180);
                var innerR = 12;
                var outerR = 24 + Math.sin(time * 30 + angleDeg) * 4;

                ctx.beginPath();
                ctx.moveTo(headCenterX + Math.cos(rad) * innerR, headCenterY + Math.sin(rad) * innerR);
                ctx.lineTo(headCenterX + Math.cos(rad) * outerR, headCenterY + Math.sin(rad) * outerR);
                ctx.stroke();
            }
            ctx.restore();
        }

        if (this.invincibleTimer > 0 && Math.sin(time * 30) > 0) return;

        var sprite = this.getCurrentSprite();

        ctx.save();
        ctx.translate(rx + this.width / 2, ry + this.height / 2);

        if (this.isSwinging) {
            ctx.rotate(this.swingAngle * 0.6);
        } else if (this.isDiving) {
            ctx.rotate(0.6 * this.facing);
        }

        if (this.facing < 0) {
            ctx.scale(-1, 1);
        }

        if (this.spiderSenseTimer > 0) {
            ctx.shadowColor = '#f1c40f';
            ctx.shadowBlur = 16;
        }

        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            var sw = sprite.naturalWidth * this.scale;
            var sh = sprite.naturalHeight * this.scale;
            ctx.drawImage(sprite, -sw / 2, -sh / 2, sw, sh);
        } else {
            ctx.fillStyle = '#e23636';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    };

    SpiderMan.prototype.getHitbox = function() {
        return {
            x: this.x + 4,
            y: this.y + 4,
            width: this.width - 8,
            height: this.height - 4
        };
    };

    window.WebSlingerPlayer = SpiderMan;
    window.WebSlingerWebProjectile = WebProjectile;
})(window);
