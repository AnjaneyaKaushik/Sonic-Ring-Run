import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";

export default function mainMenu() {
  if (!k.getData("best-score")) k.setData("best-score", 0);

  // Power user shortcut
  k.onKeyPress("f", () => {
    k.setFullscreen(!k.isFullscreen());
  });

  const bgPieceWidth = 1920;
  const bgPieces = [
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(1920, 0),
      k.scale(2),
      k.opacity(0.8),
    ]),
  ];

  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
    k.add([k.sprite("platforms"), k.pos(384, 450), k.scale(4)]),
  ];

  k.add([
    k.text("SONIC RING RUN", { font: "mania", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, 200),
  ]);

  const playBtn = k.add([
    k.sprite("play"),
    k.pos(k.center().x, k.center().y - 150),
    k.anchor("center"),
    k.scale(0.5),
    k.area({ scale: k.vec2(1.5) }), // Larger hit area for mobile
    k.z(100),
    "button",
    { action: () => handlePlayAction() }
  ]);

  const handlePlayAction = () => {
    k.go("game");
  };

  playBtn.onClick(handlePlayAction);

  playBtn.onHoverUpdate(() => {
    playBtn.scale = k.vec2(0.55);
    k.setCursor("pointer");
  });

  playBtn.onHoverEnd(() => {
    playBtn.scale = k.vec2(0.5);
    k.setCursor("default");
  });

  // How to play button
  const howToPlayBtn = k.add([
    k.rect(300, 60, { radius: 8 }),
    k.pos(k.center().x, k.center().y + 80),
    k.color(0, 0, 0, 0.8),
    k.outline(3, k.WHITE),
    k.anchor("center"),
    k.area({ scale: k.vec2(1.2, 1.5) }), // Taller/wider for mobile
    k.z(100),
    "button",
    { action: () => k.go("tutorial") }
  ]);

  howToPlayBtn.add([
    k.text("HOW TO PLAY", { font: "mania", size: 24 }),
    k.anchor("center"),
  ]);

  howToPlayBtn.onClick(() => k.go("tutorial"));

  howToPlayBtn.onHoverUpdate(() => {
    howToPlayBtn.scale = k.vec2(1.1);
    k.setCursor("pointer");
  });
  howToPlayBtn.onHoverEnd(() => {
    howToPlayBtn.scale = k.vec2(1);
    k.setCursor("default");
  });

  // Fullscreen toggle button
  const fullscreenBtn = k.add([
    k.rect(300, 60, { radius: 8 }),
    k.pos(k.center().x, k.center().y + 160),
    k.color(0, 100, 200, 0.8),
    k.outline(3, k.WHITE),
    k.anchor("center"),
    k.area({ scale: k.vec2(1.2, 1.5) }),
    k.z(100),
    "button",
    { action: toggleFullscreen }
  ]);

  fullscreenBtn.add([
    k.text("FULLSCREEN", { font: "mania", size: 24 }),
    k.anchor("center"),
  ]);

  const toggleFullscreen = () => k.setFullscreen(!k.isFullscreen());

  fullscreenBtn.onClick(toggleFullscreen);

  fullscreenBtn.onHoverUpdate(() => {
    fullscreenBtn.scale = k.vec2(1.1);
    k.setCursor("pointer");
  });
  fullscreenBtn.onHoverEnd(() => {
    fullscreenBtn.scale = k.vec2(1);
    k.setCursor("default");
  });

  // Legal button (pushed down)
  const legalBtn = k.add([
    k.rect(300, 60, { radius: 8 }),
    k.pos(k.center().x, k.center().y + 240),
    k.color(60, 60, 60, 0.8),
    k.outline(3, k.WHITE),
    k.anchor("center"),
    k.area({ scale: k.vec2(1.2, 1.5) }),
    k.z(100),
    "button",
    { action: () => k.go("legal") }
  ]);

  legalBtn.add([
    k.text("DISCLAIMER", { font: "mania", size: 24 }),
    k.anchor("center"),
  ]);

  legalBtn.onClick(() => k.go("legal"));

  legalBtn.onHoverUpdate(() => {
    legalBtn.scale = k.vec2(1.1);
    k.setCursor("pointer");
  });
  legalBtn.onHoverEnd(() => {
    legalBtn.scale = k.vec2(1);
    k.setCursor("default");
  });

  // Addictive warning footer with highlight box
  k.add([
    k.rect(850, 60, { radius: 10 }),
    k.pos(k.center().x, k.height() - 50),
    k.color(0, 0, 0, 0.7),
    k.outline(4, k.Color.fromArray([255, 215, 0])),
    k.anchor("center"),
  ]);

  k.add([
    k.text("PS: This can be addictive, please play at your own risk!", {
      font: "mania",
      size: 24
    }),
    k.anchor("center"),
    k.pos(k.center().x, k.height() - 50),
    k.color(255, 215, 0),
  ]);

  // Unified Mobile/Desktop Button Handler
  // This is the most robust way to handle clicks in KAPLAY on mobile
  k.onMousePress("left", () => {
    const mpos = k.mousePos();
    k.get("button").forEach((btn) => {
      if (btn.hasPoint(mpos) && btn.action) {
        btn.action();
      }
    });
  });

  makeSonic(k.vec2(200, 745));

  k.add([
    k.rect(1920, 300),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({ isStatic: true }),
  ]);

  const gameSpeed = 4000;
  k.onUpdate(() => {
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

    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
  });
}