var ga = require('./GeneticController'),
	config = require('./config');

var i;
ga.importData(config.size).initPop(config.popSize, config.size);
for (i = 0; i < config.generations; i++) {
	ga.tournament(config.popSize, config.poolSize).genNewPop(config.popSize, config.crossoverProb, config.mutationProb, config.size);
}

//Print result
for (i = 0; i < config.popSize; i++) {
	// console.log('f: ' + ga.pop[i].f);
}
