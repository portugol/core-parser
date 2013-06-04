var tokenTypes= require('../definitions/token_types'),
operandCodes=require('./vartype_codes'),
util = require('util');
//**********************************************
// TIPOS DE VARIAVEL COMPATIVEIS ENTRE OPERAÇÕES
//**********************************************

var lists = {
	integerList: {
		"+" : (operandCodes.NUMBER | operandCodes.STRING | operandCodes.CHAR),
		"-":  (operandCodes.NUMBER | operandCodes.CHAR),
		"/":  operandCodes.NUMBER,
		"*":  operandCodes.NUMBER,
		"**": operandCodes.NUMBER,
		"%":  operandCodes.NUMBER,
		"==": (operandCodes.NUMBER | operandCodes.CHAR),
		"!=": (operandCodes.NUMBER | operandCodes.CHAR),
		"<=": (operandCodes.NUMBER | operandCodes.CHAR),
		"<":  (operandCodes.NUMBER | operandCodes.CHAR),
		">=": (operandCodes.NUMBER | operandCodes.CHAR),
		">":  (operandCodes.NUMBER | operandCodes.CHAR),
		"<<": operandCodes.INTEGER,
		">>": operandCodes.INTEGER,
		"|":  operandCodes.INTEGER,
		"&":  operandCodes.INTEGER
	},

	realList: {
		"+" : (operandCodes.NUMBER | operandCodes.STRING),
		"-":  operandCodes.NUMBER,
		"/":  operandCodes.NUMBER,
		"*":  operandCodes.NUMBER,
		"**": operandCodes.NUMBER,
		"%":  operandCodes.NUMBER,
		"==": operandCodes.NUMBER,
		"!=": operandCodes.NUMBER,
		"<=": operandCodes.NUMBER,
		"<":  operandCodes.NUMBER,
		">=": operandCodes.NUMBER,
		">":  operandCodes.NUMBER
	},

	charList: {
		"+" : (operandCodes.INTEGER | operandCodes.CHAR),
		"-":  (operandCodes.INTEGER | operandCodes.CHAR),
		"==": (operandCodes.INTEGER | operandCodes.CHAR),
		"!=": (operandCodes.INTEGER | operandCodes.CHAR),
		"<=": (operandCodes.INTEGER | operandCodes.CHAR),
		"<":  (operandCodes.INTEGER | operandCodes.CHAR),
		">=": (operandCodes.INTEGER | operandCodes.CHAR),
		">":  (operandCodes.INTEGER | operandCodes.CHAR)
	},

	stringList: {
		"+" : (operandCodes.STRING | operandCodes.CHAR | operandCodes.NUMBER),
		"-":  operandCodes.STRING,
		"/":  operandCodes.STRING,
		"*":  operandCodes.STRING,
		"**": operandCodes.STRING,
		"%":  operandCodes.STRING,
		"==": operandCodes.STRING,
		"!=": operandCodes.STRING,
		"<=": operandCodes.STRING,
		"<":  operandCodes.STRING,
		">=": operandCodes.STRING,
		">":  operandCodes.STRING
	},

	booleanList: {
		"==": operandCodes.BOOLEAN,
		"!=": operandCodes.BOOLEAN,
		"&&": operandCodes.BOOLEAN,
		"||": operandCodes.BOOLEAN
	}
};



