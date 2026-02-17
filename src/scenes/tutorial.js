import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";
import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";

export default function tutorial() {
    const citySfx = k.play("Theme", { volume: 0.3, loop: true });
    k.setGravity(3100);

    // Pause state management (integrated from game.js)
    let isPaused = false;
    let pauseOverlay = null;
    let pauseButton = null;
    let pauseButtonText = null;
    let pauseUIElements = [];
    let spawnedEnemies = [];
    let spawnedRings = [];

    const pauseGame = () => {
        if (isPaused) return;
        isPaused = true;

        pauseButton.hidden = true;
        if (citySfx) citySfx.paused = true;

        spawnedEnemies.forEach(e => e.hidden = true);
        spawnedRings.forEach(r => r.hidden = true);
        sonic.hidden = true;

        pauseOverlay = k.add([
            k.rect(k.width(), k.height()),
            k.color(0, 0, 0, 0.7),
            k.pos(0, 0),
            k.fixed(),
            k.z(100),
        ]);
        pauseUIElements.push(pauseOverlay);

        const pauseTitle = k.add([
            k.text("PAUSED", { font: "mania", size: 96, color: k.WHITE }),
            k.anchor("center"),
            k.pos(k.center().x, k.center().y - 150),
            k.fixed(),
            k.z(101),
        ]);
        pauseUIElements.push(pauseTitle);

        const makeBtn = (text, pos, color, action) => {
            const btn = k.add([
                k.rect(400, 100, { radius: 12 }),
                k.pos(k.center().x + pos.x, k.center().y + pos.y),
                k.color(color),
                k.outline(6, k.WHITE),
                k.anchor("center"),
                k.area(),
                k.fixed(),
                k.z(101),
            ]);

            btn.add([
                k.text(text, { font: "mania", size: 48, color: k.WHITE }),
                k.anchor("center"),
            ]);

            btn.onHoverUpdate(() => {
                btn.scale = k.vec2(1.1);
                k.setCursor("pointer");
            });
            btn.onHoverEnd(() => {
                btn.scale = k.vec2(1);
                k.setCursor("default");
            });

            btn.onClick(action);
            pauseUIElements.push(btn);
        };

        makeBtn("RESUME", k.vec2(0, 50), k.Color.fromArray([34, 197, 94]), () => resumeGame());
        makeBtn("QUIT", k.vec2(0, 180), k.Color.fromArray([239, 68, 68]), () => {
            citySfx.stop();
            k.go("main-menu");
        });
    };

    const resumeGame = () => {
        if (!isPaused) return;
        isPaused = false;

        pauseButton.hidden = false;
        if (citySfx) citySfx.paused = false;

        spawnedEnemies.forEach(e => e.hidden = false);
        spawnedRings.forEach(r => r.hidden = false);
        sonic.hidden = false;

        pauseUIElements.forEach(el => k.destroy(el));
        pauseUIElements = [];
        pauseOverlay = null;
    };

    const bgPieceWidth = 1920;
    const bgPieces = [
        k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(bgPieceWidth, 0),
            k.scale(2),
            k.opacity(0.8),
        ]),
    ];

    const platforms = [
        k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
        k.add([k.sprite("platforms"), k.pos(384, 450), k.scale(4)]),
    ];

    const sonic = makeSonic(k.vec2(200, 745));
    sonic.setEvents();

    k.add([
        k.rect(k.width(), 300),
        k.opacity(0),
        k.area(),
        k.pos(0, 832),
        k.body({ isStatic: true }),
        "platform",
    ]);

    // UI Elements
    const instructionText = k.add([
        k.text("PRESS SPACE OR CLICK TO JUMP!", { font: "mania", size: 48 }),
        k.pos(k.center().x, 200),
        k.anchor("center"),
        k.fixed(),
    ]);

    const subInstructionText = k.add([
        k.text("TRY IT NOW!", { font: "mania", size: 32 }),
        k.pos(k.center().x, 280),
        k.anchor("center"),
        k.fixed(),
    ]);

    let score = 0;
    let scoreText = null;
    let ringStreak = 0;
    let perfectRun = 0;
    let scoreMultiplier = 0;

    const comboText = k.add([
        k.text("", { font: "mania", size: 48 }),
        k.pos(k.center().x, 150),
        k.anchor("center"),
        k.color(255, 215, 0),
        k.fixed(),
    ]);

    // Pause Button
    pauseButton = k.add([
        k.rect(120, 50, { radius: 8 }),
        k.color(0, 0, 0, 0.8),
        k.outline(3, k.WHITE),
        k.pos(k.width() - 140, 100),
        k.anchor("center"),
        k.area(),
        k.fixed(),
        k.z(10),
    ]);

    pauseButtonText = pauseButton.add([
        k.text("⏸ PAUSE", { font: "mania", size: 24, color: k.WHITE }),
        k.anchor("center"),
    ]);

    pauseButton.onClick(() => pauseGame());

    // Ensure audio stops when leaving the scene
    k.onSceneLeave(() => {
        if (citySfx) citySfx.stop();
    });

    // Lives UI (hearts)
    const hearts = [];
    const renderHearts = (lives) => {
        hearts.forEach(h => k.destroy(h));
        hearts.length = 0;
        for (let i = 0; i < lives; i++) {
            const heart = k.add([
                k.text("❤", { font: "mania", size: 36 }),
                k.pos(k.width() - 80 - i * 50, 40),
                k.color(255, 0, 0),
                k.anchor("center"),
                k.fixed(),
                k.z(10),
            ]);
            hearts.push(heart);
        }
    };

    let step = 0;
    let hasJumped = false;
    let hasCollectedRing = false;
    let hasDestroyedEnemy = false;
    let isTransitioning = false;

    // Robust Step Transition
    const nextStep = (fromStep) => {
        if (step !== fromStep) return;
        isTransitioning = false;
        step++;

        console.log("Moving to step:", step);

        if (step === 1) {
            instructionText.text = "PRESS SPACE OR CLICK TO JUMP!";
            subInstructionText.text = "TRY IT NOW!";
        } else if (step === 2) {
            instructionText.text = "COLLECT A RING!";
            subInstructionText.text = "WE'LL KEEP SENDING THEM UNTIL YOU DO!";
        } else if (step === 3) {
            instructionText.text = "JUMP ON THE MOTOBUG!";
            subInstructionText.text = "DESTROY ONE TO MOVE ON!";
        } else if (step === 4) {
            instructionText.text = "LIVES AND SCORE!";
            subInstructionText.text = "WATCH YOUR HEARTS AND YOUR POINTS!";
            renderHearts(3);
            if (!scoreText) {
                scoreText = k.add([
                    k.text(`SCORE : ${score}`, { font: "mania", size: 72 }),
                    k.pos(20, 20),
                    k.fixed(),
                ]);
            }
            k.wait(3, () => nextStep(4));
        } else if (step === 5) {
            instructionText.text = "PRACTICE RUN!";
            subInstructionText.text = "GIVE IT A TRY BEFORE THE REAL THING!";

            // Intense spawning for practice
            const ringLoop = k.loop(0.8, () => {
                if (isPaused || step !== 5) return;
                const ring = makeRing(k.vec2(k.width() + 100, k.rand(500, 745)));
                spawnedRings.push(ring);
                ring.onUpdate(() => {
                    if (isPaused) return;
                    ring.move(-800, 0);
                });
            });

            const bugLoop = k.loop(1.5, () => {
                if (isPaused || step !== 5) return;
                const motobug = makeMotobug(k.vec2(k.width() + 100, 773));
                spawnedEnemies.push(motobug);
                motobug.onUpdate(() => {
                    if (isPaused) return;
                    motobug.move(-1100, 0);
                });
            });

            let timeLeft = 30;
            const timerText = k.add([
                k.text(`TIME LEFT: ${timeLeft}S`, { font: "mania", size: 32 }),
                k.pos(k.center().x, 350),
                k.anchor("center"),
                k.fixed(),
            ]);

            const countdown = k.loop(1, () => {
                if (isPaused || step !== 5) return;
                timeLeft--;
                timerText.text = `TIME LEFT: ${timeLeft}S`;
                if (timeLeft <= 0) {
                    countdown.cancel();
                    k.destroy(timerText);
                }
            });

            k.wait(30, () => {
                ringLoop.cancel();
                bugLoop.cancel();
                countdown.cancel();
                if (timerText.exists()) k.destroy(timerText);
                nextStep(5);
            });
        } else if (step === 6) {
            instructionText.text = "YOU'RE READY TO RUN!";
            subInstructionText.text = "PRESS SPACE TO START THE REAL GAME!";
        }
    };

    // Continuous Spawning during targeted steps
    k.loop(2, () => {
        if (isPaused) return;
        if (step === 2 && !hasCollectedRing) {
            const ring = makeRing(k.vec2(k.width() + 100, 745));
            spawnedRings.push(ring);
            ring.onUpdate(() => {
                if (isPaused) return;
                ring.move(-800, 0);
            });
            ring.onExitScreen(() => {
                if (ring.pos.x < 0) {
                    k.destroy(ring);
                    spawnedRings = spawnedRings.filter(r => r !== ring);
                }
            });
        }
    });

    k.loop(3, () => {
        if (isPaused) return;
        if (step === 3 && !hasDestroyedEnemy) {
            const motobug = makeMotobug(k.vec2(k.width() + 100, 773));
            spawnedEnemies.push(motobug);
            motobug.onUpdate(() => {
                if (isPaused) return;
                motobug.move(-1100, 0);
            });
            motobug.onExitScreen(() => {
                if (motobug.pos.x < 0) {
                    k.destroy(motobug);
                    spawnedEnemies = spawnedEnemies.filter(e => e !== motobug);
                }
            });
        }
    });

    k.onButtonPress("jump", () => {
        if (isPaused) return;

        // Always allow Sonic to jump if grounded
        if (sonic.isGrounded()) {
            sonic.play("jump");
            sonic.jump();
            k.play("jump", { volume: 0.5 });
        }

        // Logic for advancing tutorial
        if (step === 0) {
            nextStep(0);
        }

        if (step === 1 && !hasJumped && !isTransitioning) {
            hasJumped = true;
            isTransitioning = true;
            k.wait(1.5, () => nextStep(1));
        }

        if (step === 6) {
            citySfx.stop();
            k.go("tutorial-end");
        }
    });

    sonic.onCollide("ring", (ring) => {
        k.play("ring", { volume: 0.5 });
        k.destroy(ring);
        spawnedRings = spawnedRings.filter(r => r !== ring);

        ringStreak++;
        perfectRun++;

        let ringPoints = 2;
        let bonusText = "+2";

        if (ringStreak >= 10) {
            ringPoints = 5;
            bonusText = "+5 STREAK!";
            k.play("hyper-ring", { volume: 0.3 });
        } else if (ringStreak >= 5) {
            ringPoints = 3;
            bonusText = "+3 COMBO!";
        }

        score += ringPoints;
        if (scoreText) scoreText.text = `SCORE : ${score}`;
        sonic.ringCollectUI.text = bonusText;

        if (ringStreak >= 5) {
            comboText.text = `${ringStreak} RING STREAK!`;
        }

        k.wait(1, () => {
            sonic.ringCollectUI.text = "";
        });

        if (step === 2 && !hasCollectedRing) {
            hasCollectedRing = true;
            instructionText.text = "GREAT JOB!";
            k.wait(1.5, () => nextStep(2));
        }
    });

    sonic.onCollide("enemy", (enemy) => {
        if (!sonic.isGrounded()) {
            k.play("destroy", { volume: 0.5 });
            k.play("hyper-ring", { volume: 0.5 });
            k.destroy(enemy);
            spawnedEnemies = spawnedEnemies.filter(e => e !== enemy);
            sonic.jump();

            scoreMultiplier++;
            perfectRun++;

            let enemyPoints = 10 * scoreMultiplier;

            if (perfectRun >= 20) {
                enemyPoints += 50;
                sonic.ringCollectUI.text = `+${enemyPoints} PERFECT!`;
                k.play("hyper-ring", { volume: 0.5 });
                comboText.text = `${perfectRun} PERFECT RUN!`;
            } else {
                if (scoreMultiplier === 1) sonic.ringCollectUI.text = `+${enemyPoints}`;
                if (scoreMultiplier > 1) sonic.ringCollectUI.text = `x${scoreMultiplier}`;
            }

            score += enemyPoints;
            if (scoreText) scoreText.text = `SCORE : ${score}`;

            k.wait(1, () => {
                sonic.ringCollectUI.text = "";
            });

            if (step === 3 && !hasDestroyedEnemy) {
                hasDestroyedEnemy = true;
                instructionText.text = "AWESOME!";
                k.wait(1.5, () => nextStep(3));
            }
        } else {
            k.play("hurt", { volume: 0.5 });
            k.destroy(enemy);
            spawnedEnemies = spawnedEnemies.filter(e => e !== enemy);
            ringStreak = 0;
            perfectRun = 0;
            scoreMultiplier = 0;
            comboText.text = "";
        }
    });

    k.onUpdate(() => {
        if (isPaused) return;

        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }

        bgPieces[0].move(-100, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (platforms[1].pos.x < 0) {
            platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450);
            platforms.push(platforms.shift());
        }

        platforms[0].move(-800, 0);
        platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
    });

    // Support ESC key for pause
    k.onButtonPress("pause", () => {
        if (isPaused) resumeGame();
        else pauseGame();
    });
}
