import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";
import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";

export default function game() {
  const citySfx = k.play("Theme", { volume: 0.3, loop: true });
  k.setGravity(3100);
  
  // Pause state management
  let isPaused = false;
  let pauseOverlay = null;
  let pauseButton = null;
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
    
    // Hide pause button
    pauseButton.hidden = true;
    
    // Pause audio
    citySfx.paused = true;
    
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
    
    // Add resume instructions (bottom like game over)
    const resumeText = k.add([
      k.text("Press ESC to Resume", { 
        font: "mania", 
        size: 64,
        color: k.WHITE,
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 350),
      k.fixed(),
    ]);
    pauseUIElements.push(resumeText);
  };
  
  const resumeGame = () => {
    if (!isPaused) return;
    isPaused = false;
    
    // Show pause button
    pauseButton.hidden = false;
    pauseButtonText.text = "⏸ PAUSE";
    
    // Resume audio
    citySfx.paused = false;
    
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
  
  // Create pause button
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
  
  // Add pause button text
  pauseButtonText = pauseButton.add([
    k.text("⏸ PAUSE", { 
      font: "mania", 
      size: 24,
      color: k.WHITE,
    }),
    k.anchor("center"),
  ]);
  
  // Make pause button clickable
  pauseButton.onClick(() => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  });
  
  // Add hover effect
  pauseButton.onHover(() => {
    pauseButton.color = k.Color.fromArray([50, 50, 50, 0.9]);
  });
  
  pauseButton.onHoverEnd(() => {
    pauseButton.color = k.Color.fromArray([0, 0, 0, 0.8]);
  });
  
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
  let perfectRunLifeAwarded = false; // Track if perfect run life was given
  
  // Initial render of hearts
  renderHearts();
  
  // Combo/streak display
  const comboText = k.add([
    k.text("", { font: "mania", size: 48 }),
    k.pos(k.center().x, 150),
    k.anchor("center"),
    k.color(255, 215, 0), // Gold color
  ]);
  
  // Score checkpoint system
  const checkpoints = [50, 250, 450, 500, 700, 1000];
  let checkpointIndex = 0; // Track which checkpoint we're on
  let livesGainedFromCheckpoints = 0; // Track how many lives gained from checkpoints
  const maxGainedLives = 3; // Maximum lives that can be gained from checkpoints
  
  const addLife = () => {
    // Only award life if player has less than 3 lives AND hasn't reached max gained lives
    if (lives >= 3 || livesGainedFromCheckpoints >= maxGainedLives) {
      return; // Don't add life if at full health or reached max gained lives
    }
    
    lives++;
    livesGainedFromCheckpoints++;
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
    if (checkpointIndex < checkpoints.length && newScore >= checkpoints[checkpointIndex]) {
      addLife();
      // Display checkpoint progress
      const currentCheckpoint = checkpointIndex + 1;
      const totalCheckpoints = checkpoints.length;
      comboText.text = `CHECKPOINT ${currentCheckpoint} OF ${totalCheckpoints}!`;
      comboText.color = k.Color.fromArray([0, 255, 0]); // Green for checkpoint
      k.wait(3, () => {
        comboText.text = "";
        comboText.color = k.Color.fromArray([255, 215, 0]); // Reset to gold
      });
      checkpointIndex++;
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
  });
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
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
      return;
    }

    // Check if player is invincible (just took damage)
    if (isInvincible) {
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

    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
  });
}