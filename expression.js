	var sys = require('sys'),
		definitions= require('./definitions/dictionary'),
		prio= require('./definitions/priorities'),
		tokenTypes= require('./definitions/token_types'),
		//this.nodeTypes= require('../core-master/lib/nodes/definition'),
		Token=require('./token'),
		util = require('util'),
		Debug = require('./debug/debug'); 

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

	var Expression = function(definition, nodeType_, isArgument, isDebug){
    this.nodeTypes = definition;
		this.isArgument = isArgument || false;
		this.isDebug = isDebug || false;
		this.nodeType_=nodeType_;
	};

	if (!Array.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			for (var i = (start || 0); i < this.length; i++) {
				if (this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}

	Expression.prototype.setExpr = function(expr){
		this.expr=expr;
		this.pos=0;
	};

	//var opersStack=1;
	Expression.prototype.toPostfix = function(expr,nodeType_){
		this.nodeType_=nodeType_||this.nodeType_;
		this.expr=expr;
		this.errormsg="";
		this.pos=0;
		this.tokensymbol=0;
		this.tokenprio=0;
		this.tokentype=0;
		this.tmpstr="";
		var expected=(PRIMARY | VAR | LPAREN | SIGNAL | NOT | BITWISE_NOT);
		this.numOperands=0;
		this.operStack = [];
		this.postfixStack=[];
		this.parameterStack=[];
		
		//SE A EXPRESSAO É NULA (tamanho=0)
		if(expr.length===0){
			return []; //devolve array vazio
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
					this.throwError(this.pos, "Nao e esperado um operador BITWISE NOT (~)");
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
						this.throwError(this.pos,"Nao e esperado um operador aritmetico");
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
							this.throwError(this.pos,"Nao e esperado um sinal");
						}
						signals.push(this.tokensymbol); //guarda sinal numa pilha				
						this.pos++;
					}
					//****************************************************************
					// NAO ENCONTROU SINAIS
					//****************************************************************
					if(counter==0){
						this.throwError(this.pos, "Nao e esperado um operador binario");
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
							this.tokensymbol=previous;
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
					this.throwError(this.pos, "Nao e esperado um operador logico");
				}
				this.addOperator(tokenTypes.BINARY_LOGIC_OP);
				expected=( PRIMARY | LPAREN | VAR | NOT | SIGNAL);
				//expected=( BOOLEAN | LPAREN | VAR | NOT);	
			}
			else if(this.isNumber()){
				if((expected & NUMBER) === 0){
					this.throwError(this.pos, "Nao e esperado um numero");
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
					this.throwError("Nao e esperado um parentesis esquerdo");
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
						this.tokensymbol=aux.value_;
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
						this.throwError(oldpos, "O argumento da funcao esta mal construido");
					}
					//guarda argumento da funçao
					var argument=this.expr.substring(oldpos,this.pos-1);
					//avaliar recursivamente a expressão do argumento
					this.parameterStack= new Expression(undefined,true).toPostfix(argument);

					//cria o token do tipo argumento que guarda a stack com os parâmetros da funçao
					this.tokensymbol="argument";
					this.tokenprio=prio.VALUE;
					this.addOperand(tokenTypes.ARGUMENT);
					expected = (ARITHMETICOP | LOGICOP | RPAREN | FACT) ;
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
					this.throwError(this.pos, "Nao e esperado um parentesis direito");
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
				this.tokensymbol=")";
				this.tokenprio=prio.PARENT;
				this.addOperator(tokenTypes.PARENT);
			}
			else if(this.isNot()){
				if((expected & NOT) === 0){
					//verifica se é factorial
					if((expected & FACT) !== 0){
						this.tokensymbol="!";
						this.tokenprio=prio.UNARY;
						this.addOperator(tokenTypes.UNARY_RIGHT_OP);
						expected=(ARITHMETICOP | RPAREN);
					}
					else{
						this.throwError(this.pos, "Nao e esperado um operador NOT");
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
					this.throwError(this.pos, "unexpected \",\"");
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
					this.throwError(this.pos,"Nao e esperado um caracter");
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
					this.throwError(this.pos,"Nao e esperada uma string");
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
							this.tokensymbol=definitions[i].value;
							//se o subtipo é boolean 
							if(definitions[i].subtype=='boolean'){
								this.tokensymbol=definitions[i].value;
								//verifica se é esperado este subtipo.
								if((expected & BOOLEAN)===0){
									this.throwError((this.pos-definitions[i].symbol.length+1) ,"Não e esperado um boolean");
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
						else if(definitions[i].type=='function'){
							this.tokensymbol=definitions[i].symbol;
							this.addOperator(tokenTypes.MATHFUNC);
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
						this.throwError(this.pos, "Nao e esperada uma variavel");
						//throw new Error("Nao e esperada uma variavel");
					}
					this.tokenprio=prio.VALUE;
					this.addOperand(tokenTypes.VAR);
					//é esperado também um parentesis esquerdo porque pode ser uma função
					expected = (ARITHMETICOP | LOGICOP | LPAREN | RPAREN | CALL);
				}
			}
			else if(this.isAssign()){
				if(this.isArgument){
					this.throwError("Nao e permitido fazer atribuicao dentro do argumento de funcoes");
				}
				if(this.nodeType_!=this.nodeTypes.PROCESS){
					this.throwError("Nao e permitido fazer atribuicao");
				}
				var item=this.postfixStack[this.postfixStack.length-1];
				if(this.postfixStack.length==1 && item.type_==tokenTypes.VAR){
					this.addOperator(tokenTypes.ASSIGN);
				}
				else{
					this.throwError(this.pos, "ATRIBUICAO INVALIDA");
				}
				expected = (PRIMARY | VAR | LPAREN | BITWISE_NOT);
			}
			else if(this.isWhite()){
				//salta espaço em branco
			}
			else {
				this.throwError("Operacao invalida");
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
			this.throwError(this.pos, "Faltam operandos na expressão");
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
			this.tokensymbol="=";
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
				this.throwError(this.pos, "Parentesis sem correspondencia");
				//throw new Error("Parentesis sem correspondencia");
			}
			this.postfixStack.push(aux);
		}
	};

	Expression.prototype.throwError = function(column, msg){
		if(msg===undefined && column!==undefined){
			this.errormsg = "parse error: "+ column;
			throw new Error(this.errormsg);
		}
		this.errormsg = "parse error [column " + (column) + "]: " + msg;
		throw new Error(this.errormsg);
	};

	//adiciona um novo token à pilha de operadores
	Expression.prototype.addOperator = function(type_){
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
			this.numOperands++; //é esperado 1 operando
		}
		if(type_===tokenTypes.COMMA){
			this.numOperands+=1; //é esperado 1 operando (a vírgula é apenas um separador e é removida no fim)
		}
		if(type_===tokenTypes.ASSIGN){
			this.numOperands+=2; //são esperados 2 operandos
		}

		var operator = new Token(type_, this.tokensymbol, this.tokenprio);
		var tmp;
		if(this.isDebug){
			console.log(this.tokensymbol);
		}
		//se for parentesis esquerdo carrega para a pilha
		if(this.tokensymbol=="("){
			this.operStack.push(operator);
		}
		//se for parentesis direito
		else if(this.tokensymbol==")"){
			if(this.operStack.length>0){
				tmp = this.operStack.pop();
				while(tmp.value_ != ("(")){
					if(this.operStack.length>0){
						this.postfixStack.push(tmp);
						tmp=this.operStack.pop();
					}
					else{
						this.throwError(this.pos, "Parentesis a mais");
					}
					
				}
			}
			else{
				this.throwError(this.pos, "Parentesis a mais");
			}
		}
		else{
			/*Se já existem tokens na pilha de operadores verifica se o novo operador
			é prioritário. Se for prioritário é adicionado à stack, caso contrário
			o operador anterior passa da stack de operadores para a stack pós fixa
			e depois o novo operador é passado para a stack de operadores.*/
			if(this.operStack.length>0){
				if(this.isntPrio(operator.prio_)){
					this.postfixStack.push(this.operStack.pop());
					this.operStack.push(operator);
				}
				else{
					this.operStack.push(operator);
				}
			}
			else{
				this.operStack.push(operator);
			}
		}
	};

	//Compara a prioridade recebida por parâmetro com o topo da pilha de operadores
	Expression.prototype.isntPrio = function(prio){
		//faz peek (copia valor sem retirar da pilha)
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
			this.tokensymbol=str;
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
			value=parseInt(this.tokensymbol,10);
		}
		else if(type_==tokenTypes.REAL){
			//conversão para real
			value=parseFloat(this.tokensymbol);
		}
		else{
			value=this.tokensymbol;
		}
		if(type_==tokenTypes.ARGUMENT){
			operand = new Token(type_, this.tokensymbol, this.tokenprio, this.parameterStack);
		}
		else{
			operand = new Token(type_, value, this.tokenprio);
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
		//		this.tokensymbol=str;
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
			this.tokensymbol=code;
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
			this.tokensymbol="!";
			this.tokenprio=prio.UNARY;
			return true;
		}
		return false;
	};

	Expression.prototype.isBitwiseNot = function(){
		var code = this.expr.charAt(this.pos);

		if(code=="~"){
			this.pos++;
			this.tokensymbol="~";
			this.tokenprio=prio.UNARY;
			return true;
		}
		return false;
	};

	Expression.prototype.isSignal = function(){
		if(this.expr.charAt(this.pos-1)=="-"){
			this.tokensymbol="-";
			this.tokenprio=prio.UNARY;
			return true;
		}
		else if(this.expr.charAt(this.pos-1)=="+"){
			this.tokensymbol="+";
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
			this.tokensymbol = ",";
			return true;
		}
		return false;
	};

	Expression.prototype.isArithmeticOp = function(){
		var code=this.expr.charAt(this.pos);
		var code2=this.expr.charAt(this.pos+1);
		if(code==="+"){
			this.tokensymbol=code;
			this.tokenprio=prio.SUM;
			this.tokentype=tokenTypes.BINARYOP;
		}
		else if(code==="-"){
			this.tokensymbol=code;
			this.tokenprio=prio.SUB;
			this.tokentype=tokenTypes.BINARYOP;
		}
		else if(code==="/"){
			this.tokensymbol=code;
			this.tokenprio=prio.DIV;
			this.tokentype=tokenTypes.BINARYOP;
		}
		else if(code==="%"){
			this.tokensymbol=code;
			this.tokenprio=prio.MOD;
			this.tokentype=tokenTypes.BINARYOP;
		}
		else if(code==="*"){
			this.tokensymbol=code;
			this.tokenprio=prio.MUL;
			this.tokentype=tokenTypes.BINARYOP;
			if(code2==="*"){
				this.pos++;
				this.tokensymbol="**";
				this.tokenprio=prio.POW;
				this.tokentype=tokenTypes.BINARYOP;
			}
		}
		else if(code==="<"){
			this.tokenprio=prio.COMP1;
			this.tokensymbol=code;
			this.tokentype=tokenTypes.BINARY_LOGIC_OP;
			if(code2==="="){
				this.pos++;
				this.tokensymbol="<=";
				this.tokentype=tokenTypes.BINARY_LOGIC_OP;
			}
			if(code2==="<"){
				this.pos++;
				this.tokensymbol="<<";
				this.tokenprio=prio.SHIFT;
				this.tokentype=tokenTypes.BINARYOP;
			}
		}
		else if(code===">"){
			this.tokenprio=prio.COMP1;
			this.tokensymbol=code;
			this.tokentype=tokenTypes.BINARY_LOGIC_OP;
			if(code2==="="){
				this.pos++;
				this.tokensymbol=">=";
				this.tokentype=tokenTypes.BINARY_LOGIC_OP;
			}
			if(code2===">"){
				this.pos++;
				this.tokensymbol=">>";
				this.tokenprio=prio.SHIFT;
				this.tokentype=tokenTypes.BINARYOP;
			}
		}
		else if(code==="=" && code2==="="){
				this.pos++;
				this.tokensymbol="==";
				this.tokenprio=prio.COMP2;
				this.tokentype=tokenTypes.BINARY_LOGIC_OP;
		}
		else if(code==="&" && code2!="&"){
			this.tokensymbol="&";
			this.tokenprio=prio.BITAND;
			this.tokentype=tokenTypes.BINARYOP;
		}
		else if(code==="|" && code2!="|"){
			this.tokensymbol="|";
			this.tokenprio=prio.BITINOR;
			this.tokentype=tokenTypes.BINARYOP;
		}
		else if(code==="^"){
			this.tokensymbol=code;
			this.tokenprio=prio.BITEXOR;
			this.tokentype=tokenTypes.BINARYOP;
		}
		else if(code==="~"){
			this.tokensymbol=code;
			this.tokenprio=prio.UNARY;
			this.tokentype=tokenTypes.UNARY_LEFT_OP;
		}
		else{
			return false;
		}
		this.pos++;
		return true;
	};

	Expression.prototype.isLogicOp = function(){
		var code=this.expr.charAt(this.pos);
		var code2=this.expr.charAt(this.pos+1);
		if(code=="!" && code2=="="){
			this.pos++;
			this.tokensymbol="!=";
			this.tokenprio=prio.COMP2;
		}
		else if(code==="&" && code2==="&"){
			this.pos++;
			this.tokensymbol="&&";
			this.tokenprio=prio.LOGICAND;
		}
		else if(code==="|" && code2==="|"){
			this.pos++;
			this.tokensymbol="||";
			this.tokenprio=prio.LOGICOR;
		}
		else{
			return false;
		}
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
				this.tokensymbol=str;
				this.tokentype=tokenTypes.INTEGER;
				r = true;
			}
			//se é ponto decimal
			else if(code=='.'){
				str += this.expr.charAt(this.pos);
				this.pos++;
				this.tokensymbol=str;
				str += this.isDecimalPart();
				this.tokensymbol=str;
				this.tokentype=tokenTypes.REAL;
			}/*
			if(code=='e' || code=='E'){
				str+=this.expr.charAt(this.pos);
				this.pos++;
				str+=this.addScientificNotation();
				this.tokensymbol=str;
				this.tokentype=tokenTypes.INTEGER;
			}*/
			else {
				break; //quebra o ciclo quando o caracter não for um algarismo nem ponto decimal
			}
		}
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
				this.tokensymbol = parseFloat(str);
			}
			//se não é número
			else{
				//se é um ponto decimal
				if(code=='.'){
					this.throwError(this.pos, "Tem mais que um ponto decimal");
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
				this.throwError(this.pos, "Notacao cientifica mal construida");
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
		this.tokensymbol=str;
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
					this.tokensymbol = this.unescape(str, startpos);
					this.tokenprio=prio.VALUE;
					return true;
				}
			}
			if(this.pos==aux){
				return false;
			}
			else{
				this.throwError(startpos+1, "String mal construida");
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
						this.throwError(startpos+1, "Um caracter tem de ter tamanho igual a 1");
					}
					this.tokensymbol=str;
					this.tokenprio=prio.VALUE;
					return true;
				}
			}
			if(this.pos==aux){
				return false;
			}
			else{
				this.throwError(startpos+1, "Caracter mal construido");
			}
		}
		return false;
	};

	Expression.prototype.isLeftPar = function(){
		if(this.expr.charAt(this.pos)==="("){
			this.pos++;
			this.tokenprio=1000; //para quando aparecer um sinal menos prioritario nao remover o parentesis
			this.tokensymbol="(";
			return true;
		}
		return false;
	};

	Expression.prototype.isRightPar = function(){
		if(this.expr.charAt(this.pos)===")"){
			this.pos++;
			this.tokenprio=1000;
			this.tokensymbol=")";
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
		var buffer = [];
		var escaping = false;

		//verificar primeiro caracter
		var c = v.charAt(i);
		if(c == '\\'){
			escaping=true; //coloca escaping a true para o primeiro caracter ser analisado
		}

		for (var i = 0; i < v.length; i++) {
			var c = v.charAt(i);
			if (escaping) {
				switch (c) {
					case "'":
						buffer.push("'");  // single quote
						break;
					case '\\':
						buffer.push('\\'); // backslash \
						break;
					case '/':
						buffer.push('/');  // / (barra)
						break;
					case 'b':
						buffer.push('\b'); // backspace
						break;
					case 'f':
						buffer.push('\f'); // form feed
						break;
					case 'n':
						buffer.push('\n'); // new line
						break;
					case 'r':
						buffer.push('\r'); // carriage return
						break;
					case 't':
						buffer.push('\t'); // tab
						break;
					case 'u':
						var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
						buffer.push(String.fromCharCode(codePoint));
						i += 4; //avança 4 caracteres
						break;
					default:
						this.throwError(pos + i, "Illegal escape sequence: '\\" + c + "'");
				}
				escaping = false; //coloca escape de novo a false
			}
			else {
				if (c == '\\') {
					escaping = true;
				}
				else {
					buffer.push(c);
				}
			}
		}
		return buffer.join('');
	};

	Expression.prototype.evaluate = function(expr) {
		this.evaluator.evaluate(this.toPostFix(expr));
	};
	module.exports = Expression;

