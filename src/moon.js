class Moon {
    constructor() {
        this.engine = Engine.create();
        this.landers = [new Lander()];

        let vertices = [{ x: -20, y: HEIGHT + 20 }];//STARTING VERTEX INCLUDED (slightly offscreen)

        let y = groundHeight
        let x = -20;
        for (let i = 0; i < groundSections + 1; i += 1) {
            x = (i * (WIDTH / groundSections));
            y = normalise(noise(x), 0, 1, y - groundHeightVariance, y + groundHeightVariance);
            vertices.push({ x: x, y: y });
        }

        vertices.push({ x: WIDTH + 20, y: HEIGHT + 20 });//ENDING VERTEX INCLUDED (offscreen on other side)

        console.log(vertices);

        this.ground = Matter.Body.create({
            position: Matter.Vertices.centre(vertices), //MAKES SURE THAT THE COORDS ARE ABSOLUTE RATHER THAN RELATIVE
            vertices: vertices,
            isStatic: true,
            label: "ground"
        });

        let bodies = [this.ground];
        this.landers.forEach(l => bodies.push(l.body));

        World.add(this.engine.world, bodies);
        Engine.run(this.engine)
    }

    draw() {
        fill(255);
        beginShape();
        this.ground.vertices.forEach(v => {
            vertex(v.x, v.y);
        });
        endShape(CLOSE);

        this.landers.forEach(l => l.draw());
    }
}