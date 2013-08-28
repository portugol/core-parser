var tokenTypes=require('./token_types'),
binComp=require('../compatibility/binary_comp'),
comp=require('../compatibility/unary_left_comp'),
Token=require('../token'),
limits=require('./limits'),
dictionaryFuncs=require('./dictionary_funcs');

var ops={
	"!": logicNot,
	"-": negative,
	"~": bitwiseNot
};

var finalType={};

var self ={
	calculate: function(token1, operatorToken, dictionary){
		if(!(checkCompatibility(token1, operatorToken))){
			throw "A operação não pode ser efectuada com dados deste tipo";
		}
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		finalType=token1.type_;
		if(func===undefined){
			throw "Operador não definido";
		}
		//converte símbolo para valor
		var value1 =token1.value_;
		//guarda o resultado da operação
		var result =func(value1);
		var symbol;
		if(finalType==tokenTypes.INTEGER){
			result=parseInt(result,10);
			symbol=result.toString();
			return new Token(tokenTypes.INTEGER, result, symbol);
		}
		if(finalType==tokenTypes.REAL){
			result=parseFloat(result.toPrecision(12));
			symbol=result.toString();
			return new Token(tokenTypes.REAL, result, symbol);
		}
		if(finalType==tokenTypes.CHAR){
			result=String.fromCharCode(result);
			return new Token(tokenTypes.CHAR, result, result);
		}
		if(finalType==tokenTypes.STRING){
			result =value1.toString();
			return new Token(tokenTypes.STRING, result, result);
		}
		if(finalType==tokenTypes.BOOLEAN){
			symbol=dictionaryFuncs.getSymbolByValue(dictionary,result);
			return new Token(tokenTypes.BOOLEAN, result, symbol);
		}
	}
};

function checkCompatibility(token1, operatorToken){
	return comp.checkCompatibility(token1.type_, operatorToken.value_);
}

function bitwiseNot(value){
	//32 bits bitwise not
	return (~value);
}

function negative(value){
	return value*(-1);
}

function logicNot(value){
	return !(value);
}

module.exports=self;