/**
 * @author DGL
 */
function Agent(){
	
	/* new function */
	this.POSITION_QUEUE_MAX = 10;
	this.SMOOTH_POSITION_STEP = 10;
	this.position_queue = new Array(this.POSITION_QUEUE_MAX);
	this.CURRENT_POSITION = 0;
	this.JITTER_DISTANCE = 10;
	this.GLOBAL_COUNT = 0;
	this.DETECT_FREQUENCY = 20;
	this.SMOOTH_FREQUENCY = 2;
	this.previous_avgP = new Vector2();
	this.previous_avgP.set(0,0);
	this.initPStack();
	this.moveFlag = true;
	this.enableRemoveJitter = false;
	this.lastPosition = new Vector2();
	this.lastPosition.set(0,0);
	
	this.output = true;
	/** Position Vector. */
	
	this.pos = new Vector2();
	/** Velocity Vector. */
	this.vel = new Vector2();
	/** Terminal Velocity */
	this.VEL_TERMINAL = 50.0;
	/** Bounding Box. */
	this.bounds = new Box();
	/** The velocities list. */
	this.velocities = new Array();
	this.overlaps = new Array();
	this.velNormBuffer = new Array();
	
	this.VEL_NORM_BUFFER_SIZE = 60;
	this.ticks = 0;
	this.TICKS_TO_ENABLE_FILTER = 6000;
	
	this.nearCursor = false;
	this.stopped = false;
	
	this.posBuffer = new Array();
	this.POS_BUFFER_SIZE = 50;
	this.avgPos = new Vector2();
	
	this.distDiff = 0.0;
	
	/** must init as null - tb modified **/
	this.timestamp = null;
	
	/** Controls the removal of the agent. */
	this.remove = false;
	this.TICKS_TILL_FADE = 5;
	this.curTicksTillFade = 0;
	
	/** Stores data for implicit rendering. */
	this.needImplicitBuild = true;
	this.contWidth = 200;
	this.contHeight = 200;
	this.agentCont = null;	//double[]
	this.agentColorCont = null;	//double[]
	this.maxAgentCont = 0.0;
	
	/** Animation variables. */
	this.alpha = 0.0;
	this.desiredAlpha = 1.0;
	
	this.radius = 0.0;
	this.desiredRadius = 0.0;	
	this.imageLinkList = new Array();
	this.imageFrequency = 0;
	this.imageIndex = 0;
	this.imageLinkValidation = 0;
	this.switchPicture = 0;
	this.validImage = null;
	this.validImageFlag = 1;
	this.clickPriority = 1;
	this.removeCount = 0;
	this.switchAlpha = 1;

}

Agent.prototype.initPStack = function(){
	
	for( var tCount = 0; tCount < this.POSITION_QUEUE_MAX; tCount += 1 ){
		this.position_queue[tCount]= new Vector2();
		this.position_queue[tCount].set(0,0);
	}
}

Agent.prototype.getSum = function(){
	
	var avgP = new Vector2();
	avgP.set(0,0);
	for( var tCount = 0; tCount < this.POSITION_QUEUE_MAX; tCount += 1 ){
		avgP.add(this.position_queue[tCount]);
		//console.log(" x "+this.position_stack[tCount].returnX()+" y "+this.position_stack[tCount].returnY());
	}   
	//console.log("avgP: "+avgP);
	
	return avgP;
}


Agent.prototype.getSmoothSum = function(){
	
	var avgP = new Vector2();
	avgP.set(0,0);
	var current = (this.CURRENT_POSITION-1+this.POSITION_QUEUE_MAX)%this.POSITION_QUEUE_MAX;
	for( var tCount = 0; tCount < this.SMOOTH_POSITION_STEP; tCount += 1 ){
		avgP.add(this.position_queue[current]);
		current = (current-1+this.POSITION_QUEUE_MAX)%this.POSITION_QUEUE_MAX;
	}   
	return avgP;
}

