/**
 * @author DGL
 */


function Hashing(){
	this.entries = new Array(201);

	var i;
	for (i = 0; i < 201; i++) {
		this.entries[i] = new Array();
	}
}

// find a certain entry in the hash table
Hashing.prototype.findEntry = function(InputString) {

	var index = this.hashFunc(InputString);
	var length = this.entries[index].length;
	var i;
	
	for (i = 0; i < length; i++) {
		if (this.entries[index][i] == InputString) {
			return index;
		}
	}
	
	return -1;
};


// add an entry into the hashing map
Hashing.prototype.addEntry = function(InputString) {
	this.entries[this.hashFunc(InputString)].push(InputString);
};

// the hasing function
Hashing.prototype.hashFunc = function(InputString) {
	// Here the length of the input string is used as the hasing function
	if (this.getStringLength(InputString) <= 199) {
		return this.getStringLength(InputString);
	}
	else {
		return 200;
	}
};

// return the first char of the input string
Hashing.prototype.getFirstChar = function(InputString) {
	return InputString.charAt(0);
};

// return the length of the input string
Hashing.prototype.getStringLength = function(InputString) {
	return InputString.length;
};

