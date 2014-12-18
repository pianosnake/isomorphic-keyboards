var keyboard, notation, quiz; 

function parseQueryString(query){
	var vars = query.split("&");
	var obj = {}
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        obj[pair[0]] = pair[1];
    }
    return obj;
}

function showKeyboard(options){
	var options = parseQueryString(options);

	keyboard = new Keyboard({
		el: $("#keyboard"), 
		system: options.system,
		startNote: options.start,
		rows: parseInt(options.rows),
		onClick: noteClick
	});
}

function noteClick(clickedButton){
	var $btn = $(clickedButton);
	var note = new Note($btn.data("note"));
	if(quiz.started){
		if(note.numericValue === quiz.lastQuestion.numericValue){
			quiz.right($btn);
		}else{
			quiz.wrong($btn);
		}
	}else{
		notation.draw(note);
		$("#keyboard .button").removeClass("selected");
		$("#keyboard .button[data-note='"+note.numericValue+"']").addClass("selected");	
	}
}

$(document).ready(function(){
	showKeyboard($("select option:first").val());
	notation = new Notation({
		el: $("#notation")
	});
	quiz = new Quiz();
});


function Quiz(){
	this.totalQuestions = 5;
	this.started = false;
	this.lastQuestion = null;
	this.lastQuestionTime = null;
	this.answerTime = null;
	this.questionsAsked =0; 
	this.averageResponseTime = 0;
	this.bestTime = null; 
	this.quizBtn = $("#quizBtn");
	this.lastScoreDisplay = $("#lastScore");
	this.bestScoreDisplay = $("#bestScore");
	this.keyboardSelector = $("#keyboardSelector");
}

Quiz.prototype = {

	average:function (currentAverage, newValue){
		return ((currentAverage * (this.questionsAsked-1)) + newValue ) / this.questionsAsked;
	},

	buttonClick: function(){
		if(this.started){
			this.end();
			this.quizBtn.text("Start Quiz")
		}else{
			this.start();
			this.quizBtn.text("End Quiz");
		}
	},

	start: function(){
		keyboard.hideText();
		this.keyboardSelector.prop("disabled", "disabled");
		this.started = true;
		this.askQuestion();
	},

	end:function(){
		this.quizBtn.text("Start Quiz");
		this.keyboardSelector.prop("disabled", false);
		keyboard.showText();
		keyboard.deselect();
		notation.reset();
		this.started = false;
		this.handleScores();
		this.questionsAsked = 0; 
	},

	handleScores: function(){
		if(this.bestTime == null || this.averageResponseTime < this.bestTime){
			this.bestTime = this.averageResponseTime; 
		}
		this.lastScoreDisplay.text((this.averageResponseTime/1000).toFixed(2));
		this.bestScoreDisplay.text((this.bestTime/1000).toFixed(2));
		this.averageResponseTime = 0;
	}, 

	right: function($el){
		var answerTime = Date.now();
		var responseTime = answerTime - this.lastQuestionTime;

		this.averageResponseTime  = this.average(this.averageResponseTime, responseTime);
		this.addMarker($el, "right");
		this.hideMarker($el);
		if(this.questionsAsked >= this.totalQuestions){
			this.end();
		}else{
			this.askQuestion();
		}
	},

	wrong: function($el){
		this.addMarker($el, "wrong");
		this.hideMarker($el);
	},

	addMarker: function($el, type){
		$el.append("<div class='marker "+type+"'></div>");
	},

	hideMarker: function($el){
		var marker = $el.find(".marker");
		marker.fadeOut(900, function(){
			marker.remove();
		});
	},

	askQuestion: function(){
		keyboard.deselect();
		//random note on the keyboard
		var high = keyboard.highestNote;
		var low = keyboard.lowestNote;
		var r = low + Math.floor((Math.random()*(high-low)));

		// ask another question if it's the same as the previous note
		if((this.lastQuestion && r == this.lastQuestion.numericValue)){
			this.askQuestion();
		}else{
			this.lastQuestion = new Note(r, (Math.round(Math.random()) == 1));
			notation.draw(this.lastQuestion);
			this.lastQuestionTime = Date.now();
			this.questionsAsked ++; 
		}
	}
}