Agent.prototype.update = function(delta){
	
	this.GLOBAL_COUNT++;
	//console.log(this.GLOBAL_COUNT);
	if( this.GLOBAL_COUNT > 300 ) {
		this.enableRemoveJitter = true;
		//alert("Start anti-jittering");
	}
	
	/** Apply velocities to find total velocity. **/
	var overlapsOccurred = false;
	if(!this.overlaps.length){
		this.vel.set( 0.0, 0.0 );
		var num = this.velocities.length;
		while( this.velocities.length > 0 ) {
			tmp = new Vector2();
			tmp.setVect(this.velocities.pop());
			if( tmp != null ) {
				this.vel.add(tmp);
			} else {
				alert( "Someone was null" );
			}
		}		
		if( num > 0 ) {
			this.vel.scale( 1.0 / num );
		}
	}
	else {
		var overlapsOccurred = true;
		this.vel.set( 0.0, 0.0 );
		var num = this.overlaps.length;
		while( this.overlaps.length ) {
			tmp = new Vector2();
			tmp.setVect(this.overlaps.pop());
			if( tmp != null ) {
				this.vel.add(tmp);
			} else {
				alert( "Someone was null" );
			}
		}
		if( num > 0 ) {
			this.vel.scale( 1.0 / num );
		}	
	}
	this.velocities.length = 0;
	this.overlaps.length = 0;
	
	// Cap velocity at terminal velocity. //
	if( this.vel.length() > this.VEL_TERMINAL ){
		this.vel.normalize();
		this.vel.scale( this.VEL_TERMINAL );
	}
	
	// Apply delta to velocity. //
	this.vel.scale( delta );
	this.ticks += 1;
	if( this.ticks >= this.TICKS_TO_ENABLE_FILTER && !this.nearCursor && overlapsOccurred ) {
		this.ticks = this.TICKS_TO_ENABLE_FILTER;
		
		velNorm = new Vector2();
		velNorm.setVect(this.vel);
		velNorm.normalize();
		if( this.velNormBuffer.length > this.VEL_NORM_BUFFER_SIZE ) {
			this.velNormBuffer.pop();
		}
		this.velNormBuffer.push(velNorm);
		
		velNormSum = new Vector2();
		function addElement(element, index, array) {
			velNormSum.add(element);
		}
		this.velNormBuffer.forEach(addElement);
		// Add to position. //
		if(velNormSum.length() > 0.5 * this.velNormBuffer.length){
			this.stopped = false;
			this.pos.add(this.vel);
		}else {
			this.stopped = true;
		}
	} else {
		this.pos.add(this.vel);
		this.stopped = false;
	}
	if( this.posBuffer.length > this.POS_BUFFER_SIZE ) {
		this.posBuffer.pop();
	}
	
	//important
	this.posBuffer.push(this.pos);
	var x = 0, y = 0;
	if(this.posBuffer.length){
		function addValue(element, index, array) {
			x += element.x;
			y += element.y;
		}
		
		this.posBuffer.forEach(addValue);
		
		if(this.moveFlag == true || this.enableRemoveJitter == false){
			this.avgPos.set((x / this.posBuffer.length), (y / this.posBuffer.length));
			this.lastPosition.setVect(this.avgPos);
		}
		
		if(this.moveFlag == false && this.enableRemoveJitter == true && this.GLOBAL_COUNT%this.SMOOTH_FREQUENCY == 0){
		
		this.avgPos.setVect(this.getSmoothSum().scale(1.0/this.SMOOTH_POSITION_STEP));
		//this.avgPos.add(this.lastPosition);
		//this.avgPos.scale(0.5);
		this.lastPosition.setVect(this.avgPos);

		}
		
		if(this.enableRemoveJitter == true){
			this.position_queue[this.CURRENT_POSITION].set((x / this.posBuffer.length), (y / this.posBuffer.length));
			this.CURRENT_POSITION = (this.CURRENT_POSITION+1)%this.POSITION_QUEUE_MAX;
			
			if(this.GLOBAL_COUNT%this.DETECT_FREQUENCY == 0){
				
			
				var a = new Vector2();
				var tmp = new Vector2();
				
				
				a.setVect(this.getSum());
				tmp.setVect(this.getSum());
				
				a.sub(this.previous_avgP);
				a.scale(1.0 / this.POSITION_QUEUE_MAX);
				
				
				this.previous_avgP.setVect(tmp);
			
				//console.log(a.length()+"\n");
				
				if(a.length() != NaN && a.length() < this.JITTER_DISTANCE){
				
				//console.log("FIXED");
				this.moveFlag = false;
				
				}
				
				else if(a.length() != NaN && a.length() >= this.JITTER_DISTANCE)
				{
				//console.log("MOVE");
				this.moveFlag = true;	
				}
				
				
			}
			//console.log(this.GLOBAL_COUNT+"\n");
		
		}
			
				
		
		//console.log(this.CURRENT_POSITION+" "+this.position_stack[this.CURRENT_POSITION]+"\n");
		
		
		
	//	if(this.output){
	//	console.log(this.posBuffer.length+" "+x / this.posBuffer.length+" "+y / this.posBuffer.length+"\n");
	//	this.output = false;
	//	}
		
	}
	
	var alphaSign = this.desiredAlpha - this.alpha / Math.abs(this.desiredAlpha - this.alpha);
	var radiusSign = this.desiredRadius - this.radius / Math.abs(this.desiredRadius - this.radius);
	
	this.alpha += 1 * delta * alphaSign;
	this.radius += 30 * delta * radiusSign;

	return this.velocities.length;
};

Agent.prototype.addOverlap = function(velocity){
	this.overlaps.push(velocity);
};

Agent.prototype.addVelocity = function(velocity){
	this.velocities.push(velocity);
};

Agent.prototype.getBoundingBox = function(){
	this.bounds.center.setVect(this.pos);
	return this.bounds;
};

