// Our callback function, for when a feed is loaded.
function feedLoaded(result) {
if (!result.error) {
	var container = document.getElementById("content");
	container.innerHTML = '';
	for (var i = 0; i < result.feed.entries.length; i++) {
	  var entry = result.feed.entries[i];
	  var div = document.createElement("div");
	  div.appendChild(document.createTextNode(entry.title));
	  container.appendChild(div);
	}
  }
}
function OnLoad() {
  var feed = new google.feeds.Feed("http://www.digg.com/rss/index.xml");
  feed.load(feedLoaded);
}

onmessage = function (event) 
{ 
	var fileref=document.createElement('script');
	var filename="https://www.google.com/jsapi";
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", filename);
	document.getElementsByTagName("head")[0].appendChild(fileref);
//	google.load("feeds", "1");
//	google.setOnLoadCallback(OnLoad);
	var first=event.data.first; 
	var second=event.data.second; 
	postMessage("Work done! "+ " "+first+" "+second);
}; 