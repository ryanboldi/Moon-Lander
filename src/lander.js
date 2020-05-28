class Lander {
    constructor() {
        this.body = Bodies.trapezoid(landerWidth, landerWidth/4, landerWidth/5, landerWidth/6, -0.5,
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