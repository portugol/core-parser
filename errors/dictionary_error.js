var DictionaryError = function(errorCode, parameters) {
	this.name="DictionaryError";
    this.code=errorCode;
    this.parameters=parameters||[];
};

require('util').inherits(DictionaryError, Error);

module.exports = DictionaryError;