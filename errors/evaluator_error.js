var ProgramError = require('./program_error');

var EvaluatorError = function(errorCode, parameters) {
	this.name="EvaluatorError";
    this.code=errorCode;
    this.parameters=parameters||[];
};

require('util').inherits(EvaluatorError, ProgramError);

module.exports = EvaluatorError;