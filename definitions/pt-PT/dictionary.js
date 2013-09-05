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
		'name': "seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 4,
		'symbol': 'cos',
		'value': 'cos',
		'name': "co-seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 5,
		'symbol': 'tan',
		'value': 'tan',
		'name': "tangente",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 6,
		'symbol': 'arcsen',
		'value': 'asin',
		'name': "arco-seno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 7,
		'symbol': 'arccos',
		'value': 'acos',
		'name': "arco-coseno",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 8,
		'symbol': 'arctan',
		'value': 'atan',
		'name': "arco-tangente",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 9,
		'symbol': 'raiz',
		'value': 'sqrt',
		'name': "raíz quadrada",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 10,
		'symbol': 'log',
		'value': 'log',
		'name': "logaritmo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 11,
		'symbol': 'abs',
		'value': 'abs',
		'name': "módulo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 12,
		'symbol': 'arredCima',
		'value': 'ceil',
		'name': "arredondar para cima",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 13,
		'symbol': 'arredBaixo',
		'value': 'floor',
		'name': "arredondar para baixo",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 14,
		'symbol': 'arred',
		'value': 'round',
		'name': "arredondar",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 15,
		'symbol': 'exp',
		'value': 'exp',
		'name': 'exponential',
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 16,
		'symbol': 'pitagoras',
		'value': 'pyt',
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
