const WIDTH = 800,
    HEIGHT = 600,
    groundFrac = 6, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 12, // good to make width divisble by this.
    groundHeightVariance = 100; //(-variance -> variance)

const landerWidth = 15;

let Engine = Matter.Engine,
    World = Matter.World,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies


let groundHeight = HEIGHT - Math.floor(HEIGHT / (groundFrac)); // actual height of the ground coordinate wise

let m;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    m = new Moon();
}

function draw() {
    background(140);
    m.update();
    m.draw();
}

function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}