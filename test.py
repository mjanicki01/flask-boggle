from unittest import TestCase

from werkzeug.utils import html
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


    def test_board_setup(self):
        with self.client:
            resp = self.client.get('/')
            self.assertIn('board', session)
            self.assertIn(b'highscore', resp.data)
            self.assertIn(b'num_attempts', resp.data)
            self.assertEqual(resp.status_code, 200)


    def test_impossible_word(self):
        self.client.get('/')
        resp = self.client.get('/val?word=onomatopoeia')
        json_resp = resp.get_data(as_text=True)
        self.assertIn('not-on-board', json_resp)
        self.assertEqual(resp.json['result'], 'not-on-board')  
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get('/val?word=021548')
        self.assertEqual(resp.json['result'], 'not-word')  
        self.assertEqual(resp.status_code, 200) 


    def test_word_on_board(self):
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [["A", "A", "A", "A", "A"], 
                                    ["A", "A", "A", "A", "A"], 
                                    ["A", "A", "A", "A", "A"], 
                                    ["A", "A", "A", "A", "A"], 
                                    ["A", "A", "A", "A", "A"]]   

        resp = self.client.get('/val?word=a')
        self.assertEqual(resp.json['result'], 'ok')
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get('/val?word=aaaa')
        self.assertEqual(resp.json['result'], 'not-word')
        self.assertEqual(resp.status_code, 200)


    def tearDown(self) -> None:
        return super().tearDown()
