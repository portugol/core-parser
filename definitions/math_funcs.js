var tokenTypes=require('./token_types'),
binComp=require('../compatibility/binary_comp').binComp,
comp=require('../compatibility/unary_left_comp').unaryLeftComp,
Token=require('../token'),
dictionary=require('./dictionary'),
limits=require('./limits').limits;

var finalType={};
module.exports.mathFuncs ={
	calculate: function(values, operatorToken){
		var func={};
		var numParams=values.length;
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		for(var i=0; i<dictionary.length; i++){
			if(dictionary[i].symbol==operatorToken.value_){
				func=eval(operatorToken.value_); //guarda a função JS de acordo com o value do token
				if(numParams==dictionary[i].params){
					for(var j=0; j<numParams; j++){
						if((values[j].type_ & dictionary[i].paramTypes[j])===0){
							throw "o tipo do parametro "+j+" e invalido";
						}
					}
				}
				else{
					throw "numero de parametros invalido";
				}
				break;
			}
		}
		finalType=tokenTypes.REAL;
		if(func===undefined){
			throw "Operador nao definido";
		}

		//guarda o resultado da operação
		var result =func(values);

		if(finalType==tokenTypes.INTEGER){
			result=parseInt(result,10);
			return new Token(tokenTypes.INTEGER, result);
		}
		if(finalType==tokenTypes.REAL){
			result=parseFloat(result);
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

function sin(values){
	return Math.sin(values[0]);
}

function cos(values){
	return Math.cos(values[0]);
}

function tan(values){
	return Math.tan(values[0]);
}

function asin(values){
	return Math.asin(values[0]);
}

function acos(values){
	return Math.acos(values[0]);
}

function sqrt(values){
	return Math.sqrt(values[0]);
}

function log(values){
	return Math.log(values[0])/(value[1] ? Math.log(values[1]) : Math.log(10));
}

function ln(values){
	return Math.log(values[0])/Math.log(Math.E);
}

function abs(values){
	return Math.abs(values[0]);
}

function ceil(values){
	return Math.ceil(values[0]);
}

function floor(values){
	return Math.floor(values[0]);
}
function round(values){
	return Math.round(values[0]);
}
function pyt(values) {
	return Math.sqrt(values[0] * values[0]+ values[1] * values[1]);
}
function ceil(values){
	return Math.ceil(values[0]);
}


