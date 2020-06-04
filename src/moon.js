class Moon {
    constructor() {
        this.engine = Engine.create();
        this.landers = [new Lander(this.engine)];

        //let vertices = [{ x: -20, y: HEIGHT + 20 }];//STARTING VERTEX INCLUDED (slightly offscreen)
        let vertices = [{ x: -10, y: HEIGHT }]

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

        this.ground = Bodies.fromVertices(Matter.Vertices.centre(vertices).x, Matter.Vertices.centre(vertices).y, vertices, { isStatic: true, label: 'ground', restitution: 1});


        //find difference from ground's first vertex and 0
        let difX = (this.ground.bounds.min.x - vertices[0].x); // need to move this much to the left.
        //console.log(difX);
        let difY = (this.ground.bounds.max.y - vertices[0].y); //need to move this much down
        //console.log(difY);

        //let newPos = Matter.Vertices.centre(Matter.Vertices.hull(this.ground.vertices));

        Matter.Body.translate(this.ground, { x: -difX, y: -difY });
        //Matter.Body.setVertices(this.ground, vertices)


        let bodies = [this.ground];


        this.engine.world.gravity.y = moonGravity;
        World.add(this.engine.world, bodies);
        Engine.run(this.engine);
    }

    update() {
        this.landers.forEach(l => l.update(this.ground))
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
}