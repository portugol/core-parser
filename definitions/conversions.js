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
	    //adaptado de
	    //http://stackoverflow.com/questions/16139452/how-to-convert-big-negative-scientific-notation-number-into-decimal-notation-str
	    var data= String(scientificNumber).split(/[eE]/);
	    if(data.length== 1) return data[0]; 

	    var  z= '', sign= this<0? '-':'',
	    str= data[0].replace('.', ''),
	    mag= Number(data[1])+ 1;

	    if(mag<0){
	        z= sign + '0.';
	        while(mag++) z += '0';
	        return z + str.replace(/^\-/,'');
	    }
	    mag -= str.length;  
	    while(mag--) z += '0';
	    return str + z;
	},
	
	scientifcAutoSize: function(number){
		return parseFloat(number).toString();
	}
};

module.exports=self;