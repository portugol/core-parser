var CastError = function(errorCode, parameters) {
	this.name="CastError";
    this.code=errorCode;
    this.parameters=parameters||[];
};

require('util').inherits(CastError, Error);

module.exports = CastError;