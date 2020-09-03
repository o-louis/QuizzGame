class Quizz {
    constructor() {
        this.score = 0;
        this.questions = [];
        this.questionNumber = 0;
    }

    async launch() {
        let _this = this;
        const form = document.getElementById("formAnswer");

        this.questions = await this.getQuestions();
        this.updateQuestionNumber();
        this.displayQuestion(this.questionNumber);
        this.highlightSelectedInput();

        form.addEventListener("submit", (e) =>{
            e.preventDefault();
            if (_this.questionNumber < _this.questions.length) {
                _this.checkUserAnswer();
                setTimeout(() => {
                    _this.displayQuestion(++_this.questionNumber);
                    _this.updateQuestionNumber();
                    _this.resetColor();
                }, 1500);
            }
            _this.displayScore();
            _this.replay();
        });
    }

    displayQuestion(index) {
        let labels = document.querySelectorAll("label");
        let container = document.getElementsByClassName("question")[0];
        let radioInput = document.querySelectorAll("input[type=radio]");

        if (this.questions[index]) {
            container.innerHTML = this.questions[index].question;
            for (let i = 0; i < labels.length; i++) {
                const answer = this.questions[index].propositions[i];
                radioInput[i].value = answer;
                radioInput[i].id = answer;
                labels[i].setAttribute("for", answer);
                labels[i].innerHTML = answer;
            }
        }
    }

    checkUserAnswer() {
        let userAnswer = this.getUserAnswer();
        let labels = document.querySelectorAll("label");
        
        const indexCorrectAnswer = this.questions[this.questionNumber].answer-1;
        const correctAnswer = this.questions[this.questionNumber].propositions[indexCorrectAnswer];

        labels[indexCorrectAnswer].className = "green";
        if (userAnswer.checked.value !== correctAnswer) {
            labels[userAnswer.index].className = "red";
        } else {
            this.score += 1;
        }
    }

    resetColor() {
        let labels = document.querySelectorAll("label");
        this.removeClass(labels);
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
                scoreContainer.innerHTML = "Your score is " + this.score + "!";
            }, 1000);
        }
    }

    highlightSelectedInput() {
        const radioLabels = document.querySelectorAll('label');
        radioLabels.forEach((item) => {
            item.addEventListener("click", () => {
                this.removeClass(radioLabels);
                item.className = "selected"
            })
        });
    }

    updateQuestionNumber() {
        let title = document.querySelectorAll('.question_number')[0];
        if (this.questionNumber === this.questions.length) {
            title.innerText = `Finish`;
        } else {
            title.innerText = `Question ${this.questionNumber+1}/${this.questions.length}`
        }
    }

    replay() {
        let button = document.querySelector(".result button");
        button.addEventListener('click', () => {
            window.location.reload();
        })
    }
    
    getUserAnswer() {
        let questionChecked = document.querySelectorAll('input[type="radio"]:checked');
        let value = (questionChecked.length > 0) ? questionChecked[0] : null;
        return { checked: value, index: this.getIndex() };
    }

    getIndex() {
        let input = document.getElementsByTagName('input');
        let index;
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

    removeClass(element) {
        element.forEach(item => {
            item.className = "";
        });
    }
}

window.onload = function() {
    const quizz = new Quizz();
    quizz.launch();
};