var tokenTypes=require('./token_types'),
binComp=require('../compatibility/binary_comp'),
comp=require('../compatibility/unary_right_comp'),
Token=require('../token'),
limits=require('./limits'),
conversions=require('./conversions'),
EvaluatorError=require('../errors/evaluator_error'),
dictionaryFuncs=require('./dictionary_funcs');

var ops={
	"!": factorial
};

var finalType={};
var self ={
	calculate: function(token1, operatorToken, dictionary){
		if(!(checkCompatibility(token1, operatorToken))){
			var parameters=[operatorToken.symbol_,"TokenNames."+operatorToken.name_,"VarTypes."+conversions.codeToVarType(token1.type_)];
			throw new EvaluatorError("INCOMPATIBLE_UNARY_OPERATION",parameters);
		}
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		finalType=token1.type_;
		if(func===undefined){
			throw "Operador não definido";
		}
		//guarda o valor
		var value1 =token1.value_;
		//guarda o resultado da operação
		var result =func(value1);

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
			result=conversions.getRealValue(result,finalType);
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

function factorial(n){
	var fac=1;
	for(var i=1; i<=n; i++){
		fac=fac*i;
		if(limits.isInfinite(fac,finalType)){
			throw new EvaluatorError("INFINITY");
		}
		else if(limits.isNotNumber(fac,finalType)){
			throw new EvaluatorError("NOT_A_NUMBER");
		}
	}
	return fac;
}

module.exports=self;

