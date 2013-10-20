
function Keyboard (options){
	this.notes = ['c','db','d','eb','e','f','gb','g','ab','a','bb','b']
	this.el = options.el;
	this.totalRows = options.rows || 5;
	this.startNote = options.startNote != undefined ? options.startNote : 6;
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

	buttonNoteAt: function(x, y){
		//adjust the horizontal position because we're thinking of up/downs on the diagonals
		//and the more we go to the right the more of an offset there'll be
		 x -= Math.ceil(y/2)  ;
		 x +=12;

		// calculate the wanted note as a distance from the startNote
		// based on the given row, the step size, and position
		return (this.startNote+ (y*this.system.stepSize) + (this.system.rows * x)) % 12;
	},

	addButtonsToRow: function(row){
		//add another button if the row is odd
		var buttonsPerRowAdjusted = this.buttonsPerRow + (row % 2);
		
		for(var i=0; i<buttonsPerRowAdjusted; i++){
			var note = this.notes[this.buttonNoteAt(i, row)];
			var color = (note.length == 2) ? "black" : "white";
			this.el.find(".row_"+row).append("<div class='note-name non-selectable button "+color+"' data-note='"+note+"'>"+note+"</div>");
		}
	}
}