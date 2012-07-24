function Enum() {}

Enum.POS = {NOUN:0, VERB:1, ADJECTIVE:2, ADVERB:3, INTERJECTION:4};

function Dictionary(){
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
    this.remove = function ( key ){
        if( this.containsKey(key) && ( delete entry[key] ) ){
            size --;
        }
    };
    this.containsKey = function ( key ){
    	return (entry[key] != undefined);
    };
    this.containsValue = function ( value ){
        for(var prop in entry){
            if(entry[prop] == value){
                return true;
            }
        }
        return false;
    };
    this.values = function (){
        var values = new Array();
        for(var prop in entry){
            values.push(entry[prop]);
        }
        return values;
    };
    this.keys = function (){
        var keys = new Array();
        for(var prop in entry){
            keys.push(prop);
        }
        return keys;
    };
    this.size = function (){
        return size;
    };
    this.clear = function (){
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
	
	this.count = 0;
		var xmlDoc = loadXmlFile("data/dictionary.xml");
		
		var wordNodes = xmlDoc.getElementsByTagName("word");
		for(var i = 0; i < wordNodes.length; i++){
			var word = wordNodes[i];
			var key = word.childNodes[0].nodeValue.toUpperCase();
			
			var emotionNodes = word.getElementsByTagName("emotion");
			var emotion = emotionNodes[0];
			
			var data = new DictionaryData();
			data.valence = parseFloat(emotion.getAttribute("v"));
			data.activation = parseFloat(emotion.getAttribute("a"));
			data.imagery = parseFloat(emotion.getAttribute("i"));
			
			var posNodes = word.getElementsByTagName("pos");
			var pos = posNodes[0];
			
			if(pos.childNodes.length > 0){
				var posString = pos.childNodes[0].nodeValue;
			}
			else{
				var posString = "?";
			}
			
			if(posString.length == 1){
				this.count += 1;
			}
			if(posString.indexOf('N') >= 0){
				data.pos.push(Enum.POS.NOUN);
			}
			if(posString.indexOf('V') >= 0){
				data.pos.push(Enum.POS.VERB);
			}
			if(posString.indexOf('A') >= 0){
				data.pos.push(Enum.POS.ADJECTIVE);
			}
			if(posString.indexOf('v') >= 0){
				data.pos.push(Enum.POS.ADVERB);
			}
			if(posString.indexOf('I') >= 0){
				data.pos.push(Enum.POS.INTERJECTION);
			}
			this.put(key, data);
			
		}
	
}


function DictionaryData(){
	this.valence = 0.0;
	this.activation = 0.0;
	this.imagery = 0.0;
	this.pos = new Array();
}