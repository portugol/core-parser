var sys = require('sys'),
	definitions= require('./definitions/dev/dictionary'),
	prio= require('./definitions/priorities'),
	tokenTypes= require('./definitions/token_types'),
	Token=require('./token'),
	util = require('util'),
	Debug = require('./debug/debug'),
	nodeNames = require('./definitions/node_names'),
	ExpressionError=require('./errors/expression_error');

var LPAREN       = 1 << 1;
var RPAREN       = 1 << 2;
var COMMA        = 1 << 3;
var SIGNAL       = 1 << 4;
var CALL         = 1 << 5;
var NOT          = 1 << 7;
var BOOLEAN      = 1 << 8;
var TEXT         = 1 << 9;
var ARITHMETICOP = 1 << 10;
var LOGICOP      = 1 << 11;
var NUMBER       = 1 << 12;
var BITWISE_NOT  = 1 << 13;
var VAR          = 1 << 14;
var FACT         = 1 << 15;
var MATHFUNC_CALL = 1<< 16;
var PRIMARY      = (NUMBER | TEXT | BOOLEAN);

var Expression = function(lng, definition, nodeType_, isArgument, outsidePos, isDebug){
  this.lng=lng||"dev";
  this.nodeTypes = definition;
  this.isArgument = isArgument || false;
  this.isDebug = isDebug || false;
  this.outsidePos = outsidePos||0;
  
  this.nodeType_=nodeType_;

  try{
  	definitions = require('./definitions/'+lng+'/dictionary');
  }
  catch(e){
  	definitions = require('./definitions/dev/dictionary');
  }
};

if (!Array.indexOf) {
	Array.prototype.indexOf = function (obj, start) {
		for (var i = (start || 0); i < this.length; i++) {
			if (this[i] === obj) {
				return i;
			}
		}
		return -1;
	};
}

Expression.prototype.setLanguage = function(lng){
  this.lng=lng;
  definitions = require('./definitions/'+lng+'/dictionary');
};

Expression.prototype.setExpr = function(expr){
	this.expr=expr;
	this.pos=0;
};

