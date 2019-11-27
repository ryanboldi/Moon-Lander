const WIDTH = 800,
    HEIGHT = 600,
    groundFrac = 5, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 10, // good to make width divisble by this.
    groundHeightVariance = 50; //(-variance -> variance)

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
    let oldY = random(-groundHeightVariance, groundHeightVariance);

    vertex(0, HEIGHT);


    for (let i = 0; i < groundSections; i += 1) {

        x = (i * (WIDTH / groundSections));
        vertex(x, groundHeight + oldY);
        if (oldY > 0) {
            oldY = (random(-groundHeightVariance * 0.5, groundHeightVariance));
        } else if (oldY < 0) {
            oldY = (random(-groundHeightVariance, groundHeightVariance * 0.5));
        }
    }
    vertex(WIDTH, groundHeight);
    vertex(WIDTH, HEIGHT);
    endShape();
}

//FUNCTIONS FOR PERLIN NOISE

function fade(t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

function grad() {
    if (random(0, 1) > 0.5) {
        return 1
    } else {
        return -1
    }
}

function noise(p) {
    let p0 = floor(p)
    let p1 = p0 + 1;

    let t = p - p0;
    let fade_t = fade(t);

    let g0 = grad(p0);
    let g1 = grad(p1);

    return (1 - fade_t) * g0 * (p - p0) + fade_t * g1 * (p - p1);
}