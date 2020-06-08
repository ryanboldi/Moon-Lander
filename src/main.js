const WIDTH = 1000,
    HEIGHT = 800,
    groundFrac = 6, //1/groundfrac is how much the ground takes up of the screen (5 -> 1/5)
    groundSections = 12, // good to make width divisble by this.
    groundHeightVariance = 170; //(-variance -> variance)

const landerWidth = 30;
const footWidth = 0.15; //* landerWidth
const landerRotAngle = 0.01; // radians per frame
const landerBoosterStrength = 0.000275 //* lander mass
//const landerBoosterStrength = 1;
const moonGravity = 0.3;

let framecount = 0;

const drawEyes = false;

let rayCount = 18;
let rayLength = 600;
let angleToCover = Math.PI / 2;
let rayDif = angleToCover / rayCount;
let startAngle = (Math.PI - angleToCover) / 2;

let Engine = Matter.Engine,
    World = Matter.World,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies

let groundHeight = HEIGHT - Math.floor(HEIGHT / (groundFrac)); // actual height of the ground coordinate wise

let m;

let training = true;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    //m = new Moon();
    initNeat();
    startEvaluation();
}

function draw() {
    if (training) {
        for (let i = 0; i < 1; i++) {
            timeStep(false);
        }
    }

    if (frameCount == 1000) {
        training = false;
    }

    if (!training) {
        timeStep(false)
    }

    //timeStep(true);

    //global framecount
    //if (frameCount > 5000){
    //  timeStep(false);
    //}else{
    //  for (let i = 0; i < 100; i ++){
    //    timeStep(true);
    //}
    //}

    // let left = 0
    // let right = 0
    // let up = 0
    // //TEMP TESTING
    // if (keyIsDown(LEFT_ARROW)){
    //     left = 1
    // }
    // if (keyIsDown(RIGHT_ARROW)){
    //     right = 1
    // }
    // if (keyIsDown(UP_ARROW)){
    //     up = 1
    // }
    // if (keyIsDown(DOWN_ARROW)){
    //     noLoop();
    // }
    // m.landers[0].Move([left, right, up]);
}

function timeStep(pb = true) {
    background(140);
    m.update();
    if (pb == false) {
        m.draw();
    }
    m.checkAlive();

    if (framecount == ITERATIONS) {
        console.log("RAN OUT OF TIME");
        endEvaluation();
    }
    framecount++;
}

function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}