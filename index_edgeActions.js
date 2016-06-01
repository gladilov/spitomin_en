/* global function-----------*/
var questionsABC = "ABCD",
	  timeLinePointer,
    serverIp = '212.44.150.83';

var questionsHeaders = [
"How can one obtain 5 mg of Spitomin to titrate the individual dose?",
"How Spitomin should be administered?",
"What is the scheme of Spitomin administration at the start of treatment?",
"How rapid is the onset of Spitomin therapeutic effect?",
"What is the maximum duration of Spitomin treatment?",
"For what types of psychiatric disorders is Spitomin used?",
"What is the effect of Spitomin on main psychomotor functions?",
"What effects may develop during the course of Spitomin therapy?",
"What prescription forms should be used for Spitomin?",
"What is Spitomin effect during co-administration with SSRIs antidepressants?",
"What is the effect of Spitomin on SSRI antidepressants’ side effects during co-administration?",
"How strong is Spitomin anxiolytic activity?",
"Are there any restrictions on driving and operating mechanisms during Spitomin monotherapy?",
"Are there any restrictions on driving and operating mechanisms during combined therapy including Spitomin?",
"What diet restrictions should be told to a patient taking Spitomin?"
];

var gratHeaders = [
"Very well!",
"Excellent!",
"Great!",
"Perfect!",
"Wonderful!",
"Super!",
"You’re right on track!", 
"Well done!", 
"You’re a true master!", 
"We’re proud of you!", 
"Exactly!", 
"Bingo!", 
"Brilliant!",
"Amazing!",
"You’re an expert!"
]

var questionsABCText = [
[
"!Spitomon 10 mg tablet has a score mark and it may be divided (&frac12;  tablet = 5 mg)",
"Advice the patient to grind 10 mg tablet in a mortar and take a half of the powder thus produced",
"The 5 mg dose cannot be obtained because only 10 mg Spitomin tablets are commercially available"],
[
"!As treatment course only",
"Episodic administration only",
"Both episodic administration and treatment course"
],
[
"Intake of the maximum daily dose per course as determined by physician, bid or tid since the first day of therapy",
"!Dose should be titrated for each patient individually. The recommended initial daily dose is 15 mg (5 mg in the morning and 10 mg in the evening). It may be increased by 5 mg/day every two or three days. The usual daily dose is 20–30 mg"
],
[
"60 minutes since the start of treatment",
"!7–14 days since the start of treatment",
"60 hours since the start of treatment",

],
[
"1 month",
"2 months",
"!Not limited"
],
[
"For treatment of anxiety disorders only",
"!For treatment of anxiety disorders and as accessory therapy for depressive disorders",
"For treatment of depressive disorders only"
],
[
"Excessive sedation",
"Decreased psychomotor reactivity",
"!Spitomin is free from adverse effects on psychomotor functions",
"Excessive drowsiness"
],
[
"Tolerance",
"Drug dependency",
"Withdrawal syndrome",
"!Spitomin has no potential for addiction; it does not induce tolerance, drug dependency or withdrawal syndrome."
],
[
"!Regular prescription forms 107-1/U",
"Forms for potent medicines 148-1/U-88",
"Special prescription form for potent and psychotropic products (pink form)"
],
[
"Decreases the antidepressant activity of SSRIs",
"!Increases the antidepressant activity of SSRIs",
],
[
"!Decreases sexual disorders induced by SSRIs",
"Increases sexual disorders induced by SSRIs"
],
[
"Spitomin anxiolytic activity is weaker than that of benzodiazepines",
"!Spitomin anxiolytic activity is approximately equal to or greater than that of benzodiazepines"
],
[
"Driving is prohibited",
"!Driving and operating mechanisms are possible if the patient is fully confident in his/her psychomotor functions"
],
[
"Driving is prohibited",
"!Patient’s ability to drive and to operate mechanisms should be determined on individual basis"
],
[
"Do not consume tomatoes and tomato juice in large amounts",
"!Do not consume grapefruits and grapefruit juice in large amounts",
"Do not consume any fruits and vegetables (and their respective juices) in large amounts"
]
];

var currentQuestion = 1,
    errorQuestions = [],
    errorCorrectionMode = false,
    totalQuestions = 15;

function showHint() {
	timeLinePointer.$("Buzzer")[0].currentTime = 0;
	timeLinePointer.$("Buzzer")[0].play();
	timeLinePointer.getSymbol("Hint").stop((currentQuestion-1)*500);
	timeLinePointer.$("Hint").show();
}

function showCongratulation() {
	timeLinePointer.$("Applods")[0].currentTime = 0;
	timeLinePointer.$("Applods")[0].play();
	timeLinePointer.getSymbol("Grati").stop((currentQuestion-1)*500);
	timeLinePointer.getSymbol("Grati").$("header").html(gratHeaders[currentQuestion-1]);
	timeLinePointer.$("Grati").show();
}

function showDialog(pointer) {
	timeLinePointer.getSymbol("Dialog").stop(pointer);
	timeLinePointer.$("Dialog").show();
}

