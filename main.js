var ga = require('./GeneticController'),
	config = require('./config'),
	excel = require('node-xlsx'),
	fs = require('fs');

var i;
ga.importData(config.size).initPop(config.popSize, config.size);
for (i = 0; i < config.generations; i++) {
	ga.tournament(config.popSize, config.poolSize, i + 1).genNewPop(config.popSize, config.crossoverProb, config.mutationProb, config.size);

}

// var data = [];
// console.log(ga.toExcel.length);
// for (i = 0; i < ga.toExcel.length; i++) {
// 	data.push(ga.toExcel[i].concat([
// 		ga.toExcel[i][1] / ga.objMax[0],
// 		ga.toExcel[i][2] / ga.objMax[1],
// 		ga.toExcel[i][3] / ga.objMax[2],
// 		ga.toExcel[i][4] / ga.objMax[3]
// 	]));
// }
// console.log(data);

var xlsx = require('node-xlsx'),
	obj = {
		'name': 'size-5',
		'data': ga.toExcel
	},
	buffer = xlsx.build({ worksheets: [ obj ] });

fs.writeFileSync('All-20.xlsx', buffer, 'binary');

// Print result
for (i = 0; i < config.popSize; i++) {
	// console.log(ga.pop[i].c, ga.pop[i].f, ga.pop[i].rank);
}

// ga.calFitness(ga.pop[--i].c, true);
