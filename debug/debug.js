var tokenTypes=require('../definitions/token_types'),
	Token=require('../token'),
	prio=require('../definitions/priorities');

var Debug = function(){
	
}

Debug.prototype.printStack = function(stack){
	printStack(stack);
};

function printStack(stack){
	var item;
	var str="";
	var type="";
	var status="NOT OK";
	
	if(stack.length===0){
		console.log("The stack is empty");
		return undefined;
	}

	for(var i=stack.length-1; i>=0; i--){
		item=stack[i];
		switch (item.type_) {
			case tokenTypes.ARGUMENT:
				type="ARGUMENT";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.ASSIGN:
				type="ASSIGN";
				if(item.prio_==prio.ASSIGN) status="prio OK";
				break;
			case tokenTypes.CHAR:
				type="CHAR";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.INTEGER:
				type="INTEGER";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.REAL:
				type="REAL";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.NULL:
				type="NULL";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.MATHFUNC:
				type="MATHFUNC";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.UNARY_LEFT_OP:
				type="UNARY_LEFT_OP";
				if(item.prio_==prio.UNARY) status="prio OK";
				break;
			case tokenTypes.UNARY_RIGHT_OP:
				type="UNARY_RIGHT_OP";
				if(item.prio_==prio.UNARY) status="prio OK";
				break;
			case tokenTypes.BINARYOP:
				type="BINARYOP";
				status="---";
				break;
			case tokenTypes.BINARY_LOGIC_OP:
				type="BINARY_LOGIC_OP";
				status="---";
				break;
			case tokenTypes.VAR:
				type="VAR";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.RESERVED:
				type="RESERVED";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.FUNC:
				type="FUNC";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.COMMA:
				type="COMMA";
				if(item.prio_==prio.COMMA) status="prio OK";
				break;
			case tokenTypes.CONST:
				type="CONST";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.STRING:
				type="STRING";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			case tokenTypes.BOOLEAN:
				type="BOOLEAN";
				if(item.prio_==prio.VALUE) status="prio OK";
				break;
			default:
				return "Invalid Token";
		}
		str=i+": {"+item.value_+"}\t"+"type: "+type+"\t"+"prio: "+item.prio_+" status: "+status;
		status="NOT OK";
		console.log(str);
	}
	console.log("\n");
};

module.exports = Debug;