class Lander {
    constructor(genome) {
        this.body = Bodies.circle(50, 50, 10);
    }

    draw(){
        console.log(this.body);
    }
}