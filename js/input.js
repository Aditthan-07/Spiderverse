/**
 * Web Slinger: City Rush - Unified Input Manager
 * Supports Web-Swinging controls (Hold Swing, Release Slingshot, Dive, Web-Strike) on Keyboard, Mouse, and Touch.
 */
(function(window) {
    'use strict';

    function InputManager() {
        this.left = false;
        this.right = false;
        this.down = false;
        this.swing = false;
        this.swingPressed = false;
        this.jump = false;
        this.jumpPressed = false;
        this.shoot = false;
        this.shootPressed = false;
        this.pausePressed = false;

        this.touchActive = false;
        this.keysDown = {};

        this.initKeyboard();
        this.initMouse();
        this.initTouch();
    }

    InputManager.prototype.initKeyboard = function() {
        var self = this;

        window.addEventListener('keydown', function(e) {
            var code = e.code || e.key;

            if (code === 'ArrowLeft' || code === 'KeyA') {
                self.left = true;
                e.preventDefault();
            }
            if (code === 'ArrowRight' || code === 'KeyD') {
                self.right = true;
                e.preventDefault();
            }
            if (code === 'ArrowDown' || code === 'KeyS') {
                self.down = true;
                e.preventDefault();
            }
            if (code === 'ArrowUp' || code === 'KeyW' || code === 'ShiftLeft' || code === 'ShiftRight') {
                if (!self.swing) self.swingPressed = true;
                self.swing = true;
                e.preventDefault();
            }
            if (code === 'KeyK' || code === 'KeyX') {
                if (!self.jump) self.jumpPressed = true;
                self.jump = true;
                e.preventDefault();
            }
            if (code === 'Space' || code === 'KeyJ' || code === 'KeyZ') {
                if (!self.shoot) self.shootPressed = true;
                self.shoot = true;
                e.preventDefault();
            }
            if (code === 'Escape' || code === 'KeyP') {
                self.pausePressed = true;
                e.preventDefault();
            }

            self.keysDown[code] = true;
        });

        window.addEventListener('keyup', function(e) {
            var code = e.code || e.key;

            if (code === 'ArrowLeft' || code === 'KeyA') {
                self.left = false;
            }
            if (code === 'ArrowRight' || code === 'KeyD') {
                self.right = false;
            }
            if (code === 'ArrowDown' || code === 'KeyS') {
                self.down = false;
            }
            if (code === 'ArrowUp' || code === 'KeyW' || code === 'ShiftLeft' || code === 'ShiftRight') {
                self.swing = false;
            }
            if (code === 'KeyK' || code === 'KeyX') {
                self.jump = false;
            }
            if (code === 'Space' || code === 'KeyJ' || code === 'KeyZ') {
                self.shoot = false;
            }

            delete self.keysDown[code];
        });
    };

    InputManager.prototype.initMouse = function() {
        var self = this;
        var canvas = document.getElementById('game-canvas');
        if (!canvas) return;

        canvas.addEventListener('mousedown', function(e) {
            if (e.button === 0) { // Left Click
                if (!self.swing) self.swingPressed = true;
                self.swing = true;
            } else if (e.button === 2) { // Right Click
                if (!self.shoot) self.shootPressed = true;
                self.shoot = true;
            }
        });

        window.addEventListener('mouseup', function(e) {
            if (e.button === 0) {
                self.swing = false;
            } else if (e.button === 2) {
                self.shoot = false;
            }
        });

        canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    };

    InputManager.prototype.initTouch = function() {
        var self = this;

        function bindButton(btnId, onDown, onUp) {
            var btn = document.getElementById(btnId);
            if (!btn) return;

            var startHandler = function(e) {
                e.preventDefault();
                self.touchActive = true;
                btn.classList.add('active');
                onDown();
            };

            var endHandler = function(e) {
                e.preventDefault();
                btn.classList.remove('active');
                onUp();
            };

            btn.addEventListener('touchstart', startHandler, { passive: false });
            btn.addEventListener('touchend', endHandler, { passive: false });
            btn.addEventListener('touchcancel', endHandler, { passive: false });
            btn.addEventListener('mousedown', startHandler);
            btn.addEventListener('mouseup', endHandler);
            btn.addEventListener('mouseleave', endHandler);
        }

        bindButton('btn-left', function() { self.left = true; }, function() { self.left = false; });
        bindButton('btn-right', function() { self.right = true; }, function() { self.right = false; });
        bindButton('btn-dive', function() { self.down = true; }, function() { self.down = false; });
        bindButton('btn-jump', function() {
            if (!self.jump) self.jumpPressed = true;
            self.jump = true;
        }, function() { self.jump = false; });
        bindButton('btn-swing', function() {
            if (!self.swing) self.swingPressed = true;
            self.swing = true;
        }, function() { self.swing = false; });
        bindButton('btn-shoot', function() {
            if (!self.shoot) self.shootPressed = true;
            self.shoot = true;
        }, function() { self.shoot = false; });
        bindButton('btn-pause', function() { self.pausePressed = true; }, function() {});
    };

    InputManager.prototype.consumePresses = function() {
        this.swingPressed = false;
        this.jumpPressed = false;
        this.shootPressed = false;
        this.pausePressed = false;
    };

    InputManager.prototype.reset = function() {
        this.left = false;
        this.right = false;
        this.down = false;
        this.swing = false;
        this.swingPressed = false;
        this.jump = false;
        this.jumpPressed = false;
        this.shoot = false;
        this.shootPressed = false;
        this.pausePressed = false;
    };

    window.WebSlingerInput = new InputManager();
})(window);
