<div align="center">

# 🕷️ Spiderverse: Web Slinger (City Rush)

<p align="center">
  <img src="images/spider-head.png" alt="Spiderverse Logo" width="100"/>
</p>

<p align="center">
  <strong>An action-packed, momentum-driven HTML5 Canvas superhero arcade game.</strong>
</p>

<p align="center">
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Canvas_API-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="Canvas API"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Web_Audio_API-70D6FF?style=for-the-badge" alt="Web Audio API"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/LocalStorage-2ED573?style=for-the-badge" alt="LocalStorage"></a>
</p>

</div>

---

## 🎮 Game Overview

**Spiderverse: Web Slinger** is a momentum-driven, physics-based 2D superhero arcade experience engineered entirely with vanilla web technologies. Designed for seamless, zero-install gameplay across modern desktop and mobile browsers, the project delivers high-framerate action without reliance on heavyweight external game engines or third-party plugins.

### Motivation & Design Goals
Traditional web-based action games often struggle with input latency, bloated bundle sizes, and artificial movement mechanics. *Spiderverse* tackles this by pairing authentic harmonic pendulum swing physics with responsive canvas rendering and low-latency audio synthesis. Players step into the role of Spider-Man, navigating towering skyscraper canyons, timing precision web catapults, and confronting escalating waves of classic villains across an atmospheric New York City skyline.

---

## ✨ Key Features

- **🕸️ True Pendulum Web-Swinging Mechanics**:
  - Physics-driven angular pendulum swinging with dynamic momentum pumping (`D` / `→`) and reverse braking (`A` / `←`).
  - **Apex Catapult Launch**: Release swings precisely at the forward arc apex to slingshot high above skyscraper rooftops.

- **💥 Projectile Combat & Web-Shooters (`Spacebar`)**:
  - Fire high-velocity web projectiles to damage oncoming hostiles.
  - Temporarily immobilize and tangle enemies in mid-air with freeze-stun mechanics.

- **🦹 Structured 1v1 Villain Wave Progression**:
  - **Level 1 — Hover Drones**: Agile scout drones discharging directed energy bolts (1-hit defeat).
  - **Level 2 — Glider Rogues (Green Goblin)**: High-altitude aerial flyers hurling glowing Pumpkin Bombs (2-hit defeat).
  - **Level 3 — Symbiote Brutes (Venom)**: Heavyweight wall-clinging chargers with close-range threat (3-hit defeat).

- **⚡ Spider-Sense Threat Warning Indicator**:
  - Real-time danger crown visual alert activates when enemy projectiles approach on collision courses, enabling proactive evasive maneuvers.

- **🎵 Zero-Latency Audio Engine**:
  - Instantaneous procedural sound effect synthesis via the Web Audio API, complemented by an energetic looping background soundtrack.

- **🌆 Atmospheric Parallax Skyline**:
  - High-performance multi-layered dusk-to-night urban backdrop featuring illuminated skyscraper windows and dynamic particle FX.

- **📱 Fully Responsive Cross-Platform Design**:
  - Dynamic viewport scaling with dedicated virtual on-screen touch controls, providing parity across desktop, tablet, and mobile browsers.

---

## 🕹️ Controls Guide

| Action | Primary Key | Secondary / Mobile Controls | Function |
| :--- | :---: | :---: | :--- |
| **Swing** | **W** | Hold W / Left-Click / Touch SWING | Attach web line to physical building & swing (release to catapult) |
| **Jump** | **SPACE** | Touch JUMP Button | Rooftop leap & acrobatic mid-air hop |
| **Dive** | **S** | ↓ (Down Arrow) / Touch DIVE | Fast aerodynamic air-dive to build speed |
| **Web** | **J** | Right-Click / Touch WEB Button | Fire high-velocity web projectile to damage & freeze villains |
| **Move** | **A / D** | ← / → Arrows / Touch D-Pad | Steer left (brake) and steer right (accelerate) |
| **Sprint** | **SHIFT** | Hold SHIFT | High-speed sprint boost on rooftops and mid-air flight |
| **Pause** | **ESC** | P / Top Bar Pause Icon | Pause or resume patrol |

