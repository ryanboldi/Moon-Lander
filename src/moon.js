class Moon {
    constructor(genomeArray) {
        noiseSeed(random(0,10));
        this.engine = Engine.create();
        this.landers = [];
        for (let i = 0; i < genomeArray.length; i++){
            this.landers.push(new Lander(genomeArray[i], this.engine));
        }
        //console.log(this.landers);

        this.generate();
        if (this.ground.parts.length <= 3){
            noiseSeed(random(0,10));
            this.ground = {}
            this.generate();
        }


        let bodies = [this.ground];
        //console.log(this.engine);
        this.engine.world.gravity.y = moonGravity;
        World.add(this.engine.world, bodies);
        Engine.run(this.engine);
    }

    update() {
        this.landers.forEach(l => l.update(this.ground));
        //Engine.update(this.engine, 0.0001);
    }

    draw() {
        noStroke();
        fill(255);
        //we don't wanna draw things recursivley, so we only draw things that have one
        this.ground.parts.forEach(p => {
            if (p.parts.length == 1) {
                beginShape();

                p.vertices.forEach(v => {
                    vertex(v.x, v.y);
                });
                endShape(CLOSE);
            }
        });
        this.landers.forEach(l => l.draw());
    }

    checkAlive(){
        let alive = false;
        this.landers.forEach(l => {
            if (l.alive){
                alive = true;
            }
        });
        if(!alive){
            //console.log("ALL DIED");
            endEvaluation();
        }
    }

    Evaluate(){
        this.landers.forEach(l => l.Evaluate(this.ground));
        //this.landers.forEach(l => console.log(l.brain.score));
    }
    

    generate(){
        //let vertices = [{ x: -20, y: HEIGHT + 20 }];//STARTING VERTEX INCLUDED (slightly offscreen)
        let vertices = [{ x: -10, y: HEIGHT }];

        let y = HEIGHT
        let x = -10;
        for (let i = 0; i < groundSections + 1; i += 1) {
            x = (i * (WIDTH / groundSections));
            if ((HEIGHT - y) > 100) y = normalise(noise(x), 0, 1, y - groundHeightVariance, y + groundHeightVariance);
            else y = normalise(noise(x), 0, 1, y - groundHeightVariance, y);
            vertices.push({ x: x, y: y });
        }

        vertices.push({ x: WIDTH + 10, y: HEIGHT });//ENDING VERTEX INCLUDED (offscreen on other side)

        //let pos = Matter.Vertices.centre(vertices);

        this.ground = Bodies.fromVertices(Matter.Vertices.centre(vertices).x, Matter.Vertices.centre(vertices).y, vertices, { isStatic: true, label: 'ground', restitution: bounce});


        //find difference from ground's first vertex and 0
        let difX = (this.ground.bounds.min.x - vertices[0].x); // need to move this much to the left.
        //console.log(difX);
        let difY = (this.ground.bounds.max.y - vertices[0].y); //need to move this much down
        //console.log(difY);

        //let newPos = Matter.Vertices.centre(Matter.Vertices.hull(this.ground.vertices));

        Matter.Body.translate(this.ground, { x: -difX, y: -difY });
        //Matter.Body.setVertices(this.ground, vertices
    }
}