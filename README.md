# Sonic Runner

A fast-paced, endless runner game featuring Sonic the Hedgehog. This project is built using JavaScript and the [Kaplay](https://kaplayjs.com/) game engine, a modern fork of Kaboom.js.

## Gameplay

The objective of the game is to run as far as possible, collecting rings and avoiding enemies to achieve a high score.

-   **Endless Level:** The game procedurally generates an endless path for Sonic to run on.
-   **Collect Rings:** Gather rings to increase your score.
-   **Avoid Enemies:** Jump over or on top of classic Sonic enemies like Motobug and Buzz Bomber.
-   **Scoring:** Your score increases with each ring collected and enemy defeated. Chaining enemy jumps applies a score multiplier.
-   **Increasing Difficulty:** The game's speed gradually increases over time, making it more challenging.

## Controls

-   **Jump:** `Spacebar` / `Left Mouse Click` / `Touch`
-   **Toggle Fullscreen:** `F`

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