const pulse = document.getElementById("pulse");
const toggler = document.getElementById("toggler");
let chatHistory = [];
let currentChat = [];
let suggestionsShown = false;
let suggestionsClicked = false;
let isFirstButtonClicked = false;


toggler.addEventListener("click", expandCircle);
document.addEventListener("DOMContentLoaded", function () {
    expand_sizeInput();
});

function expandCircle() {
    const circle = document.getElementById("circle");
    const rocket = document.getElementById("rocket");

    circle.classList.toggle("expand");
    rocket.classList.toggle("launch");
    pulse.classList.toggle("hide");

    const hiddenContent = document.querySelectorAll(".circle .hidden-content");
    if (circle.classList.contains("expand")) {
        setTimeout(() => {
            hiddenContent.forEach((element) => {
                element.classList.add("show-content-animation");
            });
        }, 1000);
    } else {
        hiddenContent.forEach((element) => {
            element.classList.remove("show-content-animation");
        });
    }
}

function sendMessage() {
    const userMessage = document.getElementById("user-message").value.trim();
    if (userMessage !== "") {
        currentChat.push({ type: "user", message: userMessage });
        displayMessage(userMessage, "user");
        document.getElementById("user-message").value = "";
        hideSuggestions();
        hideWelcomeText();
    }
}

function displayMessage(message, type) {
    const chatMessages = document.getElementById("chat-messages");
    const messageBubble = document.createElement("div");
    messageBubble.className = type + "-bubble";
    messageBubble.innerText = message;
    chatMessages.appendChild(messageBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function selectSuggestion(suggestion) {
    document.getElementById("user-message").value = suggestion;
    sendMessage();
    suggestionsClicked = true;
}

function hideSuggestions() {
    document.getElementById("suggestions").style.display = "none";
}

function hideWelcomeText() {
    document.getElementById("welcome-text").style.display = "none";
    document.getElementById("info-text").style.display = "none";
}

function startNewChat() {
    chatHistory = [];
    currentChat = [];
    location.reload();
}

function showSuggestions() {
    document.getElementById("suggestions").style.display = "flex";
    suggestionsShown = true;
}

function checkEnter() {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function handleUserInput() {
    const userInput = document.getElementById("user-message").value;

    if (firstUserInput && userInput.trim() !== "") {
        hideSuggestions();
        showWelcomeText();
        firstUserInput = false;
    } else if (!suggestionsClicked) {
        if (userInput.trim() !== "") {
            if (!suggestionsShown) {
                showSuggestions();
            }
        } else {
            hideSuggestions();
            showWelcomeText();
        }
    }
}

function showWelcomeText() {
    document.getElementById("welcome-text").style.display = "block";
    document.getElementById("info-text").style.display = "block";
}

function expand_sizeInput() {
    const userInput = document.getElementById("user-input");
    userInput.classList.add("expand");
}

function showQuiz() {
    isFirstButtonClicked = false;
    quiz.questionIndex = 0;
    quiz.score = 0;

    document.getElementById("chat-messages").style.display = "none";
    document.getElementById("user-input").style.display = "none";
    document.getElementById("suggestions").style.display = "none";
    document.getElementById("welcome-text").style.display = "none";
    document.getElementById("our-school-container").style.display = "none";
    document.getElementById("information-container").style.display = "none";

    resetQuiz();
    hidePages();
    document.getElementById("quiz-container").style.display = "block";
    startQuiz();
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
            document.querySelector(".left h2").style.display = "block";
            document.querySelector(".left h2").nextElementSibling.style.display = "block";
        } else {
            document.querySelector(".left h2").style.display = "none";
            document.querySelector(".left h2").nextElementSibling.style.display = "none";
        }
    }
}

var lastBonusClickTime = 0;
const BONUS_COOLDOWN = 30000; 

function showScores() {
    var scoreContainer = document.getElementById("score-container");
    scoreContainer.style.display = "block";

    scoreDisplay.textContent = quiz.score;
    var tryAgainButton = document.getElementById("try-again");
    tryAgainButton.style.display = "block";

    if (quiz.score > 1) {
        var bonusButton = document.getElementById("bonus-button");
        bonusButton.style.display = "block";
        bonusButton.addEventListener("click", handleBonusClick);
    }

    // Hide unnecessary elements
    startConfetti();
    document.querySelector(".left h2").style.display = "none";
    document.querySelector(".left h2").nextElementSibling.style.display = "none";
    document.querySelector(".right").style.display = "none";
    document.querySelector(".progress-container").style.display = "none";
    document.getElementById("question").style.display = "none";
}

function handleBonusClick() {
    var currentTime = Date.now();
    if (currentTime - lastBonusClickTime >= BONUS_COOLDOWN) {
        console.log("Bonus action performed!");

        lastBonusClickTime = currentTime;

        var bonusButton = document.getElementById("bonus-button");
        bonusButton.disabled = true;
        setTimeout(function() {
            bonusButton.disabled = false;
        }, BONUS_COOLDOWN);
    } else {
        console.log("Bonus action is on cooldown. Please wait.");
    }
}

function startConfetti() {
    var chatContainer = document.getElementById("chat-container");
    var containerRect = chatContainer.getBoundingClientRect();

    var duration = 5 * 1000;

    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }; 

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        for (var i = 0; i < particleCount; i++) {
            var x = containerRect.left + containerRect.width * 0.4 + Math.random() * containerRect.width * 0.6; // Adjust the starting position to the right
            var y = containerRect.top - 10; 
            confetti(Object.assign({}, defaults, {
                particleCount: 1,
                origin: { x: x / window.innerWidth, y: y / window.innerHeight },
                angle: randomInRange(180 - 45, 180 + 45),
                spread: randomInRange(30, 60),
                startVelocity: randomInRange(20, 40),
                ticks: 200,
                colors: ['#0000ff', '#ff0000', '#ffffff'] 
            }));
        }
    }, 250);
}


