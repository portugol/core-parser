var tokenTypes=require('../token_types');
module.exports = [
	{
		'id': 1,
		'symbol': 'TRUE',
		'name': "true",
		'type': 'value',
		'value': true,
		'subtype': 'boolean'
	},
	{
		'id': 2,
		'symbol': 'FALSE',
		'name': "false",
		'type': 'value',
		'value': false,
		'subtype': 'boolean'
	},
	{
		'id': 3,
		'symbol': 'sin',
		'value': 'sin',
		'name': "sine",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 4,
		'symbol': 'cos',
		'value': 'cos',
		'name': "cosine",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 5,
		'symbol': 'tan',
		'value': 'tan',
		'name': "tangent",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 6,
		'symbol': 'asin',
		'value': 'asin',
		'name': "arcsine",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 7,
		'symbol': 'acos',
		'value': 'acos',
		'name': "arccosine",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 8,
		'symbol': 'atan',
		'value': 'atan',
		'name': "arctangent",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 9,
		'symbol': 'sqrt',
		'value': 'sqrt',
		'name': "square root",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 10,
		'symbol': 'log',
		'value': 'log',
		'name': "logarithm",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 11,
		'symbol': 'abs',
		'value': 'abs',
		'name': "absolute value",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 12,
		'symbol': 'ceil',
		'value': 'ceil',
		'name': "round up",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 13,
		'symbol': 'floor',
		'value': 'floor',
		'name': "round down",
		'type': 'mathFunction',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 14,
		'symbol': 'round',
		'value': 'round',
		'name': "round",
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
		'symbol': 'pyt',
		'value': 'pyt',
		'name': "pythagorean theorem",
		'type': 'mathFunction',
		'params': 2,
		'paramTypes': [tokenTypes.NUMBER,tokenTypes.NUMBER]
	},
	{
		'id': 17,
		'symbol': 'E',
		'name': "Euler's number",
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