Agent.prototype.buildCont = function(radius){
	var contWidth = parseInt(radius * 2.65);
	var	contHeight = parseInt(radius * 2.65);
	this.agentCont = new Array(contWidth * contHeight);
	this.agentColorCont = new Array(contWidth * contHeight);
	this.maxAgentCont = 0.0;
	
	var index;
	var centerX = parseFloat(contWidth / 2);
	var centerY = parseFloat(contHeight / 2);
	
	for(var y = 0; y < contHeight; y += 1){
		for(var x = 0; x < contWidth; x += 1){
			index = y * contWidth + x;
			this.agentCont[index] = parseFloat(( 1.0 / Math.pow( Math.sqrt( Math.pow( centerX - (x+0.5), 2.0 ) + Math.pow( centerY - (y+0.5), 2.0 ) ), 4.7 ) ));
			this.agentCont[index] *= Math.pow((this.radius / 100.0),4.7);
			
			this.agentColorCont[index] = parseFloat(( 1.0 / Math.pow( Math.sqrt( Math.pow( centerX - (x+0.5), 2.0 ) + Math.pow( centerY - (y+0.5), 2.0 ) ), 4.5 ) ));
			this.agentColorCont[index] *= Math.pow((this.radius / 100.0),4.5);
			this.agentColorCont[index] /= 90.0E-10;
			
			if(this.agentColorCont[index] > 0.5){
				this.agentColorCont[index] = 0.5;
			}
			
			if(!isFinite(this.agentCont[index])){
				this.agentCont[index] = Infinity;	//1.7976931348623157E+10308
			}
			if(this.agentCont[index] > this.maxAgentCont){
				this.maxAgentCont = this.agentCont[index];
			}
		}
	}
	
	var maxHeight = 0.0;
	if(contWidth > contHeight){
		maxHeight = this.agentCont[(contHeight/2)*contWidth];
	}else{
		maxHeight = this.agentCont[contWidth/2];
	}
	//alert(maxHeight);
	for(var y = 0; y < contHeight; y += 1){
		for(var x = 0; x < contWidth; x += 1){
			index = y * contWidth + x;
			this.agentCont[index] -= maxHeight;
			if(this.agentCont[index] < 0.0){
				this.agentCont[index] = 0.0;
			}
		}
	}
};

AgentArticle = function(width, height, title, text, source,imageUrl){
	this.agent = Agent;
	this.agent();
	delete this.agent;
	
	/////////color
	//////////////////
	var titleBkgColor = new Color(0,0,0,1);
	var textBkgColor = new Color(0,0,0,1);
	var sourceBkgColor = new Color(0,0,0,1);
	var titleBrdColor = new Color(0,0,0,1);
	var textBrdColor = new Color(0,0,0,1);
	var sourceBrdColor = new Color(0,0,0,1);
	var fntColorTitle = new Color(0,0,0,1);
	var fntColorText = new Color(0,0,0,1);
	var fntColorSource = new Color(0,0,0,1);
	/*
	public Font fntTitle;
	public Font fntText;
	public Font fntSource;
	
	*/
	
	this.originalHeight = height;
	
	this.height = height;
	this.width = width;
	this.title = title;
	this.text = text;
	this.source = source;
	this.imageUrl = imageUrl;
	//alert("inner"+this.height);
};

AgentArticle.prototype = Agent.prototype;

AgentTitle = function(text){
	this.agent = Agent;
	this.agent();
	delete this.agent;
	
	this.text = text;
	
	this.bkgColor = new Color(0,0,0,1);
	this.brdColor = new Color(0,0,0,1);
//	public Font font;
	this.fntColor = new Color(0,0,0,1);
};

AgentTitle.prototype = Agent.prototype;

AgentWord = function(){
	this.agent = Agent;
	this.agent();
	delete this.agent;
	this.stem = new String('');
	this.text = new String('');
	this.occurrences = 0;
	this.rejects = 0;
	this.sizeBorder = 0;
	this.colorBorder = new String('');
	this.shapeColor = new Color(0,0,0);
	this.textColor = new Color(0,0,0);
	this.textFont = new String('');
	this.valence = 0;
	this.activation = 0;
	this.imagery = 0;
	this.partOfSpeech = null;
	
};

AgentWord.prototype = Agent.prototype;
Agent.prototype.toString = function(){
	return (this.text + this.stem);
};

AgentUser = function(){
	this.agent = Agent;
	this.agent();
	delete this.agent;
	
	this.color = new String();
	
//	public Color color = new Color( 255, 0, 0 );
	this.radius = 10;
	
	this.targetAgent = null;	//AgentWords
	this.ticksSinceLastTargeting = 0;
	this.TICKS_UNTIL_RETARGET = 10000;
	
	this.ticksSinceLastMouseUse = 0;
	this.TICKS_FROM_MOUSE_USE_TILL_ACTIVATION = 25000;
	
	this.ticksSinceLastEvent = 0;
	this.TICKS_BETWEEN_EVENTS = 5000;
		
};

AgentUser.prototype = Agent.prototype;



