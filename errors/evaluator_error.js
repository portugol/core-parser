var EvaluatorError = function(errorCode, parameters) {
	this.name="EvaluatorError";
    this.code=errorCode;
    this.parameters=parameters||[];
};

EvaluatorError.prototype = new Error();

module.exports = EvaluatorError;