module.exports = {
	seqLen: undefined,

	init: function() {
		var arr = [0,1,2,0,3,4,5,0, 1,0,1,1,0,1];

		this.seqLen = 6;

		return arr
	},

	ran: function() {
		return [0,5,2,0,4,3,1,0, 1,1,1,1,1,1];
	},

	getSeqLen: function() {
		return this.seqLen;
	}
};