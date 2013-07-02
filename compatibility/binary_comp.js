var tokenTypes= require('../definitions/token_types'),
util = require('util');

var lists = {
	integerList: {
		"+" : (tokenTypes.NUMBER | tokenTypes.STRING | tokenTypes.CHAR),
		"-":  (tokenTypes.NUMBER | tokenTypes.CHAR),
		"/":  tokenTypes.NUMBER,
		"*":  tokenTypes.NUMBER,
		"**": tokenTypes.NUMBER,
		"%":  tokenTypes.INTEGER,
		"==": (tokenTypes.NUMBER | tokenTypes.CHAR),
		"!=": (tokenTypes.NUMBER | tokenTypes.CHAR),
		"<=": (tokenTypes.NUMBER | tokenTypes.CHAR),
		"<":  (tokenTypes.NUMBER | tokenTypes.CHAR),
		">=": (tokenTypes.NUMBER | tokenTypes.CHAR),
		">":  (tokenTypes.NUMBER | tokenTypes.CHAR),
		"<<": tokenTypes.INTEGER,
		">>": tokenTypes.INTEGER,
		"|":  tokenTypes.INTEGER,
		"&":  tokenTypes.INTEGER,
		"^":  tokenTypes.INTEGER
	},

	realList: {
		"+" : (tokenTypes.NUMBER | tokenTypes.STRING),
		"-":  tokenTypes.NUMBER,
		"/":  tokenTypes.NUMBER,
		"*":  tokenTypes.NUMBER,
		"**": tokenTypes.NUMBER,
		"==": tokenTypes.NUMBER,
		"!=": tokenTypes.NUMBER,
		"<=": tokenTypes.NUMBER,
		"<":  tokenTypes.NUMBER,
		">=": tokenTypes.NUMBER,
		">":  tokenTypes.NUMBER
	},

	charList: {
		"+" : (tokenTypes.INTEGER | tokenTypes.CHAR| tokenTypes.STRING),
		"-":  (tokenTypes.INTEGER | tokenTypes.CHAR),
		"==": (tokenTypes.INTEGER | tokenTypes.CHAR),
		"!=": (tokenTypes.INTEGER | tokenTypes.CHAR),
		"<=": (tokenTypes.INTEGER | tokenTypes.CHAR),
		"<":  (tokenTypes.INTEGER | tokenTypes.CHAR),
		">=": (tokenTypes.INTEGER | tokenTypes.CHAR),
		">":  (tokenTypes.INTEGER | tokenTypes.CHAR)
	},

	stringList: {
		"+" : (tokenTypes.STRING | tokenTypes.CHAR | tokenTypes.NUMBER),
		"==": tokenTypes.STRING,
		"!=": tokenTypes.STRING,
		"<=": tokenTypes.STRING,
		"<":  tokenTypes.STRING,
		">=": tokenTypes.STRING,
		">":  tokenTypes.STRING
	},

	booleanList: {
		"==": tokenTypes.BOOLEAN,
		"!=": tokenTypes.BOOLEAN,
		"&&": tokenTypes.BOOLEAN,
		"||": tokenTypes.BOOLEAN
	}
};



