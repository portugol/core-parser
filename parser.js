var Expression = require('./expression'),
	nodeTypes= require('../core-master/lib/nodes/definition'),
	Evaluator = require('./evaluator');

var Parser = function(graph){
	this.graph=graph;
};

Parser.prototype.createPostfixStacks = function(root){
	var node=root||this.graph.root;
	while(node!==undefined){
		if(node.type==nodeTypes.PROCESS || node.type==nodeTypes.WRITE || node.type==nodeTypes.IF){
			//guarda a stack posfixa
			node.postfixStack=new Expression().toPostfix(node.data.toString(),node.type);
		}
		node=node.next;
	}
};

/*
Parser.prototype.evaluate= function(root){
	var node=root||this.graph.root;
	while(node!==undefined){
	  if(node.type==nodeTypes.PROCESS){
	  	this.evaluator.evaluate(node.postfixStack);
	  }
	  else if(node.type==nodeTypes.WRITE){
	  	this.graph.console=this.evaluator.evaluate(node.postfixStack);
	  }
		node=node.next;
	}
};*/

Parser.prototype.evaluate= function(node){
	return this.evaluator.evaluate(node.postfixStack);
};

Parser.prototype.throwError = function(msg){
	this.errormsg = "PARSER ERROR: " + msg;
	throw new Error(this.errormsg);
};

module.exports = Parser;