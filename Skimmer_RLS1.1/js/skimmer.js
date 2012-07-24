/**
 * @author DGL
 */

 
function Skimmer(canvasOffsetLeft, canvasOffsetTop, canvasWidth, canvasHeight, feedResult, numEntries){

	this.colorType = 0;	//default
	
	this.numberOfArticles = 0;
	
	this.count = 0;
	this.DO_STEMMING = true;
	this.DRAW_CIRCLES = true;
	this.USE_COLLISION = true;
	this.USE_TITLES = true;
	this.stems = new HashMap();
	
	this.dictionary = new Dictionary();
	this.zoomedAgents = new Array();
	this.selectedWords = new Array();
	this.selectedArticles = new Array();
	this.selectedArticle = null;
	this.selectedArticleRanking = new Map();
	this.agentArticle = null;
	this.agentUser = null;
	this.agentTitle = new AgentTitle("");
	this.agents = new Array();
	this.newArticles = new Array();
	this.articles = new Array();
	this.words = new Array();
	this.occurrences = new VisHashMap();
	this.maxOccurrence = 0;
	this.lowOccurrence = 0;
	this.orderings = new VisHashMap();
	this.cooccurrences = new VisHashMap();
	this.maxCooccurrence = 0;
	this.lowCooccurrence = 0;
	this.adjacencies = new VisHashMap();
	this.maxAdjacency = 0;
	
	this.minRadius = 0;
	
	
	
	// color schema used when emotions are added to the program
	this.colorShadingA = new Color(50, 50, 50);
	//this.colorShadingB = new Color(255, 0, 0);
	this.colorShadingB = new Color(255, 255, 255);
	
	
	this.colorAgentWordText = new Color( 255, 255, 255 );
	this.colorAgentTitleBackground = new Color( 90, 90, 90 );
	this.colorAgentTitleBorder = new Color( 120, 120, 120 );
	this.colorAgentTitleText = new Color( 240, 240, 240 );

	this.colorAgentArticleHeaderBackground = new Color( 90, 90, 90 );
	this.colorAgentArticleHeaderBorder = new Color( 120, 120, 120 );
	this.colorAgentArticleHeaderText = new Color( 240, 240, 240 );
	this.colorAgentArticleBodyBackground = new Color( 240, 240, 240 );
	this.colorAgentArticleBodyBorder = new Color( 180, 180, 180 );
	this.colorAgentArticleBodyText = new Color( 50, 50, 50 );
	this.colorAgentArticleFooterBackground = new Color( 90, 90, 90 );
	this.colorAgentArticleFooterBorder = new Color( 120, 120, 120 );
	this.colorAgentArticleFooterText = new Color( 240, 240, 240 );
	
	
	
	// set the position of the skimmer
	this.left = canvasOffsetLeft,
	this.top = canvasOffsetTop;
	
	
	
	// Keep a record of the currently top occurring words and update them every time new articles are added to skimmer
	this.recordedTopWords = new Array();

	
	
	
	// set the height and width of the skimmer
	// only positive valuse are considered leagal input here
	if (canvasHeight > 0) {
		this.height = canvasHeight;
	}
	else {
		this.height = 768.0;
	}
	if (canvasWidth > 0) {
		this.width = canvasWidth;
	}
	else {
		this.width = 1024.0;
	}
	

	//this.height = 768.0;
	//this.width = 1024.0;
	
	

	/** Controls the influence of the user's input. */
	this.CENTER_FORCE = 100;
	this.SMUDGE_FORCE = 500;
	
	this.TITLE_WEIGHT = 100;
	this.MIN_NUM_OCCURRENCES = 2;
	this.SORTED_OCCURRENCE_LIST_SIZE = 2000;
	this.MAX_NUM_PAIRS = 200;
	this.MAX_NUM_AGENTS = 50;
	this.MAX_WORDS_PER_ZOOM = 10;
	this.MAX_ZOOMED_AGENTS = 30;
	
	this.ENFORCE_POS_REQUIREMENTS = false;
	this.NOUN_REQUIREMENT = 0.0;
	this.ADJECTIVE_REQUIREMENT = 1.0;
	this.VERB_REQUIREMENT = 1.0;
	this.ADVERB_REQUIREMENT = 1.0;
	this.INTERJECTION_REQUIREMENT = 0.0;
	this.UNCLASSIFIED_REQUIREMENT = 0.0;
	this.ENFORCE_ORDERING = false;
	this.ORDERING_MULTIPLIER = 400;	
	
	
	// The following code is a simple example of hashing table
	/*
	this.ArticlesHashTable = new Hashing();
	
	this.ArticlesHashTable.addEntry("Wakaka");
	this.ArticlesHashTable.addEntry("Hahahaha");
	this.ArticlesHashTable.addEntry("This is a centence with blank spaces between words");
	this.ArticlesHashTable.addEntry("Anther test! Interesting isn't it?");
	this.ArticlesHashTable.addEntry("1234567");

	alert(this.ArticlesHashTable.findEntry("Wakaka"));
	alert(this.ArticlesHashTable.findEntry("This is a centence with blank spaces between words"));
	alert(this.ArticlesHashTable.findEntry("Java"));
	*/
	
	
	
	//alert("In skimmer");
	//alert(feedResult.feed.title);
	
	
	// Here the source of RSS is obtained via the Google Javascript API online
	
	
	// Read data from the xml file
	// This line of code should be replaced by the code reading data from the RSS in the future 
	//var xmlDoc = loadXmlFile("data/Feed002.rss");
	//var xmlArticles = xmlDoc.getElementsByTagName("item"); // The tag item here should be replaced by entry in the future
			
			
			
	// Set the number of articles
	this.numberOfArticles = numEntries;
	
	
	// Create a class article for all the items read from the xml file and store them in the array
	//for(var i = 0; i < xmlArticles.length ;i++){
	for(var i = 0; i < numEntries; i++){
		this.newArticles[i] = new Article();
		
		// Get the title of the article
		//this.newArticles[i].title = xmlArticles[i].getElementsByTagName("title")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].title = feedResult.feed.entries[i].title;
		
		//this.newArticles[i].summary = xmlArticles[i].getElementsByTagName("description")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].summary =  feedResult.feed.entries[i].content;
		this.newArticles[i].rsscontent = feedResult.feed.entries[i].content;
				
		
		// Strip html tags in the text
		// This is a good method for browsers, but sometimes it is not appropriate for some applications. So pay special attention when some other modifications of input source are done
		// But the performance and the result are good
		if ((this.newArticles[i].summary != "")&&(this.newArticles[i].summary != " "))
		{
			var tmp = document.createElement("DIV");
			tmp.innerHTML = this.newArticles[i].summary;
			this.newArticles[i].summary = tmp.textContent||tmp.innerText;
		}


		
		// Get the URL of the image if there is an image attached to the news
		// Otherwise the image URL will be set null
		
		this.imageUrl = null;
		
		
		// Get the entries with the tag "img" from the rss data
		var imgSrc = this.newArticles[i].rsscontent.match(/<img[^<]*>/g);
		if (imgSrc != null)
		{
			for (var ii = 0; ii < imgSrc.length; ii++) {
				// Get the attribute with the attribute name src
				var tempSrc = imgSrc[ii].match(/src[^"]*"[^"]*"/);
				if (tempSrc != null) {
					// Get the string with quote around it
					var imgSrcQuote = tempSrc[0].match(/"[^"]*"/);
					if (imgSrcQuote != null)
					{
						// Get the string with quota around it
						var imgSrc = imgSrcQuote[0].substring(1, imgSrcQuote[0].length - 1);
						
						if (imgSrc.substring(0,4) != "http") {
							imgSrc = "http:" + imgSrc;
						}
						
						this.imageUrl = imgSrc;
						
					}
					//alert(imgSrc[ii].match(/src[^"]*"[^"]*"/));
				}
			}
		}
		
		
		this.newArticles[i].imageUrl = this.imageUrl;
		
		//console.log(this.newArticles[i].imageUrl);
		//console.log("hey");
		
		
		//this.newArticles[i].source = xmlArticles[i].getElementsByTagName("link")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].source = feedResult.feed.entries[i].link;
		
		this.newArticles[i].timestamp = new Date();
		this.newArticles[i].words = removeStopWords(this.newArticles[i].summary.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		this.newArticles[i].titlewords = removeStopWords(this.newArticles[i].title.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		
	}
	
	
	// Insert the user agent. //
	this.agentUser = new AgentUser();
	this.agentUser.pos.set( -( this.width / 2 ) + Math.random() * this.width, -( this.height / 2 ) + Math.random()
				* this.height );
	this.agentUser.bounds.extents.set( this.agentUser.radius, this.agentUser.radius );
	
	//this.agentTitle.text = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	this.agentTitle.text = feedResult.feed.title;
	
	this.agentTitle.pos.set(0,-(this.height / 2) + 20);
		
}



Skimmer.prototype.addNewArticles = function(){

	for(var i = 0; i < this.newArticles.length; i++){
		this.newArticles[i].summary = this.newArticles[i].summary.trim();
	}
	
	if(this.DO_STEMMING){
		var allStemPairs = new VisHashMap();
		for(var i = 0; i < this.newArticles.length; i++){
			// For summary words.
			var stemmed = new Array();
			for(var j = 0; j < this.newArticles[i].words.length; j++){
				var stemmer = new StemmerPorter();
				stemmer.add(this.newArticles[i].words[j]);
				stemmer.stem();
				var stem = stemmer.toString();
				stemmed.push(stem);
				
				var stemPairs = null;
				if(!allStemPairs.containsKey(stem)){
					stemPairs = new VisHashMap();
					allStemPairs.put(stem,stemPairs);
				}
				else{
					stemPairs = allStemPairs.get(stem);
				}
				var curcount = stemPairs.get(this.newArticles[i].words[j]);
				curcount += 1;
				stemPairs.put(this.newArticles[i].words[j],curcount);
			}
			this.newArticles[i].words.length = 0;
			this.newArticles[i].words = this.newArticles[i].words.concat(stemmed);
			
			//For title words
			if(this.USE_TITLES){
				stemmed.length = 0;
				for(var j = 0; j < this.newArticles[i].titlewords.length; j++){
					var stemmer = new StemmerPorter();
					stemmer.add(this.newArticles[i].titlewords[j]);
					stemmer.stem();
					var stem = stemmer.toString();
					stemmed.push(stem);
					
					var stemPairs = null;
					if(!allStemPairs.containsKey(stem)){
						stemPairs = new VisHashMap();
						allStemPairs.put(stem,stemPairs);
					}
					else{
						stemPairs = allStemPairs.get(stem);
					}
					var curcount = stemPairs.get(this.newArticles[i].titlewords[j]);
					curcount += 1;
					stemPairs.put(this.newArticles[i].titlewords[j],curcount);
				}
				this.newArticles[i].titlewords.length = 0;
				this.newArticles[i].titlewords = this.newArticles[i].titlewords.concat(stemmed);
			}
		}


		// Build the map for the stem to real-word pairings. //
		for(var i = 0; i < allStemPairs.size(); i++){
			var stem = allStemPairs.keys()[i];
			var stemPairs = allStemPairs.get(stem);
			var maxCount = -1;
			var selectedword = "";
			for(var j = 0; j < stemPairs.size(); j++){
				var word = stemPairs.keys()[j];
				var count = stemPairs.get(word);
				if(count > maxCount){
					maxCount = count;
					selectedword = word;
				}
			}
			this.stems.put(stem, selectedword);
		}
		
	}
	
	
	// Extract all stemmed words from all articles, ignoring duplicates. //
	// Also count total occurrences while doing this loop. /
	
	var removalList = new Array();
	for(var i = 0; i < this.newArticles.length; i++){
		var duplicateArticle = false;
		for(var j = 0; j < this.articles.length; j++){
			if(this.articles[j].title.toLowerCase() == this.newArticles[i].title.toLowerCase()){
				duplicateArticle = true;
			}
		}
		if(!duplicateArticle){
			//For summary words
			for(var j = 0; j < this.newArticles[i].words.length; j++){
				var word = this.newArticles[i].words[j];
				if(this.words.indexOf(word) < 0){
					this.words.push(word);
					this.occurrences.put(word,1);
				}
				else{
					var count;
					count = this.occurrences.get(word) + 1;
					this.occurrences.put(word,count);
					if(count > this.maxOccurrence){
						this.maxOccurrence = count;
					}
				}
			}
			
			//For title words
			if(this.USE_TITLES){
				for(var j = 0; j < this.newArticles[i].titlewords.length; j++){
					var titleword = this.newArticles[i].titlewords[j];
					if(this.words.indexOf(titleword) < 0){
						this.words.push(titleword);
						this.occurrences.put(titleword,this.TITLE_WEIGHT);
					}
					else{
						var count;
						count = this.occurrences.get(titleword) + this.TITLE_WEIGHT;
						this.occurrences.put(titleword,count);
						if(count > this.maxOccurrence){
							this.maxOccurrence = count;
						}
					}
				}
			}
		}
		else{
			removalList.push(i);
		}
	}
	
	for(var i = 0; i < removalList.length; i++){
		this.newArticles = this.newArticles.removeAt(removalList[i]);
	}
	removalList.length = 0;
	
	
	// Remove all words that fall below the minimum occurrence requirement.
	for(var i = 0; i < this.words.length; i++){
		var word = this.words[i];
		if(this.occurrences.get(word) < this.MIN_NUM_OCCURRENCES){
			
			this.occurrences.remove(word);
			this.words = this.words.removeAt(i);
			//For summary words
			for(var j = 0; j < this.newArticles.length; j++){
				var indexArticle = this.newArticles[j].words.indexOf(word);
				if(indexArticle > -1){
					this.newArticles[j].words = this.newArticles[j].words.removeAt(indexArticle);
				}
			}
			
			//For title words
			for(var j = 0; j < this.newArticles.length; j++){
				var indexArticle = this.newArticles[j].titlewords.indexOf(word);
				if(indexArticle > -1){
					this.newArticles[j].titlewords = this.newArticles[j].titlewords.removeAt(indexArticle);
				}
			}
			i -= 1;		
		}
	}
	
	
	// Build the ordering matrix. //
	for(var i = 0; i < this.newArticles.length; i++){
		var article = this.newArticles[i];
		
		var blocks = new Array();
		
		var splitlines = article.summary.split("\\.");
		for(var j = 0; j < splitlines.length; j++){
			var splitwords = splitlines[j].split(" ");
			var words = new Array();
			for(var k = 0; k < splitwords.length; k++){
				words.push(splitwords[k].toLowerCase());
			}
			blocks.push(words);
		}
		for(var j = 0; j < blocks.length; j++){
			var block = blocks[j];
			var pair = new String('');
			for(var k = 0; k < block.length; k++){
				for(var l = k + 1; l < block.length; l++){
					var wordA = block[k];
					var wordB = block[l];
					
					if(this.DO_STEMMING){
						var stemmer = new StemmerPorter();
						stemmer.add(wordA);
						stemmer.stem();
						wordA = stemmer.toString();
						
						stemmer = new StemmerPorter();
						stemmer.add(wordB);
						stemmer.stem();
						wordB = stemmer.toString();
					}
					
					if((this.words.indexOf(wordA) > -1) && (this.words.indexOf(wordB) > -1)){
						pair = this.getPair(wordA, wordB);
						var ordering = parseInt(this.orderings.get(pair));
						if(pair.indexOf(wordA) < pair.indexOf(wordB)){
							if(block.indexOf(wordA) < block.indexOf(wordB)){
								ordering -= 1;
							}
							else if(block.indexOf(wordA) > block.indexOf(wordB)){
								ordering += 1;
							}
						}
						else{
							if(block.indexOf(wordA) < block.indexOf(wordB)){
								ordering += 1;
							}
							else if(block.indexOf(wordA) > block.indexOf(wordB)){
								ordering -= 1;
							}
						}
						this.orderings.put(pair, ordering);
						
					}
					
				}
			}
		}
	}
	
	// Build the cooccurrence matrix. //
	// As well as adjacency matrix. //
	for(var i = 0; i < this.newArticles.length; i++){
		
		var article = this.newArticles[i];
		//For summary words
		var pair = new String('');
		var inversePair = new String('');
		for(var j = 0; j < article.words.length; j++){
			
			for(var k = j + 1; k < article.words.length; k++){
				pair = this.getPair(article.words[j], article.words[k]);
				inversePair = this.getInversePair(article.words[j], article.words[k]);
				
				var coCount = parseInt(this.cooccurrences.get(pair));
				coCount += 1;
				this.cooccurrences.put(pair, coCount);
				if(coCount > this.maxCooccurrence){
					this.maxCooccurrence = coCount;
				}
				if(article.summary.indexOf(pair) >= 0){
					var adjCount = parseInt(this.adjacencies.get(pair));
					adjCount += 1;
					this.adjacencies.put(pair, adjCount);
					if(adjCount > this.maxAdjacency){
						this.maxAdjacency = adjCount;
					}
				}
				if(article.summary.indexOf(inversePair) >= 0){
					var adjCount = parseInt(this.adjacencies.get(pair));
					adjCount += 1000;
					this.adjacencies.put(pair, adjCount);
					if(adjCount > this.maxAdjacency){
						this.maxAdjacency = adjCount;
					}
				}
			}
		}
		
		//For title words
		if(this.USE_TITLES){
			var pair = new String('');
			var inversePair = new String('');
			for(var j = 0; j < article.titlewords.length; j++){
				
				for(var k = j + 1; k < article.titlewords.length; k++){
					pair = this.getPair(article.titlewords[j], article.titlewords[k]);
					inversePair = this.getInversePair(article.titlewords[j], article.titlewords[k]);
					
					var coCount = parseInt(this.cooccurrences.get(pair));
					coCount += this.TITLE_WEIGHT;
					this.cooccurrences.put(pair, coCount);
					if(coCount > this.maxCooccurrence){
						this.maxCooccurrence = coCount;
					}
					if(article.summary.indexOf(pair) >= 0){
						var adjCount = parseInt(this.adjacencies.get(pair));
						adjCount += 1;
						this.adjacencies.put(pair, adjCount);
						if(adjCount > this.maxAdjacency){
							this.maxAdjacency = adjCount;
						}
					}
					if(article.summary.indexOf(inversePair) >= 0){
						var adjCount = parseInt(this.adjacencies.get(pair));
						adjCount += 1000;
						this.adjacencies.put(pair, adjCount);
						if(adjCount > this.maxAdjacency){
							this.maxAdjacency = adjCount;
						}
					}
				}
			}
		}
		
	}
	
	
	// Record the original length of the array articles
	originLength = this.articles.length;
	

	// New articles are now processed, move them all to main articles list. // 
	this.articles = this.articles.concat(this.newArticles);
	this.newArticles.length = 0;
	
	// Remove the duplicated items in the array articles
	var ii = 0;
	var jj;
	
	while (ii < this.articles.length) {

		if (ii < originLength) {
			jj = originLength;
		}
		else {
			jj = ii + 1;
		}
		
		while (jj < this.articles.length) {
			// Duplicated elements are found in the array
			if (this.articles[ii].title == this.articles[jj].title) {
				// Replace the duplicated element with the last element in the array
				this.articles[jj] = this.articles[this.articles.length - 1];
				// Delete the last element in the array
				this.articles.length = this.articles.length - 1;
			}
			// else do nothing
			
			jj++;
		}
		
		ii++;
	}
	
	
	// When the total number of articles reached a certain number, erase the aged ones
	if (this.articles.length > 2 * this.numberOfArticles) {
		// Replace the old articles with new ones
//		this.articles = this.articles.slice(this.numberOfArticles, this.articles.length);
	}
	
	
};




Skimmer.prototype.extractArticleMinMax = function(){
	//Maximum Occurrence
	this.maxOccurrence = 0;
	for(var i = 0; i < this.words.length; i++){
		var occurrence = this.occurrences.get(this.words[i]);
		if(occurrence > this.maxOccurrence){
			this.maxOccurrence = occurrence;
		}
	}
	
	//Maximum Cocurrence
	this.maxCooccurrence = 0;
	for(var i = 0; i < this.cooccurrences.size(); i++){
		var pair = this.cooccurrences.keys()[i];
		var coCount = this.cooccurrences.get(pair);
		if(coCount > this.maxCooccurrence ){
			this.maxCooccurrence = coCount;
		}
	}
	
	//Maximum Adjacency
	this.maxAdjacency = 0;
	for(var i = 0; i < this.adjacencies.size(); i++){
		var pair = this.adjacencies.keys()[i];
		var invAdjacency = parseInt(parseInt(this.adjacencies.get(pair))/1000);
		var adjacency = parseInt(parseInt(this.adjacencies.get(pair)) - invAdjacency * 1000);
		var totalAdjacency = invAdjacency + adjacency;
		if(totalAdjacency > this.maxAdjacency ){
			this.maxAdjacency = totalAdjacency;
		}
	}
	
	//Maximum Ordering
	this.maxOrdering = 0;
	for(var i = 0; i < this.orderings.size(); i++){
		var pair = this.orderings.keys()[i];
		var ordering = Math.abs(parseInt(this.orderings.get(pair)));
		if(ordering > this.maxOrdering ){
			this.maxOrdering = ordering;
		} 
	}
		
};

//seems not used
Skimmer.prototype.checkForAdjacencies = function(){
	//check for adjacency combinations
	for(var i = 0; i < this.articles.length; i++){
		var article = this.articles[i];
		var pair = new String('');
		var invPair = new String('');
		for(var j = 0; j < article.words.length; j++){
			for(var k = j + 1; k < article.words.length; k++){
				pair = this.getPair(article.words[j], article.words[k]);
				invPair = this.getInversePair(article.words[j], article.words[k]);
				
				var cooccurrence = parseInt(this.cooccurrences.get(pair));
				var invAdjacency = parseInt(parseInt(this.adjacencies.get(pair))/1000);
				var adjacency = parseInt(parseInt(this.adjacencies.get(pair)) - invAdjacency * 1000);
				var totalAdjacency = invAdjacency + adjacency;
				
				var occurrenceA = this.occurrences.get(pair.split(" ")[0]);
				var occurrenceB = this.occurrences.get(pair.split(" ")[1]);
				
				if(cooccurrence != 0 && occurrenceA!= 0 && occurrenceB!= 0){
					var ratio = totalAdjacency / cooccurrence;
					var freqRatioA = cooccurrence / occurrenceA;
					var freqRatioB = cooccurrence / occurrenceB;
					if(ratio > 0.85 && freqRatioA > 0.85 && freqRatioB > 0.85){
						if(adjacency > invAdjacency){
							//System.out.println( pair + " should be combined." );
						}
						else{
							//System.out.println( invPair + " should be combined." );
						}
						
					}
				}
			}
		}
	}
};


Skimmer.prototype.updateAgents = function(){
	
	// Build a collection of the top occurring words. //
	var topWords = new Array();
	for(var i = 0; i < this.words.length; i++){
		var word = this.words[i];
		var occurrence = this.occurrences.get(word);
		if(topWords.length == 0){
			topWords.push(word);
		}
		else if(topWords.length < this.SORTED_OCCURRENCE_LIST_SIZE){
			for(var j = 0; j < topWords.length; j++){
				var curWord = topWords[j];
				var curOccurrence = this.occurrences.get(curWord);
				
				if(occurrence >= curOccurrence){
					topWords = topWords.add(word,j);
					break;
				}
			}
			if(topWords.indexOf(word) < 0){
				topWords.push(word);
			}
		}
		else{
			var lastWord = topWords[topWords.length - 1];
			var lastOccurrence = this.occurrences.get(lasWord);
			if(occurrence > lastOccurrence){
				topWords.pop();
				for(var j = 0; j < topWords.length; j++){
					var curWord = topWords[j];
					var curOccurrence = this.occurrences.get(curWord);
					
					if(occurrence >= curOccurrence){
						topWords = topWords.add(word,j);
						break;
					}
				}
				if(topWords.indexOf(word) < 0){
					topWords.push(word);
				}
			}
		}
	}
	// Build a collection of the top cooccurring pairs. //
	var topPairs = new Array();
	for(var i = 0; i < this.cooccurrences.size(); i++){
		var pair = this.cooccurrences.keys()[i];
		var coCount = this.cooccurrences.get(pair);
		if(topPairs.length == 0){
			topPairs.push(pair);
		}
		else if(topPairs.length < this.MAX_NUM_PAIRS){
			for(var j = 0; j < topPairs.length; j++){
				var curPair = topPairs[j];
				var curCoCount = this.cooccurrences.get(curPair);
				
				if(coCount >= curCoCount){
					topPairs = topPairs.add(pair,j);
					break;
				}
			}
			if(topPairs.indexOf(pair) < 0){
				topPairs.push(pair);
			}
		}
		else{
			var lastPair = topPairs[topPairs.length - 1];
			var lastCoCount = this.cooccurrences.get(lastPair);
			if(coCount > lastCoCount){
				topPairs.pop();
				
				for(var j = 0; j < topPairs.length; j++){
					var curPair = topPairs[j];
					var curCoCount = this.cooccurrences.get(curPair);
					
					if(coCount >= curCoCount){
						topPairs = topPairs.add(pair,j);
						break;
					}
				}
				if(topPairs.indexOf(pair) < 0){
					topPairs.push(pair);
				}
			}
		}
	}
	
	// Find the lowCooccurrence for acceptance into visualization. //
	if(topPairs.length > 0){
		this.lowCooccurrence = this.cooccurrences.get(topPairs[topPairs.length - 1]);
	}
	else{
		this.lowCooccurrence = 0;
	}
	
	// Make sure that part of speech requirements make sense. //
	// Also fill in total number of agents per. //
	// Allocate lists for each. //
	var numNounAgents = 0;
	var numAdjectiveAgents = 0;
	var numVerbAgents = 0;
	var numAdverbAgents = 0;
	var numInterjectionAgents = 0;
	var numUnclassifiedAgents = 0;
	var nouns = new Array();	//AgentWord
	var adjectives = new Array();
	var verbs = new Array();
	var adverbs = new Array(); 
	var interjections = new Array();
	var unclassifieds = new Array();

	if(this.ENFORCE_POS_REQUIREMENTS){
		var reqSum = this.NOUN_REQUIREMENT + this.VERB_REQUIREMENT + this.ADJECTIVE_REQUIREMENT + this.ADVERB_REQUIREMENT + this.INTERJECTION_REQUIREMENT;
		if(reqSum <= 1.0){
			this.UNCLASSIFIED_REQUIREMENT = 1.0 - reqSum;
		}
		else{
			this.NOUN_REQUIREMENT /= reqSum;
			this.VERB_REQUIREMENT /= reqSum;
			this.ADJECTIVE_REQUIREMENT /= reqSum;
			this.ADVERB_REQUIREMENT /= reqSum;
			this.INTERJECTION_REQUIREMENT /= reqSum;
			this.UNCLASSIFIED_REQUIREMENT = 0.0;
		}
		numNounAgents = parseInt( this.NOUN_REQUIREMENT * this.MAX_NUM_AGENTS );		
		numAdjectiveAgents = parseInt( this.ADJECTIVE_REQUIREMENT * this.MAX_NUM_AGENTS );
		numVerbAgents = parseInt( this.VERB_REQUIREMENT * this.MAX_NUM_AGENTS );
		numAdverbAgents = parseInt( this.ADVERB_REQUIREMENT * this.MAX_NUM_AGENTS );
		numInterjectionAgents = parseInt( this.INTERJECTION_REQUIREMENT * this.MAX_NUM_AGENTS );
		numUnclassifiedAgents = parseInt( this.UNCLASSIFIED_REQUIREMENT * this.MAX_NUM_AGENTS );
	}else{
		numUnclassifiedAgents = this.MAX_NUM_AGENTS;
	}
	
	// Create agents to be placed into the visualization. //
	var tmpAgent = new AgentWord();
	var alreadyAdded = new Array();
	
	
	for(var i = 0; i < topWords.length; i++){
		for(var j = 0; j < topWords.length; j++){
			var wordA = topWords[i];
			var wordB = topWords[j];
			
			if(wordA.toLowerCase() != wordB.toLowerCase()){
				var pair = this.getPair(wordA, wordB);
				var coCount = this.lowCooccurrence + 1;
				
				if(!this.ENFORCE_POS_REQUIREMENTS){
					coCount = this.cooccurrences.get(pair);
				}
				if(coCount >= this.lowCooccurrence && (alreadyAdded.indexOf(wordA) < 0)){
					var alreadyAnAgent = false;
					for(var k = 0; k < this.agents.length; k++){
						var agent = this.agents[k];
						if(agent.stem.toLowerCase() == wordA.toLowerCase()){
							alreadyAnAgent = true;
						}
					}
					
					if(!alreadyAnAgent){
						tmpAgent = new AgentWord();
						tmpAgent.stem = wordA;
						if(this.DO_STEMMING){
							tmpAgent.text = this.stems.get(wordA);
						}else{
							tmpAgent.text = wordA;
						}
						tmpAgent.occurrences = this.occurrences.get(wordA);
						tmpAgent.pos.set( -3.0 + Math.random() * 6.0, -3.0 + Math.random() * 6.0);
						tmpAgent.timestamp = new Date();
						tmpAgent.desiredAlpha = 1.0;
						
						tmpAgent.textColor = this.colorAgentWordText;
						
						if(this.ENFORCE_POS_REQUIREMENTS){
							
							var data = this.dictionary.get(tmpAgent.text);
							if(data != null){
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.ADJECTIVE)){
										adjectives.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.VERB)){
										verbs.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.ADVERB)){
										adverbs.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.INTERJECTION)){
										interjections.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.NOUN)){
										nouns.push(tmpAgent);
									}
								}
							}
							else{
								unclassifieds.push(tmpAgent);
							}
						}
						else{
							unclassifieds.push(tmpAgent);
						}
						alreadyAdded.push(wordA);
						if(tmpAgent.occurrences < this.lowOccurrence){
							this.lowOccurrence = tmpAgent.occurrences;
						}
						break;
					}
				}
			}
		}
	}
	
	while(nouns.length != 0 && numNounAgents > 0){
		var newAgent = nouns.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numNounAgents -= 1;
			//newAgent.partOfSpeech = POS.NOUN;
			this.agents.push(newAgent);
		}
	}
	
	while(adjectives.length != 0 && numAdjectiveAgents > 0){
		var newAgent = adjectives.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numAdjectiveAgents -= 1;
			//newAgent.partOfSpeech = POS.ADJECTIVE;
			this.agents.push(newAgent);
		}
	}
	
	while(verbs.length != 0 && numVerbAgents > 0){
		var newAgent = verbs.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numVerbAgents -= 1;
			//newAgent.partOfSpeech = POS.VERB;
			this.agents.push(newAgent);
		}
	}
	
	while(adverbs.length != 0 && numAdverbAgents > 0){
		var newAgent = adverbs.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numAdverbAgents -= 1;
			//newAgent.partOfSpeech = POS.ADVERB;
			this.agents.push(newAgent);
		}
	}
	
	while(interjections.length != 0 && numInterjectionAgents > 0){
		var newAgent = interjections.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numInterjectionAgents -= 1;
			//newAgent.partOfSpeech = POS.INTERJECTION;
			this.agents.push(newAgent);
		}
	}
	
	while(unclassifieds.length != 0 && numUnclassifiedAgents > 0){
		var newAgent = unclassifieds.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numUnclassifiedAgents -= 1;
			this.agents.push(newAgent);
		}
	}
	this.updateAgentColor();
