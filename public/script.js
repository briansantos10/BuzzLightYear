const pulse = document.getElementById("pulse");
const toggler = document.getElementById("toggler");
toggler.addEventListener("click", expandCircle);

function expandCircle() {
  const circle = document.getElementById("circle");
  const rocket = document.getElementById("rocket");
  circle.classList.toggle("expand");
  rocket.classList.toggle("launch");
  pulse.classList.toggle("hide");

  const hiddenContent = document.querySelectorAll(".circle .hidden-content");
  hiddenContent.forEach((element) => {
    element.classList.toggle("show-content-animation");
  });

  const title = document.getElementById("title");
  const suggestions = document.getElementById("suggestions");
  const chatInput = document.getElementById("chat-input");
  title.classList.toggle("animation");
  suggestions.classList.toggle("animation");
  chatInput.classList.toggle("animation");
}

function restartPage() {
  window.location.reload();
}

// info page
function showInfo() {
  const infoPage = document.getElementById("info_page");
  const introSection = document.querySelector(".intro");

  introSection.classList.add("active");
  infoPage.classList.add("active");
  document.querySelector(".chatbox").classList.remove("active");
}

/* quiz stuff here */

function showQuiz() {
  document.getElementById("chat-messages").style.display = "none";
  document.getElementById("user-input").style.display = "none";
  document.getElementById("suggestions").style.display = "none";
  document.getElementById("welcome-text").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  startQuiz();
}

function startQuiz() {
  populate();
  document.querySelector(".progress-container").style.display = "block";
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
  new Question("Click any button to continue: ", ["A", "B", "C", "D"], "A"),
  new Question(
    "aLorem ipsum dolor sit amet, consectetur adipiscing elit.?",
    ["Aa", "Ba", "Ca", "Da"],
    "Ba"
  ),
  new Question(
    "bLorem ipsum dolor sit amet, consectetur adipiscing elit.?",
    ["Ac", "Bc", "Cc", "Dc"],
    "Cc"
  ),
  new Question(
    "cLorem ipsum dolor sit amet, consectetur adipiscing elit.?",
    ["Ad", "Bd", "Cd", "Dd"],
    "Dd"
  ),
  new Question(
    "dLorem ipsum dolor sit amet, consectetur adipiscing elit.?",
    ["A", "B", "C", "D"],
    "A"
  ),
];

var quiz = new Quiz(questions);

populate();

let isFirstButtonClicked = false;

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
    '<div class="progress-number">' +
    currentQuestionNumber +
    "</div>" +
    " of " +
    '<div class="progress-number">' +
    quiz.questions.length +
    "</div>";
}

function showScores() {
  var gameOver = "<h1>Your Score: </h1>";
  gameOver +=
    "<h2 id='score' style='text-align:center;'>" + quiz.score + "/5</h2>";
  var element = document.getElementById("quiz");
  element.innerHTML = gameOver;
}

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
  }
}

function updateProgressBar() {
  var progressBar = document.getElementById("progress-bar");
  var currentQuestionNumber = quiz.questionIndex + 1;
  var totalQuestions = quiz.questions.length;
  var progressPercentage = (currentQuestionNumber / totalQuestions) * 100;
  progressBar.style.width = progressPercentage + "%";
}

/* end of quiz stuff*/
