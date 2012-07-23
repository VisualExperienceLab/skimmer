/**
 * @author DGL
 */
 
function Article(){
	this.title = new String();
	this.summary = new String();
	
	// A string is used here to preserve the original RSS content
	this.rsscontent = new String();
	
	// The URL of the image
	this.imageUrl = null;
	
	this.words = new Array();
	this.titlewords = new Array();
	this.source = new String;
	this.timestamp = null;
	
	this.valence = 0.0;
	this.activation = 0.0;
	this.imagery = 0.0;
	this.toString = function(){
		return this.title;
	};
}

function loadXmlFile(xmlFile){
	var xmlDom = null;
	if (window.ActiveXObject){
		
		xmlDom = new ActiveXObject('MSXML2.DOMDocument.3.0');
		xmlDom.async=false;
		xmlDom.load(xmlFile);
	}else if (document.implementation && document.implementation.createDocument){
		var xmlhttp = new window.XMLHttpRequest();
		//console.log("hello1");
		xmlhttp.open("GET", xmlFile, false);
		//console.log("hello2");
		xmlhttp.send(null);
		//console.log("hello3");
		xmlDom = xmlhttp.responseXML;
		//console.log("hello4");
	}else{
		xmlDom = null;
	}
	return xmlDom;
}

String.prototype.compareTo = function(str) {
	if (typeof str != "string") return false; // if str is not of type string return false
	// do comparision implementation here, an examlpe:
	if (str > this.toString()) return 1;
	else if (str < this.toString()) return -1;
	else return 0;
};
String.prototype.compareToIgnoreCase = function(str) {
	if (typeof str != "string") return false; // if str is not of type string return false
	// do comparision implementation here, an examlpe:
	if (str.toLowerCase() > this.toString().toLowerCase()) return 1;
	else if (str.toLowerCase()  < this.toString().toLowerCase() ) return -1;
	else return 0;
};

// delete space in middle
String.prototype.Trim = function() { 
   return this.replace(/(^\s*)|(\s*$)/g, ""); 
};
// delete space left
String.prototype.LTrim = function() { 
   return this.replace(/(^\s*)/g, ""); 
};
// delete space right
String.prototype.RTrim = function() { 
   return this.replace(/(\s*$)/g, ""); 
};