//	this.updateAgentPosEmotion();
	nouns.length = 0;
	adjectives.length = 0;
	verbs.length = 0;
	adverbs.length = 0;
	interjections.length = 0;
	unclassifieds.length = 0;
	alreadyAdded.length = 0;
	
	
	// Update the words of top occurence and record them
	this.recordedTopWords = topWords;
	
};


Skimmer.prototype.extractAgentMinMax = function(){
	//Find Minimum Radius
	this.minRadius = 0;
	 for(var i = 0; i < this.agents.length; i++){
	 	var agent = this.agents[i];
	 	var curRadius = agent.text.length * 8 / 2 + 5;
	 	if(curRadius > this.minRadius){
	 		this.minRadius = curRadius;
	 	}
	 }
};

Skimmer.prototype.update = function(delta){
	// Fix agents that need a fix due to some stupid error that occasionally pops up. //
	for(var i = 0; i < this.agents.length; i++){
		var agent = this.agents[i];
		if(agent != null){
			if(agent.pos.x == NaN || agent.pos.y == NaN){
				this.agents[i].pos.set(0, 0);
			}
		}
	}
	
	// Give Agents their new direction. //
	var atob = new Vector2();
	var sep;
	var idealSep;
	var sepDiff;
	var agentA = null;
	var agentB = null;
	
	for(var i = 0; i < this.agents.length; i++){
		for(var j = i; j < this.agents.length; j++){
			agentA = this.agents[i];
			agentB = this.agents[j];
			
			if(agentA != null && agentB != null){
				var agentPosA = new Vector2();
				agentPosA.setVect(agentA.pos);
				var agentPosB = new Vector2();
				agentPosB.setVect(agentB.pos);
				
				/* modify position vectors based on orderings */
				
				atob.setVect(agentB.pos);
				atob.sub(agentA.pos);
				
				sep = atob.length();
				
				if(sep != 0){
					var velocityA = new Vector2();
					var velocityB = new Vector2();
					
					// Check for and handle collision.
					var flag = (agentA.getBoundingBox()).intersects(agentB.getBoundingBox());
					if(this.USE_COLLISION &&flag ){
						atob.normalize();
						atob.scale(40);
						
						velocityB.set(atob.x, atob.y);
						atob.negate();
						velocityA.set(atob.x, atob.y);
						
						this.agents[i].addOverlap(velocityA);
						this.agents[j].addOverlap(velocityB);
					}
					else{
						idealSep = this.getIdealSeparation(agentA, agentB);
						
						//idealSep = idealSep * Math.sqrt(this.width * this.width + this.height * this.height) / Math.sqrt(1024 * 1024 + 768 * 768);
						
						sepDiff = (idealSep - sep);
						
						var speed = Math.abs(sepDiff) * 1.25;
						
						
						/*
						atob.normalize();
						
						if(sepDiff > 0.0){
							velocityB.setVect(atob);
							atob.negate();
							velocityA.setVect(atob);
						}
						else{
							velocityA.setVect(atob);
							atob.negate();
							velocityB.setVect(atob);
						}
						
						// Scaling based on distance to ideal sep. //
						velocityA.scale(speed);
						velocityB.scale(speed);						
						
						*/
						
						
						// calculathe the projection of the idealSep on two coordinates
						// Horizonal ideal distance between angents
						idealSepX = Math.abs(idealSep * atob.x / sep);
						// Vertical ideal distance between angents
						idealSepY = Math.abs(idealSep * atob.y / sep);

						// Calculate the horizonal speed and the vertical speed separatedly
						var ratioX = this.width / 1024;
						var ratioY = this.height / 768;


						var velocityField = new Vector2();
						velocityField.set(atob.length() / 4, atob.length() / 4);


						// Some transformations of the ratios are done to adjust the scale of the circles on the screen
						if(idealSepX * ratioX - Math.abs(atob.x) > 0.0){
							velocityB.x = atob.x + velocityField.x;
							velocityA.x = - atob.x - velocityField.x;

							//velocityA.sub(velocityField);
							//velocityB.add(velocityField);
						}
						else{
							velocityA.x = atob.x + velocityField.x;
							velocityB.x = - atob.x - velocityField.x;

							//velocityA.add(velocityField);
							//velocityB.sub(velocityField);
						}

						if(idealSepY * ratioY - Math.abs(atob.y) > 0.0){
							velocityB.y = atob.y + velocityField.y;
							velocityA.y = - atob.y - velocityField.y;

							//velocityA.sub(velocityField);
							//velocityB.add(velocityField);
						}
						else{
							velocityA.y = atob.y + velocityField.y;
							velocityB.y = - atob.y - velocityField.y;

							//velocityA.add(velocityField);
							//velocityB.sub(velocityField);
						}
						
						
						
						velocityA.normalize();
						velocityB.normalize();

						
						
						// Scaling based on distance to ideal sep. //
						velocityA.scale(speed);
						velocityB.scale(speed);
						
						
						
						// Fix random bug. //
						if(velocityA.x != NaN && velocityA.y != NaN && velocityB.x != NaN && velocityB.y != NaN){
							// Apply velocities. //
							this.agents[i].addVelocity(velocityA);
							this.agents[j].addVelocity(velocityB);
						}
						
						// Apply orderings. //
						if(this.ENFORCE_ORDERING){
							var orderingVectA = new Vector2();
							var orderingVectB = new Vector2();
							
							var pair = this.getPair(agentA.stem, agentB.stem);
							var ordering = this.orderings.get(pair);
							if(ordering != 0){
								var scaleValue = ordering * this.ORDERING_MULTIPLIER;
								if(pair.indexOf(agentA.stem) < pair.indexOf(agentB.stem)){
									if(agentA.pos.y - agentA.bounds.extents.y > agentB.pos.y + agentB.bounds.extents.y){
										//agent is already above the other agent
									}
									else{
										orderingVectA.y += scaleValue;
										orderingVectB.y -= scaleValue;
									}
								}
								else{
									if(agentB.pos.y - agentB.bounds.extents.y > agentA.pos.y + agentA.bounds.extents.y){
										//agent is already above the other agent
									}
									else{
										orderingVectB.y += scaleValue;
										orderingVectA.y -= scaleValue;
									}
								}
								this.agents[i].addVelocity(orderingVectA);
								this.agents[j].addVelocity(orderingVectB);
							}
						}
						
					}
				}
				else{
					var tempVect = new Vector2();
					tempVect.set(Math.random() * 5, Math.random() * 5);
					this.agents[i].addVelocity(tempVect);
					tempVect.set(Math.random() * 5, Math.random() * 5);
					this.agents[j].addVelocity(tempVect);
				}
				
			}
		}
	}
	
	// Disallow movement off of the screen. //
	// Apply repulsion to cursor location. //
	// Collide with special agents. //
	var agent;
	var agentToTitle = new Vector2();
	for(var i = 0; i < this.agents.length; i++){
		agent = this.agents[i];
		if(agent != null){
			//check for collision with title agent
			if(this.agentTitle != null && agent.getBoundingBox().intersects(this.agentTitle.getBoundingBox())){
				var velocityAgent = new Vector2();
				agentToTitle.setVect(this.agentTitle.pos);
				agentToTitle.sub(agent.pos);
				
				agentToTitle.normalize();
				agentToTitle.scale(40);
				agentToTitle.negate();
				
				velocityAgent.set(agentToTitle.x, agentToTitle.y);
				
				this.agents[i].addOverlap(velocityAgent);
				
			}
			
			//check for collision with article agent
			var agentToArticle = new Vector2();
			if(this.agentArticle != null && agent.getBoundingBox().intersects(this.agentArticle.getBoundingBox())){
				var velocityAgent = new Vector2();
				agentToArticle.setVect(this.agentArticle.pos);
				agentToArticle.sub(agent.pos);
				
				agentToArticle.normalize();
				agentToArticle.scale(40);
				agentToArticle.negate();
				
				velocityAgent.set(agentToArticle.x, agentToArticle.y);
				this.agents[i].addOverlap(velocityAgent);
			}
			
			//check for collision with user agent
			var agentToUser = new Vector2();
			if(this.agentUser != null && agent.getBoundingBox().intersects(this.agentUser.getBoundingBox())){
				var velocityAgent = new Vector2();
				agentToUser.setVect(this.agentUser.pos);
				agentToUser.sub(agent.pos);
				
				agentToUser.normalize();
				agentToUser.scale(40);
				agentToUser.negate();
				
				velocityAgent.set(agentToUser.x, agentToUser.y);
				this.agents[i].addOverlap(velocityAgent);
			}
			
			var toCenter = new Vector2();
			toCenter.setVect(agent.pos);
			toCenter.normalize();
			toCenter.negate();
			
			var hrzEdgeDist = this.width / 2.0 - Math.abs(agent.pos.x);
			var vrtEdgeDist = this.height / 2.0 - Math.abs(agent.pos.y);
			var edgeDist = Infinity;
			
			if(hrzEdgeDist < vrtEdgeDist){
				edgeDist = hrzEdgeDist;
			}
			else{
				edgeDist = vrtEdgeDist;
			}
			
			if(edgeDist < 50){
				toCenter.scale(this.CENTER_FORCE * (50 - edgeDist) * this.agents.length);
				this.agents[i].addVelocity(toCenter);
			}
			this.agents[i].update(delta);
			
			//Handle removal
			if(agent.remove){
				if(agent.curTicksTillFade >= agent.TICKS_TILL_FADE){
					this.agents = this.agents.removeAt(i);
				}
				else{
					this.agents[i].curTicksTillFade += 1;
				}
			}
		}
	}
	
	//Make sure agents are at least moderately centered.
	for(var i = 0; i < this.agents.length; i++){
		var curAgent = this.agents[i];
		var agentToCenter = new Vector2();
		agentToCenter.setVect(curAgent.pos);
		agentToCenter.negate();
		agentToCenter.normalize();
		agentToCenter.scale(this.agents.length);
		this.agents[i].addVelocity(agentToCenter);
	}
	
	//Move title agent to position
	if(this.agentTitle != null){
		var titleToTop = new Vector2();
		titleToTop.set(0, (-this.height / 2.0) + 50);
		titleToTop.sub(this.agentTitle.pos);
		titleToTop.scale(0.5);
		this.agentTitle.update(delta);
		if(this.agentTitle.remove){
			this.agentArticle = null;
		}
	}
	
	//Handle article agent movement
	if(this.agentArticle != null){
		//Avoid outside edge
		var toCenter = new Vector2();
		toCenter.setVect(this.agentArticle.pos);
		toCenter.normalize();
		toCenter.negate();
		
		var hrzEdgeDist = this.width / 2.0 - (Math.abs(this.agentArticle.pos.x) + this.agentArticle.bounds.extents.x);
		var vrtEdgeDist = this.height / 2.0 - (Math.abs(this.agentArticle.pos.y) + this.agentArticle.bounds.extents.y);
		var edgeDist = Infinity;
		
		if(hrzEdgeDist < vrtEdgeDist){
			edgeDist = hrzEdgeDist;
		}
		else{
			edgeDist = vrtEdgeDist;
		}
		
		if(edgeDist < 30){
			toCenter.scale(this.CENTER_FORCE * (50 - edgeDist) * 2);
			this.agentArticle.addVelocity(toCenter);
		}
		
		//Avoid title agent
		if(this.agentTitle != null && this.agentArticle != null && this.agentArticle.getBoundingBox().intersects(this.agentTitle.getBoundingBox())){
			var velocityAgent = new Vector2();
			agentToTitle.setVect(this.agentTitle.pos);
			agentToTitle.sub(this.agentArticle.pos);
			
			agentToTitle.normalize();
			agentToTitle.scale(40);
			agentToTitle.negate();
			
			velocityAgent.set(agentToTitle.x, agentToTitle.y);
			
			this.agentArticle.addOverlap(velocityAgent);
		}
		
		//Make sure selected agents are pulled toward the article agent
		for(var i = 0; i < this.agents.length; i++){
			var curAgent = this.agents[i];
			if(this.selectedWords.indexOf(curAgent) > -1){
				var agentToArticle = new Vector2();
				agentToArticle.setVect(this.agentArticle.pos);
				agentToArticle.sub(curAgent.pos);
				agentToArticle.normalize();
				agentToArticle.scale(40 * this.agents.length);
				this.agents[i].addVelocity(agentToArticle);
			}
		}
		this.agentArticle.update(delta);
		if(this.agentArticle.remove){
			this.agentArticle = null;
		}
	}
	
	//Handle user agent
	/****************
	 * if( false && agentUser != null ) {
			
			// Fix random bug. //
			if( Double.isNaN( agentUser.pos.x ) || Double.isNaN( agentUser.pos.y ) || Double.isNaN( agentUser.pos.x ) || Double.isNaN( agentUser.pos.y ) ) {
			
				agentUser.pos.set( 0, - visSize.height + 50 );
				
			}
			
			agentUser.ticksSinceLastTargeting += 1;
			agentUser.ticksSinceLastMouseUse += 1;
			agentUser.ticksSinceLastEvent += 1;
			
			if( agentUser.ticksSinceLastMouseUse > agentUser.TICKS_FROM_MOUSE_USE_TILL_ACTIVATION ) {
			
				// Retarget. //
				if( agentUser.targetAgent == null || !agents.contains( agentUser.targetAgent ) || agentUser.ticksSinceLastTargeting > agentUser.TICKS_UNTIL_RETARGET ) {
				
					if( !agents.isEmpty() ) {
						int randIndex = (int)( Math.round( Math.random() * agents.size()-1 ) );
						if( randIndex < 0 ) { randIndex = 0; }
						agentUser.targetAgent = agents.get( randIndex );
					}
					
					agentUser.ticksSinceLastTargeting = 0;
						
				}
				
				if( agentUser.targetAgent != null ) {
				
					if( agentUser.getBoundingBox().intersects( agentUser.targetAgent.getBoundingBox() ) ) {
						
						if( agentUser.ticksSinceLastEvent > agentUser.TICKS_BETWEEN_EVENTS ) {
						
							int choice = (int)( Math.round( Math.random() ) );
							
							if( choice == 0 ) {
							
								mouseClicked( new MouseEvent( this,
						                                      Integer.MAX_VALUE,
						                                      System.nanoTime(),
						                                      MouseEvent.CTRL_DOWN_MASK,
						                                      (int)( agentUser.targetAgent.pos.x + ( visSize.width / 2 ) ),
						                                     (int)( agentUser.targetAgent.pos.y + ( visSize.height / 2 ) ),
						                                      1,
						                                      false,
						                                      MouseEvent.BUTTON1 ) );
								
							} else {
								
								mouseClicked( new MouseEvent( this,
						                                      Integer.MAX_VALUE,
						                                      System.nanoTime(),
						                                      MouseEvent.SHIFT_DOWN_MASK,
						                                      (int)( agentUser.targetAgent.pos.x + ( visSize.width / 2 ) ),
						                                     (int)( agentUser.targetAgent.pos.y + ( visSize.height / 2 ) ),
						                                      1,
						                                      false,
						                                      MouseEvent.BUTTON1 ) );
								
							}
							
							agentUser.targetAgent = null;
							agentUser.ticksSinceLastEvent = 0;
							
						}
						
					} else {
					
						Vector2 curVel = new Vector2( agentUser.vel );
						
						Vector2 toTarget = new Vector2();
						Vector2.sub( agentUser.targetAgent.pos, agentUser.pos, toTarget );
						toTarget.normalize();
						
						if( curVel.length() > 0.0 ) {
							
							curVel.normalize();
							curVel.scale( 30.0 );
							agentUser.addVelocity( curVel );
							
							toTarget.scale( 5.0 );
							agentUser.addVelocity( toTarget );
							
						} else {
							
							toTarget.scale( 20.0 );
							agentUser.addVelocity( toTarget );
							
						}
						
					}
					
				}
				
			} else {
				
				if( agentTitle != null ) {
					
					Vector2 curVel = new Vector2( agentUser.vel );
					curVel.normalize();
					curVel.scale( 30.0 );
					agentUser.addVelocity( curVel );
					
					Vector2 toTitle = new Vector2();
					Vector2.sub( agentTitle.pos, agentUser.pos, toTitle );
					toTitle.normalize();
					toTitle.scale( 5.0 );
					agentUser.addVelocity( toTitle );
					
				}
				
			}
			
			agentUser.update( delta );
			
			if( agentUser.remove ) {
				agentUser = null;
			}
		}
	 */
};

