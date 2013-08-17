var tokenTypes=require('../token_types');
module.exports = [
	{
		'id': 1,
		'symbol': 'VERDADEIRO',
		'name': "verdadeiro",
		'type': 'value',
		'value': true,
		'subtype': 'boolean'
	},
	{
		'id': 2,
		'symbol': 'FALSO',
		'name': "falso",
		'type': 'value',
		'value': false,
		'subtype': 'boolean'
	},
	{
		'id': 3,
		'symbol': 'sen',
		'functionName': 'sin',
		'name': "seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 4,
		'symbol': 'cos',
		'functionName': 'cos',
		'name': "co-seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 5,
		'symbol': 'tan',
		'functionName': 'tan',
		'name': "tangente",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 6,
		'symbol': 'arcsin',
		'functionName': 'asin',
		'name': "arco-seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 7,
		'symbol': 'arccos',
		'functionName': 'acos',
		'name': "arco-coseno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 8,
		'symbol': 'arctan',
		'functionName': 'atan',
		'name': "arco-tangente",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 9,
		'symbol': 'raiz',
		'functionName': 'sqrt',
		'name': "raíz quadrada",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 10,
		'symbol': 'log',
		'functionName': 'log',
		'name': "logaritmo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 11,
		'symbol': 'abs',
		'functionName': 'abs',
		'name': "módulo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 12,
		'symbol': 'arredCima',
		'functionName': 'ceil',
		'name': "arredondar para cima",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 13,
		'symbol': 'arredBaixo',
		'functionName': 'floor',
		'name': "arredondar para baixo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 14,
		'symbol': 'arred',
		'functionName': 'round',
		'name': "arredondar",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 15,
		'symbol': 'exp',
		'functionName': 'exp',
		'name': 'exponential',
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 16,
		'symbol': 'pitagoras',
		'functionName': 'pyt',
		'name': "teorema de Pitágoras",
		'type': 'mathFunction',
		'params': 2,
		'paramTypes': [tokenTypes.NUMBER,tokenTypes.NUMBER]
	},
	{
		'id': 17,
		'symbol': 'E',
		'name': "número de Euler",
		'type': 'value',
		'value': Math.E
	},
	{
		'id': 18,
		'symbol': 'PI',
		'name': "Pi",
		'type': 'value',
		'value': Math.PI
	}
];
