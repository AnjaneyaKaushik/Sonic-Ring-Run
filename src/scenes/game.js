import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";
import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";

export default function game() {
  const citySfx = k.play("Theme", { volume: 0.3, loop: true });
  k.setGravity(3100);

  k.onSceneLeave(() => {
    if (citySfx) citySfx.stop();
  });

  // Pause state management
  let isPaused = false;
  let pauseOverlay = null;
  let pauseButton = null;
  let resetButton = null;
  let pauseButtonText = null;
  let pauseUIElements = [];
  let spawnedEnemies = [];
  let spawnedRings = [];
  let isSpawningRings = true;
  let isSpawningMotoBugs = true;

  // Pause/Resume functions
  const pauseGame = () => {
    if (isPaused) return;
    isPaused = true;

    // Hide pause and reset buttons
    pauseButton.hidden = true;
    if (resetButton) resetButton.hidden = true;

    // Pause audio
    if (citySfx) citySfx.paused = true;

    // Hide all game objects (enemies, rings, sonic)
    spawnedEnemies.forEach(enemy => enemy.hidden = true);
    spawnedRings.forEach(ring => ring.hidden = true);
    sonic.hidden = true;
    isSpawningRings = false;
    isSpawningMotoBugs = false;

    // Create pause overlay
    pauseOverlay = k.add([
      k.rect(k.width(), k.height()),
      k.color(0, 0, 0, 0.7),
      k.pos(0, 0),
      k.fixed(),
    ]);
    pauseUIElements.push(pauseOverlay);

    // Get high score
    const highScore = k.getData("best-score") || 0;

    // Add pause title (similar to game over structure)
    const pauseTitle = k.add([
      k.text("PAUSED", {
        font: "mania",
        size: 96,
        color: k.WHITE,
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y - 300),
      k.fixed(),
    ]);
    pauseUIElements.push(pauseTitle);

    // Add current score display
    const currentScoreText = k.add([
      k.text(`CURRENT SCORE : ${score}`, {
        font: "mania",
        size: 64,
        color: k.WHITE,
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y - 150),
      k.fixed(),
    ]);
    pauseUIElements.push(currentScoreText);

    // Add high score display
    const highScoreText = k.add([
      k.text(`HIGH SCORE : ${highScore}`, {
        font: "mania",
        size: 64,
        color: k.Color.fromArray([255, 215, 0]), // Gold color for high score
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y - 50),
      k.fixed(),
    ]);
    pauseUIElements.push(highScoreText);

    // Add buttons
    const makeBtn = (text, pos, color, action) => {
      const btn = k.add([
        k.rect(400, 100, { radius: 12 }),
        k.pos(k.center().x + pos.x, k.center().y + pos.y),
        k.color(color),
        k.outline(6, k.WHITE),
        k.anchor("center"),
        k.area({ scale: k.vec2(1.2) }),
        k.fixed(),
        k.z(100),
        "button",
        { action: action }
      ]);

      const btnText = btn.add([
        k.text(text, { font: "mania", size: 48 }),
        k.anchor("center"),
        k.color(k.WHITE),
      ]);

      btn.onHoverUpdate(() => {
        btn.scale = k.vec2(1.1);
        btn.color = color.lighten(30);
      });

      btn.onHoverEnd(() => {
        btn.scale = k.vec2(1);
        btn.color = color;
      });

      btn.onClick(action);
      pauseUIElements.push(btn);
    };

    // Button data
    const buttons = [
      { text: "RESUME", color: k.Color.fromArray([34, 197, 94]), action: () => resumeGame() },
      { text: "FULLSCREEN", color: k.Color.fromArray([168, 85, 247]), action: () => k.setFullscreen(!k.isFullscreen()) },
      { text: "RESTART", color: k.Color.fromArray([59, 130, 246]), action: () => { citySfx.paused = true; citySfx.stop(); k.go("game"); } },
      { text: "QUIT", color: k.Color.fromArray([239, 68, 68]), action: () => { citySfx.paused = true; citySfx.stop(); k.go("main-menu"); } },
    ];

    // Align buttons with consistent 130px center-to-center spacing
    buttons.forEach((btnData, index) => {
      makeBtn(btnData.text, k.vec2(0, 70 + index * 140), btnData.color, btnData.action);
    });
  };

  const resumeGame = () => {
    if (!isPaused) return;
    isPaused = false;

    // Show pause and reset buttons
    pauseButton.hidden = false;
    if (resetButton) resetButton.hidden = false;
    pauseButtonText.text = "⏸ PAUSE";

    // Resume audio
    if (citySfx) citySfx.paused = false;

    // Show all game objects
    spawnedEnemies.forEach(enemy => enemy.hidden = false);
    spawnedRings.forEach(ring => ring.hidden = false);
    sonic.hidden = false;
    isSpawningRings = true;
    isSpawningMotoBugs = true;
    spawnRing();
    spawnMotoBug();

    // Clean up all pause UI elements
    pauseUIElements.forEach(element => {
      k.destroy(element);
    });
    pauseUIElements = [];
    pauseOverlay = null;
  };

  // Pause button handler
  k.onButtonPress("pause", () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  });

  // Handle browser-initiated fullscreen exit (e.g. ESC key)
  const onFullscreenChange = () => {
    if (!k.isFullscreen() && !isPaused) {
      pauseGame();
    }
  };
  document.addEventListener("fullscreenchange", onFullscreenChange);

  k.onSceneLeave(() => {
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    if (citySfx) citySfx.stop();
  });

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

  // Custom controls that respect pause state
  k.onButtonPress("jump", () => {
    if (isPaused) return;
    if (sonic.isGrounded()) {
      sonic.play("jump");
      sonic.jump();
      k.play("jump", { volume: 0.5 });
    }
  });

  const controlsText = k.add([
    k.text("Press Space/Click/Touch to Jump!", {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center()),
  ]);

  const dismissControlsAction = k.onButtonPress("jump", () => {
    k.destroy(controlsText);
    dismissControlsAction.cancel();
  });

  const scoreText = k.add([
    k.text("SCORE : 0", { font: "mania", size: 72 }),
    k.pos(20, 20),
  ]);

  // Reset button under score
  resetButton = k.add([
    k.rect(150, 50, { radius: 8 }),
    k.pos(20, 110),
    k.color(0, 0, 0, 0.8),
    k.outline(3, k.WHITE),
    k.area(),
    k.fixed(),
    k.z(10),
  ]);

  resetButton.add([
    k.text("RESET", { font: "mania", size: 24 }),
    k.anchor("center"),
    k.pos(75, 25),
  ]);

  resetButton.onClick(() => {
    if (isPaused) return;
    isPaused = true;

    // Hide UI
    pauseButton.hidden = true;
    resetButton.hidden = true;

    // Pause audio
    if (citySfx) citySfx.paused = true;

    // Hide game objects
    spawnedEnemies.forEach(enemy => enemy.hidden = true);
    spawnedRings.forEach(ring => ring.hidden = true);
    sonic.hidden = true;
    isSpawningRings = false;
    isSpawningMotoBugs = false;

    // Create confirmation overlay
    const overlay = k.add([
      k.rect(k.width(), k.height()),
      k.color(0, 0, 0, 0.8),
      k.fixed(),
      k.z(100),
    ]);
    pauseUIElements.push(overlay);

    const confirmBox = k.add([
      k.rect(600, 350, { radius: 16 }),
      k.color(20, 20, 20),
      k.outline(6, k.WHITE),
      k.pos(k.center()),
      k.anchor("center"),
      k.fixed(),
      k.z(101),
    ]);
    pauseUIElements.push(confirmBox);

    confirmBox.add([
      k.text("RESET?", { font: "mania", size: 64 }),
      k.pos(0, -80),
      k.anchor("center"),
    ]);

    const makeConfirmBtn = (text, offset, color, action) => {
      const btn = k.add([
        k.rect(200, 80, { radius: 8 }),
        k.pos(k.center().x + offset, k.center().y + 80),
        k.color(color),
        k.outline(4, k.WHITE),
        k.anchor("center"),
        k.area(),
        k.fixed(),
        k.z(102),
      ]);
      pauseUIElements.push(btn);

      btn.add([
        k.text(text, { font: "mania", size: 32 }),
        k.anchor("center"),
      ]);

      btn.onClick(action);
      btn.onHoverUpdate(() => {
        btn.scale = k.vec2(1.1);
        k.setCursor("pointer");
      });
      btn.onHoverEnd(() => {
        btn.scale = k.vec2(1);
        k.setCursor("default");
      });
    };

    makeConfirmBtn("YES", -120, k.Color.fromArray([34, 197, 94]), () => {
      citySfx.stop();
      k.go("game");
    });

    makeConfirmBtn("NO", 120, k.Color.fromArray([239, 68, 68]), () => {
      resumeGame();
    });
  });

  resetButton.onHoverUpdate(() => {
    if (isPaused) return;
    resetButton.color = k.Color.fromArray([50, 50, 50, 0.9]);
    k.setCursor("pointer");
  });

  resetButton.onHoverEnd(() => {
    resetButton.color = k.Color.fromArray([0, 0, 0, 0.8]);
    k.setCursor("default");
  });

  // Lives UI (hearts)
  const hearts = [];
  const renderHearts = () => {
    // Clear existing hearts
    hearts.forEach(h => k.destroy(h));
    hearts.length = 0;
    // Recreate hearts based on current lives
    for (let i = 0; i < lives; i++) {
      const heart = k.add([
        k.text("❤", { font: "mania", size: 36 }),
        k.pos(k.width() - 80 - i * 50, 40),
        k.color(255, 0, 0),
        k.anchor("center"),
        k.fixed(),
      ]);
      hearts.push(heart);
    }
  };

  let score = 0;
  let scoreMultiplier = 0;
  let lives = 3;
  let isInvincible = false;

  // Addictive game mechanics
  let ringStreak = 0;
  let perfectRun = 0; // consecutive actions without taking damage
  let comboTimer = 0;
  let lastAction = "";
  let streakRebuildChance = false; // Second chance mechanic
  let lastChanceUsed = false; // Final rebuild opportunity
  let streakSystemExhausted = false; // No more streak messages after final break
  let perfectRunLifeAwarded = false;
  let bestScore = k.getData("best-score") || 0;
  let highScoreBeaten = false;

  // Dash Meter mechanics
  let dashAmount = 0;
  let isDashing = false;
  const maxDash = 100; // Track if perfect run life was given

  // Initial render of hearts
  renderHearts();

  // Combo/streak display
  const comboText = k.add([
    k.text("", { font: "mania", size: 48 }),
    k.pos(k.center().x, 150),
    k.anchor("center"),
    k.color(255, 215, 0), // Gold color
  ]);

  // Dash Meter UI
  const dashMeterContainer = k.add([
    k.rect(300, 30, { radius: 8 }),
    k.pos(k.center().x, 1000),
    k.color(0, 0, 0, 0.7),
    k.outline(3, k.WHITE),
    k.anchor("center"),
    k.area({ scale: k.vec2(1.5, 3.0) }), // Double height hit area for bottom-screen tap
    k.z(100),
    k.fixed(),
    "button",
    { action: () => triggerDash() }
  ]);

  dashMeterContainer.onClick(() => triggerDash());

  dashMeterContainer.onHoverUpdate(() => {
    if (dashAmount >= maxDash && !isDashing) {
      k.setCursor("pointer");
    }
  });

  dashMeterContainer.onHoverEnd(() => {
    k.setCursor("default");
  });

  const dashBar = dashMeterContainer.add([
    k.rect(0, 24, { radius: 4 }),
    k.pos(-147, 0), // Offset from center anchor
    k.color(0, 191, 255), // Sonic Blue fill
    k.anchor("left"),
  ]);

  const dashReadyText = k.add([
    k.text("DASH READY! (SHIFT/RIGHT)", { font: "mania", size: 24 }),
    k.pos(k.center().x, 960),
    k.color(255, 255, 255),
    k.anchor("center"),
    k.fixed(),
    k.opacity(0),
  ]);

  const togglePauseFromBtn = () => {
    if (isPaused) resumeGame();
    else pauseGame();
  };

  // Create refined pause button
  pauseButton = k.add([
    k.rect(140, 50, { radius: 8 }),
    k.color(0, 0, 0, 0.8),
    k.outline(3, k.WHITE),
    k.pos(k.width() - 80, 100),
    k.anchor("center"),
    k.area({ scale: k.vec2(1.5, 2.0) }), // Larger hit area for top-right tap
    k.fixed(),
    k.z(101),
    "button",
    { action: () => togglePauseFromBtn() }
  ]);

  pauseButtonText = pauseButton.add([
    k.text("⏸ PAUSE", { font: "mania", size: 24, color: k.WHITE }),
    k.anchor("center"),
  ]);

  pauseButton.onClick(togglePauseFromBtn);

  // Unified Mobile/Desktop Button Handler
  k.onMousePress("left", () => {
    const mpos = k.mousePos();
    k.get("button").forEach((btn) => {
      // Direct point check is more reliable than isHovering on mobile
      if (!btn.hidden && btn.hasPoint(mpos) && btn.action) {
        btn.action();
      }
    });
  });

  pauseButton.onHoverUpdate(() => {
    pauseButton.scale = k.vec2(1.1);
    k.setCursor("pointer");
  });

  pauseButton.onHoverEnd(() => {
    pauseButton.scale = k.vec2(1);
    k.setCursor("default");
  });

  // Score checkpoint system
  let checkpoints = [];
  const initialLimit = Math.max(bestScore, 300);
  for (let i = 50; i <= initialLimit; i += 50) {
    checkpoints.push(i);
  }

  let checkpointIndex = 0;

  const addLife = () => {
    // Only award life if player has less than 3 lives
    if (lives >= 3) {
      return; // Don't add life if at full health
    }

    lives++;
    // Re-render hearts to reflect new life
    renderHearts();

    // Play ding sound and show UI feedback
    k.play("hyper-ring", { volume: 0.7 });
    sonic.ringCollectUI.text = "+1 LIFE!";
    sonic.ringCollectUI.color = k.Color.fromArray([0, 255, 0]); // Green for life
    k.wait(2, () => {
      sonic.ringCollectUI.text = "";
      sonic.ringCollectUI.color = k.Color.fromArray([255, 255, 0]); // Reset to yellow
    });
  };

  const findNearestCheckpoint = (currentScore) => {
    for (let i = 0; i < checkpoints.length; i++) {
      if (currentScore < checkpoints[i]) {
        return checkpoints[i];
      }
    }
    return null; // All checkpoints reached
  };

  const checkScoreCheckpoints = (newScore) => {
    // Check for high score
    if (!highScoreBeaten && newScore > bestScore && bestScore > 0) {
      highScoreBeaten = true;
      comboText.text = "NEW HIGHSCORE!";
      comboText.color = k.Color.fromArray([255, 215, 0]); // Gold
      k.play("hyper-ring", { volume: 0.8 });

      // Add infinite checkpoints every 100 points past highscore
      const nextTarget = Math.ceil(newScore / 100) * 100;
      checkpoints.push(nextTarget);

      k.wait(4, () => {
        if (comboText.text === "NEW HIGHSCORE!") comboText.text = "";
      });
    }

    if (checkpointIndex < checkpoints.length && newScore >= checkpoints[checkpointIndex]) {
      addLife();

      const currentCheckpoint = checkpointIndex + 1;
      const totalCheckpoints = checkpoints.length;

      comboText.text = `Checkpoint ${currentCheckpoint} of ${totalCheckpoints}`;
      comboText.color = k.Color.fromArray([0, 255, 0]); // Green

      k.wait(3, () => {
        comboText.text = "";
        comboText.color = k.Color.fromArray([255, 215, 0]);
      });

      checkpointIndex++;

      // If we've hit the last checkpoint, add a new one further out
      if (checkpointIndex === checkpoints.length) {
        const lastVal = checkpoints[checkpoints.length - 1];
        checkpoints.push(lastVal + 100);
      }
    }
  };
  sonic.onCollide("ring", (ring) => {
    k.play("ring", { volume: 0.5 });
    k.destroy(ring);

    ringStreak++;
    perfectRun++;
    comboTimer = 3; // Reset combo timer
    lastAction = "ring";

    let ringPoints = 2;
    let bonusText = "+2";

    // Ring streak bonuses (addictive!)
    if (ringStreak >= 10) {
      ringPoints = 5; // 2.5x bonus for 10+ streak
      bonusText = "+5 STREAK!";
      k.play("hyper-ring", { volume: 0.3 }); // Extra sound for streak
    } else if (ringStreak >= 5) {
      ringPoints = 3; // 1.5x bonus for 5+ streak
      bonusText = "+3 COMBO!";
    }

    score += ringPoints;
    scoreText.text = `SCORE : ${score}`;
    checkScoreCheckpoints(score);
    sonic.ringCollectUI.text = bonusText;

    // Show streak counter
    if (ringStreak >= 5) {
      comboText.text = `${ringStreak} RING STREAK!`;
    }

    k.wait(1, () => {
      sonic.ringCollectUI.text = "";
    });

    // Refill dash meter
    if (!isDashing) {
      dashAmount = Math.min(maxDash, dashAmount + 5);
      dashBar.width = (dashAmount / maxDash) * 294;

      if (dashAmount >= maxDash) {
        dashReadyText.opacity = 1;
        dashBar.color = k.Color.fromArray([255, 215, 0]); // Gold when ready
      }
    }
  });
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded() || isDashing) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      if (!isDashing) {
        sonic.play("jump");
        sonic.jump();
      }
      scoreMultiplier += 1;
      perfectRun++;
      comboTimer = 3;
      lastAction = "enemy";

      let enemyPoints = 10 * scoreMultiplier;

      // Perfect run bonus (addictive!)
      if (perfectRun >= 30 && !perfectRunLifeAwarded && lives < 3) {
        // Award bonus life for amazing perfect run (only when needed)
        lives++;
        renderHearts();
        perfectRunLifeAwarded = true;
        enemyPoints += 100; // Massive score bonus too
        sonic.ringCollectUI.text = `+${enemyPoints} + LIFE!`;
        sonic.ringCollectUI.color = k.Color.fromArray([0, 255, 0]); // Green for life
        k.play("hyper-ring", { volume: 0.8 });
        comboText.text = `${perfectRun} PERFECT! BONUS LIFE!`;
        k.wait(3, () => {
          sonic.ringCollectUI.color = k.Color.fromArray([255, 255, 0]); // Reset color
        });
      } else if (perfectRun >= 30 && !perfectRunLifeAwarded && lives >= 3) {
        // Still give massive score bonus even when at full lives
        perfectRunLifeAwarded = true;
        enemyPoints += 100;
        sonic.ringCollectUI.text = `+${enemyPoints} PERFECT!`;
        k.play("hyper-ring", { volume: 0.8 });
        comboText.text = `${perfectRun} PERFECT RUN! MAX LIVES`;
      } else if (perfectRun >= 20) {
        enemyPoints += 50; // Huge bonus for perfect runs
        sonic.ringCollectUI.text = `+${enemyPoints} PERFECT!`;
        k.play("hyper-ring", { volume: 0.5 });
        comboText.text = `${perfectRun} PERFECT RUN!`;
      } else {
        if (scoreMultiplier === 1)
          sonic.ringCollectUI.text = `+${enemyPoints}`;
        if (scoreMultiplier > 1) sonic.ringCollectUI.text = `x${scoreMultiplier}`;
      }

      score += enemyPoints;
      scoreText.text = `SCORE : ${score}`;
      checkScoreCheckpoints(score);

      k.wait(1, () => {
        sonic.ringCollectUI.text = "";
      });

      // Refill dash meter from destroying enemies
      if (!isDashing) {
        dashAmount = Math.min(maxDash, dashAmount + 15);
        dashBar.width = (dashAmount / maxDash) * 294;

        if (dashAmount >= maxDash) {
          dashReadyText.opacity = 1;
          dashBar.color = k.Color.fromArray([255, 215, 0]); // Gold when ready
        }
      }
      return;
    }

    // Check if player is invincible (just took damage or dashing)
    if (isInvincible || isDashing) {
      return;
    }

    // Take damage - but give a rebuild chance!
    lives--;

    if (!streakRebuildChance && (ringStreak >= 5 || perfectRun >= 10)) {
      // Give first rebuild chance for good streaks
      streakRebuildChance = true;
      ringStreak = Math.floor(ringStreak * 0.5); // Keep half the streak
      perfectRun = Math.floor(perfectRun * 0.5);
      comboText.text = "SECOND CHANCE! REBUILD!";
      comboText.color = k.Color.fromArray([255, 165, 0]); // Orange for second chance
      k.wait(3, () => {
        comboText.text = "";
        comboText.color = k.Color.fromArray([255, 215, 0]); // Reset to gold
      });
    } else if (!lastChanceUsed && streakRebuildChance && (ringStreak >= 3 || perfectRun >= 5)) {
      // Give LAST CHANCE for any remaining streak
      lastChanceUsed = true;
      ringStreak = Math.floor(ringStreak * 0.3); // Keep 30% of streak
      perfectRun = Math.floor(perfectRun * 0.3);
      comboText.text = "LAST CHANCE! FINAL REBUILD!";
      comboText.color = k.Color.fromArray([255, 0, 0]); // Red for urgency
      k.wait(4, () => {
        comboText.text = "";
        comboText.color = k.Color.fromArray([255, 215, 0]); // Reset to gold
      });
    } else {
      // No mercy - full reset
      ringStreak = 0;
      perfectRun = 0;
      perfectRunLifeAwarded = false; // Allow another perfect run bonus
      streakRebuildChance = false; // Reset rebuild chance for next time
      lastChanceUsed = false; // Reset last chance for next life cycle

      // Only show "STREAK BROKEN!" once per game session
      if (!streakSystemExhausted) {
        streakSystemExhausted = true;
        const nearestCheckpoint = findNearestCheckpoint(score);
        if (nearestCheckpoint) {
          comboText.text = `STREAK BROKEN! NEXT: ${nearestCheckpoint} POINTS`;
        } else {
          comboText.text = "STREAK BROKEN! ALL CHECKPOINTS REACHED!";
        }
        k.wait(4, () => {
          comboText.text = "";
        });
      }
      // After first break, damage is silent - no more streak messages
    }

    // Update hearts UI when life is lost
    renderHearts();
    k.play("hurt", { volume: 0.5 });

    // Make player invincible for 2 seconds
    isInvincible = true;
    sonic.color = k.Color.fromArray([255, 100, 100]); // Red tint for invincibility

    k.wait(2, () => {
      isInvincible = false;
      sonic.color = k.Color.fromArray([255, 255, 255]); // Reset color
    });

    // Check if game over
    if (lives <= 0) {
      k.setData("current-score", score);
      k.go("gameover", citySfx);
    }
  });

  let gameSpeed = 300;
  k.loop(1.5, () => {
    if (!isPaused) {
      gameSpeed += 35;
    }
  });

  const spawnMotoBug = () => {
    if (!isSpawningMotoBugs) return;
    const motobug = makeMotobug(k.vec2(1950, 773));
    spawnedEnemies.push(motobug);
    if (isPaused) {
      motobug.hidden = true;
    }

    motobug.onUpdate(() => {
      if (isPaused) return;

      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return;
      }
      motobug.move(-gameSpeed, 0);
    });

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) {
        // Remove from tracking array when destroyed
        const index = spawnedEnemies.indexOf(motobug);
        if (index > -1) {
          spawnedEnemies.splice(index, 1);
        }
        k.destroy(motobug);
      }
    });

    const waitTime = k.rand(0.5, 2.5);

    k.wait(waitTime, spawnMotoBug);
  };

  spawnMotoBug();

  const spawnRing = () => {
    if (!isSpawningRings) return;
    const ring = makeRing(k.vec2(1950, 745));
    spawnedRings.push(ring);
    if (isPaused) {
      ring.hidden = true;
    }

    ring.onUpdate(() => {
      if (isPaused) return;
      ring.move(-gameSpeed, 0);
    });
    ring.onExitScreen(() => {
      if (ring.pos.x < 0) {
        // Remove from tracking array when destroyed
        const index = spawnedRings.indexOf(ring);
        if (index > -1) {
          spawnedRings.splice(index, 1);
        }
        k.destroy(ring);
      }
    });

    const waitTime = k.rand(0.5, 3);

    k.wait(waitTime, spawnRing);
  };

  spawnRing();

  // Dash Input
  const triggerDash = () => {
    if (dashAmount >= maxDash && !isDashing && !isPaused) {
      isDashing = true;
      dashReadyText.opacity = 0;
      k.play("hyper-ring", { volume: 1 });
      sonic.color = k.Color.fromArray([0, 191, 255]); // Electrical blue glow
    }
  };

  k.onButtonPress("dash", triggerDash);
  k.onButtonPress("down", triggerDash);

  k.add([
    k.rect(1920, 300),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({ isStatic: true }),
    "platform",
  ]);

  k.onUpdate(() => {
    if (isPaused) return;

    if (sonic.isGrounded()) scoreMultiplier = 0;

    // Combo timer countdown (adds urgency!)
    if (comboTimer > 0) {
      comboTimer -= k.dt();
      if (comboTimer <= 0 && ringStreak >= 5) {
        comboText.text = "";
      }
    }

    // Dash depletion and logic
    if (isDashing) {
      dashAmount -= k.dt() * 16.67; // 6 second dash
      dashBar.width = (dashAmount / maxDash) * 294;

      if (dashAmount <= 0) {
        dashAmount = 0;
        isDashing = false;
        sonic.color = k.Color.fromArray([255, 255, 255]);
        dashBar.color = k.Color.fromArray([0, 191, 255]);
      }
    }

    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      bgPieces.push(bgPieces.shift());
    }

    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    // for jump effect
    bgPieces[0].moveTo(bgPieces[0].pos.x, -sonic.pos.y / 10 - 50);
    bgPieces[1].moveTo(bgPieces[1].pos.x, -sonic.pos.y / 10 - 50);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450);
      platforms.push(platforms.shift());
    }

    platforms[0].move(isDashing ? -gameSpeed * 2 : -gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
  });
}