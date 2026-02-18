import k from "../kaplayCtx";

export default function legal() {
    const bgPieceWidth = 1920;
    const bgPieces = [
        k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.4)]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(1920, 0),
            k.scale(2),
            k.opacity(0.4),
        ]),
    ];

    const legalText = `
    NOT AFFILIATED WITH THE SONIC THE HEDGEHOG FRANCHISE.

    SONIC THE HEDGEHOG IS A PROPERTY OF SEGA.

    CREDITS TO SEGA AND CRUSH 40 FOR MUSIC.

    MADE FROM ASSETS FROM SONIC MANIA.

    THIS IS A FAN GAME/PARODY.

    THE PROLOGUE STORY IS NOT TAKEN FROM THE GAMES.
  `;

    k.add([
        k.rect(k.width() - 200, k.height() - 200, { radius: 16 }),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(0, 0, 0, 0.9),
        k.outline(6, k.WHITE),
    ]);

    k.add([
        k.text("LEGAL DISCLAIMER", { font: "mania", size: 64 }),
        k.pos(k.center().x, k.center().y - 300),
        k.anchor("center"),
        k.color(255, 215, 0), // Gold
    ]);

    k.add([
        k.text(legalText, {
            font: "mania",
            size: 32,
            width: k.width() - 300,
            align: "center",
            lineSpacing: 15,
        }),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    const backBtn = k.add([
        k.rect(300, 70, { radius: 8 }),
        k.pos(k.center().x, k.center().y + 320),
        k.color(239, 68, 68), // Red
        k.outline(4, k.WHITE),
        k.anchor("center"),
        k.area({ scale: 1.5 }),
        "button",
        { action: () => k.go("main-menu") }
    ]);

    backBtn.add([
        k.text("BACK", { font: "mania", size: 32 }),
        k.anchor("center"),
    ]);

    const goBack = () => k.go("main-menu");

    backBtn.onClick(goBack);
    k.onButtonPress("jump", goBack);

    backBtn.onHoverUpdate(() => {
        backBtn.scale = k.vec2(1.1);
        k.setCursor("pointer");
    });
    backBtn.onHoverEnd(() => {
        backBtn.scale = k.vec2(1);
        k.setCursor("default");
    });

    // Unified Mobile/Desktop Button Handler
    k.onMousePress("left", () => {
        const mpos = k.mousePos();
        k.get("button").forEach((btn) => {
            if (btn.hasPoint(mpos) && btn.action) {
                btn.action();
            }
        });
    });

    k.onUpdate(() => {
        bgPieces[0].move(-50, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }
    });
}
