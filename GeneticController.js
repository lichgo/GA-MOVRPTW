var IMPACT = require('./IMPACT'),
	util = require('./util'),
	go = require('./GeneticOperator'),
	dataUtil = require('./data');

module.exports = {
	pop: new Array(),
	pool: new Array(),
	seqLen: 0,
	data: undefined,
	totalWaste: undefined,
	capacity: undefined,

	importData: function(size) {
		this.data = dataUtil.getData(size);
		this.totalWaste = dataUtil.getTotalWaste();
		this.capacity = dataUtil.getCapacity();
		return this;
	},

	initPop: function(popSize, size) {
		var initChromosome = IMPACT.init(),
			ranChromosome = IMPACT.ran(),
			c1,
			c2,
			i = 0;
		this.seqLen = IMPACT.getSeqLen();
		this.pop = [];
		this.pop.push({
			c: initChromosome,
			f: this.calFitness(initChromosome, true)
		});
// console.log(this.pop[0].f);
		this.pop.push({
			c: ranChromosome,
			f: this.calFitness(ranChromosome)
		})
		while (++i < popSize) {
			c1 = copyC(initChromosome),
			c2 = copyC(ranChromosome),
			go.crossover(c1, c2, this.seqLen, size);
			go.mutation(c1, this.seqLen, size);
			go.mutation(c2, this.seqLen, size);

			this.pop.push({
				c: copyC(c1),
				f: this.calFitness(c1)
			});
			if (this.pop.length >= popSize) break;
			this.pop.push({
				c: copyC(c2),
				f: this.calFitness(c2)
			});
		}

		return this;
	},

	sortPop: function() {
		//update ranks in pop
		var i, j;
		//Pareto opitimility
		for (i = 0; i < this.pop.length; i++) {
			this.pop[i].rank = 1;
			for (j = 0; j < this.pop.length; j++) {
				if (this.pop[j].f[0] <= this.pop[i].f[0] &&
					this.pop[j].f[1] <= this.pop[i].f[1] &&
					this.pop[j].f[2] <= this.pop[i].f[2] &&
					this.pop[j].f[3] <= this.pop[i].f[3] &&
						(
							this.pop[j].f[0] < this.pop[i].f[0] ||
							this.pop[j].f[1] < this.pop[i].f[1] ||
							this.pop[j].f[2] < this.pop[i].f[2] ||
							this.pop[j].f[3] < this.pop[i].f[3] 						
						)
					) {
					this.pop[i].rank++;
				}
			}
		}
		this.pop.sortObject('rank');
		return this;
	},

	tournament: function(popSize, poolSize) {
		var eliteRate = 0.4,
			eliteSize = Math.floor(popSize * eliteRate),
			r,
			i;

		this.sortPop();

		this.pool = [];
		for (i = 0; i < poolSize; i++) {
			r = Math.floor(Math.random() * eliteSize);
			this.pool.push(this.pop[r].c);
		}

		return this;
	},

	genNewPop: function(popSize, crossoverProb, mutationProb, size) {
		var newPop = [],
			ran1,
			ran2,
			poolSize = this.pool.length,
			c1,
			c2,
			pc,
			pm;

		while (newPop.length < popSize) {
			ran1 = Math.floor(Math.random() * poolSize);
			ran2 = Math.floor(Math.random() * poolSize);
			c1 = copyC(this.pool[ran1]);
			c2 = copyC(this.pool[ran2]);

			pc = Math.random();
			if (pc <= crossoverProb)
				go.crossover(c1, c2, this.seqLen, size);
			pm = Math.random();
			if (pm <= mutationProb) {
				go.mutation(c1, this.seqLen, size).mutation(c2, this.seqLen, size);
			}
			
			newPop.push({
				c: copyC(c1),
				f: this.calFitness(c1)
			});
			if (newPop.length >= popSize) break;
			newPop.push({
				c: copyC(c2),
				f: this.calFitness(c2)
			});
		}

		this.pop = newPop;
	},

	calFitness: function(c, test) {
		//Pareto Optimility
		var PENALTY = 10000000,
			i,
			preId = 0,
			nextId,
			n = this.seqLen,
			routeLens = [],
			routeNum,
			rLen = 0,
			rTime = 0,
			rWeight = 0,
			dist,
			avgOfTrans,
			exactWaste = 0,
			transportation = 0,
			workload = 0,
			delay = 0,
			remainingWaste;

		//transportation cost
		for (i = 1; i < this.seqLen + 2; i++) {
			nextId = c[i];
			if (c[n + 2 + nextId] == 1) {
				exactWaste += this.data[nextId][3];
				dist = Math.sqrt( Math.pow((this.data[preId][1] - this.data[nextId][1]), 2) + Math.pow((this.data[preId][2] - this.data[nextId][2]), 2) );
				transportation += dist;
				rLen += dist;
				rTime += dist;	//Original: departure time, Now: arrival time
				if (nextId == 0) {
					if (rLen != 0) {
						routeLens.push(rLen);
						if (rWeight > this.capacity) return [PENALTY, PENALTY, PENALTY, PENALTY];
						rLen = 0;
						rTime = 0;
						rWeight = 0;
					}
				} else {
					rWeight += this.data[nextId][3];
// if (test) console.log(nextId, rTime, this.data[nextId][5]);
					if (rTime > this.data[nextId][5]) {
						delay += rTime - this.data[nextId][5];
// if (test) console.log('delay: ' + delay);
					}
					//set rTime as departure time
					rTime = Math.max(rTime, this.data[nextId][4]) + this.data[nextId][6];
				}
				preId = nextId;
			}
		}
		//std of workload
		routeNum = routeLens.length;
		if (test) console.log('routeLens: ', routeLens);
		avgOfTrans = transportation / routeNum;
		for (i = 0; i < routeNum; i++) {
			workload += Math.pow( (routeLens[i] - avgOfTrans), 2);
		}
		//delay -> delay
		//remaining waste
		remainingWaste = this.totalWaste - exactWaste;

		return [
			Math.round(transportation * 100) / 100, 
			Math.round(workload * 100) / 100, 
			Math.round(delay * 100) / 100, 
			Math.round(remainingWaste * 100) / 100
		];
	}
};

function copyC(c) {
	var res = [],
		i = 0;
	for (i = 0; i < c.length; i++) {
		res.push(c[i]);
	}
	return res;
}