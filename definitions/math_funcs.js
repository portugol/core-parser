var tokenTypes=require('./token_types'),
binComp=require('../compatibility/binary_comp'),
comp=require('../compatibility/unary_left_comp'),
Token=require('../token'),
limits=require('./limits'),
EvaluatorError=require('../errors/evaluator_error'),
conversions=require('./conversions'),
dictionaryFuncs=require('./dictionary_funcs');

var finalType={};
var self={
	calculate: function(values, operatorToken, dictionary){
		var func={};
		var numParams=values.length;
		try{
			var obj=dictionaryFuncs.getObjectByValue(dictionary,operatorToken.value_);
		}
		catch(e){
			throw new EvaluatorError("UNEXPECTED_ERROR");
		}
		try{
			var func=eval(obj.value);
		}
		catch(e){
			throw "Operador não definido";
		}
		var funcParams=obj.params;
		var paramTypes=obj.paramTypes;
		if(numParams==funcParams){
			for(var j=0; j<numParams; j++){
				var parameter=values[j];
				//se o tipo de parâmetro recebido não é compatível com o que é esperado
				if((parameter.type_ & paramTypes[j])===0){
					//throw "O tipo do parâmetro "+j+" é inválido";
					//"O parâmetro %parametro (%tipo) é inválido. É esperado um do tipo %tipo"
					var paramNumber=j+1; //avançar 1 posição porque começa em 0
					var errorParameters=[paramNumber,parameter.symbol_,"VarTypes."+conversions.codeToVarType(parameter.type_), operatorToken.funcName, "VarTypes."+conversions.codeToVarType(obj.paramTypes[j])];
					throw new EvaluatorError("INVALID_PARAMETER",errorParameters);
				}
			}
		}
		else{
			//throw "Número de parâmetros inválido";
			//A função deve receber %s parâmetro(s). Introduziu %s parâmetro(s)
			var errorParameters=[operatorToken.funcName,funcParams, numParams];
			throw new EvaluatorError("INVALID_NUMBER_PARAMETERS",errorParameters);
		}

		finalType=tokenTypes.REAL;

		//guarda o resultado da operação
		var result =func(values);

		//verificar se está fora do domínio
		if(limits.isNotNumber(result,finalType)){
			var functionName=dictionaryFuncs.getFunctionNameByValue(dictionary,obj.value);
			var argument=values.toString();
			var parameters=[argument, functionName];
			throw new EvaluatorError("ARGUMENT_OUT_OF_DOMAIN",parameters);
		}
		//verificar se o valor é infinito
		if(limits.isInfinite(result,finalType)){
			var functionName=dictionaryFuncs.getFunctionNameByValue(dictionary,obj.value);
			var argument=values.toString();
			var parameters=[functionName,argument];
			throw new EvaluatorError("FUNCTION_RETURNS_INFINITY",parameters);
		}
		var symbol;
		if(finalType==tokenTypes.INTEGER){
			result=conversions.getIntValue(result,finalType);
			symbol=result.toString();
			return new Token(tokenTypes.INTEGER, result,symbol);
		}
		if(finalType==tokenTypes.REAL){
			result=conversions.getRealValue(result,finalType);
			symbol=result.toString();
			return new Token(tokenTypes.REAL, result,symbol);
		}
		if(finalType==tokenTypes.CHAR){
			result=String.fromCharCode(result);
			return new Token(tokenTypes.CHAR, result, result);
		}
		if(finalType==tokenTypes.STRING){
			result =result.toString();
			return new Token(tokenTypes.STRING, result, result);
		}
		if(finalType==tokenTypes.BOOLEAN){
			symbol=dictionaryFuncs.getSymbolByValue(dictionary,result);
			return new Token(tokenTypes.BOOLEAN, result, symbol);
		}
	}
};

function sin(values){
	return Math.sin(values[0].value_);
}

function cos(values){
	return Math.cos(values[0].value_);
}

function tan(values){
	return Math.tan(values[0].value_);
}

function asin(values){
	return Math.asin(values[0].value_);
}

function acos(values){
	return Math.acos(values[0].value_);
}

function atan(values){
	return Math.atan(values[0].value_);
}

function sqrt(values){
	return Math.sqrt(values[0].value_);
}

function log(values){
	var base;
	try{
		base=values[1].value_;
	}
	catch(e){
		base=undefined;
	}
	return Math.log(values[0].value_)/(base ? Math.log(base) : Math.log(10));
}

function ln(values){
	return Math.log(values[0].value_)/Math.log(Math.E);
}

function abs(values){
	return Math.abs(values[0].value_);
}

function ceil(values){
	return Math.ceil(values[0].value_);
}

function floor(values){
	return Math.floor(values[0].value_);
}
function round(values){
	return Math.round(values[0].value_);
}
function exp(values){
	return Math.exp(values[0].value_);
}
function pyt(values) {
	return Math.sqrt(values[0].value_ * values[0].value_+ values[1].value_ * values[1].value_);
}

module.exports=self;

