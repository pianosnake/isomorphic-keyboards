function Notation(options){
		
	this.el = options.el;
	this.positions = {
		"c": 50,
		"d": 43,
		"e": 36,
		"f": 28,
		"g": 21,
		"a": 14,
		"b": 7
	}
	this.render();
// 48  90
// 49  83 flat
// 50  83 
}

Notation.prototype = {
	render: function(){
		this.el.addClass("system");
		this.el.append("<div class='clef'></div><div class='bars'></div><div class='modifier'></div><div class='whole-note'></div>");
	},

	draw: function(note){
		this.el.find(".bars").text(note.text + " " + note.numericValue);
		

		var notePosition = this.getPosition(note);
		this.el.find(".whole-note").css("top", notePosition);

		if(note.text.charAt(1) == "b"){
			this.showFlat(notePosition);
		}else{
			this.hideModifier();
		}
	}, 
// 3  90
// 4  40
// 5  -10
// 6  -60
	getPosition: function(note){
		var start;
		if(note.octave == 3){
		    start  = 90
		}else if(note.octave == 4){
		    start  = 40
		}else if (note.octave == 5){
			start = -10
		}else if (note.octave == 6){
			start = -60
		}
		return start + this.positions[note.text.charAt(0)];
	}, 

	showFlat: function(position){
		this.el.find(".modifier").addClass("flat").css("top", position-10);
	},

	showSharp: function(position){
		this.el.find(".modifier").addClass("sharp").css("top", position-7);
	},

	hideModifier: function(){
		this.el.find(".modifier").removeClass("sharp flat");
	}


}