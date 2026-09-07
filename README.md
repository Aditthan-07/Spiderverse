# 🕷️ Spiderverse: Web Slinger (City Rush)

<p align="center">
  <img src="images/spider-head.png" alt="Spiderverse Logo" width="100"/>
</p>

<p align="center">
  <strong>An action-packed, web-swinging HTML5 Canvas superhero arcade game.</strong>
</p>

<p align="center">
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Canvas_API-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="Canvas API"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Web_Audio_API-70D6FF?style=for-the-badge" alt="Web Audio API"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/LocalStorage-2ED573?style=for-the-badge" alt="LocalStorage"></a>
</p>

---

## 🎮 Game Overview

**Spiderverse: Web Slinger** is a momentum-driven, physics-based 2D superhero game designed for smooth browser gameplay across desktop and mobile devices. Players take control of Spider-Man navigating high-altitude skyscraper canyons, battling iconic villains in structured wave encounters, and executing acrobatic web catapults across the New York City skyline.

---

## ✨ Key Features

* **🕸️ True Pendulum Web-Swinging**: Physics-driven swinging mechanics with directional momentum pumping (D / →) and precision braking (A / ←).
* **🚀 Apex Catapult Boost**: Release swings at the forward apex to slingshot high into the air and clear rooftop gaps.
* **💥 Wrist Web-Shooter Combat (Spacebar)**: Fire high-velocity web projectiles to damage and temporarily tangle/freeze oncoming enemies in mid-air.
* **🦹 1v1 Villain Wave Encounters**:
  * **Level 1 — Hover Drones**: Scout drones firing energy bolts (1-hit defeat).
  * **Level 2 — Glider Rogues (Green Goblin)**: Aerial flyers tossing glowing Pumpkin Bombs (2-hit defeat).
  * **Level 3 — Symbiote Brutes (Venom)**: Heavy wall-clinging chargers (3-hit defeat).
* **⚡ Spider-Sense Threat Warning**: A visual danger crown alerts you whenever enemy projectiles approach, enabling rapid evasive maneuvers.
* **🎵 Zero-Latency Audio Synthesis**: Real-time sound effect generation powered by the Web Audio API alongside an energetic looping soundtrack.
* **🌆 Atmospheric Parallax Skyline**: Clean multi-layer dusk/night backdrop with ambient illuminated skyscrapers and particle FX.
* **📱 Fully Responsive**: Seamless touch controls and scalable viewport for mobile, tablet, and desktop play.

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

## 🛠️ Tech Stack

| Technology | Purpose & Implementation |
| :--- | :--- |
| **HTML5** | Semantic application shell, HUD overlay containers, and canvas viewport |
| **CSS3** | Responsive glassmorphic UI, comic typography, touch controls, and modal animations |
| **JavaScript (ES6+)** | Core game engine, modular state management, collision detection, and wave logic |
| **HTML5 Canvas API** | High-performance 60 FPS 2D procedural rendering, parallax backgrounds, and particle emitters |
| **Web Audio API** | Real-time procedural sound effect synthesizer and dynamic BGM playback |
| **Web Storage API** | Local persistence for high scores, best distances, combos, and user settings |

---

## 🚀 How to Run Locally

### Option 1: Direct in Browser
Simply clone the repository and open index.html in any modern web browser:
`ash
git clone https://github.com/Aditthan-07/Spiderverse.git
cd Spiderverse
`
Double-click index.html to play.

### Option 2: Local HTTP Server (Recommended)
For optimal audio streaming and asset loading:
`ash
# Using Node.js
npx serve .

# Or using Python 3
python -m http.server 8080
`
Open **http://localhost:8080** in your browser.

---

## 🌐 Live Demo

Play the live game directly in your browser:  
👉 **[Play Spiderverse Live](https://aditthan-07.github.io/Spiderverse/)**

---

## ⚖️ Disclaimer

*Spiderverse: Web Slinger* is an educational, non-commercial fan project. Spider-Man and associated characters, names, and related indicia are trademarks and copyrights of Marvel Entertainment, LLC and Sony Pictures Entertainment Inc.
