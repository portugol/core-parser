var tokenTypes= require('../definitions/token_types'),
util = require('util');

var ops={
	"!": tokenTypes.INTEGER
};

module.exports.unaryRightComp={
	checkCompatibility: function(tokenType, operatorSymbol){
		if(operatorSymbol in ops){
			//se o tipo de dados é compatível com o operador
			if((ops[operatorSymbol] & tokenType)===0){
				return false;
			}
		}
		return true;
	}
};