Skimmer.prototype.getPair = function(wordA, wordB){
	if( wordA.compareTo( wordB ) < 0 ) { return ( wordA + " " + wordB ); }
	return ( wordB + " " + wordA );
};

Skimmer.prototype.getInversePair = function(wordA, wordB) {
	if( wordA.compareTo( wordB ) < 0 ) { return ( wordB + " " + wordA ); }
	return ( wordA + " " + wordB );
};

Skimmer.prototype.getIdealSeparation = function(agentA, agentB){
	var pair = this.getPair(agentA.stem, agentB.stem);
	var radiusA = (this.minRadius + (agentA.occurrences / this.maxOccurrence) * this.minRadius);
	var radiusB = (this.minRadius + (agentB.occurrences / this.maxOccurrence) * this.minRadius);
	
	var coCount = this.cooccurrences.get(pair);
	
	var coCountToA = coCount / agentA.occurrences;
	var coCountToB = coCount / agentB.occurrences;
	
	var overlapA = coCountToA * radiusA * 2;
	var overlapB = coCountToB * radiusB * 2;
	
	var overlap = (overlapA + overlapB) / 2;
	
	var idealVennSep = Math.abs(radiusA + radiusB - overlap);
	
	
	
	var scale;
	
	if (this.height > this.width) {
		scale = this.width;
	}
	else {
		scale = this.height;
	}
	
	
	//var idealCoSep = ( 1.0 - (coCount / this.maxCooccurrence)) * this.height * 0.65;
	var idealCoSep = ( 1.0 - (coCount / this.maxCooccurrence)) * 1280 * 0.35;
	
	if(overlap > 5){
		return idealVennSep;
	}
	
	return idealCoSep;
};

