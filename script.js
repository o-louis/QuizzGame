class Quizz {
    constructor() {
        this.score = 0;
        this.currentQuestion = 0;
        this.questions = [];
    }

    async launch() {
        var _this = this;
        var counter = 0;
        var form = document.getElementById("formAnswer");

        this.questions = await this.getJson()
                                    .then(data => data.questions)
                                    .catch(e => console.error(e));

        this.displayNextQuestion(counter);
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            if (counter < _this.questions.length) {
                
                var userAnswer = _this.getUserAnswer();
                var indexCorrectAnswer = _this.questions[counter].answer-1;
                var correctAnswer = _this.questions[counter].propositions[indexCorrectAnswer];
                var labels = document.querySelectorAll("label");
                
                labels[indexCorrectAnswer].style.color = "green";
                if (userAnswer.checked.value !== correctAnswer) {
                    labels[userAnswer.index].style.color = "red";
                }

                setTimeout(() => {
                    _this.displayNextQuestion(++counter);
                    _this.resetColor();
                }, 2000);

            }
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

    resetColor() {
        var labels = document.querySelectorAll("label");
        for (var i =0 ; i < labels.length; i++) {
            labels[i].style.color = "black";
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

    getJson() {
        var json = "./data.json";
        return fetch(json)
                .then(response => response.json())
                .catch(error => console.error(error));
    }
}

function _init() {
    const quizz = new Quizz();
    quizz.launch();
}

window.onload = _init;