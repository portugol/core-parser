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
		'value': 'sin',
		'functionName': 'sin',
		'name': "seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 4,
		'symbol': 'cos',
		'value': 'cos',
		'functionName': 'cos',
		'name': "co-seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 5,
		'symbol': 'tan',
		'value': 'tan',
		'functionName': 'tan',
		'name': "tangente",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 6,
		'symbol': 'arcsen',
		'value': 'arcsin',
		'functionName': 'asin',
		'name': "arco-seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 7,
		'symbol': 'arccos',
		'value': 'arccos',
		'functionName': 'acos',
		'name': "arco-coseno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 8,
		'symbol': 'arctan',
		'value': 'arctan',
		'functionName': 'atan',
		'name': "arco-tangente",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 9,
		'symbol': 'raiz',
		'value': 'sqrt',
		'functionName': 'sqrt',
		'name': "raíz quadrada",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 10,
		'symbol': 'log',
		'value': 'log',
		'functionName': 'log',
		'name': "logaritmo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 11,
		'symbol': 'abs',
		'value': 'abs',
		'functionName': 'abs',
		'name': "módulo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 12,
		'symbol': 'arredCima',
		'value': 'ceil',
		'functionName': 'ceil',
		'name': "arredondar para cima",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 13,
		'symbol': 'arredBaixo',
		'value': 'floor',
		'functionName': 'floor',
		'name': "arredondar para baixo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 14,
		'symbol': 'arred',
		'value': 'round',
		'functionName': 'round',
		'name': "arredondar",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 15,
		'symbol': 'exp',
		'value': 'exp',
		'functionName': 'exp',
		'name': 'exponential',
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 16,
		'symbol': 'pitagoras',
		'value': 'pyt',
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
