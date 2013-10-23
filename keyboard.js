NOTES = ['c','db','d','eb','e','f','gb','g','ab','a','bb','b'];

// Note is made by either (1) parsing given text into a note with numeric value and octave or (2) take a numeric value 
function Note(info){
	this.numericValue = 0;
	this.octave = 0; 
	this.info = info;
	this.parseInfo();
	
}
Note.prototype = {
	parseInfo: function(){
		if(typeof(this.info) == "string"){
			this.calculateNumericValueAndOctave();

		}else if(typeof(this.info.octave) !== "undefined" && typeof(this.info.numericValue) !== "undefined") {
			this.octave = this.info.octave;
			while (this.info.numericValue < 0 ){
				this.info.numericValue += 12;
			}
			this.numericValue = this.info.numericValue;
		}

	},

	calculateNumericValueAndOctave: function(){
		var parts = this.info.split("");
		
		if(parts.length == 3 && !isNaN(parts[2])){
			// if the note is like gb3
			this.numericValue =  NOTES.indexOf(parts[0] + ""+ parts[1]);
			this.octave = parseInt(parts[2]);

		}else if (parts.length == 2 && !isNaN(parts[1])){
			//or if its like a3
			this.numericValue =  NOTES.indexOf(parts[0]);
			this.octave = parseInt(parts[1]);
		}
	},

	text: function(){
		
		return NOTES[this.numericValue % 12] + "" + this.octave;
	},
}



function Keyboard (options){
	this.el = options.el;
	this.totalRows = options.rows || 5;
	this.startNote = new Note(options.startNote);
	this.buttonsPerRow = 14;
	this.onClick = options.onClick;
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
			rows: 4,
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
			var note = $(evt.target).data("note");
			self.onClick(note);
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
		 // x +=12;

		// calculate the wanted note as a distance from the startNote
		// based on the given row, the step size, and position
		var newNoteValue = (this.startNote.numericValue+ (y*this.system.stepSize) + (this.system.rows * x)); 
		var newNoteOctave = Math.floor(newNoteValue / 12) + this.startNote.octave;

		// return  this.getNoteText(newNoteValue) +""+ newNoteOctave;
		return new Note({numericValue: newNoteValue, octave: newNoteOctave})
	},


	addButtonsToRow: function(row){
		//add another button if the row is odd
		var buttonsPerRowAdjusted = this.buttonsPerRow + (row % 2);
		
		for(var i=0; i<buttonsPerRowAdjusted; i++){
			var noteText = this.noteAt(i, row).text();
			var color = (noteText.length == 3) ? "black" : "white";
			$('<div/>', {
   				"class": 'note-name non-selectable button '+ color,
    			"data-note": noteText,
    			"text": noteText
			}).appendTo(this.el.find(".row_"+row));

		}
	}
}