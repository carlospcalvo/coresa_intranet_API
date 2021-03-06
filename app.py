# Python standard libraries
import json
import os
import sqlite3
from collections import OrderedDict


# Third-party libraries
from flask import Flask, redirect, request, url_for, render_template, jsonify
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
import requests


# Internal imports
from db import init_db_command
from user import User

# Configuration
GOOGLE_CLIENT_ID =  os.environ.get("GOOGLE_CLIENT_ID", None)
#print(GOOGLE_CLIENT_ID)
GOOGLE_CLIENT_SECRET =  os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# Flask app setup
app = Flask(__name__, template_folder='templates')
#Flask and Flask-Login will use app.secret_key to cryptographically sign cookies and other items.
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

# User session management setup
# https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)

# Naive database setup
try:
    init_db_command()
except sqlite3.OperationalError:
    # Assume it's already been created
    pass

# OAuth 2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)

@app.route("/")
def index():
    return render_template('index.html')

# Flask-Login helper to retrieve a user from our db
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route("/arribos")
def arribos():
    if current_user.is_authenticated:
        return  render_template('arribos-comerciales.html')
    else:
        return render_template('404.html')


#render '<a class="button" style="display: flex; align-items:center; justify-content: center;" href="/login">Google Login</a>'

def get_google_provider_cfg():
    try:   
        return requests.get(GOOGLE_DISCOVERY_URL).json()
    except:
        return "Ooops. Couldn't reach Google.", 400

@app.route("/login")
def login():
    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@app.route("/login/callback")
def callback():
    # Get authorization code Google sent back
    code = request.args.get("code")

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send a request to get tokens
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Now that you have tokens (yay) let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    try:
        # You want to make sure their email is verified.
        # The user authenticated with Google, authorized your
        # app, and now you've verified their email through Google!
        if userinfo_response.json().get("email_verified"):
            unique_id = userinfo_response.json()["sub"]
            users_email = userinfo_response.json()["email"]
            picture = userinfo_response.json()["picture"]
            users_name = userinfo_response.json()["given_name"]
        else:
            return "User email not available or not verified by Google.", 400
    except:
        return redirect(url_for("index"))

    # Create a user in your db with the information provided
    # by Google
    user = User(
        id_=unique_id, name=users_name, email=users_email, profile_pic=picture
    )

    # Doesn't exist? Add it to the database.
    if not User.get(unique_id):
        User.create(unique_id, users_name, users_email, picture)

    # Begin user session by logging the user in
    login_user(user)

    # Send user back to homepage
    return redirect(url_for("index"))

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))

@app.route('/api/arribos', methods=['POST', 'GET'])
def arribos_json():
    json_file_path = os.getcwd() + '\\static\\data\\data.json'

    if request.method == 'POST':
        if request.data: 
            data = request.get_json()
            with open(json_file_path, 'w') as json_file:
                json.dump(data, json_file, sort_keys=False)
            return jsonify({'code': 200, 'success': 'data.json updated!'})
        else:
            return jsonify({'code': 204, 'error': 'Request received with empty body'})
    elif request.method == 'GET':
        with open(json_file_path, 'r') as json_file: 
            data = json.load(json_file, object_pairs_hook=OrderedDict) 
            jsonify(data)
        return json.dumps(data)
    else:
        return jsonify({'code': 400, 'error': 'bad request!'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', ssl_context="adhoc", debug=True)