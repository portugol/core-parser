var sys = require('sys'),
  prio  = require('./definitions/priorities'),
  types = require('./definitions/token_types'),
  util  = require('util');

var Token = function (type_, value_, symbol_, prio_, extraParameters) {
  this.type_ = type_;
  this.symbol_=symbol_;
  this.value_ = value_;
  this.prio_ = prio_;

  //copiar todos os atributos do objecto extraParameters
  for (var key in extraParameters) {
      this[key] = extraParameters[key];
  }
};

Token.prototype.setPrio = function (prio) {
  this.prio_ = prio;
};

Token.prototype.setType = function (type) {
  this.type_ = type;
};

Token.prototype.toString = function () {
  switch (this.type_) {
  case types.NULL:
    return "NULL";
  case types.REAL:
  case types.INTEGER:
  case types.MATHFUNC:
  case types.UNARYOP:
  case types.BINARYOP:
  case types.VAR:
  case types.BOOLEAN:
  case types.FUNC:
  case types.CONST:
  case types.STRING:
  case types.PARENT:
  case types.ARGUMENT:
  case types.PARAMETER:
  case types.ASSIGN:
    return this.value_;
  case types.COMMA:
    return ",";
  default:
    return "Invalid Token";
  }
};
module.exports = Token;