class Lander {
    constructor(genome) {
        this.body = Bodies.trapezoid(100, 100, 150, 100, -0.5,
            {
                label: "lander"
            });

    }

    draw(engine) {
        console.log(this.body);

        //draw the lander
        fill(255);
        beginShape();
        lander.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);
    }
}