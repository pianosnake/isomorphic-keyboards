var svgns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";

function Notation(options){
		
	this.el = options.el[0].contentDocument;

	this.note = this.el.getElementById("note");
	this.sharp = this.el.getElementById("sharp");
	this.flat = this.el.getElementById("flat");
	this.eight = this.el.getElementById("eight");
	this.staff = this.el.getElementById("staff");
	this.staffBBox = this.staff.getBBox();

	this.positions = {
		"c": 0,
		"d": -10,
		"e": -20,
		"f": -30,
		"g": -40,
		"a": -50,
		"b": -60
	}

	this.hideExtras();
	this.hide(this.note);
}

Notation.prototype = {


	draw: function(note){
		this.hideExtras();
		this.show(this.note);
		var notePosition = this.getPosition(note);

		if(note.text.charAt(1) == "b"){
			this.show(this.flat, notePosition);
		}

		this.showHelpers(notePosition);

		this.note.setAttribute("transform","translate(0,"+notePosition+")");
	}, 

	getPosition: function(note){
		var start;
		if(note.octave == 3){
		    start  = 70
		}else if(note.octave == 4){
		    start  = 0
		}else if (note.octave == 5){
			start = -70
		}else if (note.octave == 6){
			start = -140
		}
		return start + this.positions[note.text.charAt(0)];
	}, 

	show: function(el, position){
		el.setAttribute('visibility','visible');
		el.setAttribute("transform","translate(0,"+position+")");
	},

	hide: function(el){
		el.setAttribute('visibility','hidden');
	},

	hideExtras: function(){
		this.hide(this.flat);
		this.hide(this.sharp);
		this.hide(this.eight);
	}, 

	showHelpers: function(p){
		while(this.staff.getElementsByClassName("helper").length > 0 ){
			this.staff.removeChild(this.staff.getElementsByClassName("helper")[0])
		}

		if(p>=0){
			var lines = Math.floor(p/20) + 1 ;
			for(var i=0; i< lines; i++){
				this.addHelper(this.staffBBox.height+this.staffBBox.y + (i * 20) + 18);
			}
		}else if(p<=-120){
			var pMod = p * (-1) - 120;
			var lines = Math.floor(pMod/20) + 1 ;
			for(var i=0; i< lines; i++){
				this.addHelper(this.staffBBox.y -((i+1)* 20));
			}
		}
	}, 

	addHelper: function(y){
		var r = this.el.createElementNS(svgns, "rect");
		r.setAttributeNS(null, "height", 2);
		r.setAttributeNS(null, "width", 45);
		r.setAttributeNS(null, "class", "helper");
		r.setAttributeNS(null, "x", 85);
		r.setAttributeNS(null, "y", y);
		this.el.getElementById("staff").appendChild(r);
	}


}