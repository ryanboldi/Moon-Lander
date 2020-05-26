class Lander {
    constructor() {
        this.body = Bodies.trapezoid(400, 100, 45, 30, -0.5,
            {
                label: "lander"
            });
    }

    draw() {
        //draw the lander
        fill(255);
        beginShape();
        this.body.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);
    }
}