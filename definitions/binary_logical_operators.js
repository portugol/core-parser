var tokenTypes=require('./token_types'),
prio= require('./priorities'),
Token=require('../token'),
limits=require('./limits'),
conversions=require('./conversions'),
dictionaryFuncs=require('./dictionary_funcs');

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

var self ={
	calculate: function(token1, token2, operatorToken, dictionary){
		if(!(conversions.checkCompatibility(token1, token2, operatorToken))){
			throw "Operação entre tipos incompatíveis";
		}
		finalType=conversions.getFinalType(token1,token2);

		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		if(func===undefined){
			throw "Operador não definido";
		}
		
		//operandos
		var value1 =token1.value_;
		var value2 =token2.value_;

		//guarda o resultado da operação
		var result=func(value1,value2);
		//traduzir para a lingua respectiva
		var symbol=dictionaryFuncs.getSymbolByValue(dictionary,result);
		
		return new Token(tokenTypes.BOOLEAN, result,symbol);
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

module.exports=self;