Expression.prototype.toPostfix = function(expr,nodeType_){
	this.nodeType_=nodeType_||this.nodeType_;
	this.expr=expr;
	this.errormsg="";
	this.pos=0;
	this.tokenValue=0;
	this.tokenSymbol=0;
	this.tokenprio=0;
	this.tokentype=0;
	this.tmpstr="";
	var expected=(PRIMARY | VAR | LPAREN | SIGNAL | NOT | BITWISE_NOT);
	this.numOperands=0;
	this.operStack = [];
	this.postfixStack=[];
	this.parameterStack=[];
	
	//SE A EXPRESSAO É NULA (tamanho=0)
	try{
		if(expr.length===0){
			return []; //devolve array vazio
		}
	}
	catch(e){
		if(expr===null || expr===undefined){
			return [];
		}
		throw e;
	}

	while(this.pos<this.expr.length){
		/*if(this.isUnaryOp()){
			if((expected & UNARY) === 0){
				//MUDAR PARA EXCEPÇAO
				console.log("ERRO: Nao e esperado um operador UNARY");
				break;
			}
			this.addOperator(postfixStack, operStack, tokenTypes.OPERATOR);
			expected=(PRIMARY | LPAREN | FUNCTION);
		}*/
		if(this.isBitwiseNot()){
			if((expected & BITWISE_NOT) === 0){
				this.throwError("UNEXPECTED_BITWISE_NOT",this.pos);
				//throw new Error("Nao e esperado um operador NOT");
			}
			this.addOperator(tokenTypes.UNARY_LEFT_OP);
			expected=(NUMBER| LPAREN | VAR);
		}
		else if(this.isArithmeticOp()){
			if((expected & ARITHMETICOP) === 0){
				//****************************************************************
				// VERIFICAR SE O OPERANDO É DO TIPO BOOLEAN. DA ERRO
				//****************************************************************
				if(this.getLastType()==tokenTypes.BOOLEAN){
					var parameters=[this.tokenSymbol];
					this.throwError("UNEXPECTED_ARITHMETICOP",this.pos,parameters);
				}
				//****************************************************************
				//VERIFICAR SE É UM SINAL (negativo ou positivo) E AGRUPAR SINAIS
				//****************************************************************
				var counter=0;
				var signals=[];
				//verificar se há sinais positivos e negativos
				while(this.isSignal()){
					counter++;
					if((expected & SIGNAL) === 0){
						var parameters=[this.tokenSymbol];
						this.throwError("UNEXPECTED_SIGNAL",this.pos,parameters);
					}
					signals.push(this.tokenValue); //guarda sinal numa pilha				
					this.pos++;
				}
				//****************************************************************
				// NAO ENCONTROU SINAIS
				//****************************************************************
				if(counter===0){
					var parameters=[this.tokenSymbol];
					this.throwError("UNEXPECTED_BINARYOP",this.pos,parameters);
				}
				//****************************************************************
				// ENCONTROU UM OU MAIS SINAIS
				//****************************************************************
				else{
					var previous=signals.pop();
					while(signals.length>0){
						var next=signals.pop();
						if(next===previous){
							previous="+"; //sinais iguais -> +
						}
						else{
							previous="-"; //sinais diferentes -> -
						}
					}
					this.pos--; //acertar posição actual
					//se o resultado for um sinal negativo cria o token
					if(previous=="-"){
						this.tokenValue=previous;
						this.tokenSymbol=this.tokenValue;
						this.tokenprio=prio.UNARY;
						this.addOperator(tokenTypes.UNARY_LEFT_OP);
					}
					expected=(NUMBER | LPAREN |VAR | BITWISE_NOT);
				}
			}
			//****************************************************************
			// É ESPERADO UM OPERADOR ARITMÉTICO
			//****************************************************************
			else{
				this.addOperator(this.tokentype);
				expected=(NUMBER| TEXT | LPAREN | VAR | SIGNAL | BITWISE_NOT);
			}
		}
		else if(this.isLogicOp()){
			if((expected & LOGICOP)===0){
				var parameters=[this.tokenSymbol];
				this.throwError("UNEXPECTED_LOGICOP",this.pos,parameters);
			}
			this.addOperator(tokenTypes.BINARY_LOGIC_OP);
			expected=( PRIMARY | LPAREN | VAR | NOT | SIGNAL);
			//expected=( BOOLEAN | LPAREN | VAR | NOT);	
		}
		else if(this.isNumber()){
			if((expected & NUMBER) === 0){
				var parameters=[this.tokenSymbol];
				this.throwError("UNEXPECTED_NUMBER",this.pos,parameters);
				//throw new Error("Nao e esperado um numero");
			}
			if(this.isArgument){
				expected = (ARITHMETICOP| RPAREN | COMMA | FACT | LOGICOP);
			}
			else{
				expected = (ARITHMETICOP | RPAREN | FACT | LOGICOP);
			}
			this.addOperand(this.tokentype);
		}
		else if(this.isLeftPar()){
			if((expected & LPAREN) === 0){
				this.throwError("UNEXPECTED_LEFTPAR",this.pos);
				//throw new Error("Nao e esperado um parentesis esquerdo");
			}
			//****************************************************************
			// SE É ESPERADA UMA FUNÇAO
			//****************************************************************
			if ((expected & CALL) || (expected & MATHFUNC_CALL)) {
				//****************************************************************
				// MODIFICA O TIPO DE TOKEN DE VARIAVEL PARA FUNCAO
				//****************************************************************
				if(expected & CALL){
					var aux = this.postfixStack.pop();
					this.tokenprio=prio.VALUE;
					this.tokenValue=aux.value_;
					this.tokenSymbol=this.tokenValue;
					this.addOperator(tokenTypes.FUNC);
				}
				//****************************************************************
				// AADQUIRE O ARGUMENTO DA FUNÇAO E AVALIA RECURSIVAMENTE
				//****************************************************************
				var leftPar=1;
				var oldpos=this.pos;
				var str="";

				while(leftPar!==0 && this.pos<this.expr.length){
					str+=this.expr.charAt(this.pos);
					if(this.expr.charAt(this.pos)=="("){
						leftPar++;
					}
					if(this.expr.charAt(this.pos)==")"){
						leftPar--;
					}
					this.pos++;
				}
				//ao procurar argumento chegou ao final da expressao, logo esta mal construida
				if(this.pos>this.expr.length){
					var parameters=[str];
					this.throwError("BAD_ARGUMENT",oldpos,parameters);
				}
				//guarda argumento da funçao
				var argument=this.expr.substring(oldpos,this.pos-1);
				//avaliar recursivamente a expressão do argumento
				var outsidePos=oldpos+this.outsidePos;
				this.parameterStack= new Expression(this.lng,this.nodeTypes,undefined,true,outsidePos).toPostfix(argument);

				//cria o token do tipo argumento que guarda a stack com os parâmetros da funçao
				this.tokenValue="argument";
				this.tokenSymbol=argument;
				this.tokenprio=prio.VALUE;
				this.addOperand(tokenTypes.ARGUMENT);
				if(this.isArgument){
					//se for argumento é permitido ter uma vírgula seguir ao parentesis direito da função
					//exemplo --->   func(func(1,2),3)
					//                             |
					//                             ---------->permitido 
					expected = (ARITHMETICOP | LOGICOP | RPAREN | FACT | COMMA) ;
				}
				else{
					expected = (ARITHMETICOP | LOGICOP | RPAREN | FACT) ;
				}
			}
			//****************************************************************
			// É UM PARENTESIS  ESQUERDO SIMPLES
			//****************************************************************
			else{
				this.addOperator(tokenTypes.PARENT);
				expected = (PRIMARY | LPAREN | VAR | SIGNAL | NOT | RPAREN | BITWISE_NOT);
			}
		}
		else if(this.isRightPar()){
			if((expected & RPAREN) === 0){
				this.throwError("UNEXPECTED_RIGHTPAR",this.pos);
				//throw new Error("Nao e esperado um parentesis direito");
			}
			else{
				if(this.isArgument){
					expected = (ARITHMETICOP | LOGICOP | RPAREN | FACT | COMMA);
				}
				//expectedParameter=NOPARAMETER; //já não são esperados parâmetros
				else{
					expected = (ARITHMETICOP | LOGICOP | RPAREN | FACT);
				}
			}
			this.tokenValue=")";
			this.tokenSymbol=this.tokenValue;
			this.tokenprio=prio.PARENT;
			this.addOperator(tokenTypes.PARENT);
		}
		else if(this.isNot()){
			if((expected & NOT) === 0){
			//verifica se é factorial
				if((expected & FACT) !== 0){
					this.tokenValue="!";
					this.tokenSymbol=this.tokenValue;
					this.tokenprio=prio.UNARY;
					this.addOperator(tokenTypes.UNARY_RIGHT_OP);
					expected=(ARITHMETICOP | RPAREN);
				}
				else{
					this.throwError("UNEXPECTED_NOT",this.pos);
				}
			}
			else{
				this.addOperator(tokenTypes.UNARY_LEFT_OP);
				expected=(BOOLEAN | LPAREN | VAR);
			}
		}
		//Se o caracter é uma vírgula
		else if (this.isComma()) {
			//Se não é esperada uma vírgula dá erro
			if ((expected & COMMA) === 0) {
				this.throwError("UNEXPECTED_COMMA",this.pos);
				//throw new Error("unexpected \",\"");
			}
			//this.addOperator(tokenTypes.COMMA);
			//this.numOperands+=1;
			this.tokensymnol=",";
			this.tokenprio=prio.COMMA;
			this.addOperator(tokenTypes.COMMA);
			expected = (PRIMARY | VAR | SIGNAL | NOT | LPAREN | BITWISE_NOT);
		}
		else if(this.isChar()){
			if((expected & TEXT) === 0){
				var parameters=[this.tokenSymbol];
				this.throwError("UNEXPECTED_CHAR",this.pos,parameters);
			}
			this.addOperand(tokenTypes.CHAR);
			if(this.isArgument){
				expected = (ARITHMETICOP | LOGICOP | RPAREN | COMMA);
				//expected = (ARITHMETICOP | RPAREN | COMMA);
			}
			else{
				expected = (ARITHMETICOP | LOGICOP | RPAREN);
				//expected = (ARITHMETICOP | RPAREN);
			}
		}
		else if(this.isString()){
			if((expected & TEXT) === 0){
				var parameters=[this.tokenSymbol];
				this.throwError("UNEXPECTED_STRING",this.pos,parameters);
				//throw new Error("Nao e esperada uma string");
			}
			this.addOperand(tokenTypes.STRING);
			if(this.isArgument){
				expected = (ARITHMETICOP | LOGICOP | RPAREN | COMMA);
				//expected = (ARITHMETICOP | RPAREN | COMMA);
			}
			else{
				expected = (ARITHMETICOP | LOGICOP | RPAREN);
				//expected = (ARITHMETICOP | RPAREN | COMMA);
			}
		}
		//****************************************************************
		// SE ENCONTRAR TEXTO GUARDA-O NUMA VARIAVEL E VERIFICA O QUE É (variavel, funcao, etc..)
		//****************************************************************
		//o método getText() procura texto e guarda-o na string temporária tmpstr
		else if(this.getText().length>0){
			var i;
			//Procura o símbolo nas definitions
			for(i=0; i<definitions.length; i++){
				//se encontrar o símbolo nas definitions
				if(definitions[i].symbol==this.tmpstr){
					this.tokenprio=prio.VALUE;
					// se é do tipo value
					if(definitions[i].type=='value'){
						this.tokenSymbol=definitions[i].symbol;
						this.tokenValue=definitions[i].value;
						//se o subtipo é boolean 
						if(definitions[i].subtype=='boolean'){
							//this.tokenValue=definitions[i].value;
							//verifica se é esperado este subtipo.
							if((expected & BOOLEAN)===0){
								var parameters=[this.tmpstr];
								this.throwError("UNEXPECTED_BOOLEAN",(this.pos-definitions[i].symbol.length+1),parameters);
							}
							this.addOperand(tokenTypes.BOOLEAN);
							expected = (LOGICOP | RPAREN);
							//se neste momento é um argumento é esperada também uma vírgula
							if(this.isArgument){
								expected = (LOGICOP | RPAREN | COMMA);
							}
						}
						//se o subtipo é null 
						else if(definitions[i].subtype=='null'){
							this.addOperand(tokenTypes.NULL);
							expected = (ARITHMETICOP | LOGICOP | RPAREN);
						}
						//o subtipo não é boolean nem null
						//se neste momento está a ser avaliado um argumento é esperada  ainda uma vírgula
						else if(this.isArgument){
							this.addOperand(tokenTypes.REAL);
							expected = (ARITHMETICOP | LOGICOP | RPAREN | COMMA);
						}
						else{
							this.addOperand(tokenTypes.REAL);
							expected = (ARITHMETICOP | LOGICOP | RPAREN);
						}
					}
					//é uma definition do tipo função
					else if(definitions[i].type=='mathFunction'){
						this.tokenSymbol=definitions[i].symbol;
						this.tokenValue=definitions[i].functionName;
						var completeName=definitions[i].name;
						var extraParameters={"funcName":completeName};
						this.addOperator(tokenTypes.MATHFUNC,extraParameters);
						expected = (LPAREN | MATHFUNC_CALL);
					}
					break; //quebra o for
				}
			}
			//se percorrer a lista e não encontrar uma definition correspondente
			//é uma variável (ou função)
			if(i>=definitions.length){
				//Se não é esperada uma variável dá erro
				if ((expected & VAR) === 0) {
					var parameters=[this.tokenSymbol];
					this.throwError("UNEXPECTED_VAR",this.pos,parameters);
					//throw new Error("Nao e esperada uma variavel");
				}
				this.tokenprio=prio.VALUE;
				this.addOperand(tokenTypes.VAR);
				//é esperado também um parentesis esquerdo porque pode ser uma função
				expected = (ARITHMETICOP | LOGICOP | LPAREN | RPAREN | CALL | FACT);
			}
		}
		else if(this.isAssign()){
			if(this.isArgument){
				var parameters=[this.expr];
				this.throwError("ARGUMENT_ASSIGN",this.pos,parameters);
			}
			if(this.nodeType_!=this.nodeTypes.PROCESS){
				var parameters=["NodeTypes."+nodeNames[this.nodeType_]];
				//console.log("PARAMETERS");
				//console.log(parameters);
				this.throwError("INVALID_NODE_ASSIGN",this.pos,parameters);
			}
			//o item é o item que fica antes do sinal de igual
			var item=this.postfixStack[this.postfixStack.length-1];
			//console.log(item);
			//se ainda só existe um elemento na postfixstack e esse elemento é uma Variável
			//a atribuição é válida, e por isso adiciona o operador = à stack
			if(this.postfixStack.length==1 && item.type_==tokenTypes.VAR){
				this.addOperator(tokenTypes.ASSIGN);
			}
			else{
				//expressão até ao sinal de igual
				var badVar=this.expr.substring(0,this.pos-1);
				var parameters=[badVar];
				this.throwError("NOT_VAR_ASSIGN",this.pos,parameters);
			}
			expected = (PRIMARY | VAR | LPAREN | BITWISE_NOT | NOT | SIGNAL);
		}
		else if(this.isWhite()){
			//salta espaço em branco
		}
		else {
			this.throwError("INVALID_OPERATION",this.pos);
		}
	} //FIM DO WHILE
	//descarrega os operadores restantes para a pilha pos fixa
	this.popAll();
	if(this.isArgument){
		this.removeCommas();
	}

	if(this.isDebug){
		console.log("numero de operandos: "+this.numOperands);
		console.log("numero de tokens:"+this.postfixStack.length);
	}
	if((this.numOperands+1!=this.postfixStack.length) && this.postfixStack.length>0){
		this.throwError("MISSING_OPERANDS",this.pos+1);
		//throw new Error("Faltam operandos na expressão");
	}
	
	if(this.isDebug){
		var dbg = new Debug();
		console.log("POSTFIXTACK:");
		dbg.printStack(this.postfixStack);
		console.log("OPERATOR STACK:");
		dbg.printStack(this.operStack);
	}


	return this.postfixStack;
};

