function showQuiz() {
  isFirstButtonClicked = false;
  quiz.questionIndex = 0;
  quiz.score = 0;

  document.getElementById("quiz").classList.add("active");
  document.querySelector(".intro").classList.add("active");
  document.querySelector(".chatbox").classList.remove("active");
  document.getElementById("info_page").classList.remove("active");
  document.getElementById("chat-input").style.display = "none";
  document.getElementById("our-school-container").style.display = "none";
  resetQuiz();
  hidePages();
}

var scoreDisplay = document.getElementById("score");

function populate() {
  if (quiz.isEnded()) {
    showScores();
  } else {
    var questionElement = document.getElementById("question");
    var choices = quiz.getQuestionIndex().choices;

    questionElement.innerHTML = quiz.getQuestionIndex().text;

    for (var i = 0; i < choices.length; i++) {
      var choiceElement = document.getElementById("choice" + i);
      choiceElement.innerHTML = choices[i];
      guess("btn" + i, choices[i]);
    }

    updateProgressBar();

    if (quiz.questionIndex === 0) {
      document.querySelector(".leftq h1").style.display = "block";
      document.querySelector(".leftq h1").nextElementSibling.style.display =
        "block";
    } else {
      document.querySelector(".leftq h1").style.display = "none";
      document.querySelector(".leftq h1").nextElementSibling.style.display =
        "none";
    }
  }
}

var lastBonusClickTime = 0;
const BONUS_COOLDOWN = 30000;

function showScores() {
  var scoreContainer = document.getElementById("score-container");
  scoreContainer.style.display = "block";
  
  var scoreDisplay = document.getElementById("score");
  scoreDisplay.textContent = quiz.score;

  var tryAgainButton = document.getElementById("try-again");
  tryAgainButton.style.display = "block";
  if (quiz.score > 1) {
    var bonusButton = document.getElementById("bonus-button");
    bonusButton.style.display = "block";
    bonusButton.addEventListener("click", handleBonusClick);
  }

  document.getElementById("question").style.display = "none";
  document.querySelector(".rightq").style.display = "none";
  document.querySelector(".progress-container").style.display = "none";
  document.querySelector(".leftq h1").style.display = "none";

  resetBarcketPosition();
}


function resetQuiz() {
  quiz.score = 0;
  quiz.questionIndex = 0;

  var scoreContainer = document.getElementById("score-container");
  scoreContainer.style.display = "none";
  var tryAgainButton = document.getElementById("try-again");
  tryAgainButton.style.display = "none";
  var bonusButton = document.getElementById("bonus-button");
  bonusButton.style.display = "none";
  document.querySelector(".leftq h1").style.display = "block";
  document.querySelector(".leftq h1").nextElementSibling.style.display = "block";
  document.querySelector(".rightq").style.display = "block";
  document.querySelector(".progress-container").style.display = "block";
  document.getElementById("question").style.display = "block";
  populate();

  // Reset progress bar position
  resetBarcketPosition();
}


function handleBonusClick() {
  var currentTime = Date.now();
  if (currentTime - lastBonusClickTime >= BONUS_COOLDOWN) {
    console.log("Bonus action performed!");

    lastBonusClickTime = currentTime;

    var bonusButton = document.getElementById("bonus-button");
    bonusButton.disabled = true;
    setTimeout(function () {
      bonusButton.disabled = false;
    }, BONUS_COOLDOWN);
  } else {
    console.log("Bonus action is on cooldown. Please wait.");
  }
}

function resetBarcketPosition() {
  const progressWidth = progressBar.offsetWidth;
  const barcketWidth = barcket.offsetWidth;
  const progressleft = progressBar.getBoundingClientRect().left;
  const barcketleft = progressleft + progressWidth - barcketWidth / 2;
  barcket.style.left = barcketleft - progressleft + "px";
}


function startQuiz() {
  populate();
  document.querySelector(".progress-container").style.display = "block";
  document.getElementById("progress-bar").style.width = "0";
  document.getElementById("quiz-container").classList.add("quiz-active");
}

