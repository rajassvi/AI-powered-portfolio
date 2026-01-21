from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

# --------------------------------------------------
# App Setup
# --------------------------------------------------
app = Flask(__name__)

# --------------------------------------------------
# Load .env variables
# --------------------------------------------------
load_dotenv()

# --------------------------------------------------
# Flask-Mail (Gmail SMTP) Configuration
# --------------------------------------------------
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

# --------------------------------------------------
# Page Routes
# --------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/contact")
def contact_page():
    return render_template("contact.html")

@app.route("/projects/cooks-on-call")
def cooks_on_call():
    return render_template("cooks-on-call.html")

@app.route("/projects/blockvote")
def blockvote():
    return render_template("blockvote.html")

# --------------------------------------------------
# Contact Form API (POST)
# --------------------------------------------------
@app.route("/contact", methods=["POST"])
def contact_submit():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    budget = data.get("budget")
    message = data.get("message")

    msg = Message(
        subject=f"New Contact Form Message: {subject}",
        recipients=[app.config['MAIL_USERNAME']]
    )

    msg.body = f"""
New contact form submission:

Name: {name}
Email: {email}
Budget: {budget}

Message:
{message}
"""

    try:
        mail.send(msg)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# --------------------------------------------------
# App Run
# --------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
