from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request
import os
import requests
from geopy.distance import geodesic
from datetime import datetime, timedelta
import threading

from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

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



# ==================================================================
# AED Location Logic
# ==================================================================

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

    if not locations: 
        dataset_id = "d_e8934d28896a1eceecfe86f42dd3c077"
        url = f"https://data.gov.sg/api/action/datastore_search?resource_id={dataset_id}"
        records = requests.get(url).json()['result']['records']

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

# ==================================================================
# Incident Class
# ==================================================================

incidents = []

class Incident:
    def __init__(self, latitude, longitude):
        self.__id = len(incidents) + 1
        self.__latitude = latitude
        self.__longitude = longitude
        self.__datetime = datetime.now() # Example output: 2025-06-29 14:23:45.123456
        # now_str = now.strftime("%Y-%m-%d %H:%M:%S")
        
    def get_incident_Id(self):
        return self.__id
    
    def get_latitude(self):
        return self.__latitude
    
    def get_longitude(self):
        return self.__longitude
    
    def get_datetime(self):
        return self.__datetime


# # Example usage:
# incident1 = Incident(1.3521, 103.8198)
# print(incident1.get_latitude())  # get: prints 1.3521

# incident1.set_latitude(1.3000)   # set: changes latitude
# print(incident1.get_latitude()) 
    
# TODO: Implement logic to find nearby responders
# 'Database' last updated User's Location
# user_locations = {
#     "cfr1" : {"latitude": 1.3521, "longitude": 180.1},
#     "cfr2" : {"latitude": 1.3501, "longitude": 180.2} # we hard code this for now but we will remove later this is for testings as of now
#     # we need to confirm the ID of the emulator and 
#     # also think of a way to periodically update the location of the emulator
#     # how do we also identify the emulators (e.g. emulator A and emulator b)
# }

# @app.route('/case-create', methods=['POST'])
# def create_incident():
#     data = request.get_json()
#     lat = data.get('latitude')
#     lon = data.get('longitude')
#     global _next_incident_id
#     inc = {
#         "id": _next_incident_id,
#         "latitude": lat,
#         "longitude": lon,
#         "responders": {
#             "cfr2" : {} # we hard code this for now but we will remove later this is for testings as of now
#         }
#     }

    # TODO: Implement logic to find nearby responders
    # # Check for nearby responders within <=400m
    # nearby_users = []
    # patient_coords = (inc["latitude"], inc["longitude"])
    # for user_id, loc in user_locations.items():
    #     user_coords = (loc['latitude'], loc['longitude'])
    #     distance = geodesic(patient_coords, user_coords).meters
    #     if distance <= 400:
    #         nearby_users.append({"user_id": user_id, "distance": distance})

    # A way to notify nearby users a case is happening then popup case acceptance form
    # return jsonify({
    #     "incident": inc,
    #     "nearby_users": nearby_users
    # })
    

# ==================================================================
# R Role Engine Class
# ==================================================================
class Responder:
    def __init__(self):
        self.__emulatorId = None
        self.__role = None
        self.__latitude = None
        self.__longtitude = None
        self.__disabilities = []
        self.__isInNoChangeRadius = 0 # Identify if user entered role no-change radius 
        self.__roleChangeCounter = 0 # if above two swaps we mark CFR not able to swap roles
        self.__case_acceptance_time = datetime.now() # Time when the responder attended the incident
        
    # ========= Getter =========
    def get_emulatorId(self):
        return self.__emulatorId
    
    def get_role(self):
        return self.__role
    
    def get_location(self): # i put liddat first cause idk how you gonna declare the lat and long
        return (self.__latitude, self.__longtitude)
    
    def get_latitude(self): # and if you using the above one then remove this and the bottom one
        return self.__latitude
    
    def get_longtitude(self): # remove this also if using get_location
        return self.__longtitude
    
    def get_disabilities(self):
        return self.__disabilities
    
    def get_isInNoChangeRadius(self):
        return self.__isInNoChangeRadius
    
    def get_roleChangeCounter(self):
        return self.__roleChangeCounter
    
    def get_case_acceptance_time(self):
        return self.__case_acceptance_time
    
    # ========= Setter =========
    def set_role(self, newRole):
        self.__role = newRole
    
    def set_location(self, lat, long):
        self.__latitude = lat
        self.__longtitude = long
        
    def update_disabilities(self, newDisabilities):
        # there is confirm a more efficent way to do this checks but i speed coding rn.
        self.__disabilities = newDisabilities
    
    def set_isInNoChangeArea(self, radiusStatus):
        if radiusStatus:
            self.__isInNoChangeRadius = 1
            return True
        return False
    
    # ========= Class Functions =========
    def is_role_no_change(self, incident_location):
        # return True if this responder stays in the same role
        distance = geodesic(self.get_location, incident_location)
        if 0 < distance <= 50:
            self.set_isInNoChangeArea(True)
            return True
        else:
            self.set_isInNoChangeArea(False)
            return False

