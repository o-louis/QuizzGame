class Quizz {
    constructor() {
        this.score = 0;
        this.questions = [];
        this.counter = 0;
    }

    async launch() {
        var _this = this;
        var form = document.getElementById("formAnswer");

        this.questions = await this.getQuestions();
        this.displayNextQuestion(this.counter);

        form.addEventListener("submit", function(event) {
            event.preventDefault();
            if (_this.counter < _this.questions.length) {
                _this.checkUserAnswer();
                setTimeout(() => {
                    _this.displayNextQuestion(++_this.counter);
                    _this.resetColor();
                }, 1500);
            }
            _this.displayScore();
        });
    }

    displayNextQuestion(index) {
        var container = document.getElementsByClassName("question")[0];
        var labels = document.querySelectorAll("label");
        var radioInput = document.querySelectorAll("input[type=radio]");

        if (this.questions[index]) {
            container.innerHTML = this.questions[index].question;
            for (var i = 0; i < labels.length; i++) {
                var answer = this.questions[index].propositions[i];
                radioInput[i].value = answer;
                labels[i].setAttribute("for", answer);
                labels[i].innerHTML = answer;
            }
        }
    }

    checkUserAnswer() {
        var userAnswer = this.getUserAnswer();
        var indexCorrectAnswer = this.questions[this.counter].answer-1;
        var correctAnswer = this.questions[this.counter].propositions[indexCorrectAnswer];
        var labels = document.querySelectorAll("label");

        labels[indexCorrectAnswer].style.color = "green";
        if (userAnswer.checked.value !== correctAnswer) {
            labels[userAnswer.index].style.color = "red";
        } else {
            this.score += 10;
        }
    }

    resetColor() {
        var labels = document.querySelectorAll("label");
        for (var i =0 ; i < labels.length; i++) {
            labels[i].style.color = "black";
        }
    }

    displayScore() {
        if (this.counter === (this.questions.length-1)) {
            setTimeout(() => {
                var container = document.getElementsByClassName("question")[0];
                var form = document.getElementById("formAnswer");
                var scoreContainer = document.getElementsByClassName("result")[0];

                form.className = "none";
                container.className += " none";
                scoreContainer.innerHTML = "Your score is " + this.score + " ! YAY";
            }, 1000);
        }
    }
    
    getUserAnswer() {
        var radios = document.querySelectorAll('input[type="radio"]:checked');
        var value = (radios.length > 0) ? radios[0] : null;
        return {checked: value, index: this.getIndex()};
    }

    getIndex() {
        var input = document.getElementsByTagName('input');
        var index;
        for (var i = 0; i < input.length; i++) {
            if (input[i].type="radio") {
                if (input[i].checked) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    getQuestions() {
        var json = "./data.json";
        return fetch(json)
                .then(response => response.json())
                .then(data => data.questions)
                .catch(error => console.error(error));
    }
}

window.onload = function() {
    const quizz = new Quizz();
    quizz.launch();
};