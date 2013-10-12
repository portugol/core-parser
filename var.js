var Var = function(name_,type_,value_,symbol_,level_,typeName_) {
	this.name_ = name_;
	this.type_ = type_;
	this.value_ = value_;
	this.symbol_ = symbol_;
	this.level_ = level_;
	this.typeName_ = typeName_;
};

Var.prototype.getValue=function(){
	return this.value_;
};

Var.prototype.getSymbol=function(){
	return this.symbol_;
};

Var.prototype.setSymbol=function(symbol){
	this.symbol_=symbol;
};

Var.prototype.setValue=function(value){
	this.value_=value;
};

Var.prototype.getType=function(){
	return this.type_;
};


module.exports=Var;