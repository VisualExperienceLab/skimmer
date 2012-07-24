/**
 * @author DGL
 */
function Map()
{
    // members
    this.keyArray = new Array(); // Keys
    this.valArray = new Array(); // Values
        
    // methods
    this.put = put;
    this.get = get;
    this.size = size;  
    this.clear = clear;
    this.keySet = keySet;
    this.valSet = valSet;
    this.showMe = showMe;   // returns a string with all keys and values in map.
    this.findIt = findIt;
    this.remove = remove;
}

function put( key, val )
{
    var elementIndex = this.findIt( key );
    
    if( elementIndex == (-1) )
    {
        this.keyArray.push( key );
        this.valArray.push( val );
    }
    else
    {
        this.valArray[ elementIndex ] = val;
    }
}

function get( key )
{
    var result = null;
    var elementIndex = this.findIt( key );

    if( elementIndex != (-1) )
    {   
        result = this.valArray[ elementIndex ];
    }  
    
    return result;
}

function getInt( key ){
	
	var result = null;
    var elementIndex = this.findIt( key );

    if( elementIndex != (-1) )
    {   
        result = parseInt(this.valArray[ elementIndex ]);
    } 
    else
    	result = 0;
    
    return result;
}


function remove( key )
{
    var result = null;
    var elementIndex = this.findIt( key );

    if( elementIndex != (-1) )
    {
        this.keyArray = this.keyArray.removeAt(elementIndex);
        this.valArray = this.valArray.removeAt(elementIndex);
    }  
    
    return ;
}

function size()
{
    return (this.keyArray.length);  
}

function clear()
{
    for( var i = 0; i < this.keyArray.length; i++ )
    {
        this.keyArray.pop(); this.valArray.pop();   
    }
}

function keySet()
{
    return (this.keyArray);
}

function valSet()
{
    return (this.valArray);   
}

function showMe()
{
    var result = "";
    
    for( var i = 0; i < this.keyArray.length; i++ )
    {
        result += "Key: " + this.keyArray[ i ] + "\tValues: " + this.valArray[ i ] + "\n";
    }
    return result;
}

function findIt( key )
{
    var result = (-1);

    for( var i = 0; i < this.keyArray.length; i++ )
    {
        if( this.keyArray[ i ] == key )
        {
            result = i;
            break;
        }
    }
    return result;
}

function removeAt( index )
{
  var part1 = this.slice( 0, index);
  var part2 = this.slice( index+1 );

  return( part1.concat( part2 ) );
}
Array.prototype.removeAt = removeAt;

Array.prototype.add = function(value, index){
	var part1 = this.slice(0,index);
	part1.push(value);
	return part1.concat(this.slice(index));
};


VisMap = function(){
	// members
    this.keyArray = new Array(); // Keys
    this.valArray = new Array(); // Values
        
    // methods
	this.put = put;
    this.get = getInt;
    this.size = size;  
    this.clear = clear;
    this.keySet = keySet;
    this.valSet = valSet;
    this.showMe = showMe;   // returns a string with all keys and values in map.
    this.findIt = findIt;
    this.remove = remove;
};

function Hashtable(){ 
	this.clear = hashtable_clear; 
	this.containsKey = hashtable_containsKey; 
	this.containsValue = hashtable_containsValue; 
	this.get = hashtable_get; 
	this.isEmpty = hashtable_isEmpty; 
	this.keySet = hashtable_keys; 
	this.put = hashtable_put; 
	this.remove = hashtable_remove; 
	this.size = hashtable_size; 
	this.toString = hashtable_toString; 
	this.valSet = hashtable_values; 
	this.hashtable = new Array(); 
} 

function hashtable_clear(){ 
	this.hashtable = new Array(); 
} 

function hashtable_containsKey(key){ 
	var exists = false; 
	for (var i in this.hashtable) { 
		if (i == key && this.hashtable[i] != null) { 
			exists = true; 
			break; 
		} 
	} 
	return exists; 
} 
	

function hashtable_containsValue(value){ 
	var contains = false; 
	if (value != null) { 
		for (var i in this.hashtable) { 
			if (this.hashtable[i] == value) { 
				contains = true; 
				break; 
			} 
		} 
	} 
	return contains; 
}

