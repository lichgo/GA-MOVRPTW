var ga = require('./GeneticController'),
	config = require('./config'),
	excel = require('node-xlsx'),
	fs = require('fs');

var start = new Date();
var i;
ga.importData(config.size).initPop(config.popSize, config.size);
for (i = 0; i < config.generations; i++) {
	ga.tournament(config.popSize, config.poolSize, i + 1).genNewPop(config.popSize, config.crossoverProb, config.mutationProb, config.size);

}
var end = new Date();
console.log((end.getTime() - start.getTime()) / 1);

var	refine = function(data) {
		console.log(data.length);
		//update ranks in pop
		var i,
			j,
			len;
		//Pareto opitimility
		for (i = 0; i < data.length; i++) {
			data[i].push(1);
			for (j = 0; j < data.length; j++) {
				if (i == j) continue;
				if ( data[j][0] <= data[i][0] && data[j][1] <= data[i][1] && data[j][2] <= data[i][2] && data[j][3] <= data[i][3] ) {
					if ( data[j][0] < data[i][0] || data[j][1] < data[i][1] || data[j][2] < data[i][2] || data[j][3] < data[i][3] ) {
						data[i][4]++;
					} else {
						data.splice(j, 1);
						j--;
					}
				}
			}
		}

		//sort
		data.sortObject('4');
		console.log(data.length);
		//remove those ranked over 1
		for (i = 0, len = data.length; i < len; i++) {
			if (data[i][4] > 1) {
				data.splice(i, len);
				break;
			}
		}
		console.log(data.length);
		console.log(data);
	};

// var data = [];
// console.log(ga.toExcel.length);
// for (i = 0; i < config.popSize; i++) {
	// data.push(ga.pop[i].f);
	// data.push(ga.toExcel[i].concat([
	// 	ga.toExcel[i][1] / ga.objMax[0],
	// 	ga.toExcel[i][2] / ga.objMax[1],
	// 	ga.toExcel[i][3] / ga.objMax[2],
	// 	ga.toExcel[i][4] / ga.objMax[3]
	// ]));
// }
// console.log(data);

refine(ga.toExcel);
var xlsx = require('node-xlsx'),
	obj = {
		'name': 'size-20',
		'data': ga.toExcel
	},
	buffer = xlsx.build({ worksheets: [ obj ] });

fs.writeFileSync('Opt-20.xlsx', buffer, 'binary');

// Print result
// for (i = 0; i < config.popSize; i++) {
// 	console.log(ga.pop[i].c, ga.pop[i].f, ga.pop[i].rank);
// }

// ga.calFitness(ga.pop[--i].c, true);
