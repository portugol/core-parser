var types=require('./token_types');

var self ={
	isNotNumber: function(value,type){
		//Filtrar apenas números porque Strings devolvem true no método isNaN()
		if(type==types.INTEGER || type==types.REAL){
			if(isNaN(value)){
				return true;
			}
			return false;
		}
		else{
			return false;
		}
	},
	isInfinite: function(value,type){
		//Filtrar apenas números porque uma String "infinity" é considerado infinito
		if(type==types.INTEGER || type==types.REAL){
			if(isFinite(value)){
				return false;
			}
			return true;
		}
		else{
			return false;
		}
	},
	isScientificNotation: function(value){
		//converte o valor para string, lowercase e determina a posição da letra "e"
		var pos=value.toString().toLowerCase().indexOf("e");
		//se existe a letra "e"
		if(pos!=-1){
			return true;
		}
		return false;
	},
	isOverflow: function(value){
		return(this.isInfinite(value) || this.isScientificNotation(value));
	}
};

module.exports=self;