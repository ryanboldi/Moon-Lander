const WIDTH = 800,
    HEIGHT = 600,
    groundFrac = 5, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 10, // good to make width divisble by this.
    groundHeightVariance = 100; //(-variance -> variance)

groundHeight = HEIGHT - Math.floor(HEIGHT / (groundFrac)); // actual height of the ground coordniate wise


function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(140);
    generateMap();
}

function draw() {}


function generateMap() {
    stroke(0);
    strokeWeight(3);

    beginShape();
    vertex(0, HEIGHT);
    for (let i = 0; i < groundSections; i += 1) {
        x = (i * (WIDTH / groundSections));
        vertex(x, normalise(noise(x), 0, 1, groundHeight - groundHeightVariance, groundHeight + groundHeightVariance));
    }
    vertex(WIDTH, groundHeight);
    vertex(WIDTH, HEIGHT);
    endShape();
}

function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}