var tokenTypes=require('./token_types'),
comp=require('../compatibility/binary_comp').binComp,
Token=require('../token'),
limits=require('./limits').limits;

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
		if(!(checkCompatibility(token1, token2, operatorToken))){
			throw "Operacao entre tipos incompativeis";
		}
		finalType=getFinalType(token1,token2);
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		if(func===undefined){
			throw "Operador nao definido";
		}
		//converte símbolos para valores
		var value1 =convertToValue(token1,finalType);
		var value2 =convertToValue(token2,finalType);

		//guarda o resultado da operação
		var result =func(value1,value2);
		if(finalType==tokenTypes.INTEGER){
			result=parseInt(result,10).toPrecision(12);
			return new Token(tokenTypes.INTEGER, result);
		}
		if(finalType==tokenTypes.REAL){
			result=parseFloat(result).toPrecision(12);
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


function convertToValue(token, finalType){
	if(finalType==tokenTypes.INTEGER){
		return getIntValue(token);
	}
	if(finalType==tokenTypes.REAL){
		return getRealValue(token);
	}
	if(finalType==tokenTypes.CHAR){
		return getIntValue(token);
	}
	if(finalType==tokenTypes.STRING){
		return token.value_;
	}
}

function getFinalType(token1, token2){
	return comp.getFinalType(token1.type_, token2.type_);
}

function checkCompatibility(token1, token2, operatorToken){
	return comp.checkCompatibility(token1.type_, token2.type_, operatorToken.value_);
}

function getIntValue(token){
	if(token.type_==tokenTypes.CHAR){
		return token.value_.charCodeAt(0);
	}
	return parseInt(token.value_,10);
}

function getRealValue(token){
	if(token.type_==tokenTypes.CHAR){
		return this.getCharCode(token.value_);
	}
	return parseFloat(token.value_);
}

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