Expression.prototype.removeCommas = function(){
	var tempStack=[];
	var item={};
	while(this.postfixStack.length>0){
		//retira o primeiro item da pilha
		item=this.postfixStack.shift();
		if(item.type_!=tokenTypes.COMMA){
			tempStack.push(item);
		}
	}
	this.postfixStack=tempStack;
};

Expression.prototype.isAssign = function(){
	var code1 = this.expr.charAt(this.pos);
	var code2 = this.expr.charAt(this.pos+1);

	if(code1=="=" && code2!="="){
		this.pos++;
		this.tokenValue="=";
		this.tokenSymbol=this.tokenValue;
		this.tokenprio=prio.ASSIGN;
		return true;
	}
	return false;
};

Expression.prototype.getLastType = function(){
	if(this.postfixStack.length>0){
		return this.postfixStack[this.postfixStack.length-1].type_;
	}
	return false;
};

Expression.prototype.popAll = function(){
	var aux;
	while(this.operStack.length>0){
		aux=this.operStack.pop();
		if(aux.value_=="("){
			this.throwError("UNMATCHED_PAR",this.pos);
			//throw new Error("Parentesis sem correspondencia");
		}
		this.postfixStack.push(aux);
	}
};

Expression.prototype.throwError = function(errorCode, column, parameters){
	/*if(msg===undefined && column!==undefined){
		this.errormsg = "parse error: "+ column;
		throw new Error(this.errormsg);
	}
	this.errormsg = "parse error [column " + (column) + "]: " + msg;*/
	if(parameters===undefined){
		parameters=[];
	}
	//somar colunas exteriores ao argumento de funções
	column = this.outsidePos+column;
	throw new ExpressionError(errorCode, column, parameters);
};

