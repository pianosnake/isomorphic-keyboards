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
		this.el.append("<div class='clef'></div><div class='bars'></div><div class='modifier'></div><div class='whole-note'></div>");
	},

	show: function(note){
		this.el.find(".bars").text(note);
		var noteProperties = note.split("");

		var notePosition = this.positions[noteProperties[0]];
		this.el.find(".whole-note").css("top", notePosition);

		if(noteProperties[1] == "b"){
			this.showFlat(notePosition);
		}else{
			this.hideModifier();
		}
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