class BoggleGameboard {

  constructor() {
    this.seconds = 60;
    this.score = 0;
    this.words = [];
    this.timer = setInterval(this.tick.bind(this), 1000);

    $("#form").on("submit", this.handleSubmit.bind(this));
    $("#num_attempts").hide();
    $("#highscore").hide();
  }


  addWord(word) {
    $("#word_display").append($(`<p class='word_item'>${word}</p>`));
  }

  displayMsg(msg) {
    $("#msg").text(msg)
  }

  displayScore() {
    $("#score").text(`Score: ${this.score}`)
  }

  displayTimer() {
    $("#timer").text(`Seconds: ${this.seconds}`)
  }

  
  async handleSubmit(event) {
    event.preventDefault();
    const word = document.getElementById("form_input").value;
    const resp = await axios.get("/val", { params: {'word': word}});

      if (resp.data.result === "ok") {
        if (this.words.includes(word.toUpperCase())) {
          this.displayMsg("Word already added")
        } else {
          this.words.push(word.toUpperCase()); // tried using set to prevent duplicate words, but still added dup's to DOM anyway
          this.score += word.length;
          this.addWord(word)
          this.displayMsg("Added!")
        }
        
      } else if (resp.data.result === "not-on-board") {
        this.displayMsg("Not on the board")

      } else if (resp.data.result === "not-word") {
        this.displayMsg("Not a word")
      }

    this.displayScore();
    $("#form_input").val("");
  }


  async tick() {
    this.seconds -= 1;
    this.displayTimer();

    if (this.seconds > 0 && this.seconds <= 10) {
      $("#timer").css("color", "red");

    } else if (this.seconds === 0) {
      clearInterval(this.timer);
      $("#timer").hide()
      $("#msg").hide()
      await this.scoreGame();
    }
  }

  async scoreGame() {
    $("#form").hide();
    $("#num_attempts").show();
    const resp = await axios.post("/stats", { 'score': this.score });
    if (resp.data.brokeRecord) {
      $("#score").text(`New record: ${this.score}`);
    } else {
      $("#score").text(`Final score: ${this.score}`);
      $("#highscore").show();
    }
  }
}



let new_game = new BoggleGameboard()