class RoleAllocationEngine:
    # Role engine rough idea
    # States of differing factors
    
    def __init__(self):
        self.__cfrCount = 0
        self.__AEDCollectedBy = []
        self.__roles = ["CPR_Hero", "AED_Buddy", "Assistant"]
        self.__roles_taken = []
        self.__listOfResponders = []
        self.lock = threading.Lock()
        
    # ========Getters========
    def get_cfrCount(self):
        return self.__cfrCount
    
    def get_isAEDCollectedBy(self):
        return self.__AEDCollectedBy
    
    def get_roles(self):
        return self.__roles
    
    def get_roles_taken(self):
        return self.__roles_taken
    
    def get_listOfResponders(self):
        return self.__listOfResponders
    
    def get_last_responder(self):
        with self.lock:
            if self.__listOfResponders:
                return self.__listOfResponders[-1]
            return None
    
    # ========Setters========
    def add_responder(self, responderId):
        self.__listOfResponders.append(responderId)
        self.__cfrCount += 1
    
    # ========Class Functions========
    def is_role_no_change(self, responders, incident, roles) -> bool:
        # return True if this responder stays in the same role
        pass
        
    def is_within_distance(self, responder, incident, threshold_m):
        # this will work hand in hand with assign_roles_to_responder
        pass
        
    def has_time_elapsed(self, responder, incident, max_minutes) -> bool:
        # i think if we using the python function we dont need use this function
        pass
        
    def assign_role_to_responder(self, role: str, responder_to: str):
        # assign roles to the CFRs
        # look at the global pool of roles for the user
        pass
        
    def swap_objectives(self, responders_from: str, responder_to: str):
        # objective swap function with outgoing request
        pass
        
    def force_swap(self, responder_from: str, responder_to: str):
        # objective swap functions forced
        pass

    def disabilityChecker(self, responder, disability):
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

        #Sean: i think this is correct hahahah
    def isMaxResponderCount(self) -> bool:
        # a check to make sure that there are less than 6 responders
        return self.__cfrCount < 6
    
    # TODO: Come back and amend the logic if the time variable is wrong
    def compare_acceptance_times(self, responder):
        with self.lock:
            first_responder = self.get_last_responder()
            if first_responder and first_responder != responder:
                time_diff = abs((responder.get_case_acceptance_time() - first_responder.get_case_acceptance_time()).total_seconds()) # this part
                threshold = 0.5
                if time_diff < threshold:
                    print("Responders accepted at same time!")
                else: 
                    print("Responder accepted at different times!")
            pass
                    
    
    def isAEDCollectedStateChecker(self, AED_State) -> bool:
        # this check is for the delegation of the AED role (e.g. if we still need to give out AED buddy role)
        # also if we want to make the second CFR collect the AED (if uncollected) or go to the scene if the AED is already collected
        pass
        
    # Main function
    def role_engine(self, responder, incident,):
        # Case broadcast close
        if self.isMaxResponderCount() and True: # Placeholder to check if broadcast system is still up 
            return # TODO: Placeholder: Case broadcast close
        
        responders = self.get_listOfResponders()
        if self.get_cfrCount() > 0:
            if (responder.get_case_acceptance_time() - responders[self.get_cfrCount()-1].get_case_acceptance_time()):
                pass
        




# ==================================================================
# TODO: Info for Sean    
# @app.route('/case-create', methods=['POST'])
# def scenarioa():
#     responder1 = responder1
#     roleAssignment = roleengine.addResponder(responder1)

#     return roleAssignment


# ==================================================================
# Role Allocation Logic
# ==================================================================
incidents.append(Incident(1.3513, 103.8443))
roleEngine = RoleAllocationEngine()

assigned_roles = {} # hold the roles assigned to users

@app.route('/assign-role', methods=['POST'])
def assign_role():
    data = request.json
    device_id = data.get('device_id')
    print(f"Received device_id: {device_id}")
    print("Current assigned roles:", assigned_roles)

    if device_id in assigned_roles:
        role = assigned_roles[device_id]
    elif "A" not in assigned_roles.values():
        role = "A"
        assigned_roles[device_id] = role
    elif "B" not in assigned_roles.values():
        role = "B"
        assigned_roles[device_id] = role
    else:
        role = "None"
    
    roleEngine.add_responder(device_id)

    print(f"Assigned role for {device_id}: {role}")
    return jsonify({"role": role, "assigned_at": datetime.utcnow().isoformat()})
