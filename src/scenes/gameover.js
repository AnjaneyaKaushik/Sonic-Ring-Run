import k from "../kaplayCtx";

export default function gameover(citySfx) {
  if (citySfx) citySfx.stop();
  let bestScore = k.getData("best-score") || 0;
  const currentScore = k.getData("current-score") || 0;

  // Hill Climb Style: Calculate checkpoints reached
  let checkpointsReached = 0;
  if (currentScore > 0) {
    if (currentScore <= bestScore || bestScore === 0) {
      // Only counting 50pt intervals if we're below the best score (or best is 0)
      checkpointsReached = Math.floor(currentScore / 50);
    } else {
      // Counting 50pt intervals up to best, then 100pt intervals past it
      const baselineCheckpoints = Math.floor(bestScore / 50);
      const bonusCheckpoints = Math.floor((currentScore - bestScore) / 100);
      checkpointsReached = baselineCheckpoints + bonusCheckpoints;
    }
  }

  // Dynamic Grading System
  const calculateRank = (score, best) => {
    if (score === 0) return "F";
    if (score > best && best > 0) return "S";

    const target = Math.max(best, 1000); // 1000 is the minimum goal for an S rank if highscore is low
    const ratio = score / target;

    if (ratio >= 0.9) return "S";
    if (ratio >= 0.75) return "A";
    if (ratio >= 0.6) return "B";
    if (ratio >= 0.4) return "C";
    if (ratio >= 0.2) return "D";
    if (ratio >= 0.1) return "E";
    return "F";
  };

  const currentRank = calculateRank(currentScore, bestScore);

  // Calculate best rank before updating best score
  let bestRank = calculateRank(bestScore, bestScore);

  // Update high score if beaten
  const isNewRecord = currentScore > bestScore;
  if (isNewRecord) {
    k.setData("best-score", currentScore);
    bestScore = currentScore;
    bestRank = "S";
  }

  // UI Construction
  k.add([
    k.text(isNewRecord ? "NEW RECORD!" : "GAME OVER", {
      font: "mania",
      size: 96,
      color: isNewRecord ? k.Color.fromArray([255, 215, 0]) : k.WHITE
    }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 320),
  ]);

  // Checkpoints Stats (Hill Climb style)
  k.add([
    k.text(`CHECKPOINTS CLEARED: ${checkpointsReached}`, {
      font: "mania",
      size: 32,
      color: k.Color.fromArray([0, 255, 0])
    }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 230),
  ]);

  k.add([
    k.text(`BEST SCORE : ${bestScore}`, { font: "mania", size: 48 }),
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y - 150),
  ]);

  k.add([
    k.text(`CURRENT SCORE : ${currentScore}`, { font: "mania", size: 48 }),
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y - 150),
  ]);

  // Rank Boxes
  const makeRankBox = (rank, label, pos) => {
    const box = k.add([
      k.rect(350, 350, { radius: 8 }),
      k.color(0, 0, 0, 0.8),
      k.outline(6, k.WHITE),
      k.pos(pos),
      k.anchor("center"),
    ]);

    box.add([
      k.text(label, { font: "mania", size: 32 }),
      k.pos(0, -200),
      k.anchor("center"),
    ]);

    box.add([
      k.text(rank, { font: "mania", size: 120 }),
      k.anchor("center"),
    ]);

    return box;
  };

  makeRankBox(bestRank, "BEST RANK", k.vec2(k.center().x - 400, k.center().y + 100));
  makeRankBox(currentRank, "CURRENT RANK", k.vec2(k.center().x + 400, k.center().y + 100));

  k.wait(1, () => {
    // Restart Button
    const restartBtn = k.add([
      k.sprite("restart"),
      k.pos(k.center().x - 100, k.center().y + 350),
      k.anchor("center"),
      k.scale(0.1),
      k.area(),
      k.z(50),
    ]);

    restartBtn.onClick(() => k.go("game"));
    restartBtn.onHoverUpdate(() => {
      restartBtn.scale = k.vec2(0.11);
      k.setCursor("pointer");
    });
    restartBtn.onHoverEnd(() => {
      restartBtn.scale = k.vec2(0.1);
      k.setCursor("default");
    });

    // Menu Button
    const menuBtn = k.add([
      k.sprite("menu"),
      k.pos(k.center().x + 100, k.center().y + 350),
      k.anchor("center"),
      k.scale(0.1),
      k.area(),
      k.z(50),
    ]);

    menuBtn.onClick(() => k.go("main-menu"));
    menuBtn.onHoverUpdate(() => {
      menuBtn.scale = k.vec2(0.11);
      k.setCursor("pointer");
    });
    menuBtn.onHoverEnd(() => {
      menuBtn.scale = k.vec2(0.1);
      k.setCursor("default");
    });
  });
}