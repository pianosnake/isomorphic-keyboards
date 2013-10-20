function Notation(options){
		
	this.el = options.el;
	this.positions = {
		"c": 90,
		"d": 83,
		"e": 76,
		"f": 68,
		"g": 61,
		"a": 54,
		"b": 47
	}
	this.render();

}

Notation.prototype = {
	render: function(){
		this.el.addClass("system");
		this.el.append("<div class='clef'></div><div class='bars'></div><div class='whole-note'></div>");
	},

	show: function(note){
		this.el.find(".bars").text(note);
		var notePosition = this.positions[note.split("")[0]];
		this.el.find(".whole-note").css("top", notePosition);
	}


}