Skimmer.prototype.getAgentClickedAt = function(cursor){
	for(var i = 0; i < this.agents.length; i++){
		var agent = this.agents[i];
		var agentBound = agent.getBoundingBox();
		if(agentBound.contains(cursor)){
			return agent;
		}
	}
	return null;
};

Skimmer.prototype.updateAgentColor = function(){
	// coloring ramdom
	if(this.colorType == 0){
		for(var i = 0; i < this.agents.length; i++){
			var agent = this.agents[i];
			this.agents[i].shapeColor = new Color(50 + parseInt(Math.random()*200), 50 + parseInt(Math.random()*200), 50 + parseInt(Math.random()*200));
		}
	}
	// coloring according to pos
	else if(this.colorType == 1){
		for(var i = 0; i < this.agents.length; i++){
			var agent = this.agents[i];
			if(agent.partOfSpeech == null){
				var data = this.dictionary.get(agent.text);
				if(data != null){
					if(data.pos.length == 1){
						if(data.pos.indexOf(Enum.POS.ADJECTIVE) > -1){
							this.agents[i].shapeColor.set(0, 0, 100);
						}else if(data.pos.indexOf(Enum.POS.VERB) > -1){
							this.agents[i].shapeColor.set(0, 100, 0);
						}else if(data.pos.indexOf(Enum.POS.ADVERB) > -1){
							this.agents[i].shapeColor.set(100, 100, 0);
						}else if(data.pos.indexOf(Enum.POS.INTERJECTION) > -1){
							this.agents[i].shapeColor.set(100, 0, 0);
						}else if(data.pos.indexOf(Enum.POS.NOUN) > -1){
							this.agents[i].shapeColor.set(100, 0, 100);
						}
					}else{
						this.agents[i].shapeColor.set(100, 100, 100);
					}
				}else{
					this.agents[i].shapeColor.set(100, 100, 100);
				}
			}else{
				if(agent.indexOf(Enum.POS.ADJECTIVE) > -1){
					this.agents[i].shapeColor.set(0, 0, 100);
				}else if(agent.indexOf(Enum.POS.VERB) > -1){
					this.agents[i].shapeColor.set(0, 100, 0);
				}else if(agent.indexOf(Enum.POS.ADVERB) > -1){
					this.agents[i].shapeColor.set(100, 100, 0);
				}else if(agent.indexOf(Enum.POS.INTERJECTION) > -1){
					this.agents[i].shapeColor.set(100, 0, 0);
				}else if(agent.indexOf(Enum.POS.NOUN) > -1){
					this.agents[i].shapeColor.set(100, 0, 100);
				}
			}
		}
	}
	// coloring according to source
	else if(this.colorType == 2){
		var sourceColors = new HashMap();
		sourceColors.put("Yahoo", new Color(255, 0, 0));
		sourceColors.put("BBC", new Color(255, 165, 0));
		sourceColors.put("Google", new Color(0, 0, 255));
		sourceColors.put("Digg", new Color(0, 255, 0));
		sourceColors.put("Summize", new Color(0, 255, 255));
		sourceColors.put("Technorati", new Color(255, 255, 0));
	
		for(var i = 0; i < this.agents.length; i++){
			var agent = this.agents[i];
			var sources = new VisHashMap();
			var totalArticleCount = 0;
			for(var j = 0; j < this.articles.length; j++){
				var article = this.articles[j];
				if(article.words.indexOf(agent.stem) > -1){
					totalArticleCount += 1;
					var count = sources.get(article.source);
					count += 1;
					sources.put(article.source, count);
				}
			}
			
			var sortedSources = new Array();
			for(var j = 0; j < sources.size(); j++){
				var source = sources.keys()[j].toString();
				var count = sources.get(source);
				if(sortedSources.length == 0){
					sortedSources.push(source);
				}else{
					for(var k = 0; k < sortedSources.length; k++){
						var curSource = sortedSources[k];
						var curCount = sources.get(curSource);
						
						if(count >= curCount){
							sortedSources.add(source, k);
							break;
						}
					}
					if(sortedSources.indexOf(source) < 0){
						sortedSources.push(source);
					}
				}
			}
			if(sortedSources.length >= 2){
				var dominantSource = sortedSources[0];
				var secondarySource = sortedSources[1];
				
				var dominantColor = null;
				if(sourceColors.containsKey(dominantSource)){
					dominantColor = sourceColors.get(dominantSource);
				}
				else{
					dominantColor = new Color(100, 100, 100);
				}
				
				var ratio = parseInt(sources.get(dominantSource) - sources.get(secondarySource)) / totalArticleCount;
				
				var tmpDesaturated = new Color(100, 100, 100);
				
				this.agents[i].shapeColor.set(parseInt(dominantColor.red * ratio + tmpDesaturated.red * ( 1 - ratio)),
						parseInt(dominantColor.green * ratio + tmpDesaturated.green * ( 1 - ratio)),
						parseInt(dominantColor.blue * ratio + tmpDesaturated.blue * ( 1 - ratio)));
				
			}else if(sortedSources.length == 1){
				var dominantSource = sortedSources[0];
				if(sourceColors.containsKey(dominantSource)){
					this.agents[i].shapeColor = sourceColors.get(dominantSource);
				}else{
					this.agents[i].shapeColor.set(100,100,100);
				}
			}else{
				this.agents[i].shapeColor.set(100,100,100);
			}
		}
	}
	else if(this.colorType == 3){
		// Calculate emotion for articles from the dictionary. //
		
		/*
		for(var i = 0; i < this.articles.length; i++){
			var article = this.articles[i];
			var sumValence = 0;
			var sumActivation = 0;
			var sumImagery = 0;
			
			var weightValence = 0;
			var weightActivation = 0;
			var weightImagery = 0;
			
			for(var j = 0; j < article.words.length; j++){
				var word = article.words[j];
				
				var data = null;
				if(this.stems.containsKey(word)){
					data = this.dictionary.get(this.stems.get(word));
				}else{
					data = this.dictionary.get(word);
				}
				if(data != null){
					sumValence += data.valence * Math.abs(data.valence);
					sumActivation += data.activation;
					sumImagery += data.imagery;
					
					weightValence += Math.abs(data.valence);
					weightActivation += 1.0;
					weightImagery += 1.0;
				}
			}
			
			if(weightValence != 0.0){
				sumValence /= weightValence;
			}else{
				sumValence = 0.0;
			}
			if(weightActivation != 0.0){
				sumActivation /= weightActivation;
			}else{
				sumActivation = 0.0;
			}
			if(weightImagery != 0.0){
				sumImagery /= weightImagery;
			}else{
				sumImagery = 0.0;
			}
			
			this.articles[i].valence = sumValence;
			this.articles[i].activation = sumActivation;
			this.articles[i].imagery = sumImagery;
		}
		
		// Calculate emotion for agents from article average
		for(var i = 0; i < this.agents.length; i++){
			var agent = this.agents[i];
			var sumValence = 0;
			var sumActivation = 0;
			var sumImagery = 0;
			
			var weightValence = 0;
			var weightActivation = 0;
			var weightImagery = 0;
			for(var j = 0; j < this.articles.length; j++){
				var article = this.articles[j];
				if(article.words.indexOf(agent.stem) > -1){
					sumValence += article.valence * Math.abs(article.valence);
					sumActivation += article.activation;
					sumImagery += article.imagery;
					
					weightValence += Math.abs(article.valence);
					weightActivation += 1.0;
					weightImagery += 1.0;
				}
			}
			if(weightValence != 0.0){
				sumValence /= weightValence;
			}else{
				sumValence = 0.0;
			}
			if(weightActivation != 0.0){
				sumActivation /= weightActivation;
			}else{
				sumActivation = 0.0;
			}
			if(weightImagery != 0.0){
				sumImagery /= weightImagery;
			}else{
				sumImagery = 0.0;
			}
			this.agents[i].valence = sumValence;
			this.agents[i].activation = sumActivation;
			this.agents[i].imagery = sumImagery;
		}

*/


		// Calculate emotion for agents from the dictionary for all the agents
		for(var i = 0; i < this.agents.length; i++){
			var agent = this.agents[i];

			var word = agent.stem;
			
			var data = null;
			if(this.stems.containsKey(word)){
				data = this.dictionary.get(this.stems.get(word));
			}else{
				data = this.dictionary.get(word);
			}
			if(data != null){
				this.agents[i].valence = data.valence * Math.abs(data.valence);
				this.agents[i].activation = data.activation;
				this.agents[i].imagery = data.imagery;
			}
		}





		
		//Color agents based on emotion
		for(var i = 0; i < this.agents.length; i++){
			var agent = this.agents[i];
			var tmpDesaturated = new Color(100,100,100);
			tmpDesaturated.set(100,100,100);

			
			/*
			var tmpShadingA = new Color(parseInt(this.colorShadingA.red * agent.activation + tmpDesaturated.red * (1.0 - agent.activation)),
										parseInt(this.colorShadingA.green * agent.activation + tmpDesaturated.green * (1.0 - agent.activation)),
										parseInt(this.colorShadingA.blue * agent.activation + tmpDesaturated.blue * (1.0 - agent.activation)));

			var tmpShadingB = new Color(parseInt(this.colorShadingB.red * agent.activation + tmpDesaturated.red * (1.0 - agent.activation)),
										parseInt(this.colorShadingB.green * agent.activation + tmpDesaturated.green * (1.0 - agent.activation)),
										parseInt(this.colorShadingB.blue * agent.activation + tmpDesaturated.blue * (1.0 - agent.activation)));
*/



			/*							
			var tmpShadingA = new Color(parseInt(this.colorShadingA.red * agent.activation + tmpDesaturated.red * (1.0 - agent.activation)),
										parseInt(this.colorShadingA.green * agent.valence + tmpDesaturated.green * (1.0 - agent.valence)),
										parseInt(this.colorShadingA.blue * agent.imagery + tmpDesaturated.blue * (1.0 - agent.imagery)));

			var tmpShadingB = new Color(parseInt(this.colorShadingB.red * agent.activation + tmpDesaturated.red * (1.0 - agent.activation)),
										parseInt(this.colorShadingB.green * agent.valence + tmpDesaturated.green * (1.0 - agent.valence)),
										parseInt(this.colorShadingB.blue * agent.imagery + tmpDesaturated.blue * (1.0 - agent.imagery)));
*/

										
			
			//var ratio = agent.valence += 1.0;
			//var ratio = 1.0;
			
			//var red = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.red + ( ratio / 2 ) * tmpShadingA.red );
			//var green = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.green + ( ratio / 2 ) * tmpShadingA.green );
			//var blue = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.blue + ( ratio / 2 ) * tmpShadingA.blue );
			
			
			// activation gets its value from [0, 1]
			// valence gets its value from [-1, 1]
			
			// In order to use the yellow and blue chroma, red and green are set equal
			// Thus the lightness of the color equal to 1 / 2 * (blue + red)
			
			//var red = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.red + ( ratio / 2 ) * tmpShadingA.red );
			//var green = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.green + ( ratio / 2 ) * tmpShadingA.green );
			//var blue = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.blue + ( ratio / 2 ) * tmpShadingA.blue );
			
			var red   = 200 * (1 / 2 + agent.valence);
			var green = 200 * (1 / 2 + agent.valence);
			var blue  = 200 * (1 / 2 - agent.valence);
			red   = parseInt(50 + 100 * (1 + agent.valence) * agent.activation);
			green = parseInt(50 + 100 * (1 + agent.valence) * agent.activation);
			blue  = parseInt(50 + 100 * (1 - agent.valence) * agent.activation);
			
			
			if( red > 255 ) red = 255;
			if( red < 0 ) red = 0;
			if( green > 255 ) green = 255;
			if( green < 0 ) green = 0;
			if( blue > 255 ) blue = 255;
			if( blue < 0 ) blue = 0;
			
		/*	
			
			// Here the Red Green and Blue colors above are seen as the value in the HSL color space so that it will be meaningful
			// Activation - Red   - H
			// Valence    - Green - S
			// Imagery    - Blue  - L
			
			h = green / 255;
			s = blue / 255;
			l = red / 255;
			
			var q;
			var p;
			var hk;
			var tr;
			var tg;
			var tb;
			
			if (l < 0.5) {
				q = l * (l + s);
			}
			else {
				q = l + s - (l * s);
			}

			p = 2 * l - q;
			hk = h;
			
			tr = hk + 1 / 3;
			if (tr < 0) {
				tr = tr + 1;
			}
			if (tr > 1) {
				tr = tr - 1;
			}

			if (tr < 1 / 6) {
				red = p + ((q - p) * 6 * tr);
			}
			else if (tr < 1 / 2) {
				red = q;
			}
			else if (tr < 2 / 3) {
				red = p + ((q - p) * 6 * (2 / 3 - tr));
			}
			else {
				red = p;
			}
			red = red * 255;
			
			tg = hk;
			if (tg < 0) {
				tg = tg + 1;
			}
			if (tg > 1) {
				tg = tg - 1;
			}

			if (tg < 1 / 6) {
				green = p + ((q - p) * 6 * tg);
			}
			else if (tg < 1 / 2) {
				green = q;
			}
			else if (tg < 2 / 3) {
				green = p + ((q - p) * 6 * (2 / 3 - tg));
			}
			else {
				green = p;
			}
			green = green * 255;

			
			tb = hk - 1 / 3;
			if (tb < 0) {
				tb = tb + 1;
			}
			if (tb > 1) {
				tb = tb - 1;
			}
			
			if (tb < 1 / 6) {
				blue = p + ((q - p) * 6 * tb);
			}
			else if (tb < 1 / 2) {
				blue = q;
			}
			else if (tb < 2 / 3) {
				blue = p + ((q - p) * 6 * (2 / 3 - tb));
			}
			else {
				blue = p;
			}
			blue = blue * 255;
			*/
			
			
			this.agents[i].shapeColor.set( red, green, blue );
		}
		// Color title based on total article average. //
		if( this.agentTitle != null ) {
			var sumValence = 0.0;
			var sumActivation = 0.0;
			var sumImagery = 0.0;
			
			var weightValence = 0.0;
			var weightActivation = 0.0;
			var weightImagery = 0.0;
			
			for(var i = 0; i < this.articles.length; i++) {
			
				var article = this.articles[i];
				sumValence += article.valence * Math.abs( article.valence );
				sumActivation += article.activation;
				sumImagery += article.imagery;
					
				weightValence += Math.abs( article.valence );
				weightActivation += 1.0;
				weightImagery += 1.0;
					
			}
			
			if( weightValence != 0.0 ) {
				sumValence /= weightValence;
			} else {
				sumValence = 0.0;
			}
			if( weightActivation != 0.0 ) {
				sumActivation /= weightActivation;
			} else {
				sumActivation = 0.0;
			}
			if( weightImagery != 0.0 ) {
				sumImagery /= weightImagery;
			} else {
				sumImagery = 0.0;
			}
			
			var valence = sumValence;
			var activation = sumActivation;
			//double imagery = sumImagery;
			
			var tmpDesaturated = new Color(100, 100, 100);
			
			var tmpShadingA = new Color(parseInt( this.colorShadingA.red * activation + tmpDesaturated.red * ( 1.0 - activation ) ),
			                               parseInt( this.colorShadingA.green * activation + tmpDesaturated.green * ( 1.0 - activation ) ),
			                               parseInt( this.colorShadingA.blue * activation + tmpDesaturated.blue * ( 1.0 - activation ) ));
			var tmpShadingB = new Color(parseInt( this.colorShadingB.red * activation + tmpDesaturated.red * ( 1.0 - activation ) ),
			                               parseInt( this.colorShadingB.green * activation + tmpDesaturated.green * ( 1.0 - activation ) ),
			                               parseInt( this.colorShadingB.blue * activation + tmpDesaturated.blue * ( 1.0 - activation ) ));
			
			//var ratio = valence += 1.0;
			var ratio = 1.0;
			
			var red = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.red + ( ratio / 2 ) * tmpShadingA.red );
			var green = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.green + ( ratio / 2 ) * tmpShadingA.green );
			var blue = parseInt( ( 1.0 - ratio / 2 ) * tmpShadingB.blue + ( ratio / 2 ) * tmpShadingA.blue );
			
			if( red > 255 ) red = 255;
			if( red < 0 ) red = 0;
			if( green > 255 ) green = 255;
			if( green < 0 ) green = 0;
			if( blue > 255 ) blue = 255;
			if( blue < 0 ) blue = 0;


			this.agentTitle.bkgColor.set( red, green, blue );
			this.agentTitle.brdColor.set( red, green, blue );
	//		this.agentTitle.brdColor.brighter();
			
		}
	}
	else{
		for(var i = 0; i < this.agents.length; i++){
			var agent = this.agents[i];
			this.agents[i].shapeColor.set(255,255,255);
		}
	}
	
};



