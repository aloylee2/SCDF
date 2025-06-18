from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify
import os
import requests

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

@app.route('/aed_locations')
def get_aed_locations():
    dataset_id = "d_e8934d28896a1eceecfe86f42dd3c077"
    url = f"https://data.gov.sg/api/action/datastore_search?resource_id={dataset_id}"
    records = requests.get(url).json()['result']['records']

    locations = []

    for record in records:
        postal = record.get('Postal_Code')
        building = record.get('Building_Name', 'Unknown')
        desc = record.get('Location_Description', '')

        lat = lon = None
        if postal:
            try:
                resp = requests.get(
                    "https://www.onemap.gov.sg/api/common/elastic/search",
                    params={"searchVal": postal, "returnGeom": "Y", "getAddrDetails": "Y"}
                )
                data = resp.json()
                results = data.get("results", [])
                if results:
                    lat = float(results[0]["LATITUDE"])
                    lon = float(results[0]["LONGITUDE"])
            except Exception as e:
                print(f"Geocode error for {postal}: {e}")

        if lat and lon:
            locations.append({
                "latitude": lat,
                "longitude": lon,
                "building": building,
                "description": desc,
                "postal_code": postal
            })

    return jsonify(locations)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
