class Lander {
    constructor(engine) {
        this.body = Bodies.trapezoid(random(200, 400), 50, landerWidth, landerWidth / 1.5, -0.5,
            {
                label: "lander"
            });

        this.drawEyes = true;

        this.footWidth = footWidth * landerWidth;
        this.rayLength = 300;

        this.foot1 = Bodies.rectangle(this.body.position.x - (landerWidth / 2.5), this.body.position.y + (landerWidth / (1.5 * 2)) + (this.footWidth), this.footWidth, this.footWidth * 2);
        this.foot2 = Bodies.rectangle(this.body.position.x + (landerWidth / 2.5), this.body.position.y + (landerWidth / (1.5 * 2)) + (this.footWidth), this.footWidth, this.footWidth * 2);

        this.L = Matter.Body.create({ restitution: 0.5 });

        Matter.Body.setParts(this.L, [this.body, this.foot1, this.foot2]);

        //let bodies = [this.body, this.foot1, this.foot1Conn, this.foot2, this.foot2Conn]

        let bodies = [this.L]

        World.add(engine.world, bodies);
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
            this.rays[i] = ray.rotate(this.L.angle - startAngle - (rayDif * i));
        }

        let rayValues = [];
        //raycast all the rays, get their collisions
        for (let i = 0; i < this.rays.length; i++) {
            //console.log(ground)
            let start = { x: this.ray_x, y: this.ray_y }
            let end = { x: this.rays[i].x + this.ray_x, y: this.rays[i].y + this.ray_y }
            //console.log(start, end);
            let col = raycast(ground.parts, start, end, true);
            console.log(i)
            console.log(col);
            rayValues.push(col);
        }

        let eyeCols = []
        //rayValues is an array of arrays. rayValue[i] is the ith eyes' colisions, and rayvalue[i][j] is the ith eye's jth colision.
        //get closest collision of all eyes, and store that as the only colision
        for (let i = 0; i < rayValues.length; i++) {
            if (typeof (rayValues[i][0]) != "undefined") {
                let closest = 0;
                let closestDist = float("Infinity");
                //console.log(`how many collisions: ${rayValues[i].length}`)
                for (let j = 0; j < rayValues[i].length; j++) {
                    //console.log(`ray ${i}, ${j} -> ${rayValues[i][j].point}`)
                    let dist = Matter.Vector.magnitude(Matter.Vector.create(rayValues[i][j].point.x - this.ray_x, rayValues[i][j].point.y - this.ray_y));
                    //console.log(`dist: ${dist}`);
                    if (dist < closestDist){
                        closest = j;
                        closestDist = dist
                    }
                    //console.log(`closest = ${closest}`)
                }
                eyeCols.push(rayValues[i][closest].point);
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
        this.sight = sight
    }


    //[left prob, right prob, up prob] each between 0-1
    Move(probs) {
        let left = probs[0]
        let right = probs[1]
        let up = probs[2]

        if (left > right && left > 0.5) {
            //rotate counterclockwise
            Matter.Body.rotate(this.L, -landerRotAngle);
        }

        if (right > left && right > 0.5) {
            //rotate clockwise
            Matter.Body.rotate(this.L, landerRotAngle);
        }

        if (up > 0.5) {
            //force up
            stroke(100, 10, 0);
            let force = createVector(-100, 0);
            force.normalize();
            force.mult(landerBoosterStrength * (this.body.mass + (this.foot1.mass * 2))); //make it a specific length
            force.rotate(this.L.angle + (Math.PI / 2));
            //line(this.ray_x, this.ray_y, this.ray_x + force.x, this.ray_y + force.y);
            fill(255, 165, 0);
            noStroke();
            push();
            translate(this.body.position.x, this.body.position.y)
            rotate(this.L.angle)
            triangle(-(landerWidth / 5), (landerWidth / (1.5 * 2)), (landerWidth / 5), (landerWidth / (1.5 * 2)), 0, landerWidth);
            pop();
            //x: (landerWidth / 2.5),
            //y: (landerWidth / (1.5 * 2))
            Matter.Body.applyForce(this.L, this.body.position, { x: force.x, y: force.y })
        }
        //console.log(this.body.position)
    }



    draw() {
        //draw the lander
        fill(255);
        beginShape();
        this.body.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);

        if (this.drawEyes) {
            //draw rays
            stroke(0);
            for (let i = 0; i < this.rays.length; i++) {
                let norm = this.rays[i].normalize();
                norm.mult((1 - this.sight[i]) * this.rayLength);
                //this.sight[i] = map(this.sight[i], 0, 1, 1, 0);

                //let vec = this.rays[i].mult(this.sight[i]) * 100;
                //console.log(vec);
                line(this.ray_x, this.ray_y, this.ray_x + norm.x, this.ray_y + norm.y);
            }
        }
        noStroke();

        fill(255, 0, 0);
        beginShape();
        this.foot1.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);

        fill(255, 0, 0);
        beginShape();
        this.foot2.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);

        // push()
        // translate(this.body.position.x, this.body.position.y);
        // rotate(this.body.angle);

        // console.log(this.foot1Conn)
        // stroke(255, 0, 0);
        // strokeWeight(4);
        // fill(255, 0, 0);
        // point(0 - (landerWidth / 2.5), 0 + (landerWidth / (1.5 * 2)));
        // pop()
    }
}