class Lander {
    constructor() {
        this.body = Bodies.trapezoid(400, 100, landerWidth, landerWidth / 1.5, -0.5,
            {
                label: "lander"
            });
        this.rayLength = 100;
    }

    update() {
        this.ray_x = this.body.position.x
        this.ray_y = this.body.position.y

        let rayCount = 9;
        let angleToCover = Math.PI / 2;
        let rayDif = angleToCover / 9;
        let startAngle = (Math.PI - angleToCover) / 2;

        this.rays = [];

        for (let i = 0; i < rayCount; i++) {
            let ray = createVector(-this.rayLength, 0);
            this.rays[i] = ray.rotate(this.body.angle - startAngle - (rayDif * i));
        }
        //this.ray = ray.rotate(this.body.angle);
        //console.log(ray);
    }

    draw() {
        //draw the lander
        fill(255);
        beginShape();
        this.body.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);

        //draw rays
        stroke(0);
        for (let i = 0; i < this.rays.length; i++) {
            line(this.ray_x, this.ray_y, this.ray_x + this.rays[i].x, this.ray_y + this.rays[i].y);
        }
    }
}