function validateAnswer(answer) {	
	if (answer == 'yes') {
		totalQuestions--;
		timeLinePointer.getSymbol("Peoples").play((15 - totalQuestions - 1)*1000+2000+1);
		showCongratulation();
	}
	else if (answer == 'no') {
    errorQuestions.push(currentQuestion);
		showHint();
	}
}

function nextQuestion() {
	timeLinePointer.$("Grati").hide();
	timeLinePointer.$("Hint").hide();
	
	if (errorCorrectionMode !== true) currentQuestion++;
	
	if (currentQuestion == 16 && errorQuestions.length > 0) {
    errorCorrectionMode = true;
    
    /* Game statistic */
    storage = $.localStorage;
    var usersTmp = storage.get('users_tmp');
    storage.set('users_tmp.stats.game_errors', errorQuestions);
	}
	
	if (totalQuestions > 0) {
    if (errorCorrectionMode === true) {
      currentQuestion = errorQuestions.shift();
      if (errorQuestions.length == 0) errorCorrectionMode = false;
    }
    
    timeLinePointer.stop(currentQuestion*500);
    nameQuestionsABC();
	}
	else endGame();
}

function endGame() {
	timeLinePointer.$("Applods")[0].currentTime = 0;
	timeLinePointer.$("Applods")[0].play();
	
	// Empty vars
	currentQuestion = 1;
	errorQuestions = [];
	errorCorrectionMode = false;
	totalQuestions = 15;
  
	// Save game result into storage
	storage = $.localStorage;
  storage.set('users_tmp.stats.game_end', $.now());
  storage.set('users_tmp.stats.game_end_tz_offset', (new Date()).getTimezoneOffset());
	var usersTmp = storage.get('users_tmp');
	
	if (storage.isSet('users')) {
		var users = storage.get('users'),
			 count = parseInt(users.count) + 1;

		storage.set('users.count', count);
		storage.set('users.items.' + count, usersTmp);
	}
	else {
		storage.set({'users':{
			'count':1,
			'items':{1:usersTmp}
		}});
	}
	
	storage.remove('users_tmp');
  
	timeLinePointer.stop("endGame");
}

function nameQuestionsABC() {
	var timelineName = timeLinePointer;

	// Set question info (заголовок вопроса, пациентов в очереди, правильных ответов)
	timelineName.$("curQuestionHead").html(questionsHeaders[currentQuestion-1]);
	timelineName.$("queueCounter").html("There are <b>" + totalQuestions + "</b> patients in the line");
	timelineName.$("totalGoodAnswrs").html("Give the right answers to reduce the line. Total number of right answers is <b>" + (15-totalQuestions) + " out of  15</b>");
	
	for (var i = 0; i < questionsABCText[currentQuestion-1].length; i++) {
		var curAnswerInList = timelineName.getSymbol("q1"+(i+1));
		var questionABCTitle = curAnswerInList.$("TitleABC");
		var questionABCText = curAnswerInList.$("QestionText");
		
		//проставка правильны ответов
		//спецфикс для 3го ответа
		timelineName.getSymbol("q_large").setVariable("title", "yes");
		
		if (questionsABCText[currentQuestion-1][i].charAt(0) == "!") {
			curAnswerInList.setVariable("title" , "yes");
			//тексты ответов
			questionABCText.html(questionsABCText[currentQuestion-1][i].substring(1));
		}
		else {
			curAnswerInList.setVariable("title" , "no");
			//тексты ответов
			questionABCText.html(questionsABCText[currentQuestion-1][i]);
		}
		//варианты АБС
		questionABCTitle.html((questionsABC.charAt(i)));
		
		//выравнивание по высоте ответа вопроса
		if (questionsABCText[currentQuestion-1][i].length < 68) {
      	questionABCText.css({"padding": "0.7em 0"});
		}
		else {
      	questionABCText.css({"padding": "0em 0"});
		}
	}
}

/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/

