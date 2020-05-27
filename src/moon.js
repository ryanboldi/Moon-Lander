class Moon {
    constructor() {
        this.engine = Engine.create();
        this.landers = [new Lander()];

        //let vertices = [{ x: -20, y: HEIGHT + 20 }];//STARTING VERTEX INCLUDED (slightly offscreen)
        let vertices = [{ x: 0, y: HEIGHT }]

        let y = groundHeight
        let x = -10;
        for (let i = 0; i < groundSections + 1; i += 1) {
            x = (i * (WIDTH / groundSections));
            if ((HEIGHT - y) > 100) y = normalise(noise(x), 0, 1, y - groundHeightVariance, y + groundHeightVariance);
            else y = normalise(noise(x), 0, 1, y - groundHeightVariance, y);
            vertices.push({ x: x, y: y });
        }

        vertices.push({ x: WIDTH + 10, y: HEIGHT });//ENDING VERTEX INCLUDED (offscreen on other side)
        //vertices = Matter.Vertices.clockwiseSort(vertices);
        let pos = Matter.Vertices.centre(Matter.Vertices.hull(vertices));

        this.ground = Bodies.fromVertices(pos.x, pos.y, vertices, { isStatic: true, label: 'ground', mass: 0 });


        let bodies = [this.ground];
        this.landers.forEach(l => bodies.push(l.body));

        World.add(this.engine.world, bodies);
        Engine.run(this.engine);
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