class Quizz {
    constructor() {
        this.score = 0;
        this.questions = [];
        this.questionNumber = 0;
    }

    async launch() {
        let _this = this;
        this.questions = await this.getQuestions();
        const form = document.getElementById("formAnswer");

        this.updateQuestionNumber();
        this.displayQuestion(this.questionNumber);
        this.highlightSelectedInput();

        form.addEventListener("submit", (e) =>{
            e.preventDefault();
            if (_this.questionNumber < _this.questions.length) {
                _this.checkUserAnswer();

                // Move to the next question after .6s
                setTimeout(() => {
                    _this.displayQuestion(++_this.questionNumber);
                    _this.updateQuestionNumber();
                    _this.resetColor();
                }, 600);
            }
            _this.displayScore();
            _this.replay();
        });
    }

    updateQuestionNumber() {
        let title = document.querySelector('.question_number');
        if (this.questionNumber === this.questions.length) {
            title.innerText = `Finish`;
        } else {
            title.innerText = `Question ${this.questionNumber+1}/${this.questions.length}`;
        }
    }

    displayQuestion(index) {
        let labels = document.querySelectorAll("label");
        let container = document.getElementsByClassName("question")[0];
        let radioInput = document.querySelectorAll("input[type=radio]");

        if (this.questions[index]) {
            container.innerHTML = this.questions[index].question;

            // Set questions and answers in the right place
            for (let i = 0; i < labels.length; i++) {
                const answer = this.questions[index].propositions[i];
                radioInput[i].value = answer;
                radioInput[i].id = answer;
                labels[i].setAttribute("for", answer);
                labels[i].innerHTML = answer;
            }
        }
    }

    highlightSelectedInput() {
        const labels = document.querySelectorAll('label');
        labels.forEach(item => {
            item.addEventListener("click", () => {
                this.resetColor();
                item.className = "selected";
            });
        });
    }

    checkUserAnswer() {
        const userAnswer = this.getUserAnswer();
        const correctAnswer = this.getCorrectAnswer();
        let labels = document.querySelectorAll("label");

        // Show right and wrong answer
        labels[correctAnswer.index].className = "green";
        if (userAnswer.checked.value !== correctAnswer.value) {
            labels[userAnswer.index].className = "red";
        } else {
            this.score += 1;
        }
    }

    resetColor() {
        let labels = document.querySelectorAll("label");
        labels.forEach(item => {
            item.className = "";
        });
    }

    displayScore() {
        if (this.questionNumber === (this.questions.length-1)) {
            setTimeout(() => {
                let container = document.getElementsByClassName("question")[0];
                let form = document.getElementById("formAnswer");
                let result = document.querySelector(".result");
                let scoreContainer = document.querySelector(".result span");

                result.className = "result";
                form.className = "none";
                container.className += " none";
                scoreContainer.innerHTML = `Your score is ${this.score}/${this.questions.length} !`;
            }, 200);
        }
    }

    replay() {
        let button = document.querySelector(".result button");
        button.addEventListener('click', () => {
            window.location.reload();
        });
    }

    /* GET SPECIFIC THING */
    getCorrectAnswer() {
        const currentQuestion = this.questions[this.questionNumber];
        const indexCorrectAnswer = currentQuestion.answer-1;
        const correctAnswer = currentQuestion.propositions[indexCorrectAnswer];
        return { index: indexCorrectAnswer, value: correctAnswer };
    }
    
    getUserAnswer() {
        let questionChecked = document.querySelectorAll('input[type="radio"]:checked');
        let value = (questionChecked.length > 0) ? questionChecked[0] : null;
        return { checked: value, index: this.getIndex() };
    }

    getIndex() {
        let index = 0;
        let input = document.getElementsByTagName('input');
        for (let i = 0; i < input.length; i++) {
            if (input[i].type="radio") {
                if (input[i].checked) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    async getQuestions() {
        const json = "./data.json";
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