// Update the content of the Skimmer
// This is used for the google feed API
Skimmer.prototype.UpdateSkimmer = function(feedResult, numEntries){

	this.colorType = 0;	//default
	
	this.count = 0;
	this.DO_STEMMING = true;
	this.DRAW_CIRCLES = true;
	this.USE_COLLISION = true;
	this.USE_TITLES = true;
	this.stems = new HashMap();
	
	this.zoomedAgents = new Array();
	this.selectedWords = new Array();
	this.selectedArticles = new Array();
	this.selectedArticle = null;
	this.selectedArticleRanking = new Map();
	this.agentArticle = null;
	this.agentUser = null;
	this.agentTitle = new AgentTitle("");
	this.agents = new Array();
	this.newArticles = new Array();
	this.articles = new Array();
	this.words = new Array();
	this.occurrences = new VisHashMap();
	this.maxOccurrence = 0;
	this.lowOccurrence = 0;
	this.orderings = new VisHashMap();
	this.cooccurrences = new VisHashMap();
	this.maxCooccurrence = 0;
	this.lowCooccurrence = 0;
	this.adjacencies = new VisHashMap();
	this.maxAdjacency = 0;
	
	this.minRadius = 0;
	
	

	this.colorAgentWordText = new Color( 255, 255, 255 );
	this.colorAgentTitleBackground = new Color( 90, 90, 90 );
	this.colorAgentTitleBorder = new Color( 120, 120, 120 );
	this.colorAgentTitleText = new Color( 240, 240, 240 );

	this.colorAgentArticleHeaderBackground = new Color( 90, 90, 90 );
	this.colorAgentArticleHeaderBorder = new Color( 120, 120, 120 );
	this.colorAgentArticleHeaderText = new Color( 240, 240, 240 );
	this.colorAgentArticleBodyBackground = new Color( 240, 240, 240 );
	this.colorAgentArticleBodyBorder = new Color( 180, 180, 180 );
	this.colorAgentArticleBodyText = new Color( 50, 50, 50 );
	this.colorAgentArticleFooterBackground = new Color( 90, 90, 90 );
	this.colorAgentArticleFooterBorder = new Color( 120, 120, 120 );
	this.colorAgentArticleFooterText = new Color( 240, 240, 240 );
	
	//this.height = 768.0;
	//this.width = 1024.0;
	/** Controls the influence of the user's input. */
	this.CENTER_FORCE = 100;
	this.SMUDGE_FORCE = 500;
	
	this.TITLE_WEIGHT = 100;
	this.MIN_NUM_OCCURRENCES = 2;
	this.SORTED_OCCURRENCE_LIST_SIZE = 2000;
	this.MAX_NUM_PAIRS = 200;
	this.MAX_NUM_AGENTS = 50;
	this.MAX_WORDS_PER_ZOOM = 10;
	this.MAX_ZOOMED_AGENTS = 30;
	
	this.ENFORCE_POS_REQUIREMENTS = false;
	this.NOUN_REQUIREMENT = 0.0;
	this.ADJECTIVE_REQUIREMENT = 1.0;
	this.VERB_REQUIREMENT = 1.0;
	this.ADVERB_REQUIREMENT = 1.0;
	this.INTERJECTION_REQUIREMENT = 0.0;
	this.UNCLASSIFIED_REQUIREMENT = 0.0;
	this.ENFORCE_ORDERING = false;
	this.ORDERING_MULTIPLIER = 400;	
	
	
	
	//alert("In skimmer");
	//alert(feedResult.feed.title);
	
	
	// Here the source of RSS is obtained via the Google Javascript API online
	
	
	// Read data from the xml file
	// This line of code should be replaced by the code reading data from the RSS in the future 
	//var xmlDoc = loadXmlFile("data/Feed002.rss");
	//var xmlArticles = xmlDoc.getElementsByTagName("item"); // The tag item here should be replaced by entry in the future
			
			
			
	// Set the number of articles
	this.numberOfArticles = numEntries;
	
	// Create a class article for all the items read from the xml file and store them in the array
	//for(var i = 0; i < xmlArticles.length ;i++){
	for(var i = 0; i < numEntries; i++){
		this.newArticles[i] = new Article();
		
		// Get the title of the article
		//this.newArticles[i].title = xmlArticles[i].getElementsByTagName("title")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].title = feedResult.feed.entries[i].title;
		
		//this.newArticles[i].summary = xmlArticles[i].getElementsByTagName("description")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].summary = feedResult.feed.entries[i].content;
		this.newArticles[i].rsscontent = feedResult.feed.entries[i].content;
				
		
		// Strip html tags in the text
		// This is a good method for browsers, but sometimes it is not appropriate for some applications. So pay special attention when some other modifications of input source are done
		// But the performance and the result are good
		if ((this.newArticles[i].summary != "")&&(this.newArticles[i].summary != " "))
		{
			var tmp = document.createElement("DIV");
			tmp.innerHTML = this.newArticles[i].summary;
			this.newArticles[i].summary = tmp.textContent||tmp.innerText;
		}


		
		// Get the URL of the image if there is an image attached to the news
		// Otherwise the image URL will be set null
		this.imageUrl = null;
		
		
		// Get the entries with the tag "img" from the rss data
		var imgSrc = this.newArticles[i].rsscontent.match(/<img[^<]*>/g);
		if (imgSrc != null)
		{
			for (var ii = 0; ii < imgSrc.length; ii++) {
				// Get the attribute with the attribute name src
				var tempSrc = imgSrc[ii].match(/src[^"]*"[^"]*"/);
				if (tempSrc != null) {
					// Get the string with quote around it
					var imgSrcQuote = tempSrc[0].match(/"[^"]*"/);
					if (imgSrcQuote != null)
					{
						// Get the string with quota around it
						var imgSrc = imgSrcQuote[0].substring(1, imgSrcQuote[0].length - 1);
						
						if (imgSrc.substring(0,4) != "http") {
							imgSrc = "http:" + imgSrc;
						}
						
						this.imageUrl = imgSrc;
						
					}
					//alert(imgSrc[ii].match(/src[^"]*"[^"]*"/));
				}
			}
		}
		
		this.newArticles[i].imageUrl = this.imageUrl;
		
		//console.log(this.newArticles[i].imageUrl);
		//console.log("hey");
		//alert(this.imageUrl);
		
		
		
		

						
		
		//this.newArticles[i].source = xmlArticles[i].getElementsByTagName("link")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].source = feedResult.feed.entries[i].link;

		this.newArticles[i].timestamp = new Date();
		this.newArticles[i].words = removeStopWords(this.newArticles[i].summary.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		this.newArticles[i].titlewords = removeStopWords(this.newArticles[i].title.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		
	}
	
	
	// Insert the user agent. //
	this.agentUser = new AgentUser();
	this.agentUser.pos.set( -( this.width / 2 ) + Math.random() * this.width, -( this.height / 2 ) + Math.random()
				* this.height );
	this.agentUser.bounds.extents.set( this.agentUser.radius, this.agentUser.radius );
	
	//this.agentTitle.text = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	this.agentTitle.text = feedResult.feed.title;
	
	this.agentTitle.pos.set(0,-(this.height / 2) + 20);
		
}







// Add new articles from the RSS source
Skimmer.prototype.UpdateUsingRssSource = function(feedResult, numEntries){

	this.DO_STEMMING = true;
	this.DRAW_CIRCLES = true;
	this.USE_COLLISION = true;
	this.USE_TITLES = true;

	
	//alert("In skimmer");
	//alert(feedResult.feed.title);
	
	
	// Here the source of RSS is obtained via the Google Javascript API online
	
	
	// Read data from the xml file
	// This line of code should be replaced by the code reading data from the RSS in the future 
	//var xmlDoc = loadXmlFile("data/Feed002.rss");
	//var xmlArticles = xmlDoc.getElementsByTagName("item"); // The tag item here should be replaced by entry in the future
			
	// Create a class article for all the items read from the xml file and store them in the array
	//for(var i = 0; i < xmlArticles.length ;i++){
	for(var i = 0; i < numEntries; i++){
		this.newArticles[i] = new Article();
		
		// Get the title of the article
		//this.newArticles[i].title = xmlArticles[i].getElementsByTagName("title")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].title = feedResult.feed.entries[i].title;
		
		//this.newArticles[i].summary = xmlArticles[i].getElementsByTagName("description")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].summary = feedResult.feed.entries[i].content;
		this.newArticles[i].rsscontent = feedResult.feed.entries[i].content;
				
		
		// Strip html tags in the text
		// This is a good method for browsers, but sometimes it is not appropriate for some applications. So pay special attention when some other modifications of input source are done
		// But the performance and the result are good
		if ((this.newArticles[i].summary != "")&&(this.newArticles[i].summary != " "))
		{
			var tmp = document.createElement("DIV");
			tmp.innerHTML = this.newArticles[i].summary;
			this.newArticles[i].summary = tmp.textContent||tmp.innerText;
		}


		
		// Get the URL of the image if there is an image attached to the news
		// Otherwise the image URL will be set null
		this.imageUrl = null;
		
		
		// Get the entries with the tag "img" from the rss data
		var imgSrc = this.newArticles[i].rsscontent.match(/<img[^<]*>/g);
		if (imgSrc != null)
		{
			for (var ii = 0; ii < imgSrc.length; ii++) {
				// Get the attribute with the attribute name src
				var tempSrc = imgSrc[ii].match(/src[^"]*"[^"]*"/);
				if (tempSrc != null) {
					// Get the string with quote around it
					var imgSrcQuote = tempSrc[0].match(/"[^"]*"/);
					if (imgSrcQuote != null)
					{
						// Get the string with quota around it
						var imgSrc = imgSrcQuote[0].substring(1, imgSrcQuote[0].length - 1);
						
						if (imgSrc.substring(0,4) != "http") {
							imgSrc = "http:" + imgSrc;
						}
						
						this.imageUrl = imgSrc;
						
					}
					//alert(imgSrc[ii].match(/src[^"]*"[^"]*"/));
				}
			}
		}
		
		this.newArticles[i].imageUrl = this.imageUrl;
		
		//console.log(this.newArticles[i].imageUrl);
		//console.log("hey");
		//alert(this.imageUrl);
						
		
		//this.newArticles[i].source = xmlArticles[i].getElementsByTagName("link")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].source = feedResult.feed.entries[i].link;

		this.newArticles[i].timestamp = new Date();
		this.newArticles[i].words = removeStopWords(this.newArticles[i].summary.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		this.newArticles[i].titlewords = removeStopWords(this.newArticles[i].title.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		
	}
	
	
	// Insert the user agent. //
	this.agentUser = new AgentUser();
	this.agentUser.pos.set( -( this.width / 2 ) + Math.random() * this.width, -( this.height / 2 ) + Math.random()
				* this.height );
	this.agentUser.bounds.extents.set( this.agentUser.radius, this.agentUser.radius );
	
	//this.agentTitle.text = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	this.agentTitle.text = feedResult.feed.title;
	
	this.agentTitle.pos.set(0,-(this.height / 2) + 20);
		
}





// Update the agents when we try to add new agents to skimmer
Skimmer.prototype.updateAgentsAdd = function(){
	
	// Build a collection of the top occurring words. //
	var topWords = new Array();
	for(var i = 0; i < this.words.length; i++){
		var word = this.words[i];
		var occurrence = this.occurrences.get(word);
		if(topWords.length == 0){
			topWords.push(word);
		}
		else if(topWords.length < this.SORTED_OCCURRENCE_LIST_SIZE){
			for(var j = 0; j < topWords.length; j++){
				var curWord = topWords[j];
				var curOccurrence = this.occurrences.get(curWord);
				
				if(occurrence >= curOccurrence){
					topWords = topWords.add(word,j);
					break;
				}
			}
			if(topWords.indexOf(word) < 0){
				topWords.push(word);
			}
		}
		else{
			var lastWord = topWords[topWords.length - 1];
			var lastOccurrence = this.occurrences.get(lasWord);
			if(occurrence > lastOccurrence){
				topWords.pop();
				for(var j = 0; j < topWords.length; j++){
					var curWord = topWords[j];
					var curOccurrence = this.occurrences.get(curWord);
					
					if(occurrence >= curOccurrence){
						topWords = topWords.add(word,j);
						break;
					}
				}
				if(topWords.indexOf(word) < 0){
					topWords.push(word);
				}
			}
		}
	}
	// Build a collection of the top cooccurring pairs. //
	var topPairs = new Array();
	for(var i = 0; i < this.cooccurrences.size(); i++){
		var pair = this.cooccurrences.keys()[i];
		var coCount = this.cooccurrences.get(pair);
		if(topPairs.length == 0){
			topPairs.push(pair);
		}
		else if(topPairs.length < this.MAX_NUM_PAIRS){
			for(var j = 0; j < topPairs.length; j++){
				var curPair = topPairs[j];
				var curCoCount = this.cooccurrences.get(curPair);
				
				if(coCount >= curCoCount){
					topPairs = topPairs.add(pair,j);
					break;
				}
			}
			if(topPairs.indexOf(pair) < 0){
				topPairs.push(pair);
			}
		}
		else{
			var lastPair = topPairs[topPairs.length - 1];
			var lastCoCount = this.cooccurrences.get(lastPair);
			if(coCount > lastCoCount){
				topPairs.pop();
				
				for(var j = 0; j < topPairs.length; j++){
					var curPair = topPairs[j];
					var curCoCount = this.cooccurrences.get(curPair);
					
					if(coCount >= curCoCount){
						topPairs = topPairs.add(pair,j);
						break;
					}
				}
				if(topPairs.indexOf(pair) < 0){
					topPairs.push(pair);
				}
			}
		}
	}
	
	// Find the lowCooccurrence for acceptance into visualization. //
	if(topPairs.length > 0){
		this.lowCooccurrence = this.cooccurrences.get(topPairs[topPairs.length - 1]);
	}
	else{
		this.lowCooccurrence = 0;
	}
	
	// Make sure that part of speech requirements make sense. //
	// Also fill in total number of agents per. //
	// Allocate lists for each. //
	var numNounAgents = 0;
	var numAdjectiveAgents = 0;
	var numVerbAgents = 0;
	var numAdverbAgents = 0;
	var numInterjectionAgents = 0;
	var numUnclassifiedAgents = 0;
	var nouns = new Array();	//AgentWord
	var adjectives = new Array();
	var verbs = new Array();
	var adverbs = new Array(); 
	var interjections = new Array();
	var unclassifieds = new Array();

	if(this.ENFORCE_POS_REQUIREMENTS){
		var reqSum = this.NOUN_REQUIREMENT + this.VERB_REQUIREMENT + this.ADJECTIVE_REQUIREMENT + this.ADVERB_REQUIREMENT + this.INTERJECTION_REQUIREMENT;
		if(reqSum <= 1.0){
			this.UNCLASSIFIED_REQUIREMENT = 1.0 - reqSum;
		}
		else{
			this.NOUN_REQUIREMENT /= reqSum;
			this.VERB_REQUIREMENT /= reqSum;
			this.ADJECTIVE_REQUIREMENT /= reqSum;
			this.ADVERB_REQUIREMENT /= reqSum;
			this.INTERJECTION_REQUIREMENT /= reqSum;
			this.UNCLASSIFIED_REQUIREMENT = 0.0;
		}
		numNounAgents = parseInt( this.NOUN_REQUIREMENT * this.MAX_NUM_AGENTS );		
		numAdjectiveAgents = parseInt( this.ADJECTIVE_REQUIREMENT * this.MAX_NUM_AGENTS );
		numVerbAgents = parseInt( this.VERB_REQUIREMENT * this.MAX_NUM_AGENTS );
		numAdverbAgents = parseInt( this.ADVERB_REQUIREMENT * this.MAX_NUM_AGENTS );
		numInterjectionAgents = parseInt( this.INTERJECTION_REQUIREMENT * this.MAX_NUM_AGENTS );
		numUnclassifiedAgents = parseInt( this.UNCLASSIFIED_REQUIREMENT * this.MAX_NUM_AGENTS );
	}else{
		numUnclassifiedAgents = this.MAX_NUM_AGENTS;
	}
	
	// Create agents to be placed into the visualization. //
	var tmpAgent = new AgentWord();
	var alreadyAdded = new Array();
	
	/*
	var temp = new Array();
	for (var i = 0; i < topWords.length; i++) {
		if (this.recordedTopWords.indexOf(topWords[i]) < 0) {
			temp.push(topWords[i]);
		}
	}
	alert(temp.length);
	*/
	
	for(var i = 0; i < topWords.length; i++){
		for(var j = 0; j < topWords.length; j++){
			var wordA = topWords[i];
			var wordB = topWords[j];
			
			if(wordA.toLowerCase() != wordB.toLowerCase()){
				var pair = this.getPair(wordA, wordB);
				var coCount = this.lowCooccurrence + 1;
				
				if(!this.ENFORCE_POS_REQUIREMENTS){
					coCount = this.cooccurrences.get(pair);
				}
				
				if(coCount >= this.lowCooccurrence && (alreadyAdded.indexOf(wordA) < 0)){
					var alreadyAnAgent = false;
					for(var k = 0; k < this.recordedTopWords.length; k++){
						var agent = this.recordedTopWords[k];
						if(agent.toLowerCase() == wordA.toLowerCase()){
							alreadyAnAgent = true;
							break;
						}
					}
					
					if(!alreadyAnAgent){
						tmpAgent = new AgentWord();
						tmpAgent.stem = wordA;
						if(this.DO_STEMMING){
							tmpAgent.text = this.stems.get(wordA);
						}else{
							tmpAgent.text = wordA;
						}
						tmpAgent.occurrences = this.occurrences.get(wordA);
						tmpAgent.pos.set( -3.0 + Math.random() * 6.0, -3.0 + Math.random() * 6.0);
						tmpAgent.timestamp = new Date();
						tmpAgent.desiredAlpha = 1.0;
						
						tmpAgent.textColor = this.colorAgentWordText;
						
						if(this.ENFORCE_POS_REQUIREMENTS){
							
							var data = this.dictionary.get(tmpAgent.text);
							if(data != null){
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.ADJECTIVE)){
										adjectives.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.VERB)){
										verbs.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.ADVERB)){
										adverbs.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.INTERJECTION)){
										interjections.push(tmpAgent);
									}
								}
								if(data.pos.length == 1){
									if(data.pos.indexOf(Enum.POS.NOUN)){
										nouns.push(tmpAgent);
									}
								}
							}
							else{
								unclassifieds.push(tmpAgent);
							}
						}
						else{
							unclassifieds.push(tmpAgent);
						}
						alreadyAdded.push(wordA);
						if(tmpAgent.occurrences < this.lowOccurrence){
							this.lowOccurrence = tmpAgent.occurrences;
						}
						break;
					}
				}
			}
		}
	}
	
	while(nouns.length != 0 && numNounAgents > 0){
		var newAgent = nouns.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numNounAgents -= 1;
			//newAgent.partOfSpeech = POS.NOUN;
			this.agents.push(newAgent);
		}
	}
	
	while(adjectives.length != 0 && numAdjectiveAgents > 0){
		var newAgent = adjectives.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numAdjectiveAgents -= 1;
			//newAgent.partOfSpeech = POS.ADJECTIVE;
			this.agents.push(newAgent);
		}
	}
	
	while(verbs.length != 0 && numVerbAgents > 0){
		var newAgent = verbs.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numVerbAgents -= 1;
			//newAgent.partOfSpeech = POS.VERB;
			this.agents.push(newAgent);
		}
	}
	
	while(adverbs.length != 0 && numAdverbAgents > 0){
		var newAgent = adverbs.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numAdverbAgents -= 1;
			//newAgent.partOfSpeech = POS.ADVERB;
			this.agents.push(newAgent);
		}
	}
	
	while(interjections.length != 0 && numInterjectionAgents > 0){
		var newAgent = interjections.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numInterjectionAgents -= 1;
			//newAgent.partOfSpeech = POS.INTERJECTION;
			this.agents.push(newAgent);
		}
	}
	
	while(unclassifieds.length != 0 && numUnclassifiedAgents > 0){
		var newAgent = unclassifieds.shift();
		if(this.agents.indexOf(newAgent) < 0){
			if(this.agents.length >= this.MAX_NUM_AGENTS){
				var remAgent = this.agents[0];
				var remIndex = 0;
				for(var i = 0; i < this.agents.length; i++){
					var agent = this.agents[i];
					if(agent.timestamp < remAgent.timestamp){
						remAgent = agent;
						remIndex = i;
					}
				}
				this.agents[remIndex].remove = true;
				this.agents[remIndex].desiredAlpha = 0.0;
			}
			numUnclassifiedAgents -= 1;
			this.agents.push(newAgent);
		}
	}
	this.updateAgentColor();
