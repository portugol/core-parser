var Expression = require('./expression');
var Token = require('./token');
var tokenTypes= require('./definitions/token_types');
var comp=require('./compatibility/binary_comp').binComp;
var binops=require('./definitions/binary_operators').binops;
var Evaluator = require('./evaluator');
var unaryLeftComp=require('./compatibility/unary_left_comp').unaryLeftComp;
var u=require('./compatibility/unary_right_comp').unaryRightComp;
var nodeTypes= require('../core-master/lib/nodes/definition');
var Memory= require('../core-master/lib/memory');
var Var= require('../core-master/lib/var');
var Graph = require('../core-master/lib/graph');
var Parser = require('./parser');
var util=require('util');
var sys = require('sys');
var events = require('events');


//p.parse("2*(1+sin(0+0))/3"); OK 
//p.parse("a&&b||c&&d"); OK
//p.parse("!(a&&c||b&&a&&!c)"; OK
//p.parse("true&&false"); OK
//p.parse("!(true&&false||false&&true&&!true)"); OK
//p.parse("5*func((1+2),2,3)/4+8"); OK
//p.parse("func(((((((1)))))))"); OK
//p.parse("func(((((((1,2)))))))"); OK lança excepçao
//p.parse("func((),1)"; OK
//p.parse("1*-2"); OK
//p.parse("1--2"); OK
//p.parse("1/-2"); OK
//p.parse("1+-2"); OK
//p.parse("-(2*3/1+2)"); OK
//p.parse("-2*(-3--4)"); OK
//p.parse("1+2"); OK
//p.parse("1+2+3+4+5+6"); OK
//OPERAÇOES INVALIDAS:
//p.parse(")"); ERRO OK (parentesis não esperado)
//p.parse("("); ERRO OK (parentesis não fechado)
//p.parse("1+"); ERRO OK (falta operando)
//p.parse("~(3.0+4*5)"); OK


//TESTES DE OPERAçÕES
//var expr="'a'-'Ϩ'"; o caracter resultante é '\u0000' -> VER O QUE FAZER


try{
	var json={
       "root":{
          "data":"inicio",
          "type":1,
          "next":{
            "data":"a_123=(-(2411.0144)!=-(-2411.0144))&&FALSE",
            "hasExpr":true,
            "type":5,
            "next":{
              "data":"a=TRUE",
              "hasExpr":true,
              "type":5,
              "next":{
                "data":"\"Ola mundo\"",
                "hasExpr":true,
                "type":3,
                "next":{
                  "data":"b=20",
                  "hasExpr":true,
                  "type":5,
                  "next":{
                    "data":"fim",
                    "type":2
                  }
                }
              }
             }
          }
       }
    };

var g = new Graph();

g.validate(json.root);
g.execute(g.root);
console.log(g.memory);




/*
var g = new Graph(json.root);
var p = new Parser(g);
var m = new Memory();
p.createPostfixStacks();
var node=g.root;
while(node!==undefined){
  var ev=new Evaluator(m);
  if(node.type==nodeTypes.PROCESS || node.type==nodeTypes.WRITE){
    console.log(ev.evaluate(node.postfixStack));
  }
	node=node.next;
}
console.log(m);
*/

  /*
  var e = new Expression(nodeTypes.PROCESS);
  var expr="a=2";
  var stack = e.toPostfix(expr,nodeTypes.PROCESS);
  var m = new Memory();
  var ev = new Evaluator(m);
  ev.evaluate(stack);

  expr="b=1";
  stack = e.toPostfix(expr,nodeTypes.PROCESS);
  ev = new Evaluator(m);
  ev.evaluate(stack);

  expr="c=a+b";
  stack = e.toPostfix(expr,nodeTypes.PROCESS);
  ev = new Evaluator(m);
  ev.evaluate(stack);

  expr="d=sin(a)<b*2+100";
  stack = e.toPostfix(expr,nodeTypes.PROCESS);
  ev = new Evaluator(m);
  ev.evaluate(stack);

  console.log(m);
  */
}
catch(err){
	console.log(err.message);
}
