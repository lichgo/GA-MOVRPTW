var go = require('./GeneticOperator'),
	c1 = [0,2,1,4,3,5,0,1,0,1,0,1,0],
	c2 = [0,4,5,1,2,3,0,1,1,0,1,0,1],
	n = 5;

go.crossover(c1, c2, n);
console.log(c1, c2);
go.mutation(c1, n);
console.log(c1);