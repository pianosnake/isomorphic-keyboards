function Keyboard (options){
	this.el = options.el;
	this.totalRows = options.rows || 5;
	this.startNote = new Note(options.startNote);
	this.startNoteNumericValue = this.startNote.numericValue;
	this.buttonsPerRow = 14;
	this.clickCallback = options.onClick;
	this.systems = {
		//stepSize: 1 means the next note up and to the right is 1 semitone.
		"C": {rows: 3, stepSize: 1},
		"B": {rows: 3, stepSize: 2},
		"F": {rows: 5, stepSize: 1},
		"W": {rows: 2, stepSize: 7},
		"S": {rows: 7, stepSize: -1},
		"J": {rows: 2, stepSize: 1}
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

	getNoteAt: function(x, y){
		//adjust the horizontal position because we're thinking of up/downs on the diagonals
		//and the more we go to the right the more of an offset there'll be
		 x -= Math.ceil(y/2);

		// calculate the wanted note as a distance from the startNote
		// based on the given row, the step size, and position
		var newNoteValue = (this.startNoteNumericValue+ (y*this.system.stepSize) + (this.system.rows * x)); 
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