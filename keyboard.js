NOTES = {
	'c' : 0, 
	'c#': 1,
	'db': 1,
	'd': 2,
	'd#': 3,
	'eb': 3,
	'e': 4,
	'f': 5,
	'f#': 6,
	'gb': 6,
	'g': 7,
	'g#': 8,
	'ab': 8,
	'a': 9,
	'a#': 10,
	'bb': 10,
	'b': 11
}
// Note is made by either (1) parsing given text into a note with numeric value and octave or (2) take a numeric value 
function Note(info){
	this.numericValue = 0;
	this.info = info;
	this.parseInfo();
	this.name = this.name();
	this.octave = this.octave();
	this.text = this.text();
}

Note.prototype = {
	parseInfo: function(){
		if(typeof(this.info) == "string"){
			this.calculateNumericValue(this.info.split(""));
		}else if(typeof(this.info) == "number") {
			this.numericValue = this.info;
		}
	},

	calculateNumericValue: function(parts){
		if(parts.length == 3 && !isNaN(parts[2])){
			// if the note is like gb3
			this.numericValue =  NOTES[parts[0] + ""+ parts[1]] + (parts[2] * 12);
		}else if (parts.length == 2 && !isNaN(parts[1])){
			//or if it's like a3
			this.numericValue =  NOTES[parts[0]] + (parts[1] * 12);
		}else if (parts.length ==1){
			//or if it's like c then just use c4
			this.numericValue =  NOTES[parts[0]] + (4* 12);
		}
	},

	octave: function(){
		return Math.floor(this.numericValue / 12);
	},

	name: function(){
		while(this.numericValue < 0){
			this.numericValue +=12;
		}
		var noteName; 
		for(var i in NOTES){
    		if (NOTES.hasOwnProperty(i) && NOTES[i] === this.numericValue % 12) {
        		noteName = i;
        		break;
    		}
		}

		return noteName;
	},

	text: function(){
		return this.name + "" + this.octave
	}
}



function Keyboard (options){
	this.el = options.el;
	this.totalRows = options.rows || 5;
	this.startNote = new Note(options.startNote);
	this.buttonsPerRow = 14;
	this.clickCallback = options.onClick;
	this.systems = {
		//stepSize: 1 means the next note up and to the right is 1 semitone.
		"C": {
			rows: 3,
			stepSize: 1
		},

		"B": {
			rows: 3,
			stepSize: 2
		},

		"F": {
			rows: 5,
			stepSize: 1
		},

		"W": {
			rows: 2,
			stepSize: 7
		},

		"S": {
			rows: 7,
			stepSize: -1
		},

		"J": {
			rows: 2,
			stepSize: 1

		}
	}
	this.system = options.system ? this.systems[options.system] : this.systems["C"];
	this.render();
	this.attachEvents();
}

Keyboard.prototype = {
	attachEvents: function(){
		var self = this;
		this.el.on("click", ".button", function(evt){
			var note = new Note($(evt.target).data("note"));
			self.clickCallback(note);
		})
	},

	render: function(){
		this.el.empty();
		for(var i=this.totalRows-1; i>-1; i--){
			var extraClass = (i%2==0) ? "even" : ""
			this.el.append("<div class='row "+extraClass+" row_"+i+"'></div>");
			this.addButtonsToRow(i);
		}
	},

	toggleNoteNames: function(){
		this.el.find(".button").toggleClass("note-name text-off-screen");
	},

	noteAt: function(x, y){
		//adjust the horizontal position because we're thinking of up/downs on the diagonals
		//and the more we go to the right the more of an offset there'll be
		 x -= Math.ceil(y/2);

		// calculate the wanted note as a distance from the startNote
		// based on the given row, the step size, and position
		var newNoteValue = (this.startNote.numericValue+ (y*this.system.stepSize) + (this.system.rows * x)); 
		return new Note(newNoteValue);
	},


	addButtonsToRow: function(row){
		//add another button if the row is odd
		var buttonsPerRowAdjusted = this.buttonsPerRow + (row % 2);
		
		for(var i=0; i<buttonsPerRowAdjusted; i++){
			var note = this.noteAt(i, row);
			var color = (note.text.length == 3) ? "black" : "white";
			$('<div/>', {
   				"class": 'note-name non-selectable button '+ color,
    			"data-note": note.numericValue,
    			"text": note.text
			}).appendTo(this.el.find(".row_"+row));

		}
	}
}