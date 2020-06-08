class Lander {
    constructor(genome, engine) {
        this.brain = genome;
        this.body = Bodies.trapezoid(random(200, 400), 50, landerWidth, landerWidth / 1.5, -0.5,
            {
                label: "lander"
            });
        this.drawEyes = false;

        this.footWidth = footWidth * landerWidth;
        this.rayLength = 300;

        this.foot1 = Bodies.rectangle(this.body.position.x - (landerWidth / 2.5), this.body.position.y + (landerWidth / (1.5 * 2)) + (this.footWidth), this.footWidth, this.footWidth * 2);
        this.foot2 = Bodies.rectangle(this.body.position.x + (landerWidth / 2.5), this.body.position.y + (landerWidth / (1.5 * 2)) + (this.footWidth), this.footWidth, this.footWidth * 2);

        this.L = Matter.Body.create({ restitution: 0.5 });
        this.L.collisionFilter.group = -1;

        Matter.Body.setParts(this.L, [this.body, this.foot1, this.foot2]);

        //let bodies = [this.body, this.foot1, this.foot1Conn, this.foot2, this.foot2Conn]

        let bodies = [this.L]

        World.add(engine.world, bodies);

        Matter.Body.applyForce(this.L, this.body.position, { x: random(-0.005, 0.005), y: 0 })

        this.alive = true;
        this.touchdown = false;
        this.groundAngle = Math.PI;
        this.fitness = 0;
    }

    update(ground) {
        //----------CHECKS FOR DEATH
        //if the lander's body hits any part of the ground:
        for (let i = 1; i < ground.parts.length; i++) {
            if (Matter.SAT.collides(ground.parts[i], this.body).collided) {
                this.alive = false;
            }
        }

        //if creature leaves bounds, it dies
        if (this.body.bounds.max.x > WIDTH || this.body.bounds.min.x < 0) {
            this.alive = false;
        }
        if (this.body.bounds.max.y > HEIGHT || this.body.bounds.min.y < 0) {
            this.alive = false;
        }

        //-----------------------------------------------------------
        //gets sight of creature
        this.ray_x = this.body.position.x
        this.ray_y = this.body.position.y


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
                    if (dist < closestDist) {
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

        //if touchdown == false - > check if lander touches floor with feet for the first time and is still alive, touchdown = true
        //if touchdown just turned true, get angle between ground and floor and store it for fitness evaluation


        if (this.touchdown == false) {
            if (this.alive) {
                //check for touchdown (one or both feet colided)
                let f1 = false;
                let f2 = false;
                for (let i = 1; i < ground.parts.length; i++) {
                    if (Matter.SAT.collides(ground.parts[i], this.foot1).collided) {
                        f1 = true;
                    } if (Matter.SAT.collides(ground.parts[i], this.foot2).collided) {
                        f2 = true;
                    }
                }

                if (f1 || f2) {
                    this.touchdown = true;
                    //try to find angle of the ground directly underneath the player. 
                    //send a raycast straight down, and find the normal of the closest colision

                    let normalRayEnd = { x: this.ray_x, y: HEIGHT }
                    let normalRayStart = { x: this.ray_x, y: this.ray_y }
                    let normalRay = raycast(ground.parts, normalRayStart, normalRayEnd, true);

                    //stroke(255);
                    //line(normalRayStart.x, normalRayStart.y, normalRayEnd.x, normalRayEnd.y); 
                    //closest collision's normal vector
                    let groundNorm;
                    if (normalRay[0]) {
                        groundNorm = (normalRay[0].normal);
                    } else {
                        groundNorm = { x: 0, y: 0 }
                    };
                    //make normal vector, rotate by 90
                    let dir = createVector(groundNorm.x, groundNorm.y).heading() + Math.PI / 2;
                    //get difference between ground heading and lander angle
                    //console.log(`Dif between ground and lander: ${Math.abs(dir - this.L.angle)}`)

                    this.groundAngle = Math.abs(dir - this.L.angle);
                }
            }
        }
        //get inputs
        let inputs = deepcopy(this.sight);
        inputs.push(map(this.L.velocity.x, -5, 5, -1, 1));
        inputs.push(map(this.L.velocity.y, -5, 5, -1, 1));
        inputs.push(map(this.L.position.x, 0, WIDTH, -1, 1));
        inputs.push(map(this.L.position.y, 0, HEIGHT, -1, 1));

        let outputs = this.brain.activate(inputs);
        this.Move(outputs);
    }

    //CALL THIS WHEN THE EVALUATION PERIOD IS FINISHED, WILL SET THIS.BRAIN.SCORE
    Evaluate(ground) {
        //when time elapsed happens, if lander has both feet on the ground and is still alive, fitness = 10
        // if lander has died or is still in the air when the time elapsed happens, fitness = PI - this.groundAngle
        let f1 = false;
        let f2 = false;
        for (let i = 1; i < ground.parts.length; i++) {
            if (Matter.SAT.collides(ground.parts[i], this.foot1).collided) {
                f1 = true;
            } if (Matter.SAT.collides(ground.parts[i], this.foot2).collided) {
                f2 = true;
            }
        }

        //console.log(`f1: ${f1}, f2: ${f2}`);
        if (this.alive && f1 && f2) {
            //alive and landed safetly, fitness = 10;
            this.brain.score = 10;
        } else if (this.alive && !(f1 && f2)) {
            //alive but hasn't landed fully
            this.brain.score = Math.PI - this.groundAngle;
        } else if (!this.alive) {
            //died (crashed)
            this.brain.score = Math.PI - this.groundAngle;
        } else {
            //this shouldn't happen, but just in case
            this.brain.score = Math.PI - this.groundAngle;
        }

        this.fitness = this.brain.score;
        //console.log(this.brain.score);
    }

    fitness() {
        return this.fitness
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
            if (this.alive) {
                fill(255, 165, 0);
                noStroke();
                push();
                translate(this.body.position.x, this.body.position.y)
                rotate(this.L.angle)
                triangle(-(landerWidth / 5), (landerWidth / (1.5 * 2)), (landerWidth / 5), (landerWidth / (1.5 * 2)), 0, landerWidth);
                pop();
            }
            //x: (landerWidth / 2.5),
            //y: (landerWidth / (1.5 * 2))
            Matter.Body.applyForce(this.L, this.body.position, { x: force.x, y: force.y })
        }
        //console.log(this.body.position)
    }



    draw() {
        if (this.alive) {
            //draw the lander
            if (!this.alive) {
                fill(255, 0, 0);
            } else {
                fill(255);
            }
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
}