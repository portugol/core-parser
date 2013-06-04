module.exports.limits ={
	isInfinite: function(value){
		if(isFinite(value)){
			return false;
		}
		return true;
	},
	isScientificNotation: function(value){
		//converte o valor para string, lowercase e determina a posição da letra "e"
		var pos=value.toString().toLowerCase().indexOf("e");
		
		if((pos!=-1) && (value.toString().charAt(pos+1)!="-")){
			return true;
		}
		return false;
	},
	isOverflow: function(value){
		return(this.isInfinite(value) || this.isScientificNotation(value));
	}
};