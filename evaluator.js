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
	limits=require('./definitions/limits').limits;


var Evaluator = function(definition, memory, isArgument){
	this.nodeTypes=definition;
	this.isArgument = isArgument || false;
	this.memory = memory;
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

	if(this.postfixstack===undefined || this.postfixstack===null){
		console.log("A stack pos fixa esta undefined ou null no evaluator");
		throw "Erro não esperado";
	}
	if(this.postfixstack.length<1){
		console.log("A stack pos fixa esta vazia no evaluator");
		throw "Erro não esperado";
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
				this.throwError("Erro de paridade");
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
				this.throwError("Erro de paridade");
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
				this.throwError("Erro de paridade");
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
				this.throwError("Erro de paridade");
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
				this.throwError("Erro de paridade");
			}
			try{
				var e = new Evaluator(this.nodeTypes,this.memory,true);
				var params=e.evaluate(this.token1,this.level);
				this.resultToken=mathfuncs.calculate(params,this.item);
				
			}
			catch(err){
				this.throwError(err);
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
				this.memory.addVar(new Var(this.token1.value_,this.token2.type_,this.token2.value_,this.level,this.getVarTypeName(this.token2.type_)));
				return this.token2.value_;
			}
			//se a variável já existe e vai receber o mesmo tipo de dados
			if(v.type_==this.token2.type_){
				v.value_=this.token2.value_; //actualiza o valor da variável
				return this.token2.value_;
			}
			else{
				this.throwError("Não é possível a atribuir o valor "+this.token2.value_+" à variavel "+v.name_ +" ("+v.typeName_+")");
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
		if(variable===undefined){
			this.memory.addVar(new Var(varName,this.resultToken.type_,this.resultToken.value_,this.level,this.getVarTypeName(this.token2.type_)));
		}
		else{
			var type=this.memory.getVar(varName).type_;
			if(type==this.resultToken.type_){
				this.memory.setValue(varName,this.resultToken.value_);
			}
			else{
				this.throwError("Não é possível actualizar o conteúdo da variável "+varName+"para outro tipo");
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
		return this.resultToken.value_;
	}/*
	else{
		return this.tempstack[0].value_;
	}*/
};

/*
Evaluator.prototype.evaluateStringExpr = function(expr){
	try{
		return this.evaluate(new Expression().toPostfix(expr));
	}
	catch(e){
		throw e;
	}
};*/

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
				this.throwError("A variável "+stack[i].value_+" nao está definida");
			}
		}
	}
};

Evaluator.prototype.checkFunctions = function(stack){
	for(var i=0; i<stack.length; i++){
		if(stack[i].type_==tokenTypes.FUNC){
			this.throwError("As funções ainda não se encontram implementadas :)");
		}
	}
};

Evaluator.prototype.isntOperator= function(){
	var t=this.item.type_;
	return (t!=tokenTypes.BINARYOP) && (t!=tokenTypes.UNARY_LEFT_OP) &&  (t!=tokenTypes.UNARY_RIGHT_OP) &&(t!=tokenTypes.BINARY_LOGIC_OP) && (t!=tokenTypes.MATHFUNC) &&  (t!=tokenTypes.ASSIGN);
};

Evaluator.prototype.checkCompatibility = function(token1, operator, token2){
	return comp.checkCompatibility(token1.type_, operator.value_, token2.type_);
};

Evaluator.prototype.getFinalType = function(token1, token2){
	return comp.getFinalType(type1.type_, type2.type_);
};

Evaluator.prototype.getVarTypeName = function(typeValue){
	return varTypes[typeValue];
};

Evaluator.prototype.throwError = function(msg){
	throw new Error(msg);
};

module.exports=Evaluator;
