var ExpressionError = function(errorCode, column, parameters) {
	this.name="ExpressionError";
    this.code=errorCode;
    this.column=column;
    this.parameters=parameters||[];
};

ExpressionError.prototype = new Error();

module.exports = ExpressionError;