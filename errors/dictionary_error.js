var DictionaryError = function(errorCode, parameters) {
	this.name="DictionaryError";
    this.code=errorCode;
    this.parameters=parameters||[];
};

DictionaryError.prototype = new Error();

module.exports = DictionaryError;