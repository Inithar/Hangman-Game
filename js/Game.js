import { Quote } from "./Quote.js";

class Game {
  currentStep = 0;
  lastStep = 9;

  constructor({
    lettersWrapper,
    word,
    hint,
    hintBtn,
    playAgainBtn,
    gallowImg,
  }) {
    this.lettersWrapper = lettersWrapper;
    this.word = word;
    this.hint = hint;
    this.hintBtn = hintBtn;
    this.playAgainBtn = playAgainBtn;
    this.gallowImg = gallowImg;
    this.quote;
    this.correctLetterSound = new Audio("../assets/yes.wav");
    this.incorrectLetterSound = new Audio("../assets/no.wav");
  }

  guess(event, letter) {
    const clickedButton = event.target;
    clickedButton.disabled = true;

    if (this.quote.guess(letter)) {
      this.drawQuote();
      this.correctLetterSound.play();
      clickedButton.classList.add("letter-btn--correct");
    } else {
      this.currentStep++;
      this.incorrectLetterSound.play();
      clickedButton.classList.add("letter-btn--incorrect");
      this.gallowImg.setAttribute(
        "src",
        `./assets/img/step${this.currentStep}.jpg`
      );

      if (this.currentStep == this.lastStep) {
        this.showResult("lost");
      }
    }
  }

  drawLetters() {
    for (let i = 0; i < 26; i++) {
      const label = (i + 10).toString(36);
      const button = document.createElement("button");
      button.textContent = label;
      button.classList.add("letter-btn");
      button.addEventListener("click", (event) => this.guess(event, label));
      this.lettersWrapper.append(button);
    }
  }

  drawQuote() {
    const content = this.quote.getContent();
    this.word.textContent = content;
    if (!content.includes("_")) this.showResult("win");
  }

  async getQuote() {
    try {
      const response = await fetch("https://random-words-api.vercel.app/word");
      const data = await response.json();
      this.quote = new Quote(data[0].word.toLowerCase());
      this.hint.textContent = data[0].definition;
      this.drawQuote();
    } catch (error) {
      console.log(error);
    }
  }

  async changeScreenView(view) {
    if (view === "gameScreen") {
      await this.getQuote();
      this.drawLetters();
      this.hintBtn.classList.remove("hide-hint-btn");
      this.hintBtn.style.cursor = "pointer";
      this.playAgainBtn.classList.remove("show-play-again-btn");
      this.currentStep = 0;
      this.gallowImg.setAttribute(
        "src",
        `./assets/img/step${this.currentStep}.jpg`
      );
    } else {
      this.hintBtn.classList.add("hide-hint-btn");
      this.playAgainBtn.classList.add("show-play-again-btn");
      this.hint.classList.remove("show-hint");
      this.lettersWrapper.innerHTML = "";
    }
  }

  showResult(result) {
    const sentence =
      result === "win" ? "Congratulation!" : "Unfortunately you have lost.";

    this.word.textContent = `${sentence} The correct password is: ${this.quote.text.toUpperCase()}`;
    this.changeScreenView("resultScreen");
  }

  start() {
    this.drawLetters();
    this.getQuote();

    this.hintBtn.addEventListener("click", () => {
      this.hint.classList.add("show-hint");
      this.hintBtn.style.cursor = "default";
    });

    this.playAgainBtn.addEventListener("click", () => {
      this.changeScreenView("gameScreen");
    });
  }
}

const hangman = new Game({
  lettersWrapper: document.querySelector(".letters"),
  word: document.querySelector(".word"),
  hint: document.querySelector(".hint"),
  hintBtn: document.querySelector(".hint-btn"),
  playAgainBtn: document.querySelector(".play-again-btn"),
  gallowImg: document.querySelector(".gallows__img"),
});

hangman.start();
