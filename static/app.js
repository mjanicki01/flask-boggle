class BoggleGameboard {

  constructor() {
    this.seconds = 60;
    this.score = 0;
    this.words = [];
    this.timer = setInterval(this.tick.bind(this), 1000);

    $("#form").on("submit", this.handleSubmit.bind(this));
    $("#num_attempts").hide();
    $("#highscore").hide();

    $("#restart-btn").click(function(e){
      location.reload()
    })

    $("#restart-btn").hide();
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
  
 // Verify submitted word against words listed in words.txt
 // Return output based on verification result
  async handleSubmit(event) {
    event.preventDefault();
    const word = document.getElementById("form_input").value;
    const resp = await axios.get("/val", { params: {'word': word}});

      if (resp.data.result === "ok") {
        if (this.words.includes(word.toUpperCase())) {
          this.displayMsg("Word already added")
        } else {
          this.words.push(word.toUpperCase());
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

// Timer to reduce by 1 second, ending at 0. CSS styling unique for 0-10 seconds.
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

// Change front-end DOM using jQuery at end of game session.
// Post data to session & update front-end score & attempts based on response.
  async scoreGame() {
    $("#form").hide();
    $("#num_attempts").show();
    $("#restart-btn").show();
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