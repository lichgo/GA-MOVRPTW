exports.crossover = function(c1, c2, n, m) {	//n: all nodes excep two 0s at ends, m: problem size
	//Generate 2 points for 2 sectors
	var p1s1 = 1 + Math.floor(Math.random() * n),
		p2s1 = 1 + Math.floor(Math.random() * n),
		p1s2 = n + 3 + Math.floor(Math.random() * m),
		p2s2 = n + 3 + Math.floor(Math.random() * m),
		i,
		hashGenes = {},
		numGenes,
		count,
		temp;

	if (p1s1 > p2s1) {
		temp = p1s1;
		p1s1 = p2s1;
		p2s1 = temp;
	}

	if (p1s2 > p2s2) {
		temp = p1s2;
		p1s2 = p2s2;
		p2s2 = temp;
	}

// console.log(p1s1, p2s1, p1s2, p2s2);

	//Swap the first sector
	numGenes = p2s1 - p1s1 + 1;
	count = 0;
	for (i = p1s1; i <= p2s1; i++) {
		hashGenes[c1[i]] = true;
	}
	for (i = 1; i < n + 1; i++) {
		if (hashGenes[c2[i]] === true) {
			temp = c1[p1s1 + count];
			c1[p1s1 + count] = c2[i];
			c2[i] = temp;
			if (++count == numGenes) break;
		}
	}

	//Swap the second sector
	for (i = p1s2; i <= p2s2; i++) {
		temp = c1[i];
		c1[i] = c2[i];
		c2[i] = temp;
	}

	return this;
};

exports.mutation = function(c, n, m) {
	var p1s1 = 1 + Math.floor(Math.random() * n),
		p2s1 = 1 + Math.floor(Math.random() * n),
		p1s2 = n + 3 + Math.floor(Math.random() * m),
		temp;

// console.log(p1s1, p2s1, p1s2);

	//Mutate the first sector
	if (p1s1 != p2s1) {
		temp = c[p1s1];
		c[p1s1] = c[p2s1];
		c[p2s1] = temp;
	}

	//Mutate the second sector
	c[p1s2] = 1 - c[p1s2];

	return this;
};
