export class QuestionManager {
    constructor(questions) {
      this.questions = questions;
      this.currentIndex = 0;
      this.score = 0;
      this.bookmarked = [];
      this.userAnswers = new Map();
    }
  
    getCurrentQuestion() {
      return this.questions[this.currentIndex];
    }
  
    bookmarkCurrent() {
      const id = this.getCurrentQuestion().id;
      if (!this.bookmarked.includes(id)) this.bookmarked.push(id);
    }
  
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        return true;
      }
      return false;
    }
  
    answerCurrent(answer) {
      const current = this.getCurrentQuestion();
      this.userAnswers.set(current.id, answer);
      if (answer === current.answer) this.score++;
    }
  
    isQuizOver() {
      return this.currentIndex >= this.questions.length - 1;
    }
  }
  