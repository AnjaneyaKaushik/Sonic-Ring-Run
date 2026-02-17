import k from "../kaplayCtx";

export default function intro() {
    const bgPieceWidth = 1920;
    const bgPieces = [
        k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.3)]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(1920, 0),
            k.scale(2),
            k.opacity(0.3),
        ]),
    ];

    const storyText = `
    Dr. Robotnik is lost in the thoughts of Sonic. 
    He wants to capture him... 
    That's when he created MotoBugs.

    While he is busy with his nefarious plans 
    of creating new machinery to defeat Sonic, 
    the MotoBugs take care of the need 
    of capturing Sonic for him...
  `;

    const legalText = `
    NOT AFFILIATED WITH THE SONIC THE HEDGEHOG FRANCHISE.
    SONIC THE HEDGEHOG IS A PROPERTY OF SEGA.
    CREDITS TO SEGA AND CRUSH 40 FOR MUSIC.
    MADE FROM ASSETS FROM SONIC MANIA.
    THIS IS A FAN GAME/PARODY.
    THE PROLOGUE STORY IS NOT TAKEN FROM THE GAMES.
  `;

    // Story Container
    k.add([
        k.text(storyText, {
            font: "mania",
            size: 36,
            width: k.width() - 200,
            align: "center",
            lineSpacing: 10,
        }),
        k.pos(k.center().x, k.center().y - 100),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    // Legal Disclaimer (Smaller at bottom)
    k.add([
        k.rect(k.width(), 200),
        k.pos(0, k.height() - 200),
        k.color(0, 0, 0, 0.8),
    ]);

    k.add([
        k.text(legalText, {
            font: "mania",
            size: 18,
            width: k.width() - 100,
            align: "center",
            lineSpacing: 8,
        }),
        k.pos(k.center().x, k.height() - 100),
        k.anchor("center"),
        k.color(200, 200, 200),
    ]);

    k.add([
        k.text("Press Space/Click to Continue", {
            font: "mania",
            size: 24,
        }),
        k.anchor("center"),
        k.pos(k.center().x, k.height() - 240),
        k.color(255, 255, 0),
    ]);

    const startMainMenu = () => k.go("main-menu");

    k.onButtonPress("jump", startMainMenu);
    k.onClick(startMainMenu);

    k.onUpdate(() => {
        bgPieces[0].move(-50, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }
    });
}