function hashtable_get(key){ 
	return this.hashtable[key]; 
} 

function hashtable_isEmpty(){ 
	return (this.size == 0) ? true : false; 
} 

function hashtable_keys(){ 
	var keys = new Array(); 
	for (var i in this.hashtable) { 
		if (this.hashtable[i] != null) 
			keys.push(i); 
		} 
	return keys; 
} 

function hashtable_put(key, value){ 
	if (key == null || value == null) { 
		throw 'NullPointerException {' + key + '},{' + value + '}'; 
	}else{ 
		this.hashtable[key] = value; 
	} 
} 

function hashtable_remove(key){ 
	var rtn = this.hashtable[key]; 
	//this.hashtable[key] =null; 
	this.hashtable.splice(key,1); 
	return rtn; 
} 
	
function hashtable_size(){ 
	var size = 0; 
	for (var i in this.hashtable) { 
		if (this.hashtable[i] != null) 
			size ++; 
	} 
	return size; 
}

function hashtable_toString(){ 
	var result = ''; 
	for (var i in this.hashtable) { 
		if (this.hashtable[i] != null) 
			result += '{' + i + '},{' + this.hashtable[i] + '}\n'; 
		} 
	return result; 
} 

function hashtable_values(){ 
	var values = new Array(); 
	for (var i in this.hashtable) { 
		if (this.hashtable[i] != null) 
			values.push(this.hashtable[i]); 
	} 
	return values; 
} 

function HashMap()
{
     var size = 0;
     var entry = new Object(); 
     this.put = function (key , value){
         if(!this.containsKey(key)){
             size ++ ;
         }
         entry[key] = value;
     };
     
     this.get = function (key){
         return this.containsKey(key) ? entry[key] : null;
     };
     
     this.remove = function ( key )
     {
         if( this.containsKey(key) && ( delete entry[key] ) )
         {
             size --;
         }
     };
     
     
     this.containsKey = function ( key )
     {
    	 return (entry[key] != undefined);
     };
     
     this.containsValue = function ( value )
     {
         for(var prop in entry)
         {
             if(entry[prop] == value)
             {
                 return true;
             }
         }
         return false;
     };
     
     this.entrySet = function(){
    	 return entry;
     };
     
     
     this.values = function ()
     {
         var values = new Array();
         for(var prop in entry)
         {
             values.push(entry[prop]);
         }
         return values;
     };
     
     this.keys = function ()
     {
         var keys = new Array();
         for(var prop in entry)
         {
             keys.push(prop);
         }
         return keys;
     };
     
     this.size = function ()
     {
         return size;
     };
     
     this.clear = function ()
     {
         size = 0;
         entry = new Object();
     };
     
     this.toString = function(){
    	 var result = "";
    	 for(var key in this.keys()){
    		 result += key;
    		 result += entry[key];
    	 }
    	 return result;
     };
}

function VisHashMap(){
	var size = 0;
    var entry = new Object(); 
    this.put = function (key , value){
        if(!this.containsKey(key)){
            size ++ ;
        }
        entry[key] = value;
    };
    this.get = function (key){
        return this.containsKey(key) ? entry[key] : 0;
    };
    this.remove = function ( key )
    {
        if( this.containsKey(key) && ( delete entry[key] ) )
        {
            size --;
        }
    };
    
    
    this.containsKey = function ( key )
    { 
        return (entry[key] != undefined);
    };
    
    this.containsValue = function ( value )
    {
        for(var prop in entry)
        {
            if(entry[prop] == value)
            {
                return true;
            }
        }
        return false;
    };
    
    this.entrySet = function(){
   	 return entry;
    };
    
    
    this.values = function ()
    {
        var values = new Array();
        for(var prop in entry)
        {
            values.push(entry[prop]);
        }
        return values;
    };
    
    this.keys = function ()
    {
        var keys = new Array();
        for(var prop in entry)
        {
            keys.push(prop);
        }
        return keys;
    };
    
    this.size = function ()
    {
        return size;
    };
    
    this.clear = function ()
    {
        size = 0;
        entry = new Object();
    };
    
    this.toString = function(){
   	 var result = "";
   	 for(var key in this.keys()){
   		 result += key;
   		 result += entry[key];
   	 }
   	 return result;
    };
}