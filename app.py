from flask import Flask, request, jsonify, render_template, session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = "flowers"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.debug = True

toolbar = DebugToolbarExtension(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    """Create board & add to session storage"""

    board = boggle_game.make_board()
    session['board'] = board
    num_attempts = session.get("num_attempts", 1)
    highscore = session.get("highscore", 0)

    return render_template("index.html", board = board, highscore = highscore, num_attempts = num_attempts)


@app.route('/val', methods=["GET"])
def val_word():
    """Checks if submitted word from form is in referenced .txt file"""

    input = request.args['word']
    board = session['board']
    word_stat = boggle_game.check_valid_word(board, input)

    return jsonify({'result': word_stat})

@app.route('/stats', methods=["POST"])
def stats():
    """Receives JSON score data and updates stats (number of attempts & current highscore in session)"""

    score = request.json["score"]
    num_attempts = session.get("num_attempts", 0)
    highscore = session.get("highscore", 0)
    session['num_attempts'] = num_attempts + 1
    session['highscore'] = max(score, highscore)
    return jsonify(brokeRecord = score > highscore)