let Neat = neataptic.Neat;
let Methods = neataptic.Methods;
let Config  = neataptic.Config;
let Architect = neataptic.Architect;

//turn off warnings
Config.warnings = false;

let PLAYER_AMOUNT = 30;
let ITERATIONS = 500;
let MUTATION_RATE = 0.3;
let ELITISM = Math.round(0.1 * PLAYER_AMOUNT);

let neat;

function initNeat(){
    neat = new Neat(
        rayCount + 2, 3,
        null,
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
    m = new Moon(neat.population);
    players = [];

    highestScore = 0;



}