//	this.updateAgentPosEmotion();
	nouns.length = 0;
	adjectives.length = 0;
	verbs.length = 0;
	adverbs.length = 0;
	interjections.length = 0;
	unclassifieds.length = 0;
	alreadyAdded.length = 0;
	
	
	// Update the words of top occurence and record them
	this.recordedTopWords = topWords;
	
};






// Add new articles from the RSS source
Skimmer.prototype.ChangeUsingXMLSource = function(){


	this.colorType = 0;	//default
	
	this.count = 0;
	this.DO_STEMMING = true;
	this.DRAW_CIRCLES = true;
	this.USE_COLLISION = true;
	this.USE_TITLES = true;
	this.stems = new HashMap();
	
	this.zoomedAgents = new Array();
	this.selectedWords = new Array();
	this.selectedArticles = new Array();
	this.selectedArticle = null;
	this.selectedArticleRanking = new Map();
	this.agentArticle = null;
	this.agentUser = null;
	this.agentTitle = new AgentTitle("");
	this.agents = new Array();
	this.newArticles = new Array();
	this.articles = new Array();
	this.words = new Array();
	this.occurrences = new VisHashMap();
	this.maxOccurrence = 0;
	this.lowOccurrence = 0;
	this.orderings = new VisHashMap();
	this.cooccurrences = new VisHashMap();
	this.maxCooccurrence = 0;
	this.lowCooccurrence = 0;
	this.adjacencies = new VisHashMap();
	this.maxAdjacency = 0;
	
	this.minRadius = 0;
	
	
	this.colorAgentWordText = new Color( 255, 255, 255 );
	this.colorAgentTitleBackground = new Color( 90, 90, 90 );
	this.colorAgentTitleBorder = new Color( 120, 120, 120 );
	this.colorAgentTitleText = new Color( 240, 240, 240 );

	this.colorAgentArticleHeaderBackground = new Color( 90, 90, 90 );
	this.colorAgentArticleHeaderBorder = new Color( 120, 120, 120 );
	this.colorAgentArticleHeaderText = new Color( 240, 240, 240 );
	this.colorAgentArticleBodyBackground = new Color( 240, 240, 240 );
	this.colorAgentArticleBodyBorder = new Color( 180, 180, 180 );
	this.colorAgentArticleBodyText = new Color( 50, 50, 50 );
	this.colorAgentArticleFooterBackground = new Color( 90, 90, 90 );
	this.colorAgentArticleFooterBorder = new Color( 120, 120, 120 );
	this.colorAgentArticleFooterText = new Color( 240, 240, 240 );
	
	//this.height = 768.0;
	//this.width = 1024.0;
	/** Controls the influence of the user's input. */
	this.CENTER_FORCE = 100;
	this.SMUDGE_FORCE = 500;
	
	this.TITLE_WEIGHT = 100;
	this.MIN_NUM_OCCURRENCES = 2;
	this.SORTED_OCCURRENCE_LIST_SIZE = 2000;
	this.MAX_NUM_PAIRS = 200;
	this.MAX_NUM_AGENTS = 50;
	this.MAX_WORDS_PER_ZOOM = 10;
	this.MAX_ZOOMED_AGENTS = 30;
	
	this.ENFORCE_POS_REQUIREMENTS = false;
	this.NOUN_REQUIREMENT = 0.0;
	this.ADJECTIVE_REQUIREMENT = 1.0;
	this.VERB_REQUIREMENT = 1.0;
	this.ADVERB_REQUIREMENT = 1.0;
	this.INTERJECTION_REQUIREMENT = 0.0;
	this.UNCLASSIFIED_REQUIREMENT = 0.0;
	this.ENFORCE_ORDERING = false;
	this.ORDERING_MULTIPLIER = 400;	
	

	var xmlDoc = loadXmlFile("data/Feed002.rss");
	var xmlArticles = xmlDoc.getElementsByTagName("item"); // The tag item here should be replaced by entry in the future

	// Create a class article for all the items read from the xml file and store them in the array
	for(var i = 0; i < xmlArticles.length ;i++){
		this.newArticles[i] = new Article();
		
		// Get the title of the article
		this.newArticles[i].title = xmlArticles[i].getElementsByTagName("title")[0].childNodes[0].nodeValue.LTrim().RTrim();
		
		this.newArticles[i].summary = xmlArticles[i].getElementsByTagName("description")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].rsscontent = xmlArticles[i].getElementsByTagName("description")[0].childNodes[0].nodeValue.LTrim().RTrim();
				
		
		// Get the URL of the image if there is an image attached to the news
		// Otherwise the image URL will be set null
		this.imageUrl = null;
		this.newArticles[i].imageUrl = this.imageUrl;
					
		
		this.newArticles[i].source = xmlArticles[i].getElementsByTagName("link")[0].childNodes[0].nodeValue.LTrim().RTrim();
		//this.newArticles[i].source = feedResult.feed.entries[i].link;

		this.newArticles[i].timestamp = new Date();
		this.newArticles[i].words = removeStopWords(this.newArticles[i].summary.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		this.newArticles[i].titlewords = removeStopWords(this.newArticles[i].title.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		
	}
	
	
	// Insert the user agent. //
	this.agentUser = new AgentUser();
	this.agentUser.pos.set( -( this.width / 2 ) + Math.random() * this.width, -( this.height / 2 ) + Math.random()
				* this.height );
	this.agentUser.bounds.extents.set( this.agentUser.radius, this.agentUser.radius );
	
	this.agentTitle.text = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	
	this.agentTitle.pos.set(0,-(this.height / 2) + 20);
		
}

// Add new articles from the RSS source
Skimmer.prototype.UpdateUsingXMLSource = function(){

	this.DO_STEMMING = true;
	this.DRAW_CIRCLES = true;
	this.USE_COLLISION = true;
	this.USE_TITLES = true;


	var xmlDoc = loadXmlFile("data/Feed002_updated.rss");
	var xmlArticles = xmlDoc.getElementsByTagName("item"); // The tag item here should be replaced by entry in the future

	// Create a class article for all the items read from the xml file and store them in the array
	for(var i = 0; i < xmlArticles.length ;i++){
		this.newArticles[i] = new Article();
		
		// Get the title of the article
		this.newArticles[i].title = xmlArticles[i].getElementsByTagName("title")[0].childNodes[0].nodeValue.LTrim().RTrim();
		
		this.newArticles[i].summary = xmlArticles[i].getElementsByTagName("description")[0].childNodes[0].nodeValue.LTrim().RTrim();
		this.newArticles[i].rsscontent = xmlArticles[i].getElementsByTagName("description")[0].childNodes[0].nodeValue.LTrim().RTrim();
				
		
		// Get the URL of the image if there is an image attached to the news
		// Otherwise the image URL will be set null
		this.imageUrl = null;
		this.newArticles[i].imageUrl = this.imageUrl;
					
		
		this.newArticles[i].source = xmlArticles[i].getElementsByTagName("link")[0].childNodes[0].nodeValue.LTrim().RTrim();
		//this.newArticles[i].source = feedResult.feed.entries[i].link;

		this.newArticles[i].timestamp = new Date();
		this.newArticles[i].words = removeStopWords(this.newArticles[i].summary.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		this.newArticles[i].titlewords = removeStopWords(this.newArticles[i].title.replace(/[^a-zA-Z0-9]/g,' ').toUpperCase().split(' '));
		
	}
	
	
	// Insert the user agent. //
	this.agentUser = new AgentUser();
	this.agentUser.pos.set( -( this.width / 2 ) + Math.random() * this.width, -( this.height / 2 ) + Math.random()
				* this.height );
	this.agentUser.bounds.extents.set( this.agentUser.radius, this.agentUser.radius );
	
	this.agentTitle.text = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	
	this.agentTitle.pos.set(0,-(this.height / 2) + 20);
		
}



