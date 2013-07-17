////////////////////////////////////////////////////
//////////         PARSER TESTING         //////////
////////////////////////////////////////////////////

//
// mocha testes_parser.js
// $ npm install <package> --save


//Requires do parser
var Expression = require('../expression');
var Token = require('../token');
var tokenTypes= require('../definitions/token_types');
var comp=require('../compatibility/binary_comp').binComp;
var binops=require('../definitions/binary_operators').binops;
var Evaluator = require('../evaluator');
var unaryLeftComp=require('../compatibility/unary_left_comp').unaryLeftComp;
var u=require('../compatibility/unary_right_comp').unaryRightComp;
var Var= require('../var');
var Parser = require('../parser');
var util=require('util');
var sys = require('sys');
var events = require('events');
var chai = require('chai');


var assert = chai.assert,
	expect = chai.expect,
	should = chai.should(); //Should tem de ser executado

var Memory= require('../../core/lib/memory');
var Write = require('../../core/lib/nodes/write');
var nodeTypes= require('../../core/lib/nodes/definition');





//console.log(evaluator.evaluate(node));


describe(' Soma (+) ', function () {
  it('should return with error', function() {
  	var error;
  	try {
		var node = new Write("1+TRUE");
		var memory = new Memory();
		var expression = new Expression(tokenTypes);
		var evaluator = new Evaluator(tokenTypes,memory);

		var postfix=expression.toPostfix(node.data,nodeTypes.WRITE);
		node.postfixStack=postfix;
		console.log(postfix);

	    evaluator.evaluate(node);
	} catch (e) {
		error = e;
	}
	if(error === undefined) {
		throw new Error('Pass');
	}
  });
});


describe(' Soma (+) ', function (){
  it('should return without error', function() {
	var node = new Write("1+1");
	var memory = new Memory();
	var expression = new Expression(tokenTypes);
	var evaluator = new Evaluator(tokenTypes,memory);

	var postfix=expression.toPostfix(node.data,nodeTypes.WRITE);
	node.postfixStack=postfix;
	console.log(postfix);

    evaluator.evaluate(node);
  });
});

