function Keyboard (options){
	this.el = options.el;
	this.displayRows = options.displayRows ? parseInt(options.displayRows) : 5;
	this.startNote = new Note(options.startNote);
	this.startNoteNumericValue = this.startNote.numericValue;
	this.lowestNote = null;
	this.highestNote = null;
	this.buttonsPerRow = options.buttonsPerRow ? parseInt(options.buttonsPerRow) : 14;
	this.clickCallback = options.onClick;
  this.systemRows = parseInt(options.systemRows);
  this.stepSize = parseInt(options.stepSize);
	this.render();
	this.attachEvents();
}

Keyboard.prototype = {
	attachEvents: function(){
		var self=this;
    if(this.clickCallback){
      this.el.on("click",".button",function(evt){
        self.clickCallback(evt.target);
      })
    }
	},

	render: function(){
		this.el.unbind();
		this.el.empty();
		for(var i=this.displayRows-1; i>-1; i--){
			var extraClass = (i%2==0) ? "even" : ""
			this.el.append("<div class='row "+extraClass+" row_"+i+"'></div>");
			this.addButtonsToRow(i);
		}
	},

	toggleNoteNames: function(){
		this.el.find(".button").toggleClass("note-name text-off-screen");
	},

	hideText: function(){
		this.el.find(".button").addClass("text-off-screen");
	}, 

	showText: function(){
		this.el.find(".button").removeClass("text-off-screen");
	},

	deselect: function(){
		this.el.find(".button").removeClass("selected");
	},

	compareToHighestAndLowestNote: function(noteValue){
	
		if(this.highestNote == null || noteValue > this.highestNote){
			this.highestNote = noteValue;
		}
		if(this.lowestNote == null || noteValue < this.lowestNote){
			this.lowestNote = noteValue; 
		}
	}, 


	getNoteAt: function(x, y){
		//adjust the horizontal position because we're thinking of up/downs on the diagonals
		//and the more we go to the right the more of an offset there'll be
		 x -= Math.ceil(y/2);

		// calculate the wanted note as a distance from the startNote
		// based on the given row, the step size, and position
		var newNoteValue = (this.startNoteNumericValue+ (y*this.stepSize) + (this.systemRows * x));

		this.compareToHighestAndLowestNote(newNoteValue);
		return new Note(newNoteValue);
	},



	addButtonsToRow: function(row){
		//add another button if the row is odd
		var buttonsPerRowAdjusted = this.buttonsPerRow + (row % 2);
		
		for(var i=0; i<buttonsPerRowAdjusted; i++){
			var note = this.getNoteAt(i, row);
			var color = (note.text.length == 3) ? "black" : "white";
			$('<div/>', {
   				"class": 'note-name non-selectable button '+ color,
    			"data-note": note.numericValue,
    			"text": note.text
			}).appendTo(this.el.find(".row_"+row));

		}
	}
}