module.exports= {
	INTEGER: 1<<0,
	REAL:    1<<1,
	STRING:  1<<2,
	CHAR:    1<<3,
	BOOLEAN: 1<<4,
	NULL:    1<<5,
	NUMBER: (1<<0 | 1<<1),
	ALL: (1<<0 | 1<<1 | 1<<2 | 1<<3 | 1<<4 | 1<<5)
};
