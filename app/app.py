from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from hentai import Hentai, Format


app = Flask(
    __name__, 
    static_url_path="/templates"
)
app.debug = True

# route for index page
@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('home.html')

# route for nuking code
@app.route('/nuke_codes', methods=['POST'])
def nuke_codes():
    if request.method == 'POST':
        data = request.get_json()
        return data
    return None


class NukeCode (Form):
    premature_code = TextAreaField()



if __name__ == '__main__':
    app.secret_key = '2500'
    app.run()