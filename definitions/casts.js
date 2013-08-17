var tokenTypes= require('./token_types'),
operandCodes=require('../compatibility/vartype_codes'),
conversions=require('./conversions').conversions,
CastError = require('../errors/cast_error');


var castList = [
	{
		'type': operandCodes.INTEGER,
		'compatibleTypes':[operandCodes.REAL]
	},
	{
		'type': operandCodes.REAL,
		'compatibleTypes':[operandCodes.INTEGER]
	},
	{
		'type': operandCodes.BOOLEAN,
		'compatibleTypes':[]
	},
	{
		'type': operandCodes.CHAR,
		'compatibleTypes':[operandCodes.STRING]
	},
	{
		'type': operandCodes.STRING,
		'compatibleTypes':[]
	}
];


module.exports.casts = {
	checkCastCompatibility: function(oldType, newType){
		//é do mesmo tipo
		if(newType===oldType){
			return true;
		}
		else{
			for(var i=0; i<castList.length; i++){
				if(castList[i].type==oldType){
					for(var j=0; j<castList[i].compatibleTypes.length; j++){
						if(newType==castList[i].compatibleTypes[j]){
							return true;
						}
					}
				}
			}
		}
		return false;
	},
	castToType: function(token,newType){
		var oldType=token.type_;
		var result;

		if(this.checkCastCompatibility(oldType,newType)){
			result=conversions.convertToValue(token,newType);
			return result;
		}
		else{
			var parameters=["VarTypes."+conversions.codeToVarType(oldType),newType];
			throw new CastError("CAST_ERROR",parameters);
		}
	}
};