from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from hentai import Hentai, Format


app = Flask(
    __name__, 
    static_url_path="/templates"
)
app.debug = True
app.host = "192.168.254.119"

# route for index page
@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('home.html')

# route for nuking code
@app.route('/nuke_codes', methods=['POST'])
def nuke_codes():
    if request.method == 'POST':
        data = request.get_json()
        code = data['code']
        print(data)
        if (Hentai.exists(code)):
            doujin = Hentai(code)
            print(f"Success! {code}")
            print(doujin)
            return {
                'id' : doujin.id,
                'title_release' : doujin.title(),
                'title_pretty' : doujin.title(Format.Pretty),
                'tags' : [tag.name for tag in doujin.tag],
                'poster_link' : doujin.image_urls[0]
            }
        else:
            return None
    return None


if __name__ == '__main__':
    app.secret_key = '2500'
    app.run(
        host='0.0.0.0',
        port='8080'
    )