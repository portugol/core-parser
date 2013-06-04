var c=require('./compatibility').compatibility;
var tokenTypes= require('../definitions/token_types');
var Evaluator=require('../evaluator');



console.log("\n\nINTEGER - INTEGER COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.INTEGER,"+",tokenTypes.INTEGER));
console.log("- "+c.checkCompatibility(tokenTypes.INTEGER,"-",tokenTypes.INTEGER));
console.log("/ "+c.checkCompatibility(tokenTypes.INTEGER,"/",tokenTypes.INTEGER));
console.log("* "+c.checkCompatibility(tokenTypes.INTEGER,"*",tokenTypes.INTEGER));
console.log("** "+c.checkCompatibility(tokenTypes.INTEGER,"**",tokenTypes.INTEGER));
console.log("% "+c.checkCompatibility(tokenTypes.INTEGER,"%",tokenTypes.INTEGER));
console.log("== "+c.checkCompatibility(tokenTypes.INTEGER,"==",tokenTypes.INTEGER));
console.log("!= "+c.checkCompatibility(tokenTypes.INTEGER,"!=",tokenTypes.INTEGER));
console.log("<= "+c.checkCompatibility(tokenTypes.INTEGER,"<=",tokenTypes.INTEGER));
console.log("< "+c.checkCompatibility(tokenTypes.INTEGER,"<",tokenTypes.INTEGER));
console.log(">= "+c.checkCompatibility(tokenTypes.INTEGER,">=",tokenTypes.INTEGER));
console.log("> "+c.checkCompatibility(tokenTypes.INTEGER,">",tokenTypes.INTEGER));
console.log("&& "+c.checkCompatibility(tokenTypes.INTEGER,"&&",tokenTypes.INTEGER));
console.log("|| "+c.checkCompatibility(tokenTypes.INTEGER,"||",tokenTypes.INTEGER));
console.log("<< "+c.checkCompatibility(tokenTypes.INTEGER,"<<",tokenTypes.INTEGER));
console.log(">> "+c.checkCompatibility(tokenTypes.INTEGER,">>",tokenTypes.INTEGER));
console.log("| " +c.checkCompatibility(tokenTypes.INTEGER,"|",tokenTypes.INTEGER));
console.log("& "+c.checkCompatibility(tokenTypes.INTEGER,"&",tokenTypes.INTEGER));

console.log("\n\nINTEGER - REAL COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.REAL,"+",tokenTypes.REAL));
console.log("- "+c.checkCompatibility(tokenTypes.REAL,"-",tokenTypes.REAL));
console.log("/ "+c.checkCompatibility(tokenTypes.REAL,"/",tokenTypes.REAL));
console.log("* "+c.checkCompatibility(tokenTypes.REAL,"*",tokenTypes.REAL));
console.log("** "+c.checkCompatibility(tokenTypes.REAL,"**",tokenTypes.REAL));
console.log("% "+c.checkCompatibility(tokenTypes.REAL,"%",tokenTypes.REAL));
console.log("== "+c.checkCompatibility(tokenTypes.REAL,"==",tokenTypes.REAL));
console.log("!= "+c.checkCompatibility(tokenTypes.REAL,"!=",tokenTypes.REAL));
console.log("<= "+c.checkCompatibility(tokenTypes.REAL,"<=",tokenTypes.REAL));
console.log("< "+c.checkCompatibility(tokenTypes.REAL,"<",tokenTypes.REAL));
console.log(">= "+c.checkCompatibility(tokenTypes.REAL,">=",tokenTypes.REAL));
console.log("> "+c.checkCompatibility(tokenTypes.REAL,">",tokenTypes.REAL));
console.log("&& "+c.checkCompatibility(tokenTypes.REAL,"&&",tokenTypes.REAL));
console.log("|| "+c.checkCompatibility(tokenTypes.REAL,"||",tokenTypes.REAL));
console.log("<< "+c.checkCompatibility(tokenTypes.REAL,"<<",tokenTypes.REAL));
console.log(">> "+c.checkCompatibility(tokenTypes.REAL,">>",tokenTypes.REAL));
console.log("| " +c.checkCompatibility(tokenTypes.REAL,"|",tokenTypes.REAL));
console.log("& "+c.checkCompatibility(tokenTypes.REAL,"&",tokenTypes.REAL));

console.log("\n\nINTEGER - CHAR COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.CHAR,"+",tokenTypes.CHAR));
console.log("- "+c.checkCompatibility(tokenTypes.CHAR,"-",tokenTypes.CHAR));
console.log("/ "+c.checkCompatibility(tokenTypes.CHAR,"/",tokenTypes.CHAR));
console.log("* "+c.checkCompatibility(tokenTypes.CHAR,"*",tokenTypes.CHAR));
console.log("** "+c.checkCompatibility(tokenTypes.CHAR,"**",tokenTypes.CHAR));
console.log("% "+c.checkCompatibility(tokenTypes.CHAR,"%",tokenTypes.CHAR));
console.log("== "+c.checkCompatibility(tokenTypes.CHAR,"==",tokenTypes.CHAR));
console.log("!= "+c.checkCompatibility(tokenTypes.CHAR,"!=",tokenTypes.CHAR));
console.log("<= "+c.checkCompatibility(tokenTypes.CHAR,"<=",tokenTypes.CHAR));
console.log("< "+c.checkCompatibility(tokenTypes.CHAR,"<",tokenTypes.CHAR));
console.log(">= "+c.checkCompatibility(tokenTypes.CHAR,">=",tokenTypes.CHAR));
console.log("> "+c.checkCompatibility(tokenTypes.CHAR,">",tokenTypes.CHAR));
console.log("&& "+c.checkCompatibility(tokenTypes.CHAR,"&&",tokenTypes.CHAR));
console.log("|| "+c.checkCompatibility(tokenTypes.CHAR,"||",tokenTypes.CHAR));
console.log("<< "+c.checkCompatibility(tokenTypes.CHAR,"<<",tokenTypes.CHAR));
console.log(">> "+c.checkCompatibility(tokenTypes.CHAR,">>",tokenTypes.CHAR));
console.log("| " +c.checkCompatibility(tokenTypes.CHAR,"|",tokenTypes.CHAR));
console.log("& "+c.checkCompatibility(tokenTypes.CHAR,"&",tokenTypes.CHAR));

console.log("\n\nINTEGER - STRING COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.STRING,"+",tokenTypes.STRING));
console.log("- "+c.checkCompatibility(tokenTypes.STRING,"-",tokenTypes.STRING));
console.log("/ "+c.checkCompatibility(tokenTypes.STRING,"/",tokenTypes.STRING));
console.log("* "+c.checkCompatibility(tokenTypes.STRING,"*",tokenTypes.STRING));
console.log("** "+c.checkCompatibility(tokenTypes.STRING,"**",tokenTypes.STRING));
console.log("% "+c.checkCompatibility(tokenTypes.STRING,"%",tokenTypes.STRING));
console.log("== "+c.checkCompatibility(tokenTypes.STRING,"==",tokenTypes.STRING));
console.log("!= "+c.checkCompatibility(tokenTypes.STRING,"!=",tokenTypes.STRING));
console.log("<= "+c.checkCompatibility(tokenTypes.STRING,"<=",tokenTypes.STRING));
console.log("< "+c.checkCompatibility(tokenTypes.STRING,"<",tokenTypes.STRING));
console.log(">= "+c.checkCompatibility(tokenTypes.STRING,">=",tokenTypes.STRING));
console.log("> "+c.checkCompatibility(tokenTypes.STRING,">",tokenTypes.STRING));
console.log("&& "+c.checkCompatibility(tokenTypes.STRING,"&&",tokenTypes.STRING));
console.log("|| "+c.checkCompatibility(tokenTypes.STRING,"||",tokenTypes.STRING));
console.log("<< "+c.checkCompatibility(tokenTypes.STRING,"<<",tokenTypes.STRING));
console.log(">> "+c.checkCompatibility(tokenTypes.STRING,">>",tokenTypes.STRING));
console.log("| " +c.checkCompatibility(tokenTypes.STRING,"|",tokenTypes.STRING));
console.log("& "+c.checkCompatibility(tokenTypes.STRING,"&",tokenTypes.STRING));

console.log("\n\nINTEGER - BOOLEAN COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.BOOLEAN,"+",tokenTypes.BOOLEAN));
console.log("- "+c.checkCompatibility(tokenTypes.BOOLEAN,"-",tokenTypes.BOOLEAN));
console.log("/ "+c.checkCompatibility(tokenTypes.BOOLEAN,"/",tokenTypes.BOOLEAN));
console.log("* "+c.checkCompatibility(tokenTypes.BOOLEAN,"*",tokenTypes.BOOLEAN));
console.log("** "+c.checkCompatibility(tokenTypes.BOOLEAN,"**",tokenTypes.BOOLEAN));
console.log("% "+c.checkCompatibility(tokenTypes.BOOLEAN,"%",tokenTypes.BOOLEAN));
console.log("== "+c.checkCompatibility(tokenTypes.BOOLEAN,"==",tokenTypes.BOOLEAN));
console.log("!= "+c.checkCompatibility(tokenTypes.BOOLEAN,"!=",tokenTypes.BOOLEAN));
console.log("<= "+c.checkCompatibility(tokenTypes.BOOLEAN,"<=",tokenTypes.BOOLEAN));
console.log("< "+c.checkCompatibility(tokenTypes.BOOLEAN,"<",tokenTypes.BOOLEAN));
console.log(">= "+c.checkCompatibility(tokenTypes.BOOLEAN,">=",tokenTypes.BOOLEAN));
console.log("> "+c.checkCompatibility(tokenTypes.BOOLEAN,">",tokenTypes.BOOLEAN));
console.log("&& "+c.checkCompatibility(tokenTypes.BOOLEAN,"&&",tokenTypes.BOOLEAN));
console.log("|| "+c.checkCompatibility(tokenTypes.BOOLEAN,"||",tokenTypes.BOOLEAN));
console.log("<< "+c.checkCompatibility(tokenTypes.BOOLEAN,"<<",tokenTypes.BOOLEAN));
console.log(">> "+c.checkCompatibility(tokenTypes.BOOLEAN,">>",tokenTypes.BOOLEAN));
console.log("| " +c.checkCompatibility(tokenTypes.BOOLEAN,"|",tokenTypes.BOOLEAN));
console.log("& "+c.checkCompatibility(tokenTypes.BOOLEAN,"&",tokenTypes.BOOLEAN));



var codes={
	1: "INTEGER",
	2: "REAL",
	4: "STRING",
	8: "CHAR",
	16: "BOOLEAN"
};


console.log("\n\n************************************************************");
console.log("INTEGER VARTYPES RESULT");
console.log("************************************************************");
console.log("INTEGER -> "+codes[c.getFinalType(tokenTypes.INTEGER,tokenTypes.INTEGER)]);
console.log("REAL -> "+codes[c.getFinalType(tokenTypes.INTEGER,tokenTypes.REAL)]);
console.log("STRING -> "+codes[c.getFinalType(tokenTypes.INTEGER,tokenTypes.STRING)]);
console.log("CHAR-> "+codes[c.getFinalType(tokenTypes.INTEGER,tokenTypes.CHAR)]);
console.log("\n\n************************************************************");
console.log("REAL VARTYPES RESULT");
console.log("************************************************************");
console.log("INTEGER -> "+codes[c.getFinalType(tokenTypes.REAL,tokenTypes.INTEGER)]);
console.log("REAL -> "+codes[c.getFinalType(tokenTypes.REAL,tokenTypes.REAL)]);
console.log("STRING -> "+codes[c.getFinalType(tokenTypes.REAL,tokenTypes.STRING)]);

console.log("\n\n************************************************************");
console.log("STRING VARTYPES RESULT");
console.log("************************************************************");
console.log("INTEGER -> "+codes[c.getFinalType(tokenTypes.STRING,tokenTypes.INTEGER)]);
console.log("REAL -> "+codes[c.getFinalType(tokenTypes.STRING,tokenTypes.REAL)]);
console.log("STRING -> "+codes[c.getFinalType(tokenTypes.STRING,tokenTypes.STRING)]);
console.log("CHAR-> "+codes[c.getFinalType(tokenTypes.STRING,tokenTypes.CHAR)]);

console.log("\n\n************************************************************");
console.log("CHAR VARTYPES RESULT");
console.log("************************************************************");

console.log("INTEGER -> "+codes[c.getFinalType(tokenTypes.CHAR,tokenTypes.INTEGER)]);
console.log("STRING -> "+codes[c.getFinalType(tokenTypes.CHAR,tokenTypes.STRING)]);
console.log("CHAR-> "+codes[c.getFinalType(tokenTypes.CHAR,tokenTypes.CHAR)]);

console.log("\n\n************************************************************");
console.log("BOOLEAN VARTYPES RESULT");
console.log("************************************************************");

console.log("INTEGER -> "+codes[c.getFinalType(tokenTypes.BOOLEAN,tokenTypes.BOOLEAN)]);

