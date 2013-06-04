var tokenTypes=require('./token_types');
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
		'symbol': 'NULL',
		'name': "null",
		'type': 'value',
		'value': undefined,
		'subtype': 'null'
	},
	{
		'id': 4,
		'symbol': 'cos',
		'name': "cosine",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 5,
		'symbol': 'tan',
		'name': "tangent",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 6,
		'symbol': 'asin',
		'name': "arcsine",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 7,
		'symbol': 'acos',
		'name': "arccosine",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 8,
		'symbol': 'atan',
		'name': "arctangent",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 9,
		'symbol': 'sqrt',
		'name': "square root",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 10,
		'symbol': 'log',
		'name': "logarithm",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 11,
		'symbol': 'abs',
		'name': "absolute value",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 12,
		'symbol': 'ceil',
		'name': "round up",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 13,
		'symbol': 'floor',
		'name': "round down",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 14,
		'symbol': 'round',
		'name': "round",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 15,
		'symbol': 'exp',
		'name': 'exponential',
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	},
	{
		'id': 16,
		'symbol': 'pyt',
		'name': "pythagorean theorem",
		'type': 'function',
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
	},
	{
		'id': 19,
		'symbol': 'sin',
		'name': "sine",
		'type': 'function',
		'params': 1,
		'paramTypes': [tokenTypes.NUMBER]
	}
];
