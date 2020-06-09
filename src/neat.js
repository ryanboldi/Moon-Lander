let Neat = neataptic.Neat;
let Methods = neataptic.Methods;
let Config  = neataptic.Config;
let Architect = neataptic.Architect;

//turn off warnings
Config.warnings = false;

let PLAYER_AMOUNT = 30;
let ITERATIONS = 1000;
let MUTATION_RATE = 0.5;
let ELITISM = Math.round(0.1 * PLAYER_AMOUNT);

let neat;

function initNeat(){
    neat = new Neat(
        rayCount + 4, 3,
        0,
        {
            mutation: [
                Methods.Mutation.ADD_NODE,
                Methods.Mutation.SUB_NODE,
                Methods.Mutation.ADD_CONN,
                Methods.Mutation.SUB_CONN,
                Methods.Mutation.MOD_WEIGHT,
                Methods.Mutation.MOD_BIAS,
                Methods.Mutation.MOD_ACTIVATION,
                Methods.Mutation.ADD_GATE,
                Methods.Mutation.SUB_GATE,
                Methods.Mutation.ADD_SELF_CONN,
                Methods.Mutation.SUB_SELF_CONN,
                Methods.Mutation.ADD_BACK_CONN,
                Methods.Mutation.SUB_BACK_CONN
            ],
            popsize: PLAYER_AMOUNT,
            mutationRate: MUTATION_RATE,
            elitism: ELITISM
        }
    );
}

function startEvaluation(){
    //make a new world
    highestScore = 0;
    m = new Moon(neat.population);
}

function endEvaluation(){
    
    framecount = 0;
    m.Evaluate();
    
    console.log('Generation:', neat.generation, '- average score:', neat.getAverage(), 'Fittest score:', neat.getFittest().score);
    //console.log('Fittest score:', neat.getFittest().score);
    //EVALUATE ALL THE CREATURES --
    //here we need to find the genome.score for every lander based on varius things we've stored during the run
    //-------------------------------
    
    neat.sort();

    let newPopulation = [];

    //elitism
    for (let i = 0; i < neat.elitism; i++){
        newPopulation.push(neat.population[i]);
    }

    //breed new population
    for(let i = 0; i < neat.popsize - neat.elitism; i++){
        newPopulation.push(neat.getOffspring());
    }

    neat.population = newPopulation;
    neat.mutate();
    neat.generation++;

    World.clear(m.engine.world);
    Engine.clear(m.engine);
    m = {};

    startEvaluation();
}