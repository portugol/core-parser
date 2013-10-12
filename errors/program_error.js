var ProgramError = function() {
	this.name="ProgramError";
};

require('util').inherits(ProgramError, Error);

module.exports = ProgramError;