(function($, Edge, compId){


var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes

   //Edge symbol: 'stage'
   (function(symbolName) {
      
      Symbol.bindElementAction(compId, symbolName, "${Rectangle2}", "click", function(sym, e) {
         if (sym.$("check").is(":visible")) {
         	sym.$("check").hide();
         } else {
         	sym.$("RoundRect").removeClass('error');
         	sym.$("check").show();
         }
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "document", "compositionReady", function(sym, e) {
         //----------------------------!! ОНА ВИДНА В FullCode !! function nameQuestionsABC(timelineName)
         
         //AdobeEdge.Symbol.bindElementAction("EDGE-3961720", "Button_Start", "Rectangle", "click", function(sym, e) {    window.open("http://www.mysite.com", "_self"); });
         
         yepnope({
           load: ["css/style.css", "fonts/fonts.css"],
         });
         
         storage = $.localStorage;
         
         // Representative code check
         if (typeof representativeCode == "undefined") { // Type: APP
           if (storage.isSet('representativeCode') === false) {
            sym.getComposition().getStage().stop("verification");
           }
         }
         else { // Type: WEB
          if (storage.isSet('representativeCodeCurrent')) {
            if (storage.get('representativeCodeCurrent') != representativeCode && storage.isSet('users')) {
              storage.remove('users');
            }
            
            storage.remove('representativeCodeCurrent');
          }
          
          storage.set('representativeCodeCurrent', representativeCode);
         }
         
         
         Symbol.bindElementAction(compId, "Button_Verify", "Rectangle", "click", function(sym, e) {
         	if ($(".input-code").val() === '') {
         		$(".input-code").addClass('error');
         	}
         	else {
         		$(".input-code").removeClass('error');
         
         		storage = $.localStorage;
         		var representativeCode = $(".input-code").val();
         
               var xmlhttp = new XMLHttpRequest();
               var xmlhttpUrl = 'http://' + serverIp + '/api/submitall/' + representativeCode + '/';
         
               xmlhttp.open('POST', xmlhttpUrl, true);
               xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
         
               xmlhttp.onreadystatechange = function() {
                  if (this.readyState === 4) {
                     if (this.status === 200) {
         					if (this.responseText && $.trim(this.responseText)) {
         						var responseText = JSON.parse(this.responseText);
         						
         						if (responseText.success && responseText.success === true) {
         							storage.set('representativeCode', representativeCode);
         							sym.getComposition().getStage().stop("intro");
         						}
         						else showDialog("representativeCodeError");
         					}
         					else showDialog("representativeCodeError");
                     }
                     else showDialog("representativeCodeError");
                  }
               }
         
         		xmlhttp.send(JSON.stringify({}));
         	}
         
         });
         
         Symbol.bindElementAction(compId, "Button_Start", "Rectangle", "click", function(sym, e) {
         	// Goto question №1
         	sym.getComposition().getStage().stop("q1");
         });
         
         Symbol.bindElementAction(compId, "Button_Question_Start", "Rectangle", "click", function(sym, e) {
         	// Validation of the registration form
         	var error = false;
         
         	$(".input-reg").each(function(i, e){
         		if ($(this).val() === '') $(this).addClass('error');
         		else $(this).removeClass('error');
         	});
         
         	if ($(".input-reg.error").length > 0 
         		|| sym.getComposition().getStage().$("check").is(':hidden')
         	) { error = true; }
         	else { error = false; }
         
         	if (sym.getComposition().getStage().$("check").is(':hidden')) {
         		sym.getComposition().getStage().$("RoundRect").addClass('error');
         	}
         
         	if (error === false) {
         		// Save new user into storage
         		var new_user = {
         			'last_name':$('#user_last_name').val(),
         			'name':$('#user_name').val(),
         			'sername':$('#user_second_name').val(),
         			'lpu_name':$('#lpu_name').val(),
         			'lpu_num':$('#lpu_number').val(),
         			'city':$('#user_city').val(),
         			'stats': {
                        'game_start': $.now(),
                        'game_start_tz_offset': (new Date()).getTimezoneOffset()
                    },
         		};
         
         		storage = $.localStorage;
         		if (storage.isSet('users_tmp')) storage.remove('users_tmp');
         		storage.set('users_tmp', new_user);
         
         		// Goto question №1
         		sym.getComposition().getStage().stop("q1");
         	}
         });
         
         Symbol.bindElementAction(compId, "Button_Stop", "Rectangle", "click", function(sym, e) {
         	$(".input-reg").val('');
         
         	sym.getComposition().getStage().stop("intro");
         });
         
         Symbol.bindElementAction(compId, "Button_Intro_Start", "Rectangle", "click", function(sym, e) {
         	sym.getComposition().getStage().stop("register");
         });
         
         Symbol.bindElementAction(compId, "Button_Intro_Result", "Rectangle", "click", function(sym, e) {
         	storage = $.localStorage;
         	sym.getComposition().getStage().getSymbol("Table_Result").$("Table_Result_Items").empty();
         	sym.getComposition().getStage().getSymbol("Table_Result").$("Table_Result_Items").css({'padding':'10px', 'box-sizing':'border-box', '-webkit-box-sizing':'border-box', '-moz-box-sizing':'border-box'});
         	var tableItems = $('<table />').attr({'cellpadding':0, 'cellspacing':0, 'width':'100%', 'id':'table-result-items'});
         
         	// Если в таблице есть данные
         	if (storage.isSet('users')) {
            var users = storage.get('users');
         
            sym.getComposition().getStage().getSymbol("Button_Result_Submit").stop('normal');
         
         		$.each(users.items, function(i, item) {
         			var tableItemsTr = $('<tr />'),
         				 fio = item.last_name + ' ' + item.name + ' ' + item.sername,
         				 lpu = item.lpu_name + ' №' + item.lpu_num,
         				 city = item.city,
         				 //mail = '{{ mail }}', // old field
         				 //phone = '{{ phone }}', // old field
         				 tableItemsTdNum = $('<td />').addClass('num').html(i).appendTo(tableItemsTr),
         				 tableItemsTdFio = $('<td />').addClass('fio').html(fio).appendTo(tableItemsTr),
         				 tableItemsTdLpu = $('<td />').addClass('lpu').html(lpu).appendTo(tableItemsTr),
         				 tableItemsTdCity = $('<td />').addClass('city').html(city).appendTo(tableItemsTr);
         				 //tableItemsTdMail = $('<td />').addClass('mail').html(mail).appendTo(tableItemsTr),
         				 //tableItemsTdPhone = $('<td />').addClass('phone').html(phone).appendTo(tableItemsTr);
         
         			tableItemsTr.appendTo(tableItems);
         		});
         
         		sym.getComposition().getStage().getSymbol("Table_Result").$("Table_Result_Items").append(tableItems);
         	}
         	// Иначе: нет данных в таблице
         	else {
         		sym.getComposition().getStage().getSymbol("Button_Result_Submit").stop('disable');
         
         		// Add empty field to Table Result
         		var tableItemsTr = $('<tr />'),
         			 tableItemsTdEmpty = $('<td />').addClass('empty').html('Нет данных для отображения').appendTo(tableItemsTr);
         
         		tableItemsTr.appendTo(tableItems);
         		sym.getComposition().getStage().getSymbol("Table_Result").$("Table_Result_Items").append(tableItems);
         	}
         
         	sym.getComposition().getStage().stop("result");
         });
         
         Symbol.bindElementAction(compId, "Button_Result_Prev", "Rectangle", "click", function(sym, e) {
         	sym.getComposition().getStage().stop("intro");
         });
         
         Symbol.bindElementAction(compId, "Button_Result_Submit", "Rectangle", "click", function(sym, e) {
         	// Если в таблице есть данные
         	if (storage.isSet('users')) {
         		var users = storage.get('users'),
         			 representativeCode = storage.get('representativeCode'),
         			 xmlhttp = new XMLHttpRequest(),
         			 xmlhttpUrl = 'http://' + serverIp + '/api/submitall/' + representativeCode + '/';
         
               xmlhttp.open('POST', xmlhttpUrl);
               xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
         
               xmlhttp.onreadystatechange = function() {
                  if (this.readyState === 4) {
                     if (this.status === 200) {
         					if (this.responseText && $.trim(this.responseText)) {
         						var responseText = JSON.parse(this.responseText);
         
         						if (responseText.success && responseText.success === true) {
         							showDialog("tableResultSubmitSuccessful");
         							sym.getComposition().getStage().getSymbol("Button_Result_Submit").stop('disable');
         							sym.getComposition().getStage().getSymbol("Table_Result").$("Table_Result_Items").empty();
         							// Add empty field to Table Result
         							var tableItems = $('<table />').attr({'cellpadding':0, 'cellspacing':0, 'width':'100%', 'id':'table-result-items'}),
         								 tableItemsTr = $('<tr />'),
         								 tableItemsTdEmpty = $('<td />').addClass('empty').html('Нет данных для отображения').appendTo(tableItemsTr);
         
         							tableItemsTr.appendTo(tableItems);
         							sym.getComposition().getStage().getSymbol("Table_Result").$("Table_Result_Items").css({'padding':'10px', 'box-sizing':'border-box', '-webkit-box-sizing':'border-box', '-moz-box-sizing':'border-box'});
         							sym.getComposition().getStage().getSymbol("Table_Result").$("Table_Result_Items").append(tableItems);
         
         							storage.remove('users');
         						}
         						else showDialog("tableResultSubmitFailure");
         					}
         					else showDialog("tableResultSubmitFailure");
                     }
                     else showDialog("tableResultSubmitFailure");
                  }
               }
         
               xmlhttp.send(JSON.stringify(users));
            }
         });
         
         var user_last_name = sym.$("last_name");
         user_last_name.html("Last name*</br>");
         inputText = $('<input />').attr({'type':'text', 'value':'', 'class':'input-reg', 'id':'user_last_name'});
         inputText .css ('font-family', 'open-sans-condensed, sans-serif');
         inputText .css ('font-size', 21);
         inputText .css ('color', '#005098');
         inputText .css ('width', 180);
         inputText .css ('padding',6);
         inputText .css('border' , '2px solid #e2e2e2');
         inputText .css('box-shadow', 'inset 1px 1px 4px 0 #878787');
         inputText .css('-moz-border-radius', 6); /* Firefox */
         inputText .css('-webkit-border-radius', 6); /* Safari, Chrome */
         inputText .css('-khtml-border-radius', 6); /* KHTML */
         inputText .css('border-radius', 6); /* CSS3 */
         inputText .appendTo(user_last_name);
         
         var user_name = sym.$("user_name");
         user_name.html("First name*</br>");
         inputText = $('<input />').attr({'type':'text', 'value':'', 'class':'input-reg', 'id':'user_name'});
         inputText .css ('font-family', 'open-sans-condensed, sans-serif');
         inputText .css ('font-size', 21);
         inputText .css ('color', '#005098');
         inputText .css ('width', 180);
         inputText .css ('padding',6);
         inputText .css('border' , '2px solid #e2e2e2');
         inputText .css('box-shadow', 'inset 1px 1px 4px 0 #878787');
         inputText .css('-moz-border-radius', 6); /* Firefox */
         inputText .css('-webkit-border-radius', 6); /* Safari, Chrome */
         inputText .css('-khtml-border-radius', 6); /* KHTML */
         inputText .css('border-radius', 6); /* CSS3 */
         inputText .appendTo(user_name);
         
         
         var user_second_name = sym.$("sername");
         user_second_name.html("Patronymic name*</br>");
         inputText = $('<input />').attr({'type':'text', 'value':'', 'class':'input-reg', 'id':'user_second_name'});
         inputText .css ('font-family', 'open-sans-condensed, sans-serif');
         inputText .css ('font-size', 21);
         inputText .css ('color', '#005098');
         inputText .css ('width', 180);
         inputText .css ('padding',6);
         inputText .css('border' , '2px solid #e2e2e2');
         inputText .css('box-shadow', 'inset 1px 1px 4px 0 #878787');
         inputText .css('-moz-border-radius', 6); /* Firefox */
         inputText .css('-webkit-border-radius', 6); /* Safari, Chrome */
         inputText .css('-khtml-border-radius', 6); /* KHTML */
         inputText .css('border-radius', 6); /* CSS3 */
         inputText .appendTo(user_second_name);
         
         
         var lpu_name = sym.$("lpu_name");
         lpu_name.html("MPI name*</br>");
         inputText = $('<input />').attr({'type':'text', 'value':'', 'class':'input-reg', 'id':'lpu_name'});
         inputText .css ('font-family', 'open-sans-condensed, sans-serif');
         inputText .css ('font-size', 21);
         inputText .css ('color', '#005098');
         inputText .css ('width', 180);
         inputText .css ('padding',6);
         inputText .css('border' , '2px solid #e2e2e2');
         inputText .css('box-shadow', 'inset 1px 1px 4px 0 #878787');
         inputText .css('-moz-border-radius', 6); /* Firefox */
         inputText .css('-webkit-border-radius', 6); /* Safari, Chrome */
         inputText .css('-khtml-border-radius', 6); /* KHTML */
         inputText .css('border-radius', 6); /* CSS3 */
         inputText .appendTo(lpu_name);
         
         
         var lpu_number = sym.$("lpu_number");
         lpu_number.html("MPI number*</br>");
         inputText = $('<input />').attr({'type':'tel', 'value':'', 'class':'input-reg', 'id':'lpu_number'});
         inputText .css ('font-family', 'open-sans-condensed, sans-serif');
         inputText .css ('font-size', 21);
         inputText .css ('color', '#005098');
         inputText .css ('width', 80);
         inputText .css ('padding',6);
         inputText .css('border' , '2px solid #e2e2e2');
         inputText .css('box-shadow', 'inset 1px 1px 4px 0 #878787');
         inputText .css('-moz-border-radius', 6); /* Firefox */
         inputText .css('-webkit-border-radius', 6); /* Safari, Chrome */
         inputText .css('-khtml-border-radius', 6); /* KHTML */
         inputText .css('border-radius', 6); /* CSS3 */
         inputText .appendTo(lpu_number);
         
         
         
         var user_city = sym.$("user_city");
         user_city.html("City / settlement*</br>");
         inputText = $('<input />').attr({'type':'text', 'value':'', 'class':'input-reg', 'id':'user_city'});
         inputText .css ('font-family', 'open-sans-condensed, sans-serif');
         inputText .css ('font-size', 21);
         inputText .css ('color', '#005098');
         inputText .css ('width', 380);
         inputText .css ('padding',6);
         inputText .css('border' , '2px solid #e2e2e2');
         inputText .css('box-shadow', 'inset 1px 1px 4px 0 #878787');
         inputText .css('-moz-border-radius', 6); /* Firefox */
         inputText .css('-webkit-border-radius', 6); /* Safari, Chrome */
         inputText .css('-khtml-border-radius', 6); /* KHTML */
         inputText .css('border-radius', 6); /* CSS3 */
         inputText .appendTo(user_city);
         
         
         var verify_code = sym.$("verify_text");
         //sym.getComposition().getStage().$("verify_text");
         inputCode = $('<input />').attr({'type':'text', 'value':'', 'placeholder':'Enter ID', 'class':'input-code', 'id':'verify_code'});
         inputCode .css ('font-family', 'open-sans-condensed, sans-serif');
         inputCode .css ('font-size', 21);
         inputCode .css ('text-align', 'center');
         inputCode .css ('color', '#005098');
         inputCode .css ('width', '200px');
         inputCode .css ('margin', '20px auto 0');
         inputCode .css ('padding','6px');
         inputCode .css('border' , '2px solid #e2e2e2');
         inputCode .css('box-shadow', 'inset 1px 1px 4px 0 #878787');
         inputCode .css('-moz-border-radius', 6); /* Firefox */
         inputCode .css('-webkit-border-radius', 6); /* Safari, Chrome */
         inputCode .css('-khtml-border-radius', 6); /* KHTML */
         inputCode .css('border-radius', 6); /* CSS3 */
         inputCode .appendTo(verify_code);
         
         
         sym.$("Law_Text").html("I confirm that I am a medical or pharmaceutical worker and I give voluntary consent to the collection of my personal data, in accordance with the requirement of <span><a href='http://www.consultant.ru/popular/o-personalnyh-dannyh/250_2.html#p93' class='law-article-link' target='_blank'>paragraph 1, Article 6 of Federal Law dated July 27, 2006 No.152-FZ</a></span>");
         
         $('.law-article-link').on('click', function(e){
         	e.preventDefault();
         	showDialog('lawArticle');
         });
         
         $('.input-reg').on('change keyup', function(e) {
         	if ($(this).val() === '') $(this).addClass('error');
         	else $(this).removeClass('error');
         });
         
         $('.input-code').on('change keyup', function(e) {
         	if ($(this).val() === '') $(this).addClass('error');
         	else $(this).removeClass('error');
         });
         
         $(document).on("online", function(){ alert("You're online / on") });
         $(document).on("offline", function(){ alert("You're offline / on") });
         document.addEventListener("online", function(){ alert("You're online") }, false);
         document.addEventListener("offline", function(){ alert("You're offline") }, false);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
         timeLinePointer = sym;
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 500, function(sym, e) {
         nameQuestionsABC();

      });
      //Edge binding end

      

      

      

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         timeLinePointer = sym;
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 10000, function(sym, e) {
         timeLinePointer = sym;
         sym.stop();

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

   //=========================================================
   
   //Edge symbol: 'anim_for_button_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 5958, function(sym, e) {
         // insert code here
         // Play the timeline at a label or specific time. For example:
         // sym.play(500); or sym.play("myLabel");
         sym.play(0);

      });
      //Edge binding end

   })("anim_for_button_symbol_1");
   //Edge symbol end:'anim_for_button_symbol_1'

   //=========================================================
   
   //Edge symbol: 'Button_Start'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseover", function(sym, e) {
         // insert code to be run when the mouse hovers over the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseout", function(sym, e) {
         // insert code to be run when the mouse is moved off the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop(0);
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         // insert code to be run when the mouse button is down
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("down");
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         // insert code to be run when the mouse button is released
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
      //Edge binding end

   })("Button_Start");
   //Edge symbol end:'Button_Start'

   //=========================================================
   
   //Edge symbol: 'Button_Start_2'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseover", function(sym, e) {
         // insert code to be run when the mouse hovers over the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseout", function(sym, e) {
         // insert code to be run when the mouse is moved off the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop(0);
         

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         // insert code to be run when the mouse button is down
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("down");
         

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         // insert code to be run when the mouse button is released
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "click", function(sym, e) {
         // insert code for mouse click here
         nextQuestion();

      });
      //Edge binding end

      })("Button_Continue");
   //Edge symbol end:'Button_Continue'

   //=========================================================
   
   //Edge symbol: 'Symbol_3'
   (function(symbolName) {   
   
      Symbol.bindElementAction(compId, symbolName, "${Rectangle3}", "click", function(sym, e) {
         validateAnswer(sym.getVariable("title"));

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
      });
      //Edge binding end

      

      })("Answer_Template_Small");
   //Edge symbol end:'Answer_Template_Small'

   //=========================================================
   
   //Edge symbol: 'Button_Start_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseover", function(sym, e) {
         // insert code to be run when the mouse hovers over the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseout", function(sym, e) {
         // insert code to be run when the mouse is moved off the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop(0);
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         // insert code to be run when the mouse button is down
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("down");
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         // insert code to be run when the mouse button is released
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
            //Edge binding end

         })("Button_Start_1");
   //Edge symbol end:'Button_Start_1'

   //=========================================================
   
   //Edge symbol: 'Hint1'
   (function(symbolName) {   
   
   })("Hint1_1");
   //Edge symbol end:'Hint1_1'

   //=========================================================
   
   //Edge symbol: 'anim_hint_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 5750, function(sym, e) {
         
         // Play the timeline at a label or specific time. For example:
         // sym.play(500); or sym.play("myLabel");
         sym.play(0);
         

      });
      //Edge binding end

   })("anim_hint_symbol_1");
   //Edge symbol end:'anim_hint_symbol_1'

   //=========================================================
   
   //Edge symbol: 'Answer_Template_Small_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle3}", "click", function(sym, e) {
         
         validateAnswer(sym.getVariable("title"));

      });
         //Edge binding end

         })("Answer_Template_Large");
   //Edge symbol end:'Answer_Template_Large'

   //=========================================================
   
   //Edge symbol: 'Hint1_1'
   (function(symbolName) {   
   
      })("Hint1_2");
   //Edge symbol end:'Hint1_2'

   //=========================================================
   
   //Edge symbol: 'Hint1_2'
   (function(symbolName) {   
   
      })("Hint1_3");
   //Edge symbol end:'Hint1_3'

   //=========================================================
   
   //Edge symbol: 'Hint1_3'
   (function(symbolName) {   
   
      })("Hint1_4");
   //Edge symbol end:'Hint1_4'

   //=========================================================
   
   //Edge symbol: 'Hint1_5'
   (function(symbolName) {   
   
      })("Hint1_5");
   //Edge symbol end:'Hint1_5'

   //=========================================================
   
   //Edge symbol: 'Hint1_6'
   (function(symbolName) {   
   
      })("Hint1_6");
   //Edge symbol end:'Hint1_6'

   //=========================================================
   
   //Edge symbol: 'Hint1_7'
   (function(symbolName) {   
   
      })("Hint1_7");
   //Edge symbol end:'Hint1_7'

   //=========================================================
   
   //Edge symbol: 'Hint1_8'
   (function(symbolName) {   
   
      })("Hint1_8");
   //Edge symbol end:'Hint1_8'

   //=========================================================
   
   //Edge symbol: 'Hint1_9'
   (function(symbolName) {   
   
      })("Hint1_9");
   //Edge symbol end:'Hint1_9'

   //=========================================================
   
   //Edge symbol: 'Hint1_10'
   (function(symbolName) {   
   
      })("Hint1_10");
   //Edge symbol end:'Hint1_10'

   //=========================================================
   
   //Edge symbol: 'Hint1_11'
   (function(symbolName) {   
   
      })("Hint1_11");
   //Edge symbol end:'Hint1_11'

   //=========================================================
   
   //Edge symbol: 'Hint1_12'
   (function(symbolName) {   
   
      })("Hint1_12");
   //Edge symbol end:'Hint1_12'

   //=========================================================
   
   //Edge symbol: 'Hint1_13'
   (function(symbolName) {   
   
      })("Hint1_13");
   //Edge symbol end:'Hint1_13'

   //=========================================================
   
   //Edge symbol: 'Hint1_14'
   (function(symbolName) {   
   
      })("Hint1_14");
   //Edge symbol end:'Hint1_14'

   //=========================================================
   
   //Edge symbol: 'Hint1_15'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         //console.log(sym.$("Text4"))
         //sym.$("Text4").html("Инструкция по медицинскому применению не запрещает употреблять любые овощи и фрукты, а также соки из них при приеме Спитомина, но ограничивает употребление в <i>значительных</i> количествах грейпфрутов и грейпфрутового сока.")

      });
      //Edge binding end

      })("Hint1_15");
   //Edge symbol end:'Hint1_15'

   //=========================================================
   
   //Edge symbol: 'Hint'
   (function(symbolName) {   
   
   })("Hint");
   //Edge symbol end:'Hint'

   //=========================================================
   
   //Edge symbol: 'Hint1_16'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 7000, function(sym, e) {
         //sym.$("Text15").html("Инструкция по медицинскому применению не запрещает употреблять любые овощи и фрукты, а также соки из них при приеме Спитомина, но ограничивает употребление в <i>значительных</i> количествах грейпфрутов и грейпфрутового сока.")

      });
      //Edge binding end

      })("Grati");
   //Edge symbol end:'Grati'

   //=========================================================
   
   //Edge symbol: 'anim_congratulation_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 3000, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("anim_congratulation_symbol_1");
   //Edge symbol end:'anim_congratulation_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl1_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2666, function(sym, e) {
         // insert code here
         // Play the timeline at a label or specific time. For example:
         // sym.play(500); or sym.play("myLabel");
         sym.play(0);

      });
      //Edge binding end

   })("pepl1_symbol_1");
   //Edge symbol end:'pepl1_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl2_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1466, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("pepl2_symbol_1");
   //Edge symbol end:'pepl2_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl3_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1800, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("pepl3_symbol_1");
   //Edge symbol end:'pepl3_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl4_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2966, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("pepl4_symbol_1");
   //Edge symbol end:'pepl4_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl5_symbol_1'
   (function(symbolName) {   
   
   })("pepl5_symbol_1");
   //Edge symbol end:'pepl5_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl6_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1933, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("pepl6_symbol_1");
   //Edge symbol end:'pepl6_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl7_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1600, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("pepl7_symbol_1");
   //Edge symbol end:'pepl7_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl8_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2466, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("pepl8_symbol_1");
   //Edge symbol end:'pepl8_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pepl9_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1466, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("pepl9_symbol_1");
   //Edge symbol end:'pepl9_symbol_1'

   //=========================================================
   
   //Edge symbol: 'Peoples'
   (function(symbolName) {   
      
      
      
      
      
      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 5000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 6000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 7000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 8000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 9000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 10000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 11000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 12000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 13000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 14000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 15000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 16000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 17000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 3000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 4000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

   })("Peoples");
   //Edge symbol end:'Peoples'

   //=========================================================
   
   //Edge symbol: 'Symbol_1'
   (function(symbolName) {   
   
   })("Symbol_1");
   //Edge symbol end:'Symbol_1'

   //=========================================================
   
   //Edge symbol: 'Button_Start_2'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
               //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseover", function(sym, e) {
         // insert code to be run when the mouse hovers over the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
               //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseout", function(sym, e) {
         // insert code to be run when the mouse is moved off the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop(0);
         

      });
               //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         // insert code to be run when the mouse button is down
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("down");
         

      });
               //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         // insert code to be run when the mouse button is released
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
               //Edge binding end

            })("Button_Stop");
   //Edge symbol end:'Button_Stop'

   //=========================================================
   
   //Edge symbol: 'Table_Result'
   (function(symbolName) {   
   
   })("Table_Result");
   //Edge symbol end:'Table_Result'

   //=========================================================
   
   //Edge symbol: 'Button_Result_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
               //Edge binding end

      

      

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         sym.stop("down");
         

      });
               //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         sym.stop("normal");
         

      });
               //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 3000, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

            })("Button_Result_Submit_old");
   //Edge symbol end:'Button_Result_Submit_old'

   //=========================================================
   
   //Edge symbol: 'Button_Result_Submit_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
               //Edge binding end

      

      

      

      

            })("Button_Result_Prev");
   //Edge symbol end:'Button_Result_Prev'

   //=========================================================
   
   //Edge symbol: 'Button_Result_Submit_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseover", function(sym, e) {
         // insert code to be run when the mouse hovers over the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseout", function(sym, e) {
         // insert code to be run when the mouse is moved off the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop(0);
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         // insert code to be run when the mouse button is down
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("down");
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         // insert code to be run when the mouse button is released
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
                  //Edge binding end

               })("Button_Intro_Result");
   //Edge symbol end:'Button_Intro_Result'

   //=========================================================
   
   //Edge symbol: 'Button_Result_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseover", function(sym, e) {
         // insert code to be run when the mouse hovers over the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseout", function(sym, e) {
         // insert code to be run when the mouse is moved off the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop(0);
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         // insert code to be run when the mouse button is down
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("down");
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         // insert code to be run when the mouse button is released
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
                  //Edge binding end

               })("Button_Intro_Start");
   //Edge symbol end:'Button_Intro_Start'

   //=========================================================
   
   //Edge symbol: 'Grati_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2000, function(sym, e) {
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1000, function(sym, e) {
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 3000, function(sym, e) {
         sym.stop();

      });
      //Edge binding end

         })("Dialog");
   //Edge symbol end:'Dialog'

   //=========================================================
   
   //Edge symbol: 'Button_Continue_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseover", function(sym, e) {
         // insert code to be run when the mouse hovers over the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseout", function(sym, e) {
         // insert code to be run when the mouse is moved off the object
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop(0);
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         // insert code to be run when the mouse button is down
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("down");
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         // insert code to be run when the mouse button is released
         // Go to a label or specific time and stop. For example:
         // sym.stop(500); or sym.stop("myLabel");
         sym.stop("over");
         

      });
            //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "click", function(sym, e) {
         // insert code for mouse click here
         timeLinePointer.$("Dialog").hide();

      });
         //Edge binding end

         })("Button_Dialog_Ok");
   //Edge symbol end:'Button_Dialog_Ok'

   //=========================================================
   
   //Edge symbol: 'Table_Result_1'
   (function(symbolName) {   
   
      })("Table_Result_old");
   //Edge symbol end:'Table_Result_old'

   //=========================================================
   
   //Edge symbol: 'Button_Intro_Start_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
                     //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         sym.stop('down');

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         sym.stop('normal');

      });
      //Edge binding end

                  })("Button_Question_Start");
   //Edge symbol end:'Button_Question_Start'

   //=========================================================
   
   //Edge symbol: 'Button_Result_Submit_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
                  //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 3000, function(sym, e) {
         // insert code here
         sym.stop();

      });
         //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mousedown", function(sym, e) {
         sym.stop("down");
         

      });
                  //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${Rectangle}", "mouseup", function(sym, e) {
         sym.stop("normal");
         

      });
                  //Edge binding end

               })("Button_Result_Submit_1");
   //Edge symbol end:'Button_Result_Submit_1'

   //=========================================================
   
   //Edge symbol: 'Button_Question_Start_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
                     //Edge binding end

      

      

                  })("Button_Result_Submit");
   //Edge symbol end:'Button_Result_Submit'

   //=========================================================
   
   //Edge symbol: 'Button_Result_Prev_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();
         

      });
                  //Edge binding end

               })("Button_Verify");
   //Edge symbol end:'Button_Verify'

})(window.jQuery || AdobeEdge.$, AdobeEdge, "EDGE-3961720");