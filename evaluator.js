var Expression= require('./expression'),
	tokenTypes=require('./definitions/token_types'),
	comp=require('./compatibility/binary_comp').binComp,
	binLogicOps=require('./definitions/binary_logical_operators').logicalOps,
	binOps=require('./definitions/binary_operators').binaryOps,
	leftUnaryOps=require('./definitions/left_unary_operators').leftUnaryOps,
	rightUnaryOps=require('./definitions/right_unary_operators').rightUnaryOps,
	Debug = require('./debug/debug'),
	mathfuncs=require('./definitions/math_funcs').mathFuncs,
	Var=require('./var'),
	varTypes=require('./definitions/var_types'),
	Token= require('./token'),
	limits=require('./definitions/limits').limits,
	EvaluatorError=require('./errors/evaluator_error'),
	ExpressionError=require('./errors/expression_error'),
	conversions=require('./definitions/conversions').conversions,
	dictionary = require('./definitions/dictionary'),
	casts = require('./definitions/casts.js').casts;


var Evaluator = function(definition, memory, lng, isArgument){
	this.nodeTypes=definition;
	this.isArgument = isArgument || false;
	this.memory = memory;
	this.lng=lng;

	try{
  		dictionary = require('./definitions/'+lng+'/dictionary');
	}
	catch(e){
		dictionary = require('./definitions/dev/dictionary');
	}
};

Evaluator.prototype.setLanguage = function(lng) {
	this.lng=lng;
	try{
		dictionary = require('./definitions/'+lng+'/dictionary');
	}
	catch(e){
		dictionary = require('./definitions/dev/dictionary');
	}
};

