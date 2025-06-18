from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Use DATABASE_URL env variable if set (inside Docker),
# else fallback to localhost connection string for local dev.
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql://scdf_username:scdf_password@localhost:5432/scdf_db'
)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Example model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

@app.route('/api')
def index():
    return {"message": "Backend connected to PostgreSQL!"}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
