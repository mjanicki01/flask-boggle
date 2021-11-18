from flask import Flask, request, jsonify, render_template, redirect, session, flash
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = "flowers"
app.debug = True

toolbar = DebugToolbarExtension(app)

board = boggle_game.make_board()
found_words=[]

@app.route('/')
def index():
    session['score'] = 0
    session['board'] = board
    return render_template("index.html", board = board)

@app.route('/', methods=['GET', 'POST'])
def submit_form():
    input = request.form.get('name')
    session['status'] = boggle_game.check_valid_word(board, input)

    if session['status'] == 'not-on-board':
        flash("This word is not on the board")

    if session['status'] == 'ok':

        if input in session['found_words']:
            flash("This word is on the board, but you've already found it")    

        elif input not in found_words:
            session['score'] += 1
            found_words.append(input)
            session['found_words'] = found_words
            flash("This word is on the board")

    elif session['status'] == 'not-word':
        flash("This word is not a word")

    return render_template("index.html", input = input)