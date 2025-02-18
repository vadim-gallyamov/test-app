import './style.scss';

document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.getElementById('burger-menu');
    const sidebar = document.querySelector('.sidebar');
    let currentTestId = null;

    const descriptionText = document.getElementById('test-description-text');
    const startButton = document.getElementById('start-test');
    const cancelButton = document.getElementById('cancel-test');
    const selectTestMessage = document.getElementById('select-test-message');

    const testContainer = document.getElementById('test-container');
    const testHeader = document.getElementById('test-header');
    const testButtons = document.getElementById('test-buttons');

    const testDescriptions = {
        1: { description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur consequuntur eaque nesciunt incidunt ab itaque, repellendus sint ullam, quaerat eum quis, expedita dolorum. Nemo, numquam fuga sed magnam blanditiis ipsa?1' },
        2: { description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur consequuntur eaque nesciunt incidunt ab itaque, repellendus sint ullam, quaerat eum quis, expedita dolorum. Nemo, numquam fuga sed magnam blanditiis ipsa?2' },
        3: { description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur consequuntur eaque nesciunt incidunt ab itaque, repellendus sint ullam, quaerat eum quis, expedita dolorum. Nemo, numquam fuga sed magnam blanditiis ipsa?3' }
    };

    const testData = {
        1: [{ question: "1. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 0 }, { question: "2. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 1 }, { question: "3. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 2 }, { question: "4. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 3 }, { question: "5. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3"], correctAnswer: 0 }],
        2: [{ question: "1. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 4 }, { question: "2. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 5 }, { question: "3. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 0 }, { question: "4. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 1 }, { question: "5. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3"], correctAnswer: 2 }],
        3: [{ question: "1. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 4 }, { question: "2. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 5 }, { question: "3. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 0 }, { question: "4. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4", "Вариант 5", "Вариант 6"], correctAnswer: 1 }, { question: "5. Вопрос", answers: ["Вариант 1", "Вариант 2", "Вариант 3"], correctAnswer: 2 }]
    };

    let timerInterval = null;
    let timeElapsed = 0;
    const maxTime = 30;

    const exitModal = document.getElementById("exitModal");
    const confirmExit = document.getElementById("confirmExit");
    const cancelExit = document.getElementById("cancelExit");

    // Восстанавливаем состояние бургер меню из localStorage
    if (localStorage.getItem('burgerMenuOpen') === 'true') {
        sidebar.classList.add('open');
        burgerMenu.classList.add('open');
    }

    burgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        burgerMenu.classList.toggle('open');
        // Сохраняем состояние бургер меню в localStorage
        localStorage.setItem('burgerMenuOpen', sidebar.classList.contains('open'));
    });

    function attachTestLinkListeners() {
        const testLinks = document.querySelectorAll('.sidebar__link');
        testLinks.forEach(link => {
            link.addEventListener('click', () => {
                currentTestId = link.getAttribute('data-test');

                // **НОВЫЙ КОД: Проверяем наличие результатов в localStorage**
                const existingResultsJSON = localStorage.getItem(`testResultsList-${currentTestId}`);
                if (existingResultsJSON) {
                    // Результаты есть, отображаем их
                    displayExistingResults(currentTestId); 
                } else {
                    if (testDescriptions[currentTestId]) {
                        descriptionText.textContent = testDescriptions[currentTestId].description;
                        selectTestMessage.style.display = 'none';
                        testContainer.style.display = 'block';
                        testHeader.style.display = 'block';
                        testButtons.style.display = 'flex';

                        descriptionText.classList.remove('no-test');
                    }
                }
            });
        });
    }

    attachTestLinkListeners(); // Вызываем при загрузке страницы

    function generateTestForm(questions) {
        const form = document.createElement('form');
        form.classList.add('test-form');

        questions.forEach((question, questionIndex) => {
            const testQuestionDiv = document.createElement('div');
            testQuestionDiv.classList.add('test-question');

            const questionText = document.createElement('p');
            questionText.classList.add('question-text');
            questionText.textContent = question.question;
            testQuestionDiv.appendChild(questionText);

            const answersList = document.createElement('ul');
            answersList.classList.add('answers');

            // Создаем контейнер для всех вопросов, кроме последнего
            const answersContainer = document.createElement('div');
            answersContainer.classList.add('answers-container'); //

            // Для последнего вопроса применяем класс 'last-answer-container' к контейнеру
            if (questionIndex === questions.length - 1) {
                answersContainer.classList.add('last-question-answers');
            }

            answersContainer.appendChild(answersList); 
            testQuestionDiv.appendChild(answersContainer); 

            question.answers.forEach((answer, answerIndex) => {
                const answerItem = document.createElement('li');
                answerItem.classList.add('answer-item');

                const label = document.createElement('label');
                label.classList.add('answer-label');

                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `question-${questionIndex}`;
                radioInput.value = answerIndex;
                radioInput.classList.add('answer-radio');
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", "13");
                svg.setAttribute("height", "13");
                svg.setAttribute("viewBox", "0 0 13 13");
                svg.setAttribute("fill", "none");
                svg.classList.add('radio-svg');

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", "6.5");
                circle.setAttribute("cy", "6.5");
                circle.setAttribute("r", "6");
                circle.setAttribute("fill", "white");
                circle.setAttribute("stroke", "#AFAFAF");
                svg.appendChild(circle);

                const answerText = document.createElement('span');
                answerText.classList.add('answer-text');
                answerText.textContent = answer;

                label.appendChild(radioInput);
                label.appendChild(svg);
                label.appendChild(answerText);
                answerItem.appendChild(label);
                answersList.appendChild(answerItem);
            });

            form.appendChild(testQuestionDiv);
        });

        return form;
    }

    function resetAnswers(form) {
        if (form) {
            const radioButtons = form.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.checked = false;
            });
        }
        updateProgress();
    }

    function updateProgress() {
        const form = document.querySelector('.test-form');
        if (form) {
            const totalQuestions = Object.keys(testData[currentTestId]).length;
            let answeredQuestions = 0;

            for (let i = 0; i < totalQuestions; i++) {
                const radioName = `question-${i}`;
                const selectedOption = form.querySelector(`input[name="${radioName}"]:checked`);
                if (selectedOption) {
                    answeredQuestions++;
                }
            }

            const progressIndicator = document.getElementById('progress-indicator');
            if (progressIndicator) {
                progressIndicator.textContent = `${answeredQuestions}/${totalQuestions}`;
            }
        }
    }

    function startTest() {
        const content = document.querySelector('.content');
        content.innerHTML = '';

        const testHeaderElement = document.createElement('div');
        testHeaderElement.classList.add('test-header-active');

        const exitButton = document.createElement('button');
        exitButton.textContent = 'Выход';
        exitButton.classList.add('btn', 'btn-exit');
        exitButton.id = 'exit-button';
        exitButton.addEventListener('click', () => {
            exitModal.classList.add("modal_opened");
        });

        const testTitle = document.createElement('span');
        testTitle.classList.add('test-header-active__title');
        testTitle.textContent = `Тест ${currentTestId}`;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Сбросить все ответы';
        resetButton.classList.add('btn', 'btn-reset');
        resetButton.addEventListener('click', () => {
            const form = document.querySelector('.test-form');
            resetAnswers(form);
        });

        const progressIndicator = document.createElement('span');
        progressIndicator.classList.add('test-header-active__progress-indicator');
        progressIndicator.textContent = '0/0';
        progressIndicator.id = 'progress-indicator';

        const timer = document.createElement('span');
        timer.classList.add('test-header-active__timer');
        timer.textContent = '00:00:00';

        testHeaderElement.appendChild(exitButton);
        testHeaderElement.appendChild(testTitle);
        testHeaderElement.appendChild(resetButton);
        testHeaderElement.appendChild(progressIndicator);
        testHeaderElement.appendChild(timer);

        content.appendChild(testHeaderElement);
        const questions = testData[currentTestId];
        const testForm = generateTestForm(questions);
        content.appendChild(testForm);

        // Создаем контейнер для кнопки "Завершить тест"
        const submitButtonContainer = document.createElement('div');
        submitButtonContainer.classList.add('submit-button-container');

        // Кнопка "Завершить тест"
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.classList.add('btn', 'btn-finish');
        submitButton.textContent = 'Завершить';
        submitButtonContainer.appendChild(submitButton);

        content.appendChild(submitButtonContainer); 

        const exitButtonElement = document.getElementById('exit-button');
        exitButtonElement.addEventListener('click', () => {
            exitModal.classList.add("modal_opened");
        });

        if (testForm) {
            testForm.addEventListener('change', (event) => {
                if (event.target.type === 'radio') {
                    updateProgress();
                }
            });

            updateProgress();

            submitButton.addEventListener('click', (event) => {
                event.preventDefault();

                clearInterval(timerInterval); // Останавливаем таймер

                const progressIndicator = document.getElementById('progress-indicator');
                if (progressIndicator) {
                    progressIndicator.textContent = '0/5';
                }

                const results = getTestResults(testForm, questions);
                const testResultsToSave = {
                    testName: `Тест ${currentTestId}`,
                    results: questions.map((question, index) => {
                        let userAnswerText = "Не ответили";
                        let isCorrect = false;
                        const selectedAnswer = testForm.querySelector(`input[name="question-${index}"]:checked`);

                        if (selectedAnswer) {
                            const userAnswerIndex = parseInt(selectedAnswer.value);
                            userAnswerText = question.answers[userAnswerIndex];
                            isCorrect = (userAnswerIndex === question.correctAnswer);
                        }

                        return {
                            question: question.question,
                            userAnswer: userAnswerText,
                            correctAnswer: question.answers[question.correctAnswer],
                            isCorrect: isCorrect
                        };
                    }),
                    correctAnswersCount: results.correctAnswers,
                    totalQuestionsCount: questions.length,
                    date: new Date().toLocaleDateString(), // Добавляем дату прохождения теста
                    time: new Date().toLocaleTimeString()  // Добавляем время прохождения теста
                };

                // Получаем существующие результаты из localStorage
                const existingResultsJSON = localStorage.getItem(`testResultsList-${currentTestId}`);
                let existingResults = [];

                if (existingResultsJSON) {
                    existingResults = JSON.parse(existingResultsJSON);
                }

                // Добавляем новые результаты в массив
                existingResults.push(testResultsToSave);

                // Сохраняем обновленный массив в localStorage
                localStorage.setItem(`testResultsList-${currentTestId}`, JSON.stringify(existingResults));

                const content = document.querySelector('.content');
                content.innerHTML = '';
                content.appendChild(testHeaderElement);

                const mainContentContainer = document.createElement('div');
                mainContentContainer.classList.add('main-content-container');
                const h2 = document.createElement('h2');
                h2.textContent = 'Тест завершен';
                h2.classList.add('test-complete-title');
                mainContentContainer.appendChild(h2);

                const p = document.createElement('p');
                p.textContent = `Вы ответили правильно на ${results.correctAnswers} из ${questions.length} вопросов.`;
                p.classList.add('test-results-text');
                mainContentContainer.appendChild(p);

                const h3 = document.createElement('h3');
                h3.textContent = 'Ваши ответы:';
                h3.classList.add('user-answers-title');
                mainContentContainer.appendChild(h3);

                const resultsDiv = document.createElement('div');
                resultsDiv.classList.add('user-answers-container');
                results.answerCards.forEach(card => {
                    resultsDiv.appendChild(card);
                });
                mainContentContainer.appendChild(resultsDiv);

                content.appendChild(mainContentContainer);
                const restartButtonContainer = document.createElement('div');
                restartButtonContainer.classList.add('restart-container');
                content.appendChild(restartButtonContainer);
                const restartButton = document.createElement('button');
                restartButton.classList.add('btn', 'restart-button');
                restartButton.textContent = 'Пройти еще раз';
                restartButtonContainer.appendChild(restartButton);

                restartButton.addEventListener('click', restartTest);

                const exitButtonElement = document.getElementById('exit-button');
                exitButtonElement.addEventListener('click', () => {
                    exitModal.classList.add("modal_opened");
                });
            });
        }
        startTimer(timer);
    }

    function startTimer(timerElement) {
        timeElapsed = 0;
        timerInterval = setInterval(() => {
            timeElapsed++;
            if (timeElapsed >= maxTime) {
                clearInterval(timerInterval);

                showSelectTestMessage()

            } else {
                const hours = Math.floor(timeElapsed / 3600);
                const minutes = Math.floor((timeElapsed % 3600) / 60);
                const seconds = timeElapsed % 60;
                timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);
    }

    function showSelectTestMessage() {
        const content = document.querySelector('.content');
        content.innerHTML = '';

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('select-test-message-container');

        const message = document.createElement('p');
        message.textContent = 'Выберите тест из списка';
        message.classList.add('test-message');
        messageContainer.appendChild(message);

        content.appendChild(messageContainer);

        const testHeaderElement = document.querySelector('.test-header-active');
        if (testHeaderElement) {
            testHeaderElement.remove();
        }

        // Добавляем обработчик для кнопки "Выход"
        const exitButtonElement = document.getElementById('exit-button');
        if (exitButtonElement) {
            exitButtonElement.addEventListener('click', () => {
                exitModal.classList.add("modal_opened");
            });
        }

        // Добавляем обработчик для кнопки "Пройти еще раз"
        const restartButtonElement = document.querySelector('.restart-button');
        if (restartButtonElement) {
            restartButtonElement.addEventListener('click', restartTest);
        }

        attachTestLinkListeners();
    }

    function getTestResults(form, questions) {
        let correctAnswers = 0;
        const answerCards = [];

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const selectedAnswer = form.querySelector(`input[name="question-${i}"]:checked`);
            let userAnswerText = "Не ответили";
            let isCorrect = false;

            if (selectedAnswer) {
                const userAnswerIndex = parseInt(selectedAnswer.value);
                userAnswerText = question.answers[userAnswerIndex];
                if (userAnswerIndex === question.correctAnswer) {
                    correctAnswers++;
                    isCorrect = true;
                }
            }

            const resultDiv = document.createElement('div');
            resultDiv.classList.add('answer-card');

            const questionPara = document.createElement('p');
            questionPara.classList.add('answer-card__question'); 
            questionPara.textContent = ` ${question.question}`;
            resultDiv.appendChild(questionPara);

            const correctAnswerPara = document.createElement('p');
            correctAnswerPara.classList.add('answer-card__correct-answer');
            correctAnswerPara.textContent = `Правильный ответ: ${question.answers[question.correctAnswer]}`;
            resultDiv.appendChild(correctAnswerPara);

            const userAnswerPara = document.createElement('p');
            userAnswerPara.classList.add('answer-card__user-answer');
            userAnswerPara.textContent = `Вы ответили: ${userAnswerText}`;
            resultDiv.appendChild(userAnswerPara);

            answerCards.push(resultDiv);
        }

        return { correctAnswers: correctAnswers, answerCards: answerCards };
    }

    function cancelTest() {
        selectTestMessage.style.display = 'block'; 
        testContainer.style.display = 'none';     
        testButtons.style.display = 'none';       
        descriptionText.classList.add('no-test'); 
        testHeader.style.display = 'none';
    }

    confirmExit.addEventListener('click', () => {
        localStorage.setItem('burgerMenuOpen', 'true');
        exitModal.classList.remove("modal_opened");
        location.reload();
    });

    cancelButton.addEventListener('click', () => {
        cancelTest();
    });

    descriptionText.classList.add('no-test');

    cancelExit.addEventListener('click', () => {
        exitModal.classList.remove("modal_opened");
    });

    startButton.addEventListener('click', () => {
        startTest();
    });

    function displayExistingResults(testId) {
        const existingResultsJSON = localStorage.getItem(`testResultsList-${testId}`);
        const existingResults = JSON.parse(existingResultsJSON);

        // Берем последние результаты (последний элемент массива)
        const lastResult = existingResults[existingResults.length - 1];

        // Очищаем content
        const content = document.querySelector('.content');
        content.innerHTML = '';

        // Создаем testHeaderElement
        const testHeaderElement = document.createElement('div');
        testHeaderElement.classList.add('test-header-active');

        const exitButton = document.createElement('button');
        exitButton.textContent = 'Выход';
        exitButton.classList.add('btn', 'btn-exit');
        exitButton.id = 'exit-button';
        exitButton.addEventListener('click', () => {
            exitModal.classList.add("modal_opened");
        });

        const testTitle = document.createElement('span');
        testTitle.classList.add('test-header-active__title');
        testTitle.textContent = `Тест ${testId}`;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Сбросить все ответы';
        resetButton.classList.add('btn', 'btn-reset');
        resetButton.addEventListener('click', () => {
            const form = document.querySelector('.test-form');
            resetAnswers(form);
        });

        const progressIndicator = document.createElement('span');
        progressIndicator.classList.add('test-header-active__progress-indicator');
        progressIndicator.textContent = '0/5';
        progressIndicator.id = 'progress-indicator';

        const timer = document.createElement('span');
        timer.classList.add('test-header-active__timer');
        timer.textContent = '00:00:00';

        testHeaderElement.appendChild(exitButton);
        testHeaderElement.appendChild(testTitle);
        testHeaderElement.appendChild(resetButton);
        testHeaderElement.appendChild(progressIndicator);
        testHeaderElement.appendChild(timer);

        const mainContentContainer = document.createElement('div');
        mainContentContainer.classList.add('main-content-container');
        const h2 = document.createElement('h2');
        h2.textContent = 'Тест пройден';
        h2.classList.add('test-complete-title');
        mainContentContainer.appendChild(h2);

        const p = document.createElement('p');
        p.textContent = `Вы ответили правильно на ${lastResult.correctAnswersCount} из ${lastResult.totalQuestionsCount} вопросов.`;
        p.classList.add('test-results-text');
        mainContentContainer.appendChild(p);

        const h3 = document.createElement('h3');
        h3.textContent = 'Ваши ответы:';
        h3.classList.add('user-answers-title');
        mainContentContainer.appendChild(h3);

        const resultsDiv = document.createElement('div');
        resultsDiv.classList.add('user-answers-container');

        lastResult.results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('answer-card');

            const questionPara = document.createElement('p');
            questionPara.classList.add('answer-card__question');
            questionPara.textContent = ` ${result.question}`;
            resultDiv.appendChild(questionPara);

            const correctAnswerPara = document.createElement('p');
            correctAnswerPara.classList.add('answer-card__correct-answer');
            correctAnswerPara.textContent = `Правильный ответ: ${result.correctAnswer}`;
            resultDiv.appendChild(correctAnswerPara);

            const userAnswerPara = document.createElement('p');
            userAnswerPara.classList.add('answer-card__user-answer');
            userAnswerPara.textContent = `Вы ответили: ${result.userAnswer}`;
            resultDiv.appendChild(userAnswerPara);

            resultsDiv.appendChild(resultDiv);
        });
        mainContentContainer.appendChild(resultsDiv);

        content.appendChild(testHeaderElement);
        content.appendChild(mainContentContainer);

        // (Опционально) Добавляем кнопку "Пройти еще раз"
        const restartButtonContainer = document.createElement('div');
        restartButtonContainer.classList.add('restart-container');
        content.appendChild(restartButtonContainer);

        const restartButton = document.createElement('button');
        restartButton.classList.add('btn', 'restart-button');
        restartButton.textContent = 'Пройти еще раз';
        restartButtonContainer.appendChild(restartButton);

        restartButton.addEventListener('click', restartTest);
        const exitButtonElement = document.getElementById('exit-button');
        exitButtonElement.addEventListener('click', () => {
            exitModal.classList.add("modal_opened");
        });
        attachTestLinkListeners();
    }

    function restartTest() {
        const content = document.querySelector('.content');
        content.innerHTML = '';
        startTest();
    }
});