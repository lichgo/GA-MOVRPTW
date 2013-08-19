Array.prototype.sortObject = function(field) {
	if (typeof this[0][field] === 'undefined') return this;

	//bubble sort
	var len = this.length,
		i,
		j,
		flag,
		next,
		temp;

	for (i = 1; i < len; i++) {
		flag = 0;
		for (j = 0; j < len - i; j++) {
			next = j + 1;
			if (this[j][field] > this[next][field]) {
				temp = this[j];
				this[j] = this[next];
				this[next] = temp;
				flag = 1;
			}
		}
		if (flag == 0) break;
	}

	return this;
}
