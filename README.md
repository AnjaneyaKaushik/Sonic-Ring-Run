# Sonic Runner

A fast-paced, endless runner game featuring Sonic the Hedgehog. This project is built using JavaScript and the [Kaplay](https://kaplayjs.com/) game engine, a modern fork of Kaboom.js.

## Gameplay

The objective of the game is to run as far as possible, collecting rings and avoiding enemies to achieve a high score.

-   **Endless Level:** The game procedurally generates an endless path for Sonic to run on.
-   **Collect Rings:** Gather rings to increase your score.
-   **Avoid Enemies:** Jump over or on top of classic Sonic enemies like Motobug and Buzz Bomber.
-   **Scoring:** Your score increases with each ring collected (+2 points) and enemy defeated (+10 base points). Chaining enemy jumps applies a score multiplier.
-   **Score Checkpoints:** Reach certain scores (50, 250, 450, 500, 700, 1000) to earn bonus lives, but only when you have less than 3 lives and haven't exceeded the 3-life bonus limit.
-   **Ring Streak System:** Collect rings consecutively for bonus points - 5+ rings give +3 points each, 10+ rings give +5 points each with special effects.
-   **Perfect Run Bonuses:** Achieve 20+ consecutive actions without damage for score bonuses, or 30+ for a bonus life (when below 3 lives).
-   **Streak Rebuild System:** Get multiple chances to rebuild broken streaks with decreasing preservation rates.
-   **Increasing Difficulty:** The game's speed gradually increases over time, making it more challenging.

## Controls
-   **Jump:** `Spacebar` / `Left Mouse Click` / `Touch`

## Pause Screen

You can pause the game at any time by pressing the `ESC` key or clicking the pause button on the top right of the screen. The pause screen displays the following information:

-   **Current Score:** Your score in the current run.
-   **High Score:** Your best score achieved across all runs.

To resume the game, press the `ESC` key again or click the resume button.

## Score Checkpoints

The game features a strategic life recovery system through score checkpoints:

-   **Checkpoint Scores:** 50, 250, 450, 500, 700, 1000 points
-   **Bonus Lives:** Earn +1 life when reaching these milestones
-   **Smart Recovery:** Lives are only awarded when you have less than 3 lives
-   **Limited Resource:** Maximum of 3 bonus lives can be earned per game session
-   **Audio Feedback:** A satisfying "ding" sound plays when a bonus life is awarded
-   **Visual Indicator:** Green "+1 LIFE!" message appears above Sonic

### How It Works:

1. **Start with 3 lives** ❤❤❤
2. **Take damage** → 2 lives ❤❤
3. **Reach checkpoint** → +1 life ❤❤❤ (if under 3 total bonus lives)
4. **Strategic play** required after using all 3 bonus lives

This system encourages recovery gameplay while maintaining the challenge by limiting total bonus lives.

## Streak & Combo Systems

The game features advanced streak mechanics that reward consistent play and create addictive gameplay loops:

### Ring Streak System:
-   **Building Streaks:** Collect rings consecutively without taking damage
-   **Streak Bonuses:** 
    -   5-9 rings: +3 points each with "COMBO!" display
    -   10+ rings: +5 points each with "STREAK!" + bonus audio
-   **Visual Feedback:** Golden streak counter shows current progress

### Perfect Run System:
-   **Perfect Actions:** Any ring collection or enemy defeat without taking damage
-   **Milestone Rewards:**
    -   20+ actions: +50 bonus points + "PERFECT RUN!" display
    -   30+ actions: +100 bonus points + bonus life (only when below 3 lives)
-   **Strategic Value:** Encourages risk-taking for massive rewards

### Streak Rebuild System:
When you take damage, the game offers multiple chances to preserve your streaks:

1.  **Second Chance (First Damage):**
    -   **Requirement:** 5+ ring streak OR 10+ perfect run
    -   **Result:** Keep 50% of current streaks
    -   **Message:** Orange "SECOND CHANCE! REBUILD!"

2.  **Last Chance (Second Damage):**
    -   **Requirement:** 3+ ring streak OR 5+ perfect run
    -   **Result:** Keep 30% of current streaks
    -   **Message:** Red "LAST CHANCE! FINAL REBUILD!"

3.  **No Mercy (Third Damage):**
    -   **Result:** Complete streak reset
    -   **Message:** "STREAK BROKEN!"
    -   **Reset:** All rebuild chances refresh for next cycle

This system creates escalating tension and multiple opportunities for recovery while maintaining fair challenge.

## Scoring System

The game features a generous scoring system to help players reach higher grades and checkpoints:

### Point Values:
-   **Ring Collection:** +2 points per ring (base)
    -   **Ring Streak Bonuses:**
        -   5-9 rings: +3 points each ("COMBO!")
        -   10+ rings: +5 points each ("STREAK!" + bonus sound)
-   **Enemy Defeat:** +10 base points (with multiplier)
    -   **Enemy Chains:** Consecutive enemy defeats multiply the base score
        -   1st enemy: +10 points
        -   2nd enemy: +20 points (10×2)
        -   3rd enemy: +30 points (10×3)
        -   And so on...
    -   **Perfect Run Bonuses:**
        -   20-29 perfect actions: +50 bonus points
        -   30+ perfect actions: +100 bonus points + bonus life (if below 3 lives)

### Grade System:
-   **S Rank:** 1500+ points ⭐ (Master Level)
-   **A Rank:** 1200+ points 🥇 (Excellent)
-   **B Rank:** 900+ points 🥈 (Very Good)
-   **C Rank:** 600+ points 🥉 (Good)
-   **D Rank:** 300+ points 📈 (Average)
-   **E Rank:** 150+ points 📊 (Below Average)
-   **F Rank:** 50+ points 📉 (Beginner)

## Project Structure

The project is organized into the following main directories:

```
/Users/anjaneya/Desktop/coding/Sonic Runner/
├── public/              # Static assets (images, fonts, sounds)
├── src/                 # Game source code
│   ├── entities/        # Game object logic (Sonic, enemies, etc.)
│   ├── scenes/          # Game scenes (main menu, game, game over)
│   ├── kaplayCtx.js     # Kaplay context initialization
│   └── main.js          # Main entry point, asset loading, scene registration
├── package.json         # Project dependencies and scripts
└── README.md            # This file
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate into the project directory:
    ```bash
    cd sonic-runner
    ```
3.  Install the required dependencies:
    ```bash
    npm install
    ```

### Running the Game

To start the local development server and play the game, run the following command:

```bash
npm run dev
```

This will start a Vite development server and open the game in your default web browser.

## Technologies Used

-   **Game Engine:** [Kaplay](https://kaplayjs.com/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Language:** JavaScript

## Assets

The game uses various graphics and sound effects inspired by the classic Sonic the Hedgehog series. All assets are for educational and demonstration purposes.

-   **Graphics:** Sourced from various Sonic sprite sheets.
-   **Sound:** Classic sound effects from the original games.
-   **Font:** "Mania" font, reminiscent of the Sonic Mania style.

## License

This project is for educational purposes only. All Sonic the Hedgehog assets, characters, and related materials are trademarks and copyright of SEGA. Credits to Sega for Sonic The Hedgehog.