---

## 🛠️ Architecture & Tech Stack

### Core Technologies

| Technology | Purpose & Implementation |
| :--- | :--- |
| **HTML5** | Semantic application shell, HUD overlay containers, and primary canvas viewport |
| **CSS3** | Responsive glassmorphic UI, comic typography styling, touch controls, and modal transitions |
| **JavaScript (ES6+)** | Modular game engine, physics calculations, collision detection, and wave state management |
| **HTML5 Canvas API** | Hardware-accelerated 60 FPS 2D procedural rendering, parallax layers, and particle emitter pipelines |
| **Web Audio API** | Real-time procedural audio synthesis, sound effect triggering, and background music management |
| **Web Storage API (`localStorage`)** | Client-side persistence for high scores, records, active combo multipliers, and player audio settings |

### Modular Architecture Breakdown

```text
Spiderverse/
├── index.html              # Semantic HTML5 entry shell & interactive HUD overlay
├── css/
│   └── spiderman-game.css  # Superhero comic theme, glassmorphic HUD & responsive touch UI
├── js/
│   ├── game.js             # Central game loop, update tick, and state coordinator
│   ├── player.js           # Spider-Man kinematics, pendulum swing physics & web attacks
│   ├── enemy.js            # Enemy archetypes (Drones, Glider Rogues, Brutes) & projectile AI
│   ├── level.js            # Wave progression logic, encounter pacing, and stage bonuses
│   ├── city.js             # Procedural skyscraper generation and dynamic web anchor spires
│   ├── background.js       # Multi-layer parallax dusk/night skyline rendering
│   ├── camera.js           # Smooth horizontal camera tracking & screen trauma shake
│   ├── effects.js          # Particle emitter systems & comic visual callouts ("THWIP!")
│   ├── powerups.js         # Collectible tokens, health pick-ups, and web cartridges
│   ├── audio.js            # Web Audio API synthesizer engine & soundtrack controller
│   ├── input.js            # Unified input manager (Keyboard, Mouse, and Virtual Touch)
│   ├── storage.js          # Persistent local storage for user scores and audio toggles
│   └── ui.js               # HUD overlays, health indicators, and modal controllers
├── audio/                  # Audio tracks and background music themes
├── fonts/                  # Custom comic and arcade typography assets
└── images/                 # Character sprites, villain graphics, and environment textures
```

---

## 🚀 Prerequisites & Installation

### Prerequisites
Before running the game locally, ensure you have:
- A modern web browser supporting **HTML5 Canvas** and the **Web Audio API** (Chrome, Firefox, Safari, Edge).
- **Git** installed on your system.
- *(Optional, for local HTTP serving)* **Node.js** (v14+) or **Python 3.x**.

---

### Step-by-Step Setup

#### Option 1: Direct Browser Launch
Clone the repository to your local machine and launch `index.html` directly:

```bash
git clone https://github.com/Aditthan-07/Spiderverse.git
cd Spiderverse
```

Open `index.html` directly in your preferred browser (or double-click the file in your file manager).

#### Option 2: Local HTTP Server (Recommended)
Running through a local web server ensures optimal audio streaming and asset loading:

```bash
# Using Node.js
npx serve .

# Or using Python 3
python -m http.server 8080
```

Once initialized, navigate to **http://localhost:8080** in your browser.

---

## 🌐 Live Demo

Play the live game directly in your browser:  
👉 **[Play Spiderverse Live](https://aditthan-07.github.io/Spiderverse/)**

---

## ⚖️ Disclaimer

*Spiderverse: Web Slinger* is an educational, non-commercial fan project. Spider-Man and associated characters, names, and related indicia are trademarks and copyrights of Marvel Entertainment, LLC and Sony Pictures Entertainment Inc.
