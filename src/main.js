const WIDTH = 1000,
    HEIGHT = 800,
    groundFrac = 6, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 12, // good to make width divisble by this.
    groundHeightVariance = 170; //(-variance -> variance)

const landerWidth = 30;
const footWidth = 0.1; //* landerWidth
const landerRotAngle = 0.01; // radians per frame
const landerBoosterStrength = 0.000275 //* lander mass
const moonGravity = 0.3;

let rayCount = 9;
let angleToCover = Math.PI / 2;
let rayDif = angleToCover / rayCount;
let startAngle = (Math.PI - angleToCover) / 2;

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
    if (keyIsDown(DOWN_ARROW)){
        noLoop();
    }
    m.landers[0].Move([left, right, up])
}

function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

