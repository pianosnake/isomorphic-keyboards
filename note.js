NOTES = {
	'c' : 0, 
	'c#': 1,
	'db': 1,
	'd': 2,
	'd#': 3,
	'eb': 3,
	'e': 4,
	'f': 5,
	'f#': 6,
	'gb': 6,
	'g': 7,
	'g#': 8,
	'ab': 8,
	'a': 9,
	'a#': 10,
	'bb': 10,
	'b': 11
}

// Note is made with either (1) a given text like 'c#4' or (2) a numeric value 
// It's an object that has text, name, octave and numeric value
function Note(info){
	this.parseInfo(info);
}

Note.prototype = {
	parseInfo: function(info){
		if(typeof(info) == "string"){
			this.text = info;
			this.setNameAndOctave(info.split(""));
			this.setNumericValue();
		}else if(typeof(info) == "number") {
			this.numericValue = info;
			this.text = this.getText();
			this.name = this.getName();
			this.octave = this.getOctave();
		}
	},

	setNameAndOctave: function(parts){
		if(parts.length == 3 && !isNaN(parts[2])){
			// if the note is like gb3
			this.name = parts[0] + "" + parts[1];
			this.octave = parts[2]
		}else if (parts.length == 2 && !isNaN(parts[1])){
			//or if it's like a3
			this.name = parts[0];
			this.octave = parts[1];			
		}else if (parts.length ==1){
			//or if it's like c then just use c4
			this.name = parts[0];
			this.octave = 4;
		}
	},

	setNumericValue: function(parts){
		this.numericValue =  NOTES[this.name] + (this.octave * 12);
	},

	getOctave: function(){
		return Math.floor(this.numericValue / 12);
	},

	getName: function(){
		while(this.numericValue < 0){
			this.numericValue +=12;
		}
		var noteName; 
		for(var i in NOTES){
    		if (NOTES.hasOwnProperty(i) && NOTES[i] === this.numericValue % 12) {
        		noteName = i;
        		break;
    		}
		}
		return noteName;
	},

	getText: function(){
		return this.getName() + "" + this.getOctave();
	}
}

