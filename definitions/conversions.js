var tokenTypes=require('./token_types'),
comp=require('../compatibility/binary_comp').binComp;

module.exports.conversions = {
	convertToValue: function(token, finalType){
		if(finalType==tokenTypes.INTEGER){
			return this.getIntValue(token);
		}
		if(finalType==tokenTypes.REAL){
			return this.getRealValue(token);
		}
		if(finalType==tokenTypes.CHAR){
			return this.getIntValue(token);
		}
		if(finalType==tokenTypes.STRING){
			return token.value_;
		}
	},

	getIntValue: function(token){
		if(token.type_==tokenTypes.CHAR){
			return token.value_.charCodeAt(0);
		}
		return parseInt(token.value_,10);
	},

	getRealValue: function(token){
		return parseFloat(token.value_);
	},

	getFinalType: function(token1, token2){
		return comp.getFinalType(token1.type_, token2.type_);
	},

	checkCompatibility: function(token1, token2, operatorToken){
		return comp.checkCompatibility(token1.type_, token2.type_, operatorToken.value_);
	}
};