var tokenTypes=require('./token_types'),
Token=require('../token'),
limits=require('./limits'),
conversions=require('./conversions'),
EvaluatorError=require('../errors/evaluator_error');

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

var self ={
	calculate: function(token1, token2, operatorToken){
		if(!(conversions.checkCompatibility(token1, token2, operatorToken))){
			console.log(operatorToken);
			var parameters=[operatorToken.symbol_,"TokenNames."+operatorToken.name_,"VarTypes."+conversions.codeToVarType(token1.type_),"VarTypes."+conversions.codeToVarType(token2.type_)];
			throw new EvaluatorError("INCOMPATIBLE_BINARY_OPERATION",parameters);
		}
		finalType=conversions.getFinalType(token1,token2);
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		if(func===undefined){
			throw "Operador não definido";
		}
		//converte símbolos para valores
		var value1 =conversions.convertToValue(token1.value_,token1.type_,finalType);
		var value2 =conversions.convertToValue(token2.value_,token2.type_,finalType);

		//guarda o resultado da operação
		var result =func(value1,value2);

		//verificar se o valor é infinito
		if(limits.isNotNumber(result,finalType)){
			throw new EvaluatorError("NOT_A_NUMBER");
		}
		//verificar se o valor é infinito
		if(limits.isInfinite(result,finalType)){
			throw new EvaluatorError("INFINITY");
		}

		var symbol;
		if(finalType==tokenTypes.INTEGER){
			result=conversions.getIntValue(result,finalType);
			symbol=result.toString();
			return new Token(tokenTypes.INTEGER, result, symbol);
		}
		if(finalType==tokenTypes.REAL){
			result=conversions.getRealValue(result);
			symbol=result.toString();
			return new Token(tokenTypes.REAL, result, symbol);
		}
		if(finalType==tokenTypes.CHAR){
			result=String.fromCharCode(result);
			return new Token(tokenTypes.CHAR, result, result);
		}
		if(finalType==tokenTypes.STRING){
			result=result.toString();
			return new Token(tokenTypes.STRING, result, result);
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
	if(value2==0){
		throw new EvaluatorError("DIVISION_BY_0");
	}
	return value1/value2;
}

function mod(value1,value2){
	return value1%value2;
}

function pow(value1,value2){
	return Math.pow(value1,value2);
}

function shiftLeft(value1,value2){
	//return (value1<<value2);
	//desta forma possibilita obter valores maiores e melhor desempenho
	return value1*(Math.pow(2,value2));
}

function shiftRight(value1,value2){
	//return (value1>>value2);
	//desta forma possibilita obter valores maiores e melhor desempenho
	if(value2<0){
		return value1*(Math.pow(2,value2));
	}
	return value1/(Math.pow(2,value2));
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

module.exports = self;