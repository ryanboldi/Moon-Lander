const WIDTH = 800,
    HEIGHT = 600,
    groundFrac = 6, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 12, // good to make width divisble by this.
    groundHeightVariance = 100; //(-variance -> variance)

const landerWidth = 15;
const landerRotAngle = 0.01; // radians per frame
const landerBoosterStrength = 0.00001

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

    let left = 0
    let right = 0
    let up = 0
    //TEMP TESTING
    if (keyIsDown(LEFT_ARROW)){
        left = 1
    }
    if (keyIsDown(RIGHT_ARROW)){
        right = 1
    }
    if (keyIsDown(UP_ARROW)){
        up = 1
    }
    m.landers[0].Move([left, right, up])
}

function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

