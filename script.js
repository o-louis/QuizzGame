class Quizz {
    constructor() {
        this.score = 0;
        this.currentQuestion = 0;
        this.questions = [];
    }

    async launch() {
        var counter = 0;
        var form = document.getElementById("formAnswer");
        this.questions = await this.getJson()
                                    .then(data => data.questions)
                                    .catch(e => console.error(e));

        this.displayNextQuestion(counter);
        form.addEventListener("submit", function(event) {
            event.preventDefault();
        });
    }

    displayNextQuestion(index) {
        var container = document.getElementsByClassName("question")[0];
        var btns = document.getElementsByTagName("button");

        container.innerHTML = this.questions[index].question;

        for (var i = 0; i < btns.length; i++) {
            btns[i].innerHTML = this.questions[index].propositions[i];
        }
    }

    async getJson() {
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