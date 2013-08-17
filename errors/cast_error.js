var CastError = function(errorCode, parameters) {
	this.name="CastError";
    this.code=errorCode;
    this.parameters=parameters||[];
};

CastError.prototype = new Error();

module.exports = CastError;