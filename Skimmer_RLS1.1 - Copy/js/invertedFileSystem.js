/**
 * @author DGL
 */
 
function InvertedFileSystem(){
	
	// An array of stop words
	this.stopWords = ['html','das','dis','der','nbsb','los','blogtalkradio','las','por','del','para','org','fuck','que','par','just','new','jsp','http','tinyurl','www','a','about','above','across','after','again','against','all','almost','alone','along','already','also','although','always','among','an','and','another','any','anybody','anyone','anything','anywhere','are','area','areas','around','as','ask','asked','asking','asks','at','away','b','back','backed','backing','backs','be','became','because','become','becomes','been','before','began','behind','being','beings','best','better','between','big','both','but','by','c','came','can','cannot','case','cases','certain','certainly','clear','clearly','come','could','d','did','differ','different','differently','do','does','done','down','downed','downing','downs','during','e','each','early','either','end','ended','ending','ends','enough','even','evenly','ever','every','everybody','everyone','everything','everywhere','f','face','faces','fact','facts','far','felt','few','find','finds','first','for','four','from','full','fully','further','furthered','furthering','furthers','g','gave','general','generally','get','gets','give','given','gives','go','going','good','goods','got','great','greater','greatest','group','grouped','grouping','groups','h','had','has','have','having','he','her','here','herself','high','higher','highest','him','himself','his','how','however','i','if','important','in','interest','interested','interesting','interests','into','is','it','its','itself','j','just','k','keep','keeps','kind','knew','know','known','knows','l','large','largely','last','later','latest','least','less','let','lets','like','likely','long','longer','longest','m','made','make','making','man','many','may','me','member','members','men','might','more','most','mostly','mr','mrs','much','must','my','myself','n','necessary','need','needed','needing','needs','never','new','newer','newest','next','no','nobody','non','noone','not','nothing','now','nowhere','number','numbers','o','of','off','often','old','older','oldest','on','once','one','only','open','opened','opening','opens','or','order','ordered','ordering','orders','other','others','our','out','over','p','part','parted','parting','parts','per','perhaps','place','places','point','pointed','pointing','points','possible','present','presented','presenting','presents','problem','problems','put','puts','q','quite','r','rather','really','right','room','rooms','s','said','same','saw','say','says','second','seconds','see','seem','seemed','seeming','seems','sees','several','shall','she','should','show','showed','showing','shows','side','sides','since','small','smaller','smallest','so','some','somebody','someone','something','somewhere','state','states','still','such','sure','t','take','taken','than','that','the','their','them','then','there','therefore','these','they','thing','things','think','thinks','this','those','though','thought','thoughts','three','through','thus','to','today','together','too','took','toward','turn','turned','turning','turns','two','u','under','until','up','upon','us','use','used','uses','v','very','w','want','wanted','wanting','wants','was','way','ways','we','well','wells','went','were','what','when','where','whether','which','while','who','whole','whose','why','will','with','within','without','work','worked','working','works','would','x','y','year','years','yet','you','young','younger','youngest','your','yours','z','@$$','afterards','ahole','am','amcik','amongst','amoungst','amount','andskota','anus','anybody','anyhow','anyway','area','areas','arschloch','arse','ash0le','ash0les','asholes','ask','asked','asking','asks','assface','assh0le','assh0lez','assholes','assholz','assMonkey','assrammer','asswipe','away','ayir','azzhole','b','b!+ch','b!tch','b00b','b00bs','b17ch','b1tch','backed','backing','backs','bassterds','bastards','bastardz','basterds','basterdz','becoming','beforehand','began','beings','below','beside','besides','best','better','beyond','bi+ch','bi7ch','Biatch','big','bill','bitch','bitches','blowjob','blowjobs','boffing','boiolas','bollock','boob','boobs','bottom','breasts','buceta','butt-pirate','butthole','buttwipe','c','c0cks','c0k','cabron','call','came','cant','carpetMuncher','case','cases','cawks','cazzo','certain','certainly','chink','chraa','chuj','cipa','clear','clearly','clits','cnts','cntz','co','cock','cock-head','cock-sucker','cockhead','cocksucker','com','come','con','couldnt','crap','cunts','cuntz','d','d4mn','damn','daygo','de','dego','del','describe','detail','did','differ','different','differently','dike','dild0','dild0s','dildos','dilld0','dilld0s','dirsa','div','does','dominatricks','dominatrics','dominatrix','downed','downing','downs','due','dupa','dziwka','e','early','eg','eight','ejackulate','ejakulate','ekrem','ekto','eleven','else','elsewhere','empty','enculer','end','ended','ending','ends','enema','etc','evenly','everybody','except','f','face','faces','fact','facts','faen','fag1t','faget','fagg1t','faggit','faggot','fagit','fags','fagz','faig','faigs','fanculo','fanny','far','fart','fatass','fcuk','feces','feg','Felcher','felt','ficken','fify','fill','finds','fire','fitt','Flikker','flippingthebird','foreskin','former','formerly','forty','fotze','found','front','fu(k','fuck','fucker','fuckin','fucking','fucks','FudgePacker','fukah','fuken','fuker','fukin','fukk','fukkah','fukken','fukker','fukkin','fully','furthered','furthering','furthers','futkretzn','fux0r','g','g00k','gave','gayboy','gaygirl','gays','gayz','general','generally','gets','given','gives','god-damned','going','good','goods','gook','got','great','greater','greatest','group','grouped','grouping','groups','guiena','h','h00r','h0ar','h0r','h0re','h4x0r','hasnt','having','hell','hells','helvete','hence','hereafter','hereby','herein','hereupon','hers','higher','highest','hoar','honkey','hoor','hoore','hore','Huevon','hui','ie','important','inc','indeed','injun','interested','interesting','interests','j','jap','japs','jerk-off','jisim','jism','jiss','jizm','jpg','jsp','k','kanker','kawk','keeps','kike','kind','klootzak','knew','knob','knobs','knobz','know','known','knows','knulle','kraut','kuk','kuksuger','kunt','kunts','kuntz','Kurac','kurwa','kusi','kyrpa','l','l3i+ch','l3itch','large','largely','las','later','latest','latter','latterly','Lesbian','lesbian','lesbo','let','lets','lezzian','like','likely','lipshits','lipshitz','long','longer','longest','ltd','m','make','making','mamhoon','man','masochist','masokist','massterbait','masstrbait','masstrbate','masterbaiter','masterbat','masterbat3','masterbate','masterbates','masturbat','masturbate','meanwhile','member','members','men','merd','mibun','mill','mine','mofo','monkleigh','moreover','mothafucker','mothafuker','mothafukkah','mothafukker','mother-fucker','motherfucker','motherfukah','motherfuker','motherfukkah','motherfukker','mouliewop','move','mr','mrs','muie','mulkku','muschi','muthafucker','muthafukah','muthafuker','muthafukkah','muthafukker','n','n1gr','name','namely','nastt','nazi','nazis','necessary','need','needed','needing','needs','neither','nepesaurio','nevertheless','newer','newest','nigga','nigur','niiger','niigr','non','none','nor','number','numbers','nutsack','o','old','older','oldest','one','onto','open','opened','opening','opens','orafis','order','ordered','ordering','orders','org','orgasim','orgasm','orgasum','oriface','orifice','orifiss','orospu','otherfucker','otherwise','ours','ourselves','own','p','p0rn','packi','packie','packy','paki','pakie','paky','par','para','parted','parting','parts','paska','pecker','peeenus','peeenusss','peenus','peinus','pen1s','penas','penis','penis-breath','penus','penuus','perse','phuc','phuk','phuker','phukker','picka','pierdol','pillu','pimmel','pimpis','piss','pizda','place','places','please','point','pointed','pointing','points','polac','polack','polak','Poonani','poontsee','poop','por','porn','possible','pr0n','pr1c','pr1ck','pr1k','present','presented','presenting','presents','preteen','problem','problems','pula','pule','pussee','puta','puto','puts','puuke','puuker','q','qahbeh','que','queef','queer','queers','queerz','quite','qweers','qweerz','qweir','r','rautenberg','re','really','recktum','rectum','retard','room','rooms','s','s.o.b.','sadist','said','saw','say','says','scank','schaffer','scheiss','schlampe','schlong','schmuck','screw','screwing','scrotum','second','seconds','sees','semen','serious','sex','sexy','sh!+','Sh!t','sh1t','sh1ter','sh1ts','sh1tter','sh1tz','shall','sharmuta','sharmute','shemale','shi+','shipal','shits','shitter','shitty','shity','shitz','shiz','showed','showing','shows','shyt','shyte','shytty','shyty','sides','sincere','skanck','skank','skankee','skankey','skanks','skanky','skribz','skurwysyn','sluts','slutty','slutz','small','smaller','smallest','smut','somebody','somehow','sometime','sometimes','son-of-a-bitch','sphencter','spic','spierdalaj','splooge','state','states','suka','sure','system','t','taken','teets','teez','ten','testical','themselves','thence','thereafter','thereby','therein','thereupon','thick','thin','thing','things','think','thinks','third','thought','thoughts','throughout','thru','tinyurl','tit','tits','today','took','top','towards','turd','turn','turned','turning','turns','twat','twelve','two','u','un','use','used','uses','v','va1jina','vag1na','vagiina','vagina','vaj1na','vajina','via','vittu','vullva','vulva','w','w00se','w0p','want','wanted','wanting','wants','way','ways','wells','went','wetback','wh00r','wh0re','whatever','whence','whenever','whereafter','whereas','whereby','wherein','whereupon','wherever','whither','whoar','whoever','whom','wichser','wop','work','worked','working','works','x','xrated','xxx','y','year','years','yed','young','younger','youngest','yourself','yourselves','z','zabourah'];
	
	this.MAX_WORD_NUM = 30000;			// The maximal number of words permitted in the inverted file system
	this.MAX_FILE_NUM = 200;			// The maximal number of files permitted in the inverted file system
	
	// The inverted file system
	this.indexWord = new Array();		// The word to be indexed in the inverted file system

	this.titleTable = new Array();		// The title of the RSS element of the inverted file system
	this.linkTable = new Array();		// The link of the RSS element of the inverted file system
	this.contentTable = new Array();	// The content of the RSS element of the inverted file system

	this.indexNum = new Array();		// The number of valid entries in the inverted file system for every word stored, used to simulate pointer to the entries

	
	this.numWord = 0;					// Count the number of words stroed in the invered file system
	
	
	this.newEntry = new Array();		// Build up a new entry list to save the result

	
	// Build up all the tables for the inverted file system
	/*
	for(i = 1; i <= this.MAX_WORD_NUM; i++)
	{
		this.titleTable[i] = new Array();
		this.linkTable[i] = new Array();
		this.contentTable[i] = new Array();
	}
	*/

}


