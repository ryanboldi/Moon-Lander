const WIDTH = 800,
    HEIGHT = 600,
    groundFrac = 5, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 15, // good to make width divisble by this.
    groundHeightVariance = 50; //(-variance -> variance)

let Engine = Matter.Engine,
    World = Matter.World,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies

let groundHeight = HEIGHT - Math.floor(HEIGHT / (groundFrac)); // actual height of the ground coordinate wise

let m;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    generateMap();
    m = new Moon();
}

function draw() {
    background(140);
    m.draw();
}


function generateMap() {
    stroke(0);
    strokeWeight(3);

    beginShape();
    vertex(-10, HEIGHT);
    let y = groundHeight
    for (let i = 0; i < groundSections; i += 1) {
        x = (i * (WIDTH / groundSections));
        y = normalise(noise(x), 0, 1, y - groundHeightVariance, y + groundHeightVariance)
        vertex(x, y);
    }
    vertex(WIDTH + 10, groundHeight);
    endShape();
}

function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}