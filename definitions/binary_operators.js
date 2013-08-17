var tokenTypes=require('./token_types'),
Token=require('../token'),
limits=require('./limits').limits,
conversions=require('./conversions').conversions;

var ops={
	"+": add,
	"-": sub,
	"*": mul,
	"/": div,
	"**": pow,
	"%": mod,
	"<<": shiftLeft,
	">>": shiftRight,
	"|": bitwiseOr,
	"&": bitwiseAnd,
	"^": bitwiseXor
};

var finalType={};

module.exports.binaryOps ={
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
		if(finalType==tokenTypes.INTEGER){
			result=parseInt(result,10);
			return new Token(tokenTypes.INTEGER, result);
		}
		if(finalType==tokenTypes.REAL){
			result=parseFloat(result.toPrecision(12));
			return new Token(tokenTypes.REAL, result);
		}
		if(finalType==tokenTypes.CHAR){
			result=String.fromCharCode(result);
			return new Token(tokenTypes.CHAR, result);
		}
		if(finalType==tokenTypes.STRING){
			result=result.toString();
			return new Token(tokenTypes.STRING, result);
		}
	}
};

function add(value1, value2){
	return value1+value2;
}

function sub(value1,value2){
	return value1-value2;
}

function mul(value1,value2){
	return value1*value2;
}

function div(value1,value2){
	if(value2===0){
		throw "divisao por 0";
	}
	return value1/value2;
}

function mod(value1,value2){
	return value1%value2;
}

function pow(value1,value2){
	return Math.pow(value1,value2);
}

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

function shiftLeft(value1,value2){
	return (value1<<value2);
}

function shiftRight(value1,value2){
	return (value1>>value2);
}

function logicNot(value){
	return (!value);
}

function logicOr(value1,value2){
	return (value1 || value2);
}

function logicAnd(value1,value2){
	return (value1 && value2);
}

function bitwiseOr(value1,value2){
	return (value1 | value2);
}

function bitwiseAnd(value1,value2){
	return (value1 & value2);
}

function bitwiseXor(value1,value2){
	return (value1 ^ value2);
}
