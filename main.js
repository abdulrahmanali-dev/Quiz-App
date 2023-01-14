// get Elements
let countSpan = document.querySelector(".quiz-info .count span");
let quizArae = document.querySelector(".quiz-area");
let answersArae = document.querySelector(".answers-area");
let catagorySpan = document.querySelector(".catagory span");
let mySpansContainer = document.querySelector(".bullets .spans ");
let qusetionTitle = document.querySelector(".quiz-area h2");
let submitButton = document.querySelector(".submit-answer");
let answer_1 = document.querySelector(".answer-1 label");
let answer_2 = document.querySelector(".answer-2 label");
let answer_3 = document.querySelector(".answer-3 label");
let answer_4 = document.querySelector(".answer-4 label");
let allTheAnswers = document.getElementsByName("questions");
let allTheAnswersLabel = document.getElementsByName("answers");
let resultsContainer = document.querySelector(".results ");
let countDownTimer = document.querySelector(".count-down");

// Set Obtions
let currentIndex = 0;
let rightAnswers = 0;
let interval;

// function to get questions form json objects
function getQustions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
      // Get the questions json file and turn it into object
      let questionsObject = JSON.parse(this.responseText);

      // Get the Count of The Questions
      let qCount = questionsObject.length;

      // Create Bullets(spans) then set question count
      createBullts(qCount);

      //get quesiton data
      getQData(questionsObject[currentIndex], qCount);

      // count Down Timer
      countDown(15, qCount);

      submitButton.onclick = () => {
        //get the right answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        //increes Index
        currentIndex++;

        // check if the answer is right or wrong
        checkAnswer(theRightAnswer, qCount);

        //get the data and jump to the next question when clicking
        getQData(questionsObject[currentIndex], qCount);

        // handle bullets
        handeBullets();

        // reset count down timer when click
        clearInterval(countDownInterval);
        countDown(15, qCount);

        // Show result
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "/html-questions.json", true);
  myRequest.send();
}

getQustions();

// i need to creat the bullets dynamic to the number of questions i have in my json object

function createBullts(num) {
  //get the count of the questions
  countSpan.innerHTML = num;
  //create bullets
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    // if its the first bullet
    if (i === currentIndex) {
      theBullet.className = "on";
    }

    mySpansContainer.appendChild(theBullet);
  }
}
function getQData(obj, count) {
  if (currentIndex < count) {
    //get the question title
    qusetionTitle.innerHTML = obj.title;

    //loop on them to get the answers
    for (j = 0; j < 4; j++) {
      allTheAnswersLabel[j].innerHTML = obj[`answer_${j + 1}`];
      allTheAnswers[j].dataset.answer = obj[`answer_${j + 1}`];
    }
  }
}

function checkAnswer(aAnswer, count) {
  //get all the answers
  let TheChosenAnswer;

  //loop on all the answers
  //to mnow whitch answer is the right answer
  for (let i = 0; i < allTheAnswers.length; i++) {
    if (allTheAnswers[i].checked) {
      TheChosenAnswer = allTheAnswers[i].dataset.answer;
    }
  }

  if (TheChosenAnswer === aAnswer) {
    let gettheBullet = document.querySelectorAll(".bullets .spans span");
    rightAnswers++;
    // gettheBullet[currentIndex].className = "right";
    console.log(currentIndex);
    console.log("good jop");
  }
}

function handeBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  console.log(arrayOfSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArae.remove();
    answersArae.remove();
    submitButton.remove();
    mySpansContainer.remove();
    resultsContainer.style = "padding:200px;";
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Amaizing</span><p><p> You Answerd ${rightAnswers} of ${count}</p>`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span><p> You Answerd ${rightAnswers} of ${count}</p>`;
    } else {
      theResults = `<span class="bad">Not Bad!</span><p> You Answerd ${rightAnswers} of ${count}, You Can Do Better</p>`;
    }
    resultsContainer.innerHTML = theResults;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    countDownInterval = setInterval(function () {
      // create minuts and seconds
      let minuts = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);
      minuts = minuts < 10 ? `0${minuts}` : minuts;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownTimer.innerHTML = `${minuts}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
