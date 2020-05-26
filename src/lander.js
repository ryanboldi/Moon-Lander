class Lander {
    constructor(genome) {
        this.body = Bodies.trapezoid(400, 400, 150, 100, -0.5,
            {
                label: "lander"
            });

    }

    draw() {
        console.log(this.body);
    }
}