Evaluator.prototype.evaluate = function(node,level){
	this.tempstack=[];


	//se for argumento de função usa a stack de parametros
	if(this.isArgument===true){
		this.postfixstack=node.parameterStack;
	}
	else{
		this.postfixstack=node.postfixStack;
	}

	this.item={};
	this.resultToken={};
	this.token1={};
	this.token2={};
	this.level=level||0;

	//se a stack não tem items
	if(this.postfixstack.length===0 ||this.postfixstack===undefined || this.postfixstack===null){
		//se é argumento, significa que é um argumento vazio. retorna um array vazio
		if(this.isArgument===true){
			return [];
		}
		else{
			console.log("A stack pos fixa esta undefined ou null no evaluator");
			this.throwError("UNEXPECTED_ERROR");
		}
	}
	if(this.postfixstack.length<1){
		console.log("A stack pos fixa esta vazia no evaluator");
		this.throwError("UNEXPECTED_ERROR");
	}
	this.checkMemoryVars(this.postfixstack,this.memory);
	this.checkFunctions(this.postfixstack);

	while(this.postfixstack.length>0){
		//o shift remove o primeiro elemento da pilha
		this.item=this.postfixstack.shift();
		//carregar operandos para a pilha
		while(this.isntOperator()){
			//o unshift adiciona elementos no inicio da pilha
			//passa o token para a pilha temporaria
			this.tempstack.push(this.item);
			if(this.postfixstack.length>0){
				//retira um novo item da stack pos fixa
				this.item=this.postfixstack.shift();
			}
			else{
				break;
			}
		}
		//se o token for um operador binario
		if(this.item.type_==tokenTypes.BINARYOP){
			this.token2=this.tempstack.pop();
			this.token1=this.tempstack.pop();
			if(this.token1===undefined || this.token2===undefined){
				this.throwError("PARITY_ERROR");
			}
			try{
				this.resultToken=binOps.calculate(this.token1, this.token2, this.item);
			}
			catch(err){
				this.throwError(err);
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.UNARY_LEFT_OP){
			this.token1=this.tempstack.pop();
			if(this.token1===undefined){
				this.throwError("PARITY_ERROR");
			}
			try{
				this.resultToken=leftUnaryOps.calculate(this.token1, this.item);
			}
			catch(err){
				this.throwError(err);
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.UNARY_RIGHT_OP){
			this.token1=this.tempstack.pop();
			if(this.token1===undefined){
				this.throwError("PARITY_ERROR");
			}
			try{
				this.resultToken=rightUnaryOps.calculate(this.token1, this.item);
			}
			catch(err){
				this.throwError(err);
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.BINARY_LOGIC_OP){
			this.token2=this.tempstack.pop();
			this.token1=this.tempstack.pop();
			if(this.token1===undefined || this.token2===undefined){
				this.throwError("PARITY_ERROR");
			}
			try{
				this.resultToken=binLogicOps.calculate(this.token1, this.token2, this.item);
			}
			catch(err){
				this.throwError(err);
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.MATHFUNC){
			//argumento da função
			this.token1=this.tempstack.pop();
			if(this.token1===undefined){
				this.throwError("PARITY_ERROR");
			}
			var params;
			try{
				var e = new Evaluator(this.nodeTypes,this.memory, this.lng, true);
				params=e.evaluate(this.token1,this.level);
			}
			catch(err){
				throw err;
			}
			try{
				this.resultToken=mathfuncs.calculate(params,this.item);
			}
			catch(err){
				throw err;
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.ASSIGN){
			this.token2=this.tempstack.pop();
			this.token1=this.tempstack.pop();
			//procura a variável pelo nome na memória
			var v = this.memory.getVar(this.token1.value_);
			//se a variável não existir na memória
			if(v===undefined){
				//cria a variável (depois mudar o nível da variável!!!!!!!!!)
				//this.memory.addVar(new Var(this.token1.value_,this.token2.type_,this.token2.value_,this.level,this.getVarTypeName(this.token2.type_)));
				this.memory.addVar(new Var(this.token1.value_,this.token2.type_,this.token2.value_,this.level,conversions.codeToVarType(this.token2.type_)));
				return this.token2.value_;
			}
			//se a variável já existe e vai receber o mesmo tipo de dados
			if(v.type_==this.token2.type_){
				v.value_=this.token2.value_; //actualiza o valor da variável
				return this.token2.value_;
			}
			else{
				try{
					v.setValue(casts.castToType(this.token2,v.getType()));
					return v.getValue();
				}
				catch(err){
					var parameters=[this.token2.value_, "VarTypes."+conversions.codeToVarType(this.token2.type_), v.name_,"VarTypes."+conversions.codeToVarType(v.getType())];
					this.throwError("INCOMPATIBLE_ASSIGN",parameters);
				}
			}
		}
		else{
			//NO CASO DA EXPRESSÃO NÃO TER OPERADORES
			this.resultToken=this.tempstack[0];
		}
	}
	//criar variável na memória ou actualizar se for um nó do tipo READ
	if(node.type==this.nodeTypes.READ){
		var varName=node.data;
		var variable=this.memory.getVar(varName);
		//se a variável não existe
		if(variable===undefined){
			//this.memory.addVar(new Var(varName,this.resultToken.type_,this.resultToken.value_,this.level,this.getVarTypeName(this.token2.type_)));
			this.memory.addVar(new Var(varName,this.resultToken.type_,this.resultToken.value_,this.level,conversions.codeToVarType(this.resultToken.type_)));
		}
		else{
			//se o tipo da variável é igual ao tipo do token
			if(variable.type_==this.resultToken.type_){
				this.memory.setValue(varName,this.resultToken.value_);
			}
			else{
				//var parameters=[this.resultToken.value_, "VarTypes."+this.getVarTypeName(this.resultToken.type_), variable.name_,"VarTypes."+this.getVarTypeName(variable.type_)];
				var parameters=[this.resultToken.value_, "VarTypes."+conversions.codeToVarType(this.resultToken.type_), variable.name_,"VarTypes."+conversions.codeToVarType(variable.type_)];
				this.throwError("INCOMPATIBLE_UPDATE",parameters);
			}
		}
	}
	if(this.isArgument){
		return this.tempstack;
	}
	if(this.resultToken.type_==tokenTypes.INTEGER){
		return parseInt(this.resultToken.value_,10);
	}
	if(this.resultToken.type_==tokenTypes.REAL){
		return parseFloat(this.resultToken.value_,10);
	}
	if(this.resultToken.type_==tokenTypes.CHAR){
		return this.resultToken.value_;
	}
	if(this.resultToken.type_==tokenTypes.STRING){
		return this.resultToken.value_;
	}
	if(this.resultToken.type_==tokenTypes.BOOLEAN){
		var result;
		//procurar no dicionário a tradução para a língua utilizada
		for(var i=0; i<=dictionary.length; i++){
			if(dictionary[i].value==this.resultToken.value_){
				result=dictionary[i].symbol;
				break;
			}
		}
		return result;
	}/*
	else{
		return this.tempstack[0].value_;
	}*/
};

Evaluator.prototype.checkMemoryVars = function(stack,mem){
	var i=0;
	//se o último item da stack for do tipo tipo atribuição então o primeiro item da stack é
	//a variável que recebe o valor da operação
	if(stack[stack.length-1].type_==tokenTypes.ASSIGN){
		i=1; //salta primeiro item da stack
	}
	for(i; i<stack.length; i++){
		if(stack[i].type_==tokenTypes.VAR){
			var v = mem.getVar(stack[i].value_);
			//se a variável existe em memória substitui pelo seu valor.
			if(v!==undefined){
				stack[i]=new Token(v.type_,v.value_);
			}
			else{
				var parameters=[stack[i].value_];
				this.throwError("UNDEFINED_VAR",parameters);
			}
		}
	}
};

Evaluator.prototype.checkFunctions = function(stack){
	for(var i=0; i<stack.length; i++){
		if(stack[i].type_==tokenTypes.FUNC){
			this.throwError("FUNCTION_NOT_IMPLEMENTED");
		}
	}
};

Evaluator.prototype.isntOperator= function(){
	var t=this.item.type_;
	return (t!=tokenTypes.BINARYOP) && (t!=tokenTypes.UNARY_LEFT_OP) &&  (t!=tokenTypes.UNARY_RIGHT_OP) &&(t!=tokenTypes.BINARY_LOGIC_OP) && (t!=tokenTypes.MATHFUNC) &&  (t!=tokenTypes.ASSIGN);
};

Evaluator.prototype.checkCompatibility = function(token1, operator, token2){
	if(operator===undefined){

	}
	return comp.checkCompatibility(token1.type_, operator.value_, token2.type_);
};

Evaluator.prototype.getFinalType = function(token1, token2){
	return comp.getFinalType(type1.type_, type2.type_);
};

Evaluator.prototype.getVarTypeName = function(typeValue){
	return varTypes[typeValue];
};

Evaluator.prototype.throwError = function(errorCode, parameters){
	if(parameters===undefined){
		parameters=[];
	}
	throw new EvaluatorError(errorCode,parameters);
};

module.exports=Evaluator;
