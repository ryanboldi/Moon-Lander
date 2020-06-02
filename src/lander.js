class Lander {
    constructor() {
        this.body = Bodies.trapezoid(400, 100, landerWidth, landerWidth / 1.5, -0.5,
            {
                label: "lander"
            });
        this.rayLength = 100;
    }

    update(ground) {
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

        let rayValues = [];
        //raycast all the rays, get their collisions
        for (let i = 0; i < this.rays.length; i++) {
            console.log(ground)
            let start = { x: this.ray_x, y: this.ray_y }
            let end = { x: this.rays[i].x + this.ray_x, y: this.rays[i].y + this.ray_y }
            //console.log(start, end);
            let col = raycast([ground], start, end, true);
            rayValues.push(col);
        }

        let eyeCols = []
        //rayValues is an array of arrays. rayValue[i] is the ith eyes' colisions, and rayvalue[i][j] is the ith eye's jth colision.
        //get closest collision of all eyes, and store that as the only colision
        for (let i = 0; i < rayValues.length; i++) {
            if (typeof(rayValues[0][0]) != "undefined") {
                eyeCols.push(rayValues[0][0].point);
            } else{
                eyeCols.push(0);
            }
        }

        console.log(eyeCols);
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