function Notation(options){
	this.el = options.el;
	this.svgns = "http://www.w3.org/2000/svg";
	this.addSvgObj();
	this.positions = {
		"c": 0, "d": -10, "e": -20, "f": -30, "g": -40, "a": -50,"b": -60
	};
	this.octaveOffsets = {
		3: 70, 4: 0, 5: -70, 6: -140
	}
}

Notation.prototype = {
	addSvgObj: function(){
		var self = this; 
		var svgObj = document.createElement("object");
		svgObj.data = "note_on_staff.svg";
		svgObj.type = "image/svg+xml";
		svgObj.onload = function(){self.render()};
		this.el.append(svgObj);
	},

	render: function(){
		this.svg = this.el.find("object")[0].contentDocument;
		this.noteHead = this.svg.getElementById("note");
		this.sharp = this.svg.getElementById("sharp");
		this.flat = this.svg.getElementById("flat");
		this.staff = this.svg.getElementById("staff");
		this.staffBBox = this.staff.getBBox();
		this.reset();
	}, 

	draw: function(note){
		this.reset();
		this.show(this.noteHead);
		var notePosition = this.getPosition(note);

		if(note.text.charAt(1) == "b"){
			this.show(this.flat, notePosition);
		}else if (note.text.charAt(1) == "#"){
			this.show(this.sharp, notePosition);
		}

		this.showHelperLines(notePosition);

		this.noteHead.setAttribute("transform","translate(0,"+notePosition+")");
	}, 

	getPosition: function(note){
		var start = this.octaveOffsets[note.octave];
		return start + this.positions[note.text.charAt(0)];
	}, 

	show: function(el, position){
		el.setAttribute('visibility','visible');
		el.setAttribute("transform","translate(0,"+position+")");
	},

	hide: function(el){
		el.setAttribute('visibility','hidden');
	},

	reset: function(){
		this.hide(this.flat);
		this.hide(this.sharp);
		this.hide(this.noteHead);
		this.removeAllHelperLines();
	}, 

	removeAllHelperLines: function(){
		while(this.staff.getElementsByClassName("helper").length > 0 ){
				this.staff.removeChild(this.staff.getElementsByClassName("helper")[0])
			}
	},

	addHelperLinesBelow: function(p){
		var lines = Math.floor(p/20) + 1 ;
			for(var i=0; i< lines; i++){
				this.addHelperLine(this.staffBBox.height+this.staffBBox.y + (i * 20) + 18);
		}
	}, 

	addHelperLinesAbove: function(p){
		var pMod = p * (-1) - 120;
		var lines = Math.floor(pMod/20) + 1 ;
		for(var i=0; i< lines; i++){
			this.addHelperLine(this.staffBBox.y -((i+1)* 20));
		}
	},

	showHelperLines: function(p){
		if(p>=0){
			this.addHelperLinesBelow(p);		
		}else if(p<=-120){
			this.addHelperLinesAbove(p);
		}
	}, 

	addHelperLine: function(y){
		var r = this.svg.createElementNS(this.svgns, "rect");
		r.setAttributeNS(null, "height", 2);
		r.setAttributeNS(null, "width", 45);
		r.setAttributeNS(null, "class", "helper");
		r.setAttributeNS(null, "x", 85);
		r.setAttributeNS(null, "y", y);
		this.staff.appendChild(r);
	}

}