//adiciona um novo token à pilha de operadores
Expression.prototype.addOperator = function(type_,extraParameters){
	if(type_===tokenTypes.BINARYOP || type_===tokenTypes.BINARY_LOGIC_OP){
		this.numOperands+=2; //são esperados 2 operandos
	}
	if(type_===tokenTypes.UNARY_LEFT_OP || type_===tokenTypes.UNARY_RIGHT_OP){
		this.numOperands++; //é esperado 1 operando
	}
	if(type_===tokenTypes.FUNC){
		this.numOperands++; //é esperado 1 operando
	}
	if(type_===tokenTypes.MATHFUNC){
		//console.log(this.tokenprio);
		this.numOperands++; //é esperado 1 operando
	}
	if(type_===tokenTypes.COMMA){
		this.numOperands+=1; //é esperado 1 operando (a vírgula é apenas um separador e é removida no fim)
	}
	if(type_===tokenTypes.ASSIGN){
		this.numOperands+=2; //são esperados 2 operandos
	}

	var operator = new Token(type_, this.tokenValue, this.tokenSymbol, this.tokenprio, extraParameters);
	var tmp;
	if(this.isDebug){
		console.log(this.tokenValue);
	}
	//se for parentesis esquerdo carrega para a pilha
	if(this.tokenValue=="("){
		this.operStack.push(operator);
	}
	//se for parentesis direito
	else if(this.tokenValue==")"){
		if(this.operStack.length>0){
			tmp = this.operStack.pop();
			while(tmp.value_ != ("(")){
				if(this.operStack.length>0){
					this.postfixStack.push(tmp);
					tmp=this.operStack.pop();
				}
				else{
					this.throwError("TOO_MANY_PAR",this.pos);
				}
				
			}
		}
		else{
			this.throwError("TOO_MANY_PAR",this.pos);
		}
	}
	else{
		/*Se já existem tokens na pilha de operadores verifica se o novo operador
		é prioritário. Se for prioritário é adicionado à stack, caso contrário
		o operador anterior passa da stack de operadores para a stack pós fixa
		e depois o novo operador é passado para a stack de operadores.*/
		if(this.operStack.length>0){
			while((this.operStack.length>0) && this.isntPrio(operator.prio_)){
				this.postfixStack.push(this.operStack.pop());
			}
			this.operStack.push(operator);
			/*
			if(this.isntPrio(operator.prio_)){
				this.postfixStack.push(this.operStack.pop());
				this.operStack.push(operator);
			}
			else{
				this.operStack.push(operator);
			}*/
		}
		else{
			this.operStack.push(operator);
		}
	}
};

