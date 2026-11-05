# 🌻 Mini Farm Life

> *Your little patch of happiness* — a cozy, browser-based farming simulation game built with vanilla HTML, CSS, and JavaScript.

---

## 📖 Overview

**Mini Farm Life** (set on Sunny Acres) is a relaxing farm-management game where you plant crops, water them, watch them grow over day-night cycles, harvest your produce, and trade in the market to expand your farm. Progress through levels to unlock new crops, purchase valuable upgrades, complete quests, and build your dream plot.

---

## ✨ Features

- **🌾 Interactive Farm Grid**:
  - Start with 16 active plots on a 5x5 grid (expandable up to 25 plots via farm upgrades).
  - Intuitive tools: **Plant (🌱)**, **Water (💧)**, **Harvest (🧺)**, and **Clear (🪓)**.

- **🥕 Crop Variety & Level Progression**:
  - Unlock new crops as you level up:
    | Crop | Icon | Unlock Level | Growth Time | Seed Cost | Base Sell Value | XP Gain |
    | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
    | **Carrot** | 🥕 | Level 1 | 1 Day | 8 coins | 18 coins | 8 XP |
    | **Wheat** | 🌾 | Level 2 | 2 Days | 12 coins | 26 coins | 12 XP |
    | **Tomato** | 🍅 | Level 3 | 2 Days | 20 coins | 45 coins | 17 XP |
    | **Corn** | 🌽 | Level 4 | 3 Days | 30 coins | 70 coins | 23 XP |
    | **Pumpkin** | 🎃 | Level 5 | 4 Days | 45 coins | 115 coins | 32 XP |

- **☀️ Weather & Day Cycle**:
  - Sleep to advance to the next day (`🌙 Sleep · Next day`).
  - Watering crops speeds up growth by an extra day.
  - Experience weather changes: every 5th day brings a gentle rain (`🌦️ Gentle rain`) that waters all crops automatically and accelerates growth!

- **⚙️ Farm Upgrades**:
  - **Better Watering Can (💧)**: Watered crops grow even faster (up to level 3).
  - **Market Stall (💰)**: Earn +5 extra coins for every sold crop per upgrade level (up to level 4).
  - **Expand Your Farm (🪴)**: Unlock 3 additional plots per upgrade tier (up to level 3, maxing out at 25 plots).

- **📜 Quests & Rewards**:
  - Complete daily milestones such as planting multiple crops, harvesting crops, or reaching level milestones to earn bonus coins.

- **🔊 Audio & Settings**:
  - Built-in Web Audio API synthesizer for playful, responsive sound effects.
  - Toggle sound effects on or off in the Settings menu.
  - Reset game option to start fresh whenever desired.

- **💾 Automatic Persistence**:
  - Game state automatically saves to the browser's `localStorage` after actions, keeping your farm safe between browser sessions.

---

## 🚀 How to Run Locally

Because Mini Farm Life is built with standard web technologies, there are no build steps, external npm packages, or installations required.

### Option 1: Direct File Open
Simply open `index.html` directly in any modern web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

### Option 2: Using a Local HTTP Server
You can also serve the files with any lightweight HTTP server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (npx serve or http-server)
npx serve .
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🎮 How to Play

1. **Select a Tool**:
   - Choose **Plant** (`🌱`), pick an available seed from the **Seed Shop**, and click an empty plot.
   - Switch to **Water** (`💧`) and click planted crops to water them for faster growth.
   - Advance time by clicking **🌙 Sleep · Next day**.
   - When crops sparkle with a gold border and say **Ready!**, switch to **Harvest** (`🧺`) and click them to gather your yield into the inventory.
   - Use **Clear** (`🪓`) if you ever want to clear a plot.
2. **Earn Coins & XP**:
   - Click **💰 Sell all harvest** in the inventory sidebar to exchange your produce for coins and XP.
   - Leveling up grants bonus coins (+25 coins) and unlocks higher-tier crops.
3. **Upgrade & Expand**:
   - Open the **⚙️ Upgrades** modal to expand your grid and increase your crop profit margins.
   - Check the **📜 Quests** tab to claim completed quest rewards.

---

## 📁 Project Structure

```text
.
├── index.html     # Semantic markup and UI layouts (stats, farm grid, sidebar, modals)
├── script.js      # Game state, farming mechanics, crop logic, audio synthesis, and persistence
├── style.css      # Styling, color palette, animations, and responsive mobile/desktop layout
└── README.md      # Game documentation and instructions
```

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags, modals, accessible grid structure.
- **CSS3**: Custom properties (CSS variables), CSS Grid & Flexbox, smooth transitions, responsive breakpoints.
- **JavaScript (ES6+)**: Modular IIFE architecture, Web Audio API, and Web Storage API (`localStorage`).