function resetBarcketPosition() {
    const progressWidth = progressBar.offsetWidth;
    const barcketWidth = barcket.offsetWidth;
    const progressLeft = progressBar.getBoundingClientRect().left;
    const barcketLeft = progressLeft + progressWidth - barcketWidth / 2;
    barcket.style.left = barcketLeft - progressLeft + "px";
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
    document.querySelector(".left h2").style.display = "block";
    document.querySelector(".left h2").nextElementSibling.style.display = "block";
    document.querySelector(".right").style.display = "block";
    document.querySelector(".progress-container").style.display = "block";
    document.getElementById("question").style.display = "block";
    populate();
    
    resetBarcketPosition();
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
    new Question("Click any button to continue: ", ["Click", "To", "Begin", "Here!"], "Click"),
    new Question("How many Members are in SkillsUSA?", ["200", "213", "2334", "0"], "200"),
    new Question("What does Blue symbolize within SkillsUSA?", ["Justice", "Unity", "Alliance", "Joy"], "Unity"),
    new Question("Which one doesn't belong within our pledge?", ["Stealing", "Justice", "Unity", "Joy"], "Stealing"),
    new Question("How many years has SkillsUSA been around?", ["239", "23", "0", "100"], "100"),
];

var quiz = new Quiz(questions);

populate();

function guess(id, guess) {
    var button = document.getElementById(id);
    button.onclick = function () {
        if (!isFirstButtonClicked) {
            isFirstButtonClicked = true;
            document.querySelector(".left h2").style.display = "none";
            document.querySelector(".left h2").nextElementSibling.style.display = "none";
        }
        quiz.guess(guess);
        populate();
    };
}

function showProgress() {
    var currentQuestionNumber = quiz.questionIndex + 1;
    var element = document.getElementById("progress");
    element.innerHTML = "<div class='progress-number'>" + currentQuestionNumber + "</div> of " + "<div class='progress-number'>" + quiz.questions.length + "</div>";
}

function turnLightOn() {
    fetch('/turnLightOn') 
    .then(response => {
        if (response.ok) {
            console.log('Light turned on successfully');
        } else {
            console.error('Failed to turn on light');
        }
    })
    .catch(error => {
        console.error('Error turning on light:', error);
    });
}

function turnLightOff() {
    fetch('/turnLightOff')
    .then(response => {
        if (response.ok) {
            console.log('Light turned off successfully');
        } else {
            console.error('Failed to turn off light');
        }
    })
    .catch(error => {
        console.error('Error turning off light:', error);
    });
}


function showSchool() {
    document.getElementById("chat-messages").style.display = "none";
    document.getElementById("user-input").style.display = "none";
    document.getElementById("suggestions").style.display = "none";
    document.getElementById("welcome-text").style.display = "none";

    document.getElementById("quiz-container").style.display = "none";

    document.getElementById("information-container").style.display = "none";

    document.getElementById("our-school-container").style.display = "block";
}

function showInformation() {
    document.getElementById("chat-messages").style.display = "none";
    document.getElementById("user-input").style.display = "none";
    document.getElementById("suggestions").style.display = "none";
    document.getElementById("welcome-text").style.display = "none";

    document.getElementById("quiz-container").style.display = "none";

    document.getElementById("our-school-container").style.display = "none";
    document.getElementById("information-container").style.display = "block";
    hideQuiz();
}

function hidePages() {
    document.getElementById("our-school-container").style.display = "none";
    document.getElementById("information-container").style.display = "none";
}

hidePages();

const progressBar = document.getElementById("progress-bar");
const barcket = document.getElementById("barcket");

function updateBarcketPosition() {
    const progressWidth = progressBar.offsetWidth;
    const barcketWidth = barcket.offsetWidth;
    const maxLeft = progressWidth - barcketWidth;
    const progressLeft = progressBar.getBoundingClientRect().left;
    const barcketLeft = progressLeft + progressWidth - barcketWidth / 2;
    barcket.style.left = barcketLeft - progressLeft + "px";
}

updateBarcketPosition();

progressBar.addEventListener("transitionend", () => {
    window.requestAnimationFrame(updateBarcketPosition);
});

window.addEventListener("resize", updateBarcketPosition);