//Compara a prioridade recebida por parâmetro com o topo da pilha de operadores
Expression.prototype.isntPrio = function(prio){
	//faz peek (copia valor sem retirar da pilha)
	//console.log(this.operStack.length);
	var lasttoken = this.operStack[this.operStack.length-1];
	//só compara prioridade se o topo da pilha de operadores não tiver um par. esq.
	if(lasttoken.symbol!="("){
		if(prio>=this.operStack[this.operStack.length-1].prio_){
			return true;
		}
	}
	return false;
};
/*
Expression.prototype.isReserved = function(str){
	if(str.length > 0 && (str in reserved)){
		this.tokenValue=str;
		this.tokenprio=prio.RESERVED;
		return true;
	}
	return false;
};
*/

Expression.prototype.addOperand = function(type_){
	var operand;
	var value;
	if(type_==tokenTypes.INTEGER){
		//conversão para inteiro
		value=parseInt(this.tokenValue,10);
	}
	else if(type_==tokenTypes.REAL){
		//conversão para real
		value=parseFloat(this.tokenValue);
	}
	else{
		value=this.tokenValue;
	}
	if(type_==tokenTypes.ARGUMENT){
		var extraParameters={"parameterStack":this.parameterStack};
		operand = new Token(type_, this.tokenValue, this.tokenSymbol, this.tokenprio, extraParameters);
	}
	else{
		operand = new Token(type_, value, this.tokenSymbol, this.tokenprio);
	}
	this.postfixStack.push(operand);
};

