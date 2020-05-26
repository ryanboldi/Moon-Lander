class Moon {
    constructor() {
        this.engine = Engine.create();
        this.landers = [new Lander()];
        this.ground = Bodies.trapezoid(400, 400, 150, 100, -0.5,
            {
                isStatic: true,
                label: "ground"
            });

        let bodies = [this.ground];
        this.landers.forEach(l => bodies.push(l.body));

        World.add(this.engine.world, bodies);
        this.engine.world.gravity = 1;
    }

    draw() {
        let ground;
        //find the object reffering to ground
        Composite.allBodies(this.engine.world).forEach(b => {
            if (b.label == "ground"){
                ground = b;
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


        //console.log(this.ground);
        //this.landers.forEach(l => l.draw());
    }
}