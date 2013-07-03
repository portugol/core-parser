var tokenTypes=require('./token_types'),
binComp=require('../compatibility/binary_comp').binComp,
comp=require('../compatibility/unary_right_comp').unaryRightComp,
Token=require('../token'),
limits=require('./limits').limits;

var ops={
	"!": factorial
};

var finalType={};

module.exports.rightUnaryOps ={
	calculate: function(token1, operatorToken){
		if(!(checkCompatibility(token1, operatorToken))){
			throw "A operacao nao pode ser efectuada com dados deste tipo";
		}
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		finalType=token1.type_;
		if(func===undefined){
			throw "Operador nao definido";
		}
		//guarda o valor
		var value1 =token1.value_;
		//guarda o resultado da operação
		var result =func(value1);

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
			result =value1.toString();
			return new Token(tokenTypes.STRING, result);
		}
	}
};

function checkCompatibility(token1, operatorToken){
	return comp.checkCompatibility(token1.type_, operatorToken.value_);
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

function factorial(value){
	if(value<0){
		//console.log(value);
		throw "Factorial de numero negativo";
	}
	if(value===0){
		return 1;
	}
	else{
		return (value*factorial(value-1));
	}
}

