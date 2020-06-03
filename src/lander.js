class Lander {
    constructor() {
        this.body = Bodies.trapezoid(400, 100, landerWidth, landerWidth / 1.5, -0.5,
            {
                label: "lander"
            });
        this.rayLength = 300;
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
            //console.log(ground)
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
            if (typeof (rayValues[i][0]) != "undefined") {
                eyeCols.push(rayValues[i][0].point);
            } else {
                //eyeCols.push(this.rayLength);
                eyeCols.push({ x: this.rays[i].x + this.ray_x, y: this.rays[i].y + this.ray_y })
            }
        };

        let sight = []
        for (let i = 0; i < eyeCols.length; i++) {
            //get a vector from the center TO THE CLOSEST COLLISION
            let distVec = Matter.Vector.create(eyeCols[i].x - this.ray_x, eyeCols[i].y - this.ray_y);
            //let distVec = Matter.Vector.create(-eyeCols[i].x + this.ray_x, -eyeCols[i].y + this.ray_y); //reverse the distance vector
            sight.push(map(Matter.Vector.magnitude(distVec), 0, this.rayLength, 1, 0)); //length of distanceVec    
        }
        //console.log(sight);
    }


    //[left prob, right prob, up prob] each between 0-1
    Move(probs) {
        let left = probs[0]
        let right = probs[1]
        let up = probs[2]

        if (left > right && left > 0.5) {
            //rotate counterclockwise
            Matter.Body.rotate(this.body, -landerRotAngle);
        }

        if (right > left && right > 0.5) {
            //rotate clockwise
            Matter.Body.rotate(this.body, landerRotAngle);
        }

        if (up > 0.5) {
            //force up
            stroke(100, 10, 0);
            let force = createVector(-100, 0);
            force.normalize();
            force.mult(0.00005); //make it a specific length
            force.rotate(this.body.angle + (Math.PI / 2));
            line(this.ray_x, this.ray_y, this.ray_x + force.x, this.ray_y + force.y);
            Matter.Body.applyForce(this.body, this.body.position, { x: force.x, y: force.y })
        }
        console.log(this.body.position)
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