/*
Expression.prototype.isUnaryOp = function(){
	
	//TESTE PARA DETECTAR DINAMICAMENTE COM VARIOS CARACTERES
	//var str=this.expr.charAt(this.pos);
	//var found=false;
	//Vai pegando nos caracteres e procura uma correspondencia na lista de operadores unary
	//while(this.pos<this.expr.length){
	//	if(unaryOps[str]!=undefined){
	//		this.tokenprio=prio.UNARY;
	//		this.tokenValue=str;
	//		this.pos++;
	//		found=true;
	//		str+=this.expr.charAt(this.pos);
	//	}
	//	else{
	//		break;
	//	}		
	//}
	//return found;
	
	var code=this.expr.charAt(this.pos);
	if(code==="!" || code ==="-"){
		this.tokenValue=code;
		this.tokenprio=prio.UNARY;
		return true;
	}
	return false;
};
*/

Expression.prototype.isNot = function(){
	var code = this.expr.charAt(this.pos);
	var code2= this.expr.charAt(this.pos+1);

	if(code=="!" && code2!="="){
		this.pos++;
		this.tokenValue="!";
		this.tokenSymbol=this.tokenValue;
		this.tokenprio=prio.UNARY;
		return true;
	}
	return false;
};

Expression.prototype.isBitwiseNot = function(){
	var code = this.expr.charAt(this.pos);

	if(code=="~"){
		this.pos++;
		this.tokenValue="~";
		this.tokenSymbol=this.tokenValue;
		this.tokenprio=prio.UNARY;
		return true;
	}
	return false;
};

Expression.prototype.isSignal = function(){
	if(this.expr.charAt(this.pos-1)=="-"){
		this.tokenValue="-";
		this.tokenSymbol=this.tokenValue;
		this.tokenprio=prio.UNARY;
		return true;
	}
	else if(this.expr.charAt(this.pos-1)=="+"){
		this.tokenValue="+";
		this.tokenSymbol=this.tokenValue;
		this.tokenprio=prio.UNARY;
		return true;
	}
	return false;
};

Expression.prototype.isComma = function () {
	var code = this.expr.charCodeAt(this.pos);
	if (code === 44) { // ,
		this.pos++;
		this.tokenprio = prio.COMMA;
		this.tokenValue = ",";
		this.tokenSymbol=this.tokenValue;
		return true;
	}
	return false;
};

Expression.prototype.isArithmeticOp = function(){
	var code=this.expr.charAt(this.pos);
	var code2=this.expr.charAt(this.pos+1);
	if(code==="+"){
		this.tokenValue=code;
		this.tokenprio=prio.SUM;
		this.tokentype=tokenTypes.BINARYOP;
	}
	else if(code==="-"){
		this.tokenValue=code;
		this.tokenprio=prio.SUB;
		this.tokentype=tokenTypes.BINARYOP;
	}
	else if(code==="/"){
		this.tokenValue=code;
		this.tokenprio=prio.DIV;
		this.tokentype=tokenTypes.BINARYOP;
	}
	else if(code==="%"){
		this.tokenValue=code;
		this.tokenprio=prio.MOD;
		this.tokentype=tokenTypes.BINARYOP;
	}
	else if(code==="*"){
		this.tokenValue=code;
		this.tokenprio=prio.MUL;
		this.tokentype=tokenTypes.BINARYOP;
		if(code2==="*"){
			this.pos++;
			this.tokenValue="**";
			this.tokenprio=prio.POW;
			this.tokentype=tokenTypes.BINARYOP;
		}
	}
	else if(code==="<"){
		this.tokenprio=prio.COMP1;
		this.tokenValue=code;
		this.tokentype=tokenTypes.BINARY_LOGIC_OP;
		if(code2==="="){
			this.pos++;
			this.tokenValue="<=";
			this.tokentype=tokenTypes.BINARY_LOGIC_OP;
		}
		if(code2==="<"){
			this.pos++;
			this.tokenValue="<<";
			this.tokenprio=prio.SHIFT;
			this.tokentype=tokenTypes.BINARYOP;
		}
	}
	else if(code===">"){
		this.tokenprio=prio.COMP1;
		this.tokenValue=code;
		this.tokentype=tokenTypes.BINARY_LOGIC_OP;
		if(code2==="="){
			this.pos++;
			this.tokenValue=">=";
			this.tokentype=tokenTypes.BINARY_LOGIC_OP;
		}
		if(code2===">"){
			this.pos++;
			this.tokenValue=">>";
			this.tokenprio=prio.SHIFT;
			this.tokentype=tokenTypes.BINARYOP;
		}
	}
	else if(code==="=" && code2==="="){
			this.pos++;
			this.tokenValue="==";
			this.tokenprio=prio.COMP2;
			this.tokentype=tokenTypes.BINARY_LOGIC_OP;
	}
	else if(code==="&" && code2!="&"){
		this.tokenValue="&";
		this.tokenprio=prio.BITAND;
		this.tokentype=tokenTypes.BINARYOP;
	}
	else if(code==="|" && code2!="|"){
		this.tokenValue="|";
		this.tokenprio=prio.BITINOR;
		this.tokentype=tokenTypes.BINARYOP;
	}
	else if(code==="^"){
		this.tokenValue=code;
		this.tokenprio=prio.BITEXOR;
		this.tokentype=tokenTypes.BINARYOP;
	}
	else if(code==="~"){
		this.tokenValue=code;
		this.tokenprio=prio.UNARY;
		this.tokentype=tokenTypes.UNARY_LEFT_OP;
	}
	else{
		return false;
	}
	this.tokenSymbol=this.tokenValue;
	this.pos++;
	return true;
};

