//global variables
var getUsername, getCategory, getCategoryValue, getResponceCode, intervalTimer;
var getScore = 0;
var attemptQues = 0;
var backQues = document.getElementById('backQues');
var nextQues = document.getElementById('nextQues');
var submitQues = document.getElementById('submitQues');
var gotoHome = document.getElementById('gotoHome');
var startAgain = document.getElementById('startAgain');

//Enter Username
document.getElementById('enterBtn').addEventListener('click', function(){
    getUsername = document.getElementById('username').value;
    if(getUsername == ""){
        document.getElementById('username').classList.add('form-error');
    }else{
        document.getElementById('username').classList.remove('form-error');
        document.querySelector('.selectCategory-wrapper').style.display = "block"
    }
});

//Suffling Questions Functionality
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

//Total timer
var actualTime = 220;
var timeSec = 221;
function totalTime(){
    document.getElementById('taskTime').innerHTML = timeSec - 1;
    timeSec--;
    if(timeSec == 0){
        alert('times up');
        //show hide steps
        document.querySelector('.second-step').style.display = "none";
        document.querySelector('.third-step').style.display = "block";
    }
}


// CLICK ON CATEGORY
var category = document.querySelectorAll('.selectCategory-wrapper ul li');
category.forEach(function(element){

    element.addEventListener('click', function(e){

        element.classList.add('active');
        element.style.pointerEvents = "none";
        //get category
        getCategory = element.innerHTML;
        document.getElementById('selectCat').innerHTML = getCategory;
        getCategoryValue = element.getAttribute("value");
        //console.log(getCategoryValue);
        
        let fetchRes =  fetch(`https://opentdb.com/api.php?amount=10&category=${getCategoryValue}&difficulty=medium&type=multiple`);

        fetchRes.then(res => 
        res.json()).then( response =>{

            //console.log(response.results);
            let totalResults = response.results;
            var itemHtml;
            var questionWrap = [];
            totalResults.map((item, key) => {
                //console.log(item);
                //console.log(item.correct_answer);
                var correctAns = `<li class="rightAns">${item.correct_answer}</li>`;
                var optionList = [];
                var optionRandom;
                item.incorrect_answers.forEach(function(element){
                    option = `<li class="wrongAns">${element}</li>`;
                    optionList.push(option);
                });
                optionList.push(correctAns);
                optionRandom = shuffle(optionList);
                
                
                itemHtml = `${(key == 0) ? '<div class="question-wrap active">' : '<div class="question-wrap">'}<div class="question-box"><div class="totalQuestionCurrent"><span class="currentQuesNo">${key + 1}</span>/10</div><h3 class="currentQues">${item.question}</h3></div><div class="quesOptions"><ul class="questionList">${optionRandom[0]}${optionRandom[1]}${optionRandom[2]}${optionRandom[3]}</ul></div></div>`;
                questionWrap.push(itemHtml);
            });

            //console.log(questionWrap);
            questionWrap.forEach(function(element){
                document.getElementById('question-wrapper').insertAdjacentHTML('beforeend', element)
            });

            //show hide steps
            document.querySelector('.first-step').style.display = "none";
            document.querySelector('.second-step').style.display = "block";

            // Answer select
            var answerBox = document.querySelectorAll('.questionList');
            console.log(answerBox);
            answerBox.forEach(function(element){
                var getChildElem = element.childNodes;
                getChildElem.forEach(function(element){
                    element.addEventListener("click", function(e){
                        attemptQues++;
                        if (element.classList == "rightAns") {
                            element.classList.add('active');
                            getScore++;
                            document.getElementById('score').innerHTML = getScore;
                            document.getElementById('correct').innerHTML = getScore;
                        }else{
                            element.classList.add('active');
                        }
                        var siblings = element.parentElement.childNodes;
                        siblings.forEach(function(element){
                            element.style.pointerEvents = "none";
                            if (element.classList == "rightAns") {
                                element.classList.add('active');
                            }
                        });
                    });
                    
                });
                
            });
            
        }).catch((err) => {
            console.log(err);
        });

        intervalTimer = setInterval(function(){
            totalTime();
        }, 1000);

    });

});


//nextQuestion function
var indexitem = 0;
nextQues.addEventListener("click", function(){
    var questionBox = document.querySelectorAll('.question-wrap');
    questionBox.forEach((elem, key) => {
        elem.classList.remove('active');
    });
    questionBox[indexitem + 1].classList.add('active');
    indexitem++;
    backQues.style.display = "block";
    if (questionBox[9].classList == "question-wrap active") {
        submitQues.style.display = "block";
        nextQues.style.display = "none";
    }
});


// Previous Question button
backQues.addEventListener("click", function(){

    var questionBox = document.querySelectorAll('.question-wrap');
    questionBox.forEach((elem, key) => {
        elem.classList.remove('active');
    });
    questionBox[indexitem - 1].classList.add('active');
    indexitem--;
    submitQues.style.display = "none";
    nextQues.style.display = "block";

    if (questionBox[0].classList == "question-wrap active") {
        backQues.style.display = "none";
    }

});

//Submit Questoin Functionality
submitQues.addEventListener("click", function(){

    indexitem = 0;
    clearInterval(intervalTimer);
    console.log(actualTime - timeSec);
    
    //Third step show and second hide
    document.querySelector('.second-step').style.display = "none";
    document.querySelector('.third-step').style.display = "block";

    //Final Score
    document.getElementById('userName').innerHTML = getUsername;
    document.getElementById('totalTime').innerHTML = actualTime - timeSec;
    document.getElementById('attempt').innerHTML = attemptQues;
    document.getElementById('wrong').innerHTML = attemptQues - getScore;
    document.getElementById('percentage').innerHTML = ((getScore/10) * 100) + "%";

    //Buttons hide show
    backQues.style.display = "none";
    submitQues.style.display = "none";
    nextQues.style.display = "block";

});

// Go to home Functionality
gotoHome.addEventListener("click", function(){
    location.reload();
});

// Start Again Functionality
startAgain.addEventListener("click", function(){
    
    clearInterval(intervalTimer);
    getScore = 0;
    attemptQues = 0;
    document.getElementById('score').innerHTML = getScore;

    //Second step show and third hide
    document.querySelector('.second-step').style.display = "block";
    document.querySelector('.third-step').style.display = "none";

    //Restart Quiz timing
    timeSec = 221;
    intervalTimer = setInterval(function(){
        totalTime();
    }, 1000);

    //Rearrange Answers Options
    var answerBox = document.querySelectorAll('.questionList');
    console.log(answerBox);
    answerBox.forEach(function(element){
        var getChildElem = element.childNodes;
        getChildElem.forEach(function(element){
            element.classList.remove('active');
            element.style.pointerEvents = 'auto';
        });
    });

    //Rearrange Questions
    var questionBox = document.querySelectorAll('.question-wrap');
    console.log(questionBox);
    questionBox.forEach(function(elem){
        elem.classList.remove("active");
    });
    questionBox[0].classList.add("active");

});