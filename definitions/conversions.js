var tokenTypes=require('./token_types'),
comp=require('../compatibility/binary_comp'),
limits=require('./limits');

var types={
	1: "INTEGER",
	2: "REAL",
	3: "NUMBER",
	4: "CHARACTER",
	8: "STRING",
	16: "BOOLEAN"
};

var self = {
	convertToValue: function(value, type, finalType){
		if(finalType==tokenTypes.INTEGER){
			return this.getIntValue(value,type);
		}
		if(finalType==tokenTypes.REAL){
			return this.getRealValue(value,type);
		}
		if(finalType==tokenTypes.CHAR){
			return this.getIntValue(value,type);
		}
		if(finalType==tokenTypes.STRING){
			return value;
		}
	},

	getIntValue: function(value,type){
		if(limits.isScientificNotation(value)){
			value=self.scientificToString(value);
		}
		if(type==tokenTypes.CHAR){
			return value.charCodeAt(0);
		}
		return parseInt(value,10);
	},

	getRealValue: function(value){
		if(limits.isScientificNotation(value)){
			value=self.scientificToString(value);
		}
		return parseFloat(value);
	},

	getFinalType: function(token1, token2){
		return comp.getFinalType(token1.type_, token2.type_);
	},

	checkCompatibility: function(token1, token2, operatorToken){
		return comp.checkCompatibility(token1.type_, token2.type_, operatorToken.value_);
	},

	codeToVarType: function(code){
		return types[code];
	},

	scientificToString: function(scientificNumber){
	    var data= String(scientificNumber).split(/[eE]/);
	    if(data.length== 1) return data[0];

	    var number=String(data[0]).split(/[.]/);
	    var integerPart=number[0];
	    var decimalPart=number[1]||"";

	    var exponent=data[1];
	    var positive=true;
	    if(exponent.charAt(0)=="+"){
	    	exponent=exponent.substring(1);
	    }
	    else if(exponent.charAt(0)=="-"){
	    	exponent=exponent.substring(1);
	    	positive=false;
	    }

	    var result=integerPart.toString()+decimalPart.toString();

	    //notação científica positiva
	    if(positive){
	    	//número de zeros = valor do expoente - número de casas decimais
	   		var zeroLength=exponent-decimalPart.length;
	    	//quando o valor do expoente é maior que o número de casas decimais
	    	if(zeroLength>0){
	    		while(zeroLength>0){
		    		result+='0';
		    		zeroLength--;
	    		}	
	    	}
	    	//quando o valor do expoente é menor ou igual que o número de casas decimais
	    	else{
	    		var left=decimalPart.substring(0,zeroLength+decimalPart.length);
	    		var right=decimalPart.slice(zeroLength+decimalPart.length);
	    	}
	    	return integerPart+left+"."+right;
	    }
	    //notação científica negativa
	    else{
	    	//o número de casas decimais final é o número do expoente mais o número de casas decimais
	    	var decimalSize=parseInt(exponent,10)+decimalPart.length;
	    	var delta=parseInt(exponent,10);	    	
	    	//se o deslocamento é menor que a parte inteira
	    	if(delta<integerPart.length){
	    		decimalPart=integerPart.substring(integerPart.length-delta)+decimalPart;
	    		integerPart=integerPart.substring(0,integerPart.length-delta);
	    		return integerPart+'.'+decimalPart;
	    	}
	    	//se o deslocamento é maior ou igual ao tamanho da parte inteira
	    	else{
	    		var numZeros=delta-integerPart.length;
	    		var zeros="";
	    		while(numZeros>0){
	    			zeros+='0';
	    			numZeros--;
	    		}
	    		return "0."+zeros+integerPart+decimalPart;

	    	}
	    }
	},
	
	scientifcAutoSize: function(number){
		return parseFloat(number).toString();
	}
};

module.exports=self;