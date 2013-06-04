module.exports = {
	VALUE:0,
	//PARENT:1,  // ()   []   ->   .   :: (Grouping, scope, array/member access)
	UNARY_RIGHT:1,
	UNARY:2,  // !   ~   -   +   *   &   sizeof   type cast ++x   --x  
	POW:3,  // ^ (pow) functions
	MUL:4,  // *   /   %
	DIV:4,
	MOD:4,	
	SUM:5,  // +   -
	SUB:5,
	SHIFT:6,  // <<   >> ( Bitwise shift left and right)
	COMP1:7,  // <   <=   >   >= (Comparisons: less-than, ...)
	COMP2:8,  //  ==   != (Comparisons: equal and not equal)
	BITAND:9,  // & (Bitwise AND)
	BITEXOR:10,  // ^ (Bitwise exclusive OR)
	BITINOR:11, // | (Bitwise inclusive normal OR)
	LOGICAND:12, // && (Logical AND)
	LOGICOR:13, // || (Logical OR)
	CONDIT:14, // ?=   =   +=   -=  *=   /=   %=   &=  |=   ^=  <<=   >>=
	ASSIGN:14,
	COMMA:15, // , (comma operator)
	PARENT:1000
};