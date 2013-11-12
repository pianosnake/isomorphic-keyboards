NOTES = ['c','c#','db','d','d#','eb','e','f','f#','gb','g','g#','ab','a','a#','bb','b'];
VALUES = [0,1,1,2,3,3,4,5,6,6,7,8,8,9,10,10,11];

// Note is made with either (1) a given text like 'c#4' or (2) a numeric value. Numeric value can take an optional parameter to prefer the flat name
// It's an object that has text, name, octave and numeric value
function Note(info, preferFlatName){
	this.preferFlatName = preferFlatName || false;
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
			this.name = this.getName();
			this.text = this.getText();
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
		this.numericValue =  VALUES[NOTES.indexOf(this.name)] + (this.octave * 12);
	},

	getOctave: function(){
		return Math.floor(this.numericValue / 12);
	},

	getName: function(){
		while(this.numericValue < 0){
			this.numericValue +=12;
		}
		var name;
		if(this.preferFlatName){
			name = NOTES[VALUES.lastIndexOf(this.numericValue % 12)];
		}else{
			name = NOTES[VALUES.indexOf(this.numericValue % 12)];
		}
		return name; 
	},

	getText: function(){
		return this.name + "" + this.getOctave();
	}

}

