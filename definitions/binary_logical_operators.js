var tokenTypes=require('./token_types'),
prio= require('./priorities'),
Token=require('../token'),
limits=require('./limits').limits,
conversions=require('./conversions').conversions;

var ops={
	"==": equals,
	"!=": isDif,
	"<=": isMinEqual,
	"<": isMin,
	">": isMaj,
	">=": isMajEqual,
	"||": logicOr,
	"&&": logicAnd
};

var finalType={};

module.exports.logicalOps ={
	calculate: function(token1, token2, operatorToken){
		if(!(conversions.checkCompatibility(token1, token2, operatorToken))){
			throw "Operação entre tipos incompatíveis";
		}
		finalType=conversions.getFinalType(token1,token2);

		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		if(func===undefined){
			throw "Operador não definido";
		}
		
		//converte símbolos para valores
		var value1 =conversions.convertToValue(token1,finalType);
		var value2 =conversions.convertToValue(token2,finalType);

		//guarda o resultado da operação
		var result =func(value1,value2);
		return new Token(tokenTypes.BOOLEAN, result);
	}
};



function equals(value1,value2){
	return (value1==value2);
}

function isMinEqual(value1,value2){
	return (value1<=value2);
}

function isMajEqual(value1,value2){
	return (value1>=value2);
}

function isMaj(value1,value2){
	return (value1>value2);
}

function isMin(value1,value2){
	return (value1<value2);
}

function isDif(value1,value2){
	return (value1!=value2);
}

function logicOr(value1,value2){
	return (value1 || value2);
}

function logicAnd(value1,value2){
	return (value1 && value2);
}