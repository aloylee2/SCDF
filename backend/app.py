# app.py
from flask import Flask
app = Flask(__name__)

@app.route('/api')
def home():
    return "Hello from backend!"

if __name__ == '__main__':
    app.run(debug=True)
