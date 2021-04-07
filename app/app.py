from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from hentai import Hentai, Format

# Removed for the reason that retrieving image from nHentai on Android is now working.
# import requests
# from PIL import Image
# from app.app_methods.img_to_data_url import img_to_data_url



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

            print(f"\n#{code} : success")
            print(f"title : {doujin.title()}")
            print(f"tags : {[tag.name for tag in doujin.tag]}")
            print(f"poster url : {doujin.image_urls[0]}\n")

            return {
                'id' : doujin.id,
                'title_release' : doujin.title(),
                'title_pretty' : doujin.title(Format.Pretty),
                'tags' : [tag.name for tag in doujin.tag],
                'poster_link' : doujin.image_urls[0],
                'artist' : [{
                    'name' : artist.name,
                    'url' : artist.url
                } for artist in doujin.artist]
                # 'poster_blob' : poster_blob
            }
        else:
            return None
    return None


if __name__ == '__main__':
    app.secret_key = '2500'
    app.run()