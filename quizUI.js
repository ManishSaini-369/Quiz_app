export class QuizUI {
    constructor(container, manager) {
      this.container = container;
      this.manager = manager;
      this.timer = null;
      this.timePerQuestion = 15;
      this.remainingTime = this.timePerQuestion;
    }
  
    renderQuestion() {
      const q = this.manager.getCurrentQuestion();
      this.container.innerHTML = `
        
        <h1 class="heading">Quiz Application</h1>
        <h3>${q.question}</h3>
        <ol>
          ${q.options.map(option => `<li><button class="option">${option}</button></li>`).join("")}
        </ol>
        <p>Time left: <span id="timer">${this.remainingTime}</span>s</p>
        <button id="bookmark">Bookmark</button>
      

      `;
  
      this.startTimer();
      this.addEventListeners();
    }
  
    startTimer() {
      this.remainingTime = this.timePerQuestion;
      this.updateTimer();
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.remainingTime--;
        this.updateTimer();
        if (this.remainingTime === 0) {
          clearInterval(this.timer);
          this.handleTimeout();
        }
      }, 1000);
    }
  
    updateTimer() {
      const timerEl = document.getElementById("timer");
      if (timerEl) timerEl.textContent = this.remainingTime;
    }
  
    handleTimeout() {
      this.manager.answerCurrent(null); // unanswered
      this.nextOrEnd();
    }
  
    // addEventListeners() {
    //   document.querySelectorAll(".option").forEach(btn => {
    //     btn.addEventListener("click", () => {
    //       clearInterval(this.timer);
    //       this.manager.answerCurrent(btn.textContent);
    //       this.nextOrEnd();
    //     });
    //   });
  
    //   document.getElementById("bookmark").addEventListener("click", () => {
    //     this.manager.bookmarkCurrent();
    //     alert("Bookmarked!");
    //   });
    // }
    addEventListeners() {
      document.querySelectorAll(".option").forEach(btn => {
        btn.addEventListener("click", () => {
          clearInterval(this.timer);
          const selected = btn.textContent;
          const correct = this.manager.getCurrentQuestion().answer;
    
          // // Check if selected answer is correct at the time so submiting each answer you can uncomment this below code
          // if (selected === correct) {
          //   btn.style.backgroundColor = "lightgreen"; // green tick
          //   btn.innerHTML += " ✅";
          // } else {
          //   btn.style.backgroundColor = "#f8d7da"; // red cross
          //   btn.innerHTML += " ❌";
          // }
    
          // Disable all buttons
          document.querySelectorAll(".option").forEach(b => b.disabled = true);
    
          // Record answer
          this.manager.answerCurrent(selected);
    
          // Delay to show feedback before moving on
          setTimeout(() => this.nextOrEnd(), 500);
        });
      });
    
      document.getElementById("bookmark").addEventListener("click", () => {
        this.manager.bookmarkCurrent();
        alert("Bookmarked!");
      });
    }
    
  
    nextOrEnd() {
      if (this.manager.nextQuestion()) {
        this.renderQuestion();
      } else {
        this.showSummary();
      }
    }

    showSummary() {
      const { score, questions, bookmarked, userAnswers } = this.manager;
      this.container.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score} / ${questions.length}</p>
    
        <h3>Bookmarked Questions:</h3>
        <ul>
          ${bookmarked.map(id => `<li>Question ID: ${id}</li>`).join("")}
        </ul>
    
        <h3>Review:</h3>
        <ol>
          ${questions.map(q => {
            const userAns = userAnswers.get(q.id);
            const isCorrect = userAns === q.answer;
            const status = userAns === undefined ? '❓ Unanswered' : isCorrect ? '✅ Correct' : '❌ Wrong';
            return `
              <li class="each-review">
                <strong> ${q.question}</strong> ${status}<br/>
                Your Answer: <strong>${userAns || "Unanswered"}</strong><br/>
                Correct Answer: <strong>${q.answer}</strong>
              </li>
            `;
          }).join("")}
        </ol>
      `;
    }
    
  }
  