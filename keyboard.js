
function Keyboard (options){
	this.el = options.el;
	this.rows = options.rows || 5;
	this.system = options.system || "C";
	this.buttonsPerRow = 14;
	this.systems = {
		"C": [
				['e','g','bb','db'],
				['eb','gb','a','c'],
				['f','ab','b','d']
			], 

		"B": [
				['db', 'e','g','bb'],
				['b','d','f','ab'],
				['c','eb','gb','a']
			],
		"J": [
				['db', 'eb','f','g','a','b'],
				['c','d','e','gb','ab','bb']
			]
	}
	this.render();
	this.attachEvents();
}

Keyboard.prototype = {
	attachEvents: function(){
		this.el.on("click", ".button", (function(evt){
			$("#note").text($(evt.target).data("note"))
		}))
	},

	render: function(){
		this.el.empty();
		for(var i=0; i< this.rows; i++){
			this.el.append("<div class='row row_"+i+"'></div>");
			this.addButtonsToRow(i);
		}
	},

	addButtonsToRow: function(row){
		//add another button if the row is odd
		var buttonsPerRowMod = this.buttonsPerRow + (row % 2)
		for(var i=0; i<buttonsPerRowMod; i++){
			var note = this.buttonNote(row, i);
			var color = (note.length == 2) ? "black" : "white";
			this.el.find(".row_"+row).append("<div class='note-name non-selectable button "+color+"' data-note='"+note+"'>"+note+"</div>");
		}
	},

	buttonNote: function(row, position){
		var buttonPattern = this.systems[this.system];
		var rows = buttonPattern.length;
		var positions = buttonPattern[0].length;
		return buttonPattern[row % rows][position % positions];
	}
}