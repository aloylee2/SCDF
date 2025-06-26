from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request
import os
import requests
from geopy.distance import geodesic
from datetime import datetime, timedelta

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

# @app.route('/aed_locations')
# def get_aed_locations():
#     dataset_id = "d_e8934d28896a1eceecfe86f42dd3c077"
#     url = f"https://data.gov.sg/api/action/datastore_search?resource_id={dataset_id}"
#     records = requests.get(url).json()['result']['records']

#     locations = []

#     for record in records:
#         postal = record.get('Postal_Code')
#         building = record.get('Building_Name', 'Unknown')
#         desc = record.get('Location_Description', '')

#         lat = lon = None
#         if postal:
#             try:
#                 resp = requests.get(
#                     "https://www.onemap.gov.sg/api/common/elastic/search",
#                     params={"searchVal": postal, "returnGeom": "Y", "getAddrDetails": "Y"}
#                 )
#                 data = resp.json()
#                 results = data.get("results", [])
#                 if results:
#                     lat = float(results[0]["LATITUDE"])
#                     lon = float(results[0]["LONGITUDE"])
#             except Exception as e:
#                 print(f"Geocode error for {postal}: {e}")

#         if lat and lon:
#             locations.append({
#                 "latitude": lat,
#                 "longitude": lon,
#                 "building": building,
#                 "description": desc,
#                 "postal_code": postal
#             })

#     return jsonify(locations)
    
@app.route('/aed' ,methods =['GET'])
def aedlocation():
    aedlocation.aedPlace



locations = []

@app.route('/aed-locations', methods=['GET', 'POST'])
def get_aed_locations():
    data = request.get_json()
    patient_lat = data.get('latitude')
    patient_lon = data.get('longitude')
    patient_coords = (patient_lat, patient_lon)

    dataset_id = "d_e8934d28896a1eceecfe86f42dd3c077"
    url = f"https://data.gov.sg/api/action/datastore_search?resource_id={dataset_id}"
    records = requests.get(url).json()['result']['records']

    if not locations:
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
                aed_coords = (lat, lon)
                distance_m = geodesic(patient_coords, aed_coords).meters

                # Only keep AEDs within 400m
                if distance_m > 0:
                    locations.append({
                        "latitude": lat,
                        "longitude": lon,
                        "building": building,
                        "description": desc,
                        "postal_code": postal,
                        "distance_m": round(distance_m, 1)
                    })

    # Sort by distance ascending
    locations.sort(key=lambda x: x["distance_m"])

    return jsonify(locations)

_incidents = {}
_next_incident_id = 1
# last updated User's Location
user_locations = {
    "cfr1" : {"latitude": 1.3521, "longitude": 180.1},
    "cfr2" : {"latitude": 1.3501, "longitude": 180.2} # we hard code this for now but we will remove later this is for testings as of now
    # we need to confirm the ID of the emulator and 
    # also think of a way to periodically update the location of the emulator
    # how do we also identify the emulators (e.g. emulator A and emulator b)
    
}

@app.route('/case-create', methods=['POST'])
def create_incident():
    data = request.get_json()
    lat = data.get('latitude')
    lon = data.get('longitude')
    global _next_incident_id
    inc = {
        "id": _next_incident_id,
        "latitude": lat,
        "longitude": lon,
        "responders": {
            "cfr2" : {} # we hard code this for now but we will remove later this is for testings as of now
        }
    }
    _incidents[_next_incident_id] = inc
    _next_incident_id += 1

    # Check for nearby responders within <=400m
    nearby_users = []
    patient_coords = (inc["latitude"], inc["longitude"])
    for user_id, loc in user_locations.items():
        user_coords = (loc['latitude'], loc['longitude'])
        distance = geodesic(patient_coords, user_coords).meters
        if distance <= 400:
            nearby_users.append({"user_id": user_id, "distance": distance})

    # A way to notify nearby users a case is happening then popup case acceptance form
    return jsonify({
        "incident": inc,
        "nearby_users": nearby_users
    })
    

def get_incident(incident_id):
    return _incidents.get(incident_id)

def list_incidents():
    return list(_incidents.values())

class RoleAllocationEngine:
    # Role engine rough idea
    # States of differing factors
    roles = ["CPR_Hero", "AED_Buddy","Paramedic_Receiver"]
    roles_taken = []
    responderA = None # this is for emulator one
    responderB = None # this is for emulator two
    
    # One question: How do we isolate one case from another case so that this pool of roles are keep to this specific case
    # I understand that our prototype is going to be only two emulators so is this a consideration or we ignore it

    def is_role_no_change(responders, incident, roles) -> bool:
        # return True if this responder stays in the same role
        pass
        
    def is_within_distance(responder, incident, threshold_m):
        # this will work hand in hand with assign_roles_to_responder
        pass
        
    def has_time_elapsed(responder, incident, max_minutes) -> bool:
        # i think if we using the python function we dont need use this function
        pass
        
    def assign_role_to_responder(role: str, responder_to: str):
        # assign roles to the CFRs
        # look at the global pool of roles for the user
        pass
        
    def swap_objectives(responders_from: str, responder_to: str):
        # objective swap function with outgoing request
        pass
        
    def force_swap(responder_from: str, responder_to: str):
        # objective swap functions forced
        pass

    def disabilityChecker(responder, disability):
        # backend/services/role_service.py

        # Keys should match whatever string you use for roles in your app.
        ROLE_ALLOWED_DISABILITIES = {
            "CPR_Heroes_1/2": {
                "hearing_impairment",
                "speech_impairment",
            },
            "AED_Buddy": {
                "hearing_impairment",
                "speech_impairment",
            },
            "Aid_Assistant": {
                "mobility_impairment",
                "limb_differences_waist_down",
            },
            "Crowd_Controller": {
                "hearing_impairment",
                "mobility_impairment",
                "limb_differences_waist_down",
                "limb_differences_above_waist",
            },
            "Paramedic_Receiver": {
                "limb_differences_above_waist",
            },
        }

        pass

    def isThereFiveResponder(responderCount) -> bool:
        # a check to make sure that there are less than 6 responders
        pass

    def isAEDCollected(AED_State) -> bool:
        # this check is for the delegation of the AED role (e.g. if we still need to give out AED buddy role)
        # also if we want to make the second CFR collect the AED (if uncollected) or go to the scene if the AED is already collected
        pass
        
    def role_engine(responder_from):
        # main function
        pass

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)