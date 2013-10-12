var error=require('./errors/program_error');
var executionError=require('./errors/evaluator_error');
var programError=require('./errors/program_error');

var e1=new executionError("treta");
var x=new Error();
console.log(x instanceof programError);