var Expression= require('./expression'),
	tokenTypes=require('./definitions/token_types'),
	comp=require('./compatibility/binary_comp'),
	binLogicOps=require('./definitions/binary_logical_operators'),
	binOps=require('./definitions/binary_operators'),
	leftUnaryOps=require('./definitions/left_unary_operators'),
	rightUnaryOps=require('./definitions/right_unary_operators'),
	Debug = require('./debug/debug'),
	mathfuncs=require('./definitions/math_funcs'),
	Var=require('./var'),
	varTypes=require('./definitions/var_types'),
	Token= require('./token'),
	limits=require('./definitions/limits'),
	EvaluatorError=require('./errors/evaluator_error'),
	ExpressionError=require('./errors/expression_error'),
	conversions=require('./definitions/conversions'),
	casts = require('./definitions/casts.js'),
	htmlEscape= require('./tools/html_escape');


var Evaluator = function(definition, memory, lng, isArgument){
	this.nodeTypes=definition;
	this.isArgument = isArgument || false;
	this.memory = memory;
	this.lng=lng;

	try{
  		this.dictionary = require('./definitions/'+lng+'/dictionary');
	}
	catch(e){
		this.dictionary = require('./definitions/dev/dictionary');
	}
};

Evaluator.prototype.setLanguage = function(lng) {
	this.lng=lng;
	try{
		this.dictionary = require('./definitions/'+lng+'/dictionary');
	}
	catch(e){
		this.dictionary = require('./definitions/dev/dictionary');
	}
};

Evaluator.prototype.evaluate = function(node,graph){
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
				throw err;
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.UNARY_LEFT_OP){
			this.token1=this.tempstack.pop();
			if(this.token1===undefined){
				this.throwError("PARITY_ERROR");
			}
			try{
				this.resultToken=leftUnaryOps.calculate(this.token1, this.item, this.dictionary);
			}
			catch(err){
				throw err;
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.UNARY_RIGHT_OP){
			this.token1=this.tempstack.pop();
			if(this.token1===undefined){
				this.throwError("PARITY_ERROR");
			}
			try{
				this.resultToken=rightUnaryOps.calculate(this.token1, this.item, this.dictionary);
			}
			catch(err){
				throw err;
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
				this.resultToken=binLogicOps.calculate(this.token1, this.token2, this.item, this.dictionary);
			}
			catch(err){
				throw err;
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
				params=e.evaluate(this.token1);
			}
			catch(err){
				throw err;
			}
			try{
				this.resultToken=mathfuncs.calculate(params,this.item,this.dictionary);
			}
			catch(err){
				console.log(err);
				throw err;
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.ASSIGN){
			this.token2=this.tempstack.pop();
			this.token1=this.tempstack.pop();

			var variableName=this.token1.value_;

			var resultType=this.token2.type_;
			var resultValue=this.token2.value_;
			var resultSymbol=this.escapeHtml(this.token2.symbol_);

			//procura a variável pelo nome na memória
			var v = this.memory.getVar(variableName);
			//se a variável não existir na memória
			if(v===undefined){
				var variable=new Var(variableName,resultType,resultValue,resultSymbol,node.level,conversions.codeToVarType(resultType));
				this.memory.addVar(variable);
				graph.memoryChanged=true;
				return resultSymbol;
			}
			//se a variável vai receber o mesmo tipo de dados
			if(v.type_==resultType){
				v.setValue(resultValue); //actualiza o valor da variável
				v.setSymbol(resultSymbol); //actualiza o valor visual da variável
				graph.memoryChanged=true;
				return resultSymbol;
			}
			//se os tipo de variável é diferente do resultado obtido
			else{
				try{
					//se for possível fazer cast significa que o valor da variável é igual ao valor visual (símbolo)
					//exemplos:
					//1.5 -> 1 (double -> int)  value:1, symbol:1
					//'c' -> "c" (char -> String)  value: "c", symbol:"c"
					//os boolean não podem ser convertidos para outros tipos ou vice-versa
					//portanto não há problemas de multilingua, em que o símbolo é diferente do value
					// exemplo pt-PT -> value:true , symbol:"VERDADEIRO"
					// exemplo en-US -> value:true , symbol:"TRUE"
					//
					//conclusao: neste caso os atributos 'value' e 'symbol' da variável são iguais
					
					var value=casts.castToType(this.token2,v.getType());
					v.setValue(value);
					v.setSymbol(value.toString());
					graph.memoryChanged=true;
					return value;
				}
				catch(err){
					var parameters=[resultSymbol, "VarTypes."+conversions.codeToVarType(resultType), v.name_,"VarTypes."+conversions.codeToVarType(v.getType())];
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
		var v=this.memory.getVar(varName);

		var resultType=this.resultToken.type_;
		var resultValue=this.resultToken.value_;
		var resultSymbol=this.resultToken.symbol_;

		//se a variável não existe
		if(v===undefined){
			this.memory.addVar(new Var(varName,resultType,resultValue,resultSymbol,node.level,conversions.codeToVarType(resultType)));
			graph.memoryChanged=true;
			return resultSymbol;
		}
		else{
			//se o tipo da variável é igual ao tipo do token
			if(v.type_==resultType){
				this.memory.setValue(varName,resultValue);
				this.memory.setSymbol(varName,resultSymbol);
				return resultSymbol;
			}
			else{
				try{
					var value=v.setValue(casts.castToType(this.resultToken,v.getType()));
					v.setSymbol(value.toString()); //ALTERADO AQUI
					return value;
				}
				catch(err){
					var parameters=[resultSymbol, "VarTypes."+conversions.codeToVarType(resultType), v.name_,"VarTypes."+conversions.codeToVarType(v.type_)];
					this.throwError("INCOMPATIBLE_ASSIGN",parameters);
				}
			}
		}
	}
	if(this.isArgument){
		return this.tempstack;
	}
	if(this.resultToken.type_==tokenTypes.INTEGER){
		return conversions.getIntValue(this.resultToken.value_,this.resultToken.type_);
	}
	if(this.resultToken.type_==tokenTypes.REAL){
		return conversions.getRealValue(this.resultToken.value_);
	}
	if(this.resultToken.type_==tokenTypes.CHAR){
		return this.resultToken.value_;
	}
	if(this.resultToken.type_==tokenTypes.STRING){
		return this.resultToken.value_;
	}
	if(this.resultToken.type_==tokenTypes.BOOLEAN){
		var result=this.resultToken.value_;
		//se o nó for IF apenas necessita da tag true ou false para escolher o ramo certo
		if(node.type==this.nodeTypes.IF){
			return result;
		}
		//se o nó não for IF precisa da tag true ou false traduzida para a respectiva língua
		else{
			try{
				//procurar no dicionário a tradução para a língua utilizada
				for(var i=0; i<=this.dictionary.length; i++){
					if(this.dictionary[i].value==this.resultToken.value_){
						result=this.dictionary[i].symbol; //actualiza result
						break;
					}
				}
			}
			catch(err){
				this.throwError("UNEXPECTED_ERROR");
			}
		}
		return result;
	}
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
				stack[i]=new Token(v.type_,v.value_,v.symbol_);
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

Evaluator.prototype.escapeHtml = function(string){
  return htmlEscape.escapeHtml(string);
};

Evaluator.prototype.throwError = function(errorCode, parameters){
	if(parameters===undefined){
		parameters=[];
	}
	throw new EvaluatorError(errorCode,parameters);
};

module.exports=Evaluator;