module.exports.compatibility = {
	//construtor

	INTEGER: operandCodes.INTEGER,
	REAL: operandCodes.REAL,
	STRING: operandCodes.STRING,
	CHAR:   operandCodes.CHAR,
	BOOLEAN: operandCodes.BOOLEAN,
	NULL:    operandCodes.NULL,
	ALL:     operandCodes.ALL,
	NUMBER:  operandCodes.NUMBER,

	//*******************************************
	// TIPOS DE VARIAVEL RESULTANTES DE OPERAÇÕES
	//*******************************************

	/*
	var operandCodes.INTEGERVars ={
		operandCodes.INTEGER: tokenTypes.operandCodes.INTEGER,
		operandCodes.REAL: tokenTypes.operandCodes.REAL,
		operandCodes.STRING: tokenTypes.operandCodes.STRING,
		operandCodes.CHAR: tokenTypes.operandCodes.CHAR
	};
	var operandCodes.REALVars ={
		operandCodes.INTEGER: tokenTypes.operandCodes.REAL,
		operandCodes.REAL: tokenTypes.operandCodes.REAL,
		operandCodes.STRING: tokenTypes.operandCodes.STRING
	};

	var operandCodes.STRINGVars ={
		operandCodes.INTEGER: tokenTypes.operandCodes.STRING,
		operandCodes.REAL: tokenTypes.operandCodes.STRING,
		operandCodes.STRING: tokenTypes.operandCodes.STRING,
		operandCodes.CHAR: tokenTypes.operandCodes.STRING
	};

	var operandCodes.CHARVars ={
		operandCodes.INTEGER: tokenTypes.operandCodes.CHAR,
		operandCodes.STRING: tokenTypes.operandCodes.STRING,
		operandCodes.CHAR: tokenTypes.operandCodes.CHAR
	};

	var operandCodes.BOOLEANVars ={
		operandCodes.BOOLEAN: tokenTypes.operandCodes.BOOLEAN
	};*/


	varResult: [
	{
		'type': operandCodes.INTEGER,
		'compatibleTypes':
		[
		{
			'type': operandCodes.INTEGER,
			'result': operandCodes.INTEGER
		},
		{
			'type': operandCodes.REAL,
			'result': operandCodes.REAL
		},
		{
			'type': operandCodes.STRING,
			'result': operandCodes.STRING
		},
		{
			'type': operandCodes.CHAR,
			'result': operandCodes.CHAR
		}
		]
	},
	{
		'type': operandCodes.REAL,
		'compatibleTypes':
		[
		{
			'type': operandCodes.INTEGER,
			'result': operandCodes.REAL
		},
		{
			'type': operandCodes.REAL,
			'result': operandCodes.REAL
		},
		{
			'type': operandCodes.STRING,
			'result': operandCodes.STRING
		}
		]
	},
	{
		'type': operandCodes.STRING,
		'compatibleTypes':
		[
		{
			'type': operandCodes.INTEGER,
			'result': operandCodes.STRING
		},
		{
			'type': operandCodes.REAL,
			'result': operandCodes.STRING
		},
		{
			'type': operandCodes.STRING,
			'result': operandCodes.STRING
		},
		{
			'type': operandCodes.CHAR,
			'result': operandCodes.STRING
		}
		]
	},
	{
		'type': operandCodes.CHAR,
		'compatibleTypes':
		[
		{
			'type': operandCodes.INTEGER,
			'result': operandCodes.CHAR
		},
		{
			'type': operandCodes.STRING,
			'result': operandCodes.STRING
		},
		{
			'type': operandCodes.CHAR,
			'result': operandCodes.CHAR
		}
		]
	},
	{
		'type': operandCodes.BOOLEAN,
		'compatibleTypes':
		[
		{
			'type': operandCodes.BOOLEAN,
			'result': operandCodes.BOOLEAN
		}
		]
	}
	],


	checkCompatibility: function(tokenType1, operatorSymbol, tokenType2){
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
			operandCode=operandCodes.INTEGER;
			break;
			case tokenTypes.REAL:
			operandCode=operandCodes.REAL;
			break;
			case tokenTypes.CHAR:
			operandCode=operandCodes.CHAR;
			break;
			case tokenTypes.STRING:
			operandCode=operandCodes.STRING;
			break;
			case tokenTypes.BOOLEAN:
			operandCode=operandCodes.BOOLEAN;
			break;
			default:
			throw Error("tipo invalido");
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

		/*
		//escolhe a lista de compatibilidade adequada ao tokenType1
		switch (varType1) {
			case operandCodes.INTEGER:
				list=operandCodes.INTEGERVars;
				break;
			case operandCodes.REAL:
				list=operandCodes.REALVars;
				break;
			case operandCodes.CHAR:
				list=operandCodes.CHARVars;
				break;
			case operandCodes.STRING:
				list=operandCodes.STRINGVars;
				break;
			case operandCodes.BOOLEAN:
				list=operandCodes.BOOLEANVars;
				break;
			default:
				throw Error("tipo invalido");
			}*/


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
