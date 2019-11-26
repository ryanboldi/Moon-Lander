const WIDTH = 800,
    HEIGHT = 600,
    groundFrac = 5, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 8, // good to make width divisble by this.
    groundHeightVariance = 60; //(-variance -> variance)

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
    let oldY = 0;
    let nextY = random(-groundHeightVariance, groundHeightVariance);

    for (let i = 0; i < groundSections; i += 1) {
        x = (i * (WIDTH / groundSections));
        nextX = ((i + 1) * (WIDTH / groundSections));
        line(x, groundHeight + oldY, nextX, groundHeight +  nextY);
        oldY = nextY;
        nextY = random(-groundHeightVariance,groundHeightVariance);
            //loops through x coord of all the ground sections
    }

    line(0, groundHeight, WIDTH, groundHeight);
}