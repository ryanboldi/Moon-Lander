class Moon {
    constructor() {
        this.engine = Engine.create();
        this.landers = [new Lander()];

        let vertices = [];

        let y = groundHeight
        let x = -10;
        for (let i = 0; i < groundSections; i += 1) {
            x = (i * (WIDTH / groundSections));
            y = normalise(noise(x), 0, 1, y - groundHeightVariance, y + groundHeightVariance);
            vertices.push({ x: x, y: y });
        }

        console.log(vertices);

        this.ground = Matter.Body.create({
            position: Matter.Vertices.centre(vertices),
            vertices: vertices,
            isStatic: true,
            label: "ground"
        });

        let bodies = [this.ground];
        this.landers.forEach(l => bodies.push(l.body));

        World.add(this.engine.world, [this.ground]);
        this.engine.world.gravity = 1;
        Engine.run(this.engine)
    }

    draw() {
        let ground;
        let lander;
        //find the object reffering to ground
        Composite.allBodies(this.engine.world).forEach(b => {
            if (b.label == "ground") {
                ground = b;
            }
            else if (b.label == "lander") {
                lander = b;
            }
        })
        console.log(ground);
        //drawing the moon's surface
        fill(255);
        beginShape();
        ground.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);

        //this.landers.forEach(l => l.draw(this.engine));
    }
}