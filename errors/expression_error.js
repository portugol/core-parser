var ProgramError = require('./program_error');

var ExpressionError = function(errorCode, column, parameters) {
	this.name="ExpressionError";
    this.code=errorCode;
    this.column=column;
    this.parameters=parameters||[];
};

require('util').inherits(ExpressionError, ProgramError);

module.exports = ExpressionError;