var Var = function(name_,type_,value_,level_,typeName_) {
	this.name_ = name_;
	this.type_ = type_;
	this.value_ = value_;
	this.level_ = level_;
	this.typeName_ = typeName_;
};

Var.prototype.getValue=function(){
	return this.value_;
};

Var.prototype.setValue=function(value){
	this.value_=value;
};

Var.prototype.getType=function(){
	return this.type_;
};


module.exports=Var;