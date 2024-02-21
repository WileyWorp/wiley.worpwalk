import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";


// Initialize Game

kaboom();

kaboom({
    maxFPS: 60,
    width: window.innerWidth,
    height: window.innerHeight,
    font: "sans-serif",
    canvas: document.querySelector("#mycanvas"),
    background: [200,200,200],
})


if (!localStorage.pastHighScore) {
    localStorage.setItem("pastHighScore", 0)
}

scene("game", () => {
setGravity(2000);
var MOVE_SPEED = 500;
const JUMP_FORCE = 900;

var moveObstacles = true;

// localStorage

// Load Sprites
loadSprite("player", "sprites/player.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
      run: { from: 0, to: 1, to: 2, to: 3},
    },
  });

loadSprite("fish", "sprites/fish.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
        left: { from: 0, to: 1}
    }
});

loadSprite("cancer", "sprites/cancer.png", {
    sliceX: 3,
    sliceY: 1,
    anims: {
        left: { from: 0, to: 1, to: 2}
    }
});

// Player Object
const player = add([
    sprite("player", {
        animSpeed: .6,
      }),
    
    pos(100, 100),
    area(),
    body(),
    z(2),
    scale(2),
    anchor("center"),
"player",
    {
        dead: false,
    },
])
setInterval(() => {
    player.play("run");
  }, 600);

// movement
onKeyPress("up", () => {
    if (player.isGrounded() && player.dead === false) {
    player.jump(JUMP_FORCE, 0)
    }
})

// Floor
const floor = add([
    rect(window.innerWidth, 300),
    color(100,100,100),
    pos(0, window.innerHeight*.77),
    area(),
    z(0),
    scale(2),
    "floor",
    body({ isStatic: true })
])

// obstacles
setInterval(function () {
    const fish = add([
        sprite("fish", {
            animSpeed: .5,
            frame: 0
        }),
        pos(window.innerWidth, window.innerHeight*.70),
        area(),
        body({ isStatic: false }),
        offscreen({ destroy: true }),
        scale(1.5),
        "obstacle"
    ]);

    setInterval(function () {
        fish.play("left");
    }, 1000)
}, 4000);

setInterval(function () {
    const cancer = add([
        sprite("cancer", {
            animSpeed: .75,
            frame: 0
        }),
        pos(window.innerWidth, window.innerHeight*.70),
        area(),
        body({ isStatic: false }),
        offscreen({ destroy: true }),
        scale(1.5),
        "obstacle"
    ]);

    setInterval(function () {
        cancer.play("left");
    }, 750)
}, 2000);

onUpdate("obstacle", (obstacle) => {
    if (moveObstacles === true)
    obstacle.move(-MOVE_SPEED, 0)
})


player.onCollide("obstacle", () => {
    MOVE_SPEED = 0; 
    player.dead = true;
    shake(2)
    add([
        text("Press space to restart"),
        pos(window.innerWidth*.40, window.innerHeight*.40),
    ])
    onKeyPress("space", () => go("game"));

});

let score = 0;
let pastHighScore = localStorage.getItem("pastHighScore");

const scoreLabel = add([
    text(score),
    pos(24, 24)
]);

const pastHighScoreLabel = add([
    text(pastHighScore),
    pos(24, 100)
]);

onUpdate(() => {
    if (player.dead === false) {
        score++;
    } else if (score > pastHighScore) {
        localStorage.setItem("pastHighScore", score)
    }
    scoreLabel.text = "Score: " + score;
    pastHighScoreLabel.text = "Past high score: " + pastHighScore;
});

});

// game over
scene("lose", () => {

});

go("game");
