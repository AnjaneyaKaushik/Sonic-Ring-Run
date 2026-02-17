import k from "./kaplayCtx";
import disclaimer from "./scenes/disclaimer";
import intro from "./scenes/intro";
import game from "./scenes/game";
import legal from "./scenes/legal";
import gameover from "./scenes/gameover";
import mainMenu from "./scenes/mainMenu";
import tutorial from "./scenes/tutorial";
import tutorialEnd from "./scenes/tutorialEnd";

k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
k.loadSprite("play", "graphics/play.png");
k.loadSprite("restart", "graphics/restart.jpg");
k.loadSprite("menu", "graphics/hamburger.png");
k.loadSprite("sonic", "graphics/sonic.png", {
  sliceX: 8,
  sliceY: 2,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 30 },
    jump: { from: 8, to: 15, loop: true, speed: 100 },
  },
});
k.loadSprite("ring", "graphics/ring.png", {
  sliceX: 16,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});
k.loadSprite("motobug", "graphics/motobug.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 8 },
  },
});
k.loadFont("mania", "fonts/mania.ttf");
k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("Theme", "sounds/Theme.mp3");

k.scene("disclaimer", disclaimer);
k.scene("intro", intro);
k.scene("legal", legal);
k.scene("main-menu", mainMenu);
k.scene("game", game);
k.scene("gameover", gameover);
k.scene("tutorial", tutorial);
k.scene("tutorial-end", tutorialEnd);

k.go("disclaimer");