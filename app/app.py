from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from hentai import Hentai, Format
import requests
from PIL import Image

# app methods
from app.app_methods.img_to_data_url import img_to_data_url



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
        code = data['code']
        print(data)
        if (Hentai.exists(code)):
            doujin = Hentai(code)
            print(f"Success! {code}")
            print(doujin)

            poster_img_data = Image.open(requests.get(doujin.image_urls[0], stream=True).raw)
            poster_blob = img_to_data_url(poster_img_data)

            return {
                'id' : doujin.id,
                'title_release' : doujin.title(),
                'title_pretty' : doujin.title(Format.Pretty),
                'tags' : [tag.name for tag in doujin.tag],
                'poster_link' : doujin.image_urls[0],
                'poster_blob' : poster_blob
            }
        else:
            return None
    return None


if __name__ == '__main__':
    app.secret_key = '2500'
    app.run()