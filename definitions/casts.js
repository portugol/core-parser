var tokenTypes= require('./token_types'),
operandCodes=require('../compatibility/vartype_codes'),
conversions=require('./conversions'),
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

var self = {
	checkCastCompatibility: function(oldType, newType){
		//é do mesmo tipo
		if(newType===oldType){
			return true;
		}
		else{
			//Procura o tipo de dados antigo na castList
			for(var i=0; i<castList.length; i++){
				if(castList[i].type==newType){
					//Verica se existe possibilidade de converter para novo tipo
					for(var j=0; j<castList[i].compatibleTypes.length; j++){
						if(oldType==castList[i].compatibleTypes[j]){
							//é possível converter
							return true;
						}
					}
				}
			}
		}
		//não é possível converter
		return false;
	},
	castToType: function(token,oldType){
		var newType=token.type_;
		var result;

		//verifica se é possível converter o novo tipo de dados para o original da variável
		if(this.checkCastCompatibility(oldType,newType)){
			//se é possível, então converte e retorn resultado
			result=conversions.convertToValue(token.value_,newType,oldType);
			return result;
		}
		else{
			//Não é possível converter. lança um erro de programa
			var parameters=["VarTypes."+conversions.codeToVarType(oldType),newType];
			throw new CastError("CAST_ERROR",parameters);
		}
	}
};

module.exports=self;