let currentQuestion = 0;
let answers = [];
let studentName = "";
let timeLeft = 40 * 60;
let timerInterval;

function startTest() {
    studentName = document.getElementById("student-name").value.trim();

    if (studentName === "") {
        alert("Please enter your name before starting the test.");
        return;
    }

    answers = new Array(questions.length).fill(null);

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("cbt-screen").classList.remove("hidden");

    createQuestionNumbers();
    showQuestion();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        document.getElementById("timer").textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Your test will be submitted automatically.");
            submitTest();
        }
    }, 1000);
}

function showQuestion() {
    const q = questions[currentQuestion];

    document.getElementById("current-question").textContent =
        currentQuestion + 1;

    let html = `
        <div class="question-text">
            ${q.question}
        </div>
    `;

    if (q.image) {
        html += `
            <div class="question-image">
                <img src="${q.image}" alt="Question diagram">
            </div>
        `;
    }

    html += `<div class="options">`;

    q.options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const selected = answers[currentQuestion] === letter ? "checked" : "";

        html += `
            <label class="option">
                <input
                    type="radio"
                    name="answer"
                    value="${letter}"
                    ${selected}
                    onchange="selectAnswer('${letter}')"
                >
                <span><strong>${letter}.</strong> ${option}</span>
            </label>
        `;
    });

    html += `</div>`;

    document.getElementById("question-container").innerHTML = html;

    updateQuestionNumbers();
}

function selectAnswer(answer) {
    answers[currentQuestion] = answer;
    updateQuestionNumbers();
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function goToQuestion(number) {
    currentQuestion = number;
    showQuestion();
}

function createQuestionNumbers() {
    const container = document.getElementById("question-numbers");

    container.innerHTML = "";

    questions.forEach((_, index) => {
        const button = document.createElement("button");

        button.className = "question-number-btn";
        button.textContent = index + 1;

        button.onclick = () => goToQuestion(index);

        container.appendChild(button);
    });
}

function updateQuestionNumbers() {
    const buttons = document.querySelectorAll(".question-number-btn");

    buttons.forEach((button, index) => {
        button.classList.remove("active");
        button.classList.remove("answered");

        if (index === currentQuestion) {
            button.classList.add("active");
        }

        if (answers[index] !== null) {
            button.classList.add("answered");
        }
    });
}

function submitTest() {
    clearInterval(timerInterval);

    let score = 0;

    questions.forEach((question, index) => {
        if (answers[index] === question.answer) {
            score++;
        }
    });

    const percentage = Math.round((score / questions.length) * 100);

    document.getElementById("cbt-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");

    document.getElementById("student-result-name").textContent =
        studentName;

    document.getElementById("score").textContent = score;

    document.getElementById("percentage").textContent =
        percentage + "%";

    showReview();
}

function showReview() {
    const container = document.getElementById("review-container");

    container.innerHTML = "";

    questions.forEach((question, index) => {

        const studentAnswer = answers[index];

        const correct = studentAnswer === question.answer;

        const statusClass = correct ? "correct" : "wrong";

        const studentAnswerText =
            studentAnswer
                ? `${studentAnswer}. ${question.options[studentAnswer.charCodeAt(0) - 65]}`
                : "Not answered";

        const correctAnswerText =
            `${question.answer}. ${question.options[question.answer.charCodeAt(0) - 65]}`;

        const review = document.createElement("div");

        review.className = `review-item ${statusClass}`;

        review.innerHTML = `
            <h3>Question ${index + 1}</h3>

            <p><strong>${question.question}</strong></p>

            ${
                question.image
                    ? `<img src="${question.image}" alt="Question diagram" class="review-image">`
                    : ""
            }

            <p>
                <strong>Your answer:</strong>
                ${studentAnswerText}
            </p>

            <p class="correct-answer">
                <strong>Correct answer:</strong>
                ${correctAnswerText}
            </p>

            <div class="explanation">
                <strong>Explanation:</strong><br>
                ${question.explanation}
            </div>
        `;

        container.appendChild(review);
    });
}
