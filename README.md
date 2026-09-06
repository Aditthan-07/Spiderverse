# 🕷️ Spiderverse: Web Slinger (City Rush)

[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-70D6FF?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Responsive](https://img.shields.io/badge/Design-Responsive%20%26%20Mobile%20Ready-2ED573?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

> **"Swing. Fight. Survive."**  
> An action-packed, modern HTML5 Canvas web-slinging superhero game featuring physics-based pendulum swinging, wrist-mounted web shooter combat, 1v1 villain wave encounters, Spider-Sense danger detection, and an authentic comic-book aesthetic.

---

## 📜 Credits & Original Project Attribution

> [!IMPORTANT]
> This project (**Spiderverse**) is a **substantially redesigned, expanded, and refactored version** of the open-source project **[Spiderman](https://github.com/Lukakva/Spiderman)** originally created by **[Lukakva (Luka Kvavilashvili)](https://github.com/Lukakva)**.

* **Original Artwork & Concept**: Foundational 2D Spider-Man sprites and concept are credited to [Lukakva/Spiderman](https://github.com/Lukakva/Spiderman).
* **Modifications & Redesign**: Created and engineered by **[Aditthan J K](https://github.com/Aditthan-07)**, introducing:
  * Physics-based pendulum web-swinging, directional steering, braking, and catapult launching
  * Spacebar wrist web-shooter projectile engine with web-tangle stun mechanics
  * Paced 1-at-a-time villain wave incursions (Hover Drones, Glider Rogues, Symbiote Brutes)
  * Real-time Spider-Sense threat warning crown with collision prediction
  * High-performance Web Audio API procedural synthesizer
  * Atmospheric multi-layer parallax night cityscape
  * Responsive glassmorphic HUD, touch controls, and particle FX
* **Soundtrack Attribution**: Spider-Man Meme Song audio sourced from [QuickSounds](https://quicksounds.com/sound/22127/spiderman-meme-song).

---

## 🎮 Game Overview

**Spiderverse: Web Slinger** transforms the classic superhero browser concept into a fluid, momentum-driven web-slinging adventure. Built with vanilla JavaScript and HTML5 Canvas (zero external frameworks), players navigate high-altitude skyscraper canyons, battle iconic villains in structured wave incursions, and chain acrobatic web catapults across the New York City skyline.

---

## ✨ Key Features

### 🕸️ Physics-Based Web-Swinging & Catapult Locomotion
- **True Pendulum Physics**: Hold W / ↑ / Click to latch onto skyscraper spires and crane arms, swinging through canyons in smooth, natural arcs.
- **Directional Steering & Braking**: Use D / → to pump forward momentum or A / ← to apply reverse braking for precision landings.
- **Apex Catapult Release**: Release the swing at the peak of the forward arc to launch high into the air with an athletic momentum boost.
- **Air Dive & Rooftop Sprinting**: Dive straight down (S / ↓) to build speed before low-canyon swings, and sprint smoothly across rooftop ledges.

### 💥 Wrist Web-Shooters & Combat (Spacebar)
- **High-Velocity Web Projectiles**: Tap Spacebar to shoot webs directly at villains.
- **Web Tangle & Freeze Stun**: Web hits damage enemies and cocoon them for **1.4 seconds**, immobilizing them in mid-air so you can finish them or swing safely past.
- **Dynamic Combos**: Chain attacks without taking hits to rack up score multipliers (COMBO x2!, COMBO x3!).

### 🦹 Structured 1v1 Villain Wave Encounters
Villains spawn one at a time with advance threat alerts:
1. **Level 1 — Hover Drones**: Scout drones firing telegraphed energy lasers. Destroyed in 1 web shot.
2. **Level 2 — Glider Rogues (Green Goblin)**: Soaring aerial rogues dropping glowing Pumpkin Bombs. Defeated in 2 web shots.
3. **Level 3 — Symbiote Brutes (Venom)**: Wall-clinging heavy brutes lunging at close range. Defeated in 3 web shots.
4. **Level Up Rewards**: Completing each wave grants **+35 Web Ammo** and **+1 Health Heart**.

### 🛡️ Spider-Sense Threat Warning Crown
- A radiant yellow/red danger crown flashes over Spider-Man's head whenever an incoming projectile is on a collision course, alerting you to swing, dive, or dodge.
- **1.5-second Invulnerability Buffer** after taking damage to ensure fair, non-punishing combat.

### 🌆 Calm, Atmospheric Cityscape Visuals
- Multi-layer parallax dusk/night skyline with steady, ambient illuminated windows (no distracting glittering or flashing).
- Comic action popups (*"THWIP!"*, *"SWING!"*, *"CATAPULT!"*, *"POW!"*), particle sparks, and subtle camera trauma shake.

### 🎵 Soundtrack & Audio Engine
- Web Audio API real-time procedural synthesizer for instant sound effects.
- High-fidelity looping soundtrack featuring the authentic Spider-Man Meme Song.

---

## 🕹️ Controls Guide

| Action | Primary Keyboard | Alternative Key | Mouse / Touch Controls |
| :--- | :---: | :---: | :---: |
| **Shoot Web** | SPACEBAR | Z / J | Right-Click / Touch THWIP Button |
| **Web Swing** | Hold W / ↑ | Shift | Left-Click & Hold / Touch SWING Button |
| **Move Left / Brake** | A | ← (Left Arrow) | Virtual D-Pad Left |
| **Move Right / Accelerate**| D | → (Right Arrow)| Virtual D-Pad Right |
| **Dive Down** | S | ↓ (Down Arrow) | Virtual D-Pad Down |
| **Pause / Resume** | ESC | P | Top Bar Pause Icon |

---

## 🏗️ Project Architecture

`
Spiderverse/
├── index.html              # Modern semantic HTML5 shell & HUD overlay
├── css/
│   └── spiderman-game.css  # Superhero comic theme, glassmorphism HUD & touch UI
├── js/
│   ├── player.js           # Spider-Man physics, pendulum swinging, web shooting & animations
│   ├── enemy.js            # Enemy archetypes (Drones, Glider Rogues, Brutes) & AI
│   ├── level.js            # Wave progression manager, 1v1 encounter pacing & level rewards
│   ├── city.js             # Skyscraper canyon procedural generation & anchor points
│   ├── background.js       # Calm multi-layer parallax night sky & static ambient skyline
│   ├── camera.js           # Smooth horizontal camera tracking & screen shake trauma
│   ├── effects.js          # Particle systems & comic burst text popups ("THWIP!")
│   ├── powerups.js         # Collectibles (Web fluid, medkits, score tokens)
│   ├── audio.js            # Web Audio API synthesizer & BGM player
│   ├── input.js            # Unified input manager (Keyboard, Mouse & Touch)
│   ├── storage.js          # Persistent local storage (High scores & settings)
│   ├── ui.js               # HUD overlays, health bars & game modals
│   └── game.js             # Core game loop & collision pipeline
├── audio/                  # Audio soundtrack assets
├── images/                 # Authentic 2D character sprites & assets
└── README.md               # Project documentation
`

---

## 🚀 Running the Game Locally

### Option 1: Direct in Browser
Open index.html directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
`ash
# Using Node.js
npx serve .

# Or using Python 3
python -m http.server 8080
`
Then visit http://localhost:8080 in your web browser.

---

## ⚖️ Disclaimer

*Spiderverse: Web Slinger* is an educational, non-commercial fan-made project. Spider-Man and associated characters, names, and related indicia are trademarks and copyrights of Marvel Entertainment, LLC and Sony Pictures Entertainment Inc. This project does not claim ownership of the original intellectual property or original assets.
