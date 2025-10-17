import k from "../kaplayCtx";

export default function gameover(citySfx) {
  citySfx.paused = true;
  let bestScore = k.getData("best-score");
  const currentScore = k.getData("current-score");

  // Calculate score grades
  let currentRank;
  if (currentScore >= 1500) {
    currentRank = "S";
  } else if (currentScore >= 1200) {
    currentRank = "A";
  } else if (currentScore >= 900) {
    currentRank = "B";
  } else if (currentScore >= 600) {
    currentRank = "C";
  } else if (currentScore >= 300) {
    currentRank = "D";
  } else if (currentScore >= 150) {
    currentRank = "E";
  } else if (currentScore >= 50) {
    currentRank = "F";
  } else {
    currentRank = "F";
  }

  let bestRank;
  if (bestScore >= 1500) {
    bestRank = "S";
  } else if (bestScore >= 1200) {
    bestRank = "A";
  } else if (bestScore >= 900) {
    bestRank = "B";
  } else if (bestScore >= 600) {
    bestRank = "C";
  } else if (bestScore >= 300) {
    bestRank = "D";
  } else if (bestScore >= 150) {
    bestRank = "E";
  } else if (bestScore >= 50) {
    bestRank = "F";
  } else {
    bestRank = "F";
  }

  if (bestScore < currentScore) {
    k.setData("best-score", currentScore);
    bestScore = currentScore;
    bestRank = currentRank;
  }

  k.add([
    k.text("GAME OVER", { font: "mania", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 300),
  ]);
  k.add([
    k.text(`BEST SCORE : ${bestScore}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y - 200),
  ]);
  k.add([
    k.text(`CURRENT SCORE : ${currentScore}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y - 200),
  ]);

  const bestRankBox = k.add([
    k.rect(400, 400, { radius: 4 }),
    k.color(0, 0, 0),
    k.area(),
    k.anchor("center"),
    k.outline(6, k.Color.fromArray([255, 255, 255])),
    k.pos(k.center().x - 400, k.center().y + 50),
  ]);

  bestRankBox.add([
    k.text(bestRank, { font: "mania", size: 100 }),
    k.anchor("center"),
  ]);

  const currentRankBox = k.add([
    k.rect(400, 400, { radius: 4 }),
    k.color(0, 0, 0),
    k.area(),
    k.anchor("center"),
    k.outline(6, k.Color.fromArray([255, 255, 255])),
    k.pos(k.center().x + 400, k.center().y + 50),
  ]);

  currentRankBox.add([
    k.text(currentRank, { font: "mania", size: 100 }),
    k.anchor("center"),
  ]);

  k.wait(1, () => {
    k.add([
      k.text("Press Space/Click/Touch to Play Again", {
        font: "mania",
        size: 64,
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 350),
    ]);
    k.onButtonPress("jump", () => k.go("game"));
  });
}