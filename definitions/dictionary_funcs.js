var DictionaryError=require('../errors/dictionary_error');
var self={
	getSymbolByValue: function(dictionary,value){
		try{
			var result;
			//percorrer dicionário
			for(var i=0; i<=dictionary.length; i++){
				if(dictionary[i].value==value){
					result=dictionary[i].symbol;
					break;
				}
			}
			return result;
		}
		catch(err){
			throw err;
			throwError("Error searching symbol. Value "+value + " not found");
		}
	},
	getFunctionNameByValue: function(dictionary,value){
		console.log("AQUI");
		console.log(dictionary);
		console.log(value);
		try{
			var result;
			//percorrer dicionário
			for(var i=0; i<=dictionary.length; i++){
				if(dictionary[i].value==value){
					result=dictionary[i].name;
					break;
				}
			}
			return result;
		}
		catch(err){
			throw err;
			throwError("Error searching function name. Value "+value + " not found");
		}
	},
	getObjectByValue: function(dictionary, value){
		try{
			var result;
			//percorrer dicionário
			for(var i=0; i<=dictionary.length; i++){
				if(dictionary[i].value==value){
					result=dictionary[i];
					break;
				}
			}
			return result;
		}
		catch(err){
			throwError("Error searching object. Value "+value + " not found");
		}
	}
};

function throwError(errorCode){
	throw new DictionaryError(errorCode);
}

module.exports=self;