module.exports.binComp = {

	varResult: [
	{
		'type': tokenTypes.INTEGER,
		'compatibleTypes':
		[
		{
			'type': tokenTypes.INTEGER,
			'result': tokenTypes.INTEGER
		},
		{
			'type': tokenTypes.REAL,
			'result': tokenTypes.REAL
		},
		{
			'type': tokenTypes.STRING,
			'result': tokenTypes.STRING
		},
		{
			'type': tokenTypes.CHAR,
			'result': tokenTypes.CHAR
		}
		]
	},
	{
		'type': tokenTypes.REAL,
		'compatibleTypes':
		[
		{
			'type': tokenTypes.INTEGER,
			'result': tokenTypes.REAL
		},
		{
			'type': tokenTypes.REAL,
			'result': tokenTypes.REAL
		},
		{
			'type': tokenTypes.STRING,
			'result': tokenTypes.STRING
		}
		]
	},
	{
		'type': tokenTypes.STRING,
		'compatibleTypes':
		[
		{
			'type': tokenTypes.INTEGER,
			'result': tokenTypes.STRING
		},
		{
			'type': tokenTypes.REAL,
			'result': tokenTypes.STRING
		},
		{
			'type': tokenTypes.STRING,
			'result': tokenTypes.STRING
		},
		{
			'type': tokenTypes.CHAR,
			'result': tokenTypes.STRING
		}
		]
	},
	{
		'type': tokenTypes.CHAR,
		'compatibleTypes':
		[
		{
			'type': tokenTypes.INTEGER,
			'result': tokenTypes.CHAR
		},
		{
			'type': tokenTypes.STRING,
			'result': tokenTypes.STRING
		},
		{
			'type': tokenTypes.CHAR,
			'result': tokenTypes.CHAR
		}
		]
	},
	{
		'type': tokenTypes.BOOLEAN,
		'compatibleTypes':
		[
		{
			'type': tokenTypes.BOOLEAN,
			'result': tokenTypes.BOOLEAN
		}
		]
	}
	],

	checkCompatibility: function(tokenType1, tokenType2, operatorSymbol){
		var list;
		var operandCode;

		//escolhe a lista de compatibilidade adequada ao tokenType1
		switch (tokenType1) {
			case tokenTypes.INTEGER:
			list=lists.integerList;
			break;
			case tokenTypes.REAL:
			list=lists.realList;
			break;
			case tokenTypes.CHAR:
			list=lists.charList;
			break;
			case tokenTypes.STRING:
			list=lists.stringList;
			break;
			case tokenTypes.BOOLEAN:
			list=lists.booleanList;
			break;
			default:
			throw Error("tipo invalido");
		}

		//escolhe a código de operando adequado ao tokenType2
		switch (tokenType2) {
			case tokenTypes.INTEGER:
			operandCode=tokenTypes.INTEGER;
			break;
			case tokenTypes.REAL:
			operandCode=tokenTypes.REAL;
			break;
			case tokenTypes.CHAR:
			operandCode=tokenTypes.CHAR;
			break;
			case tokenTypes.STRING:
			operandCode=tokenTypes.STRING;
			break;
			case tokenTypes.BOOLEAN:
			operandCode=tokenTypes.BOOLEAN;
			break;
			default:
			throw Error("tipo invalid");
		}

		//verificar se o tokenType1 suporta a operação cujo símbolo é igual ao operatorSymbol
		if(operatorSymbol in list){
			//verificar se a operação é suportada entre o tokenType1 e o tokenType2
			if((list[operatorSymbol] & operandCode)!==0){
				return true;
			}
		}
		return false;
	},

	getFinalType: function(varType1, varType2){
		var list;
		var finalType;

		//percorre os vários tipos de variável do array varResult
		for(var i=0; i<this.varResult.length; i++){
			//verifica se encontrou o tipo correcto
			if(this.varResult[i].type==varType1){
				var type=this.varResult[i]; //guarda o tipo
				//percorre os vários tipos compatíveis com o tipo anterior
				for(var j=0; j<type.compatibleTypes.length; j++){
					//verifica se encontrou o segundo tipo correcto
					if(type.compatibleTypes[j].type==varType2){
						i=this.varResult.length; //forçar o fim do ciclo exterior quando o interior acabar
						finalType=type.compatibleTypes[j].result; //guarda o tipo de variavel resultante
						break; //terminar ciclo interior
					}
				}
			}
		}
		//POR SEGURANÇA VERIFICA SE NÃO FOI ENCONTRADO
		if(finalType===undefined){
			throw Error("As variaveis nao sao compativeis");
		}
		//devolve o tipo de variável resultante
		return finalType;
	}
};