function updateProgressBar() {
  var progressBar = document.getElementById("progress-bar");
  var progress = ((quiz.questionIndex + 0) / quiz.questions.length) * 125;
  progressBar.style.width = progress + "%";
}

function Question(text, choices, answer) {
  this.text = text;
  this.choices = choices;
  this.answer = answer;
}

Question.prototype.correctAnswer = function (choice) {
  return choice === this.answer;
};

function Quiz(questions) {
  this.score = 0;
  this.questions = questions;
  this.questionIndex = 0;
}

Quiz.prototype.getQuestionIndex = function () {
  return this.questions[this.questionIndex];
};

Quiz.prototype.isEnded = function () {
  return this.questions.length === this.questionIndex;
};

Quiz.prototype.guess = function (answer) {
  if (this.getQuestionIndex().correctAnswer(answer)) {
    this.score++;
  }

  this.questionIndex++;
};

var questions = [
  new Question(
    "Click any button to continue: ",
    ["Click", "To", "Begin", "Here!"],
    "Click"
  ),
  new Question(
    "How many Members are in SkillsUSA?",
    ["200", "213", "2334", "0"],
    "200"
  ),
  new Question(
    "What does Blue symbolize within SkillsUSA?",
    ["Justice", "Unity", "Alliance", "Joy"],
    "Unity"
  ),
  new Question(
    "Which one doesn't belong within our pledge?",
    ["Stealing", "Justice", "Unity", "Joy"],
    "Stealing"
  ),
  new Question(
    "How many years has SkillsUSA been around?",
    ["239", "23", "0", "100"],
    "100"
  ),
];

var quiz = new Quiz(questions);

populate();

function guess(id, guess) {
  var button = document.getElementById(id);
  button.onclick = function () {
    if (!isFirstButtonClicked) {
      isFirstButtonClicked = true;
      document.querySelector(".left h2").style.display = "none";
      document.querySelector(".left h2").nextElementSibling.style.display =
        "none";
    }
    quiz.guess(guess);
    populate();
  };
}

function showProgress() {
  var currentQuestionNumber = quiz.questionIndex + 1;
  var element = document.getElementById("progress");
  element.innerHTML =
    "<div class='progress-number'>" +
    currentQuestionNumber +
    "</div> of " +
    "<div class='progress-number'>" +
    quiz.questions.length +
    "</div>";
}

function turnLightOn() {
  fetch("/turnLightOn")
    .then((response) => {
      if (response.ok) {
        console.log("Light turned on successfully");
      } else {
        console.error("Failed to turn on light");
      }
    })
    .catch((error) => {
      console.error("Error turning on light:", error);
    });
}

function turnLightOff() {
  fetch("/turnLightOff")
    .then((response) => {
      if (response.ok) {
        console.log("Light turned off successfully");
      } else {
        console.error("Failed to turn off light");
      }
    })
    .catch((error) => {
      console.error("Error turning off light:", error);
    });
}

function showSchool() {
  document.querySelector(".intro").style.display = "none";
  document.querySelector(".chatbox").style.display = "none";
  document.getElementById("chat-input").style.display = "none";
  document.getElementById("suggestions").style.display = "none";

  document.getElementById("quiz").classList.remove("active");
  document.querySelector(".intro").classList.remove("active");
  document.querySelector(".chatbox").classList.remove("active");
  document.getElementById("info_page").classList.remove("active");

  document.getElementById("our-school-container").style.display = "block";
}

hidePages();

const progressBar = document.getElementById("progress-bar");
const barcket = document.getElementById("barcket");

function updateBarcketPosition() {
  const progressWidth = progressBar.offsetWidth;
  const barcketWidth = barcket.offsetWidth;
  const maxleft = progressWidth - barcketWidth;
  const progressleft = progressBar.getBoundingClientRect().left;
  const barcketleft = progressleft + progressWidth - barcketWidth / 2;
  barcket.style.left = barcketleft - progressleft + "px";
}

updateBarcketPosition();

progressBar.addEventListener("transitionend", () => {
  window.requestAnimationFrame(updateBarcketPosition);
});

window.addEventListener("resize", updateBarcketPosition);

