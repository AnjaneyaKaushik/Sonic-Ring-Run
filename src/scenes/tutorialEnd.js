import k from "../kaplayCtx";

export default function tutorialEnd() {
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

    k.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0, 0.5),
        k.fixed(),
    ]);

    k.add([
        k.text("TUTORIAL COMPLETE!", { font: "mania", size: 96 }),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 100),
        k.color(255, 215, 0), // Gold
    ]);

    k.add([
        k.text("YOU ARE NOW READY TO RUN!", { font: "mania", size: 32 }),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y),
    ]);

    const continueBtn = k.add([
        k.rect(400, 80, { radius: 8 }),
        k.pos(k.center().x, k.center().y + 150),
        k.color(34, 197, 94),
        k.outline(4, k.WHITE),
        k.anchor("center"),
        k.area(),
    ]);

    continueBtn.add([
        k.text("GO TO MENU", { font: "mania", size: 32 }),
        k.anchor("center"),
    ]);

    const goToMenu = () => {
        k.setData("tutorial-completed", true);
        k.go("main-menu");
    };

    continueBtn.onClick(goToMenu);
    k.onButtonPress("jump", goToMenu);

    continueBtn.onHoverUpdate(() => {
        continueBtn.scale = k.vec2(1.1);
        k.setCursor("pointer");
    });
    continueBtn.onHoverEnd(() => {
        continueBtn.scale = k.vec2(1);
        k.setCursor("default");
    });

    k.onUpdate(() => {
        bgPieces[0].move(-100, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }
    });
}