// Just for a test
InvertedFileSystem.prototype.showContent = function() {

	for(i = 1; i <= this.MAX_WORD_NUM; i++)
	{
		for(n = 0; n <= this.MAX_FILE_NUM; n++)
		{
			//alert(this.filename[i][n]);
		}
	}
};


//Find a certain key value in the inverted file system
InvertedFileSystem.prototype.searchIndex = function(searchKey) {
	for (i = 0; i <= numWord; i++)
	{
		if (indexWord == searchKey)
		{
		
			// key found in the inverted system
			return i;
		}
	}
	
	return -1;
}


// Add a list of content into the inverted file system
// INPUT:
//   inputentrylist --- a list of entries to be inserted into the system
//   num --- the number of entries to be inserted into the system
InvertedFileSystem.prototype.addContent = function(inputentrylist, num) {
	
	for (i = 0; i < num; i++)
	{
		// Get the content of the entry
		var entryContent = inputentrylist[i].title.toLowerCase() + " " + inputentrylist[i].content.toLowerCase();
		
		// Split the input content into words
		var wordsArray = entryContent.split(" ");
		
		for (j = 0; j < wordsArray.length; j++)
		{
			
			if(wordsArray[j]==""||wordsArray[j]==" "||wordsArray[j]=="\t")
				continue;

				// Check whether the word is a stop word
			// Here the indexOf function is not used because it is not supported for some browsers
			var flag = -1;
			for (k = 0; k < this.stopWords.length; k++)
			{
				if(this.stopWords[k] == wordsArray[j])
				{
					// the word is a stop word
					flag = k;
					break;
				}
			}
			
			// If a word is not a stop word, stem it
			// Otherwise do nothing and go on next iteration
			if (flag == -1)
			{
				// Now stemming is not used here
				// But we shall add stemming here
			
				// Set a variable to record the index in the inverted index system
				var invertedFlag = -1;
			
				for (k = 0; k < this.numWord; k++)
				{
					// Find a word in the inverted file system
					if (wordsArray[j] == this.indexWord[k])
					{
						// Record the flag once the index is found existing in the inverted index system
						invertedFlag = k;
						break;
					}
				}
				
				if (invertedFlag == -1)
				{
					// The word is not in the inverted index system
					
					// Add the new index into the system
					this.indexWord[this.indexWord.length] = wordsArray[j];
					
					// The length of words index array has increased by one here
					this.titleTable[this.indexWord.length - 1] = new Array();
					this.linkTable[this.indexWord.length - 1] = new Array();
					this.contentTable[this.indexWord.length - 1] = new Array();

					
					this.indexNum[this.numWord] = 0;

					this.titleTable[this.indexWord.length - 1][this.indexNum[this.numWord]] = inputentrylist[i].title;
					this.linkTable[this.indexWord.length - 1][this.indexNum[this.numWord]] = inputentrylist[i].link;
					this.contentTable[this.indexWord.length - 1][this.indexNum[this.numWord]] = inputentrylist[i].content;
					
					this.indexNum[this.numWord] = 1;
					this.numWord++;
				}
				else
				{
					// Check whether the file is in the inverted index system
					var fileFlag = -1;
					
					// The word is already used as an index in the index system
					for (l = 0; l < this.indexNum[invertedFlag]; l++)
					{
						// If the file is already stored in the inverted index system
						if (this.titleTable[invertedFlag][l] == inputentrylist[i].title)
						{
							fileFlag = l;
							break;
						}
					}
					
					// Add the file into the inverted index system if the file is not in the system
					if (fileFlag == -1)
					{
						this.titleTable[invertedFlag][this.indexNum[invertedFlag]] = inputentrylist[i].title;
						this.linkTable[invertedFlag][this.indexNum[invertedFlag]] = inputentrylist[i].link;
						this.contentTable[invertedFlag][this.indexNum[invertedFlag]] = inputentrylist[i].content;

						this.indexNum[invertedFlag] = this.indexNum[invertedFlag] + 1;
					}
					// Else do nothing because the file is in the inverted index system
				}
			}
		}
	}

	/*
	console.log("inverted file system\n"+this.indexWord.length);
	for(var i=0; i<this.indexWord.length ; i++){
	console.log(this.indexWord[i]+" "+this.indexNum[i]+"\n");
	for(var j=0; j<this.titleTable.length ; j++){
	console.log(this.titleTable[j]+" "+this.linkTable[j]+" "+this.contentTable[j]+"\n")
	}
	}
	*/
};

