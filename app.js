import { QuestionManager } from './questionManager.js';
import { QuizUI } from './quizUI.js';

fetch('./questions.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("quiz-container");
    const manager = new QuestionManager(data);
    const ui = new QuizUI(container, manager);
    ui.renderQuestion();
  })
  .catch(err => {
    console.error("Failed to load questions:", err);
  });