Expression.prototype.isLogicOp = function(){
	var code=this.expr.charAt(this.pos);
	var code2=this.expr.charAt(this.pos+1);
	if(code=="!" && code2=="="){
		this.pos++;
		this.tokenValue="!=";
		this.tokenprio=prio.COMP2;
	}
	else if(code==="&" && code2==="&"){
		this.pos++;
		this.tokenValue="&&";
		this.tokenprio=prio.LOGICAND;
	}
	else if(code==="|" && code2==="|"){
		this.pos++;
		this.tokenValue="||";
		this.tokenprio=prio.LOGICOR;
	}
	else{
		return false;
	}
	this.tokenSymbol=this.tokenValue;
	this.pos++;
	return true;
};

Expression.prototype.isNumber = function(){
	var r = false;
	var str = "";
	var decimalPoint=0;

	while (this.pos < this.expr.length) {
		var code = this.expr.charAt(this.pos);
		//se é algarismo
		if (code >= '0' && code <= '9') {
			str += this.expr.charAt(this.pos);
			this.pos++;
			this.tokenValue=str;
			this.tokentype=tokenTypes.INTEGER;
			r = true;
		}
		//se é ponto decimal
		else if(code=='.'){
			str += this.expr.charAt(this.pos);
			this.pos++;
			this.tokenValue=str;
			str += this.isDecimalPart();
			this.tokenValue=str;
			this.tokentype=tokenTypes.REAL;
		}/*
		if(code=='e' || code=='E'){
			str+=this.expr.charAt(this.pos);
			this.pos++;
			str+=this.addScientificNotation();
			this.tokenValue=str;
			this.tokentype=tokenTypes.INTEGER;
		}*/
		else {
			break; //quebra o ciclo quando o caracter não for um algarismo nem ponto decimal
		}
	}
	this.tokenSymbol=this.tokenValue;
	this.tokenprio=prio.VALUE;
	return r;
};

Expression.prototype.isDecimalPart = function(){
	var str = "";
	//percorre os caracteres da expressão desde a posição actual ao final
	while (this.pos < this.expr.length) {
		//guarda o caracter actual
		var code = this.expr.charAt(this.pos);
		//se o caracter é alfanumérico (0-9) 
		if (code >= '0' && code <= '9') {
			str += this.expr.charAt(this.pos);
			this.pos++;
			this.tokenValue = parseFloat(str);
			this.tokenSymbol = this.tokenValue;
		}
		//se não é número
		else{
			//se é um ponto decimal
			if(code=='.'){
				this.throwError("TOO_MANY_DECIMAL_POINT",this.pos);
			}
			else{
				break;
			}
		}
	}
	return str;
};

Expression.prototype.addScientificNotation= function(){
	var str = "";
	var ch = this.expr.charAt(this.pos);
	if(ch=="+" || ch=="-"){
		str+=ch;
	}
	//percorre os caracteres da expressão desde a posição actual ao final
	while (this.pos < this.expr.length) {
		ch=this.expr.charAt(this.pos);
		if(ch >= '0' && ch <= '9'){
			str+=ch;
		}
		else{
			this.throwError("BAD_SCIENTIFIC_NOTATION",this.pos);
		}
	}
	return str;
};

