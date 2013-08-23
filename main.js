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
console.log('CPU(ms): ' + (end.getTime() - start.getTime()) / 1);

var	rankAndUnique = function(data) {
		console.log('Original length: ' + data.length);
		//update ranks in pop
		var i,
			j,
			len;
		//Pareto opitimility
		for (i = 0; i < data.length; i++) {
			data[i].push(1);
			for (j = 0; j < data.length; j++) {
				if (i == j) continue;
				if ( data[j][1] <= data[i][1] && data[j][2] <= data[i][2] && data[j][3] <= data[i][3] && data[j][4] <= data[i][4] ) {
					if ( data[j][1] < data[i][1] || data[j][2] < data[i][2] || data[j][3] < data[i][3] || data[j][4] < data[i][4] ) {
						data[i][5]++;
					} else {
						data.splice(j, 1);
						// console.log('delete: ', data.splice(j, 1));
						j--;
					}
				}
			}
		}
		console.log('Remove duplicate: ' + data.length);
	},
	sortAndTop = function(data) {
		//sort
		data.sortObject('5');
		
		//remove those ranked over 1
		for (i = 0, len = data.length; i < len; i++) {
			if (data[i][5] > 1) {
				data.splice(i, len);
				break;
			}
		}
		console.log('Only rank top: ' + data.length);
	},
	normalize = function(data) {
		var maxs = [0, 0, 0, 0],
			i,
			len = data.length;
		for (i = 0; i < len; i++) {
			if (data[i][1] > maxs[0]) maxs[0] = data[i][1];
			if (data[i][2] > maxs[1]) maxs[1] = data[i][2];
			if (data[i][3] > maxs[2]) maxs[2] = data[i][3];
			if (data[i][4] > maxs[3]) maxs[3] = data[i][4];
		}
		// console.log(maxs);
		for (i = 0; i < len; i++) {
			data[i][1] = Math.round(data[i][1] / maxs[0] * 100) / 100;
			data[i][2] = Math.round(data[i][2] / maxs[1] * 100) / 100;
			data[i][3] = Math.round(data[i][3] / maxs[2] * 100) / 100;
			data[i][4] = Math.round(data[i][4] / maxs[3] * 100) / 100;
		}
	};

rankAndUnique(ga.toExcel);
var xlsx = require('node-xlsx'),
	obj = {
		'name': 'size-20',
		'data': ga.toExcel
	},
	buffer = xlsx.build({ worksheets: [ obj ] });
fs.writeFileSync('./e2/' + config.size + '/' + config.generations + '-' + config.crossoverProb + '.xlsx', buffer, 'binary');

sortAndTop(ga.toExcel);
obj = {
		'name': 'size-20',
		'data': ga.toExcel
	},
buffer = xlsx.build({ worksheets: [ obj ] });
fs.writeFileSync('./e2/' + config.size + '/' + config.generations + '-' + config.crossoverProb + '-refined.xlsx', buffer, 'binary');

normalize(ga.toExcel);
obj = {
		'name': 'size-20',
		'data': ga.toExcel
	},
buffer = xlsx.build({ worksheets: [ obj ] });
fs.writeFileSync('./e2/' + config.size + '/' + config.generations + '-' + config.crossoverProb + '-normalized.xlsx', buffer, 'binary');