Expression.prototype.getText = function(){
	var str = "";

	for (var i = this.pos; i < this.expr.length; i++) {
		var c = this.expr.charAt(i);
		//se o caracter não for uma letra alfabética (uppercase=lowercase)
		if (c.toUpperCase() === c.toLowerCase()) {
			//se a string não começar com uma letra alfabética OU o caracter não 
			//for _ nem algarismo termina o ciclo for
			if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
				break;
			}
		}
		str += c; //constrói a string a partir dos caracteres
	}
	//incrementar posições(numero de caracteres da string)
	this.pos+=str.length;
	this.tmpstr=str;
	this.tokenValue=str;
	this.tokenSymbol=this.tokenValue;
	return str;
};

Expression.prototype.isString = function(){
	var str='';
	var startpos=this.pos;
	var aux;

	if (this.expr.charAt(this.pos) == '"') {
		this.pos++;
		aux=this.pos;
		while (this.pos < this.expr.length) {
			var code = this.expr.charAt(this.pos);
			if(this.isDebug){
				console.log(code);
			}
			if (code != '"') {
				str += this.expr.charAt(this.pos);
				this.pos++;
			}
			else {
				this.pos++;
				this.tokenValue = this.unescape(str, startpos);
				this.tokenSymbol=this.tokenValue;
				this.tokenprio=prio.VALUE;
				return true;
			}
		}
		if(this.pos==aux){
			return false;
		}
		else{
			this.throwError("BAD_STRING",startpos+1);
		}
	}
};

Expression.prototype.isChar = function(){
	var str="";
	var startpos=this.pos;
	var aux;

	if (this.expr.charAt(this.pos) == "'") {
		this.pos++;
		aux=this.pos;
		while (this.pos < this.expr.length) {
			var code = this.expr.charAt(this.pos);
			if(this.isDebug){
				console.log(code);
			}
			if (code != "'") {
				str += this.expr.charAt(this.pos);
				this.pos++;
			}
			else {
				this.pos++;
				str = this.unescape(str, startpos);
				if(str.length>1){
					//console.log(str);
					var parameters=[str];
					this.throwError("CHAR_INVALID_SIZE",startpos+1,parameters);
				}
				this.tokenValue=str;
				this.tokenSymbol=this.tokenValue;
				this.tokenprio=prio.VALUE;
				return true;
			}
		}
		if(this.pos==aux){
			return false;
		}
		else{
			this.throwError("BAD_CHAR",startpos+1);
		}
	}
	return false;
};

Expression.prototype.isLeftPar = function(){
	if(this.expr.charAt(this.pos)==="("){
		this.pos++;
		this.tokenprio=1000; //para quando aparecer um sinal menos prioritario nao remover o parentesis
		this.tokenValue="(";
		this.tokenSymbol=this.tokenValue;
		return true;
	}
	return false;
};

Expression.prototype.isRightPar = function(){
	if(this.expr.charAt(this.pos)===")"){
		this.pos++;
		this.tokenprio=1000;
		this.tokenValue=")";
		this.tokenSymbol=this.tokenValue;
		return true;
	}
	return false;
};

Expression.prototype.isWhite = function(){
	if(this.expr.charAt(this.pos)==" "){
		this.pos++;
		return true;
	}
	return false;
};

Expression.prototype.unescape = function(v, pos) {
	var buffer ="";
	var escaping = false;

	/*
	//verificar primeiro caracter
	var c = v.charAt(i);
	if(c == '\\'){
		escaping=true; //coloca escaping a true para o primeiro caracter ser analisado
	}*/

	for (var i = 0; i < v.length; i++) {
		var c = v.charAt(i);
		if (escaping) {
			switch (c) {
				case "'":
					buffer+="'";  // single quote
					break;
				case '\\':
					buffer+='\\'; // backslash \
					break;
				case '/':
					buffer+='/';  // / (barra)
					break;
				case 'b':
					buffer+='\b'; // backspace
					break;
				case 'f':
					buffer+='\f'; // form feed
					break;
				case 'n':
					buffer+='\n'; // new line
					break;
				case 'r':
					buffer+='\r'; // carriage return
					break;
				case 't':
					buffer+='\t'; // tab
					console.log("TAB");
					break;
				case 'u':
					var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
					buffer+=String.fromCharCode(codePoint);
					i += 4; //avança 4 caracteres
					break;
				default:
					var parameters=["\\"+c];
					this.throwError("ILLEGAL_SCAPE_SEQUENCE",pos + i,parameters);
			}
			escaping = false; //coloca escape de novo a false
		}
		else {
			if (c == '\\') {
				escaping = true;
				console.log("BARRA APRA TRAS");
			}
			else {
				buffer+=c;
			}
		}
	}
	//console.log("BUFFER");
	//console.log(buffer);
	return buffer;
};

Expression.prototype.evaluate = function(expr) {
	this.evaluator.evaluate(this.toPostFix(expr));
};
module.exports = Expression;

