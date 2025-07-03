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

@app.route('/aed-locations', methods=['POST'])
def get_aed_locations():
    data = request.get_json()
    patient_lat = data.get('latitude')
    patient_lon = data.get('longitude')

    max_results = data.get('max_results', 50)

    if patient_lat is None or patient_lon is None:
        return jsonify({"error": "Missing latitude or longitude"}), 400

    if not locations:
        patient_coords = (patient_lat, patient_lon)

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

                if 0 < distance_m <= 800:
                    locations.append({
                        "latitude": lat,
                        "longitude": lon,
                        "building": building,
                        "description": desc,
                        "postal_code": postal,
                        "distance_m": round(distance_m, 1)
                    })

        locations.sort(key=lambda x: x["distance_m"])
    limited_locations = locations[:max_results]
    print(f"Locations: {len(locations)}, Limited Locations: {len(limited_locations)}")
    return jsonify(limited_locations)

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
    
    def get_location(self):
        return (self.__latitude, self.__longitude)
    
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
# Role Engine Class
# ==================================================================
class Objectives:
    def __init__(self):
        self.__currentIndex = 0
        self.__listOfObjectives = {"cpr_hero": ["chobj1", "chobj2", "chobj3"], 
                                   "aed_buddy": ["abobj1", "abobj2", "abobj3"],
                                   "assistant": ["aobj1", "aobj2", "aobj3"]}
        self.__tag = None       # this will take the key of the roles to help us track the key of the listOfObjectives e.g. cpr_hero, aed_buddy, etc 
        
    # ========== Getter ==========
    def get_currentObjectives(self):
        if self.__tag and self.__tag in self.__listOfObjectives:
            return self.__listOfObjectives[self.__tag][self.__currentIndex]
        return None
    
    def get_listOfObjectives(self):
        return self.__listOfObjectives
    
    def get_tag(self):
        return self.__tag
    
    # ========== Setter ==========
    def set_tag(self, tag):
        self.__tag = tag
        self.__currentIndex = 0
        
    def next_objectives(self):
        if self.__tag and self.__tag in self.__listOfObjectives:
            if self.__currentIndex + 1 < len(self.__listOfObjectives[self.__tag]):
                self.__currentIndex += 1
                return self.get_currentObjectives()
        return None
        

    

class Responder:
    def __init__(self):
        self.__emulatorId = None
        self.__screenId = None
        self.__role = None
        self.__latitude = None
        self.__longtitude = None
        self.__disabilities = []
        self.__currentObject = "Get to scene"
        self.__isInNoChangeRadius = False # Identify if user entered role no-change radius 
        self.__roleChangeCounter = 0 # if above two swaps we mark CFR not able to swap roles
        self.__case_acceptance_time = None # Time when the responder attended the incident
        self.__objectivesClass = Objectives()
        
    # ========= Getter =========
    def get_emulatorId(self):
        return self.__emulatorId
    
    def get_screenId(self):
        return self.__screenId
    
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
    
    def get_current_objective(self):
        return self.__currentObject
    
    def get_objectivesClass(self):
        return self.__objectivesClass
    
    # ========= Setter =========
    def set_emulatorId(self, emulatorId):
        self.__emulatorId = emulatorId
    
    def set_screenId(self, screenId):
        self.__screenId = screenId
    
    def set_role(self, newRole):
        self.__role = newRole
    
    def set_location(self, lat, long):
        self.__latitude = lat
        self.__longtitude = long
        
    def set_current_objective(self, objective):
        self.__currentObject = objective
        
    def update_disabilities(self, newDisabilities):
        self.__disabilities = newDisabilities
    
    def set_isInNoChangeArea(self, radiusStatus):
        self.__isInNoChangeRadius = radiusStatus
    
    def set_case_acceptance_time(self):
        self.__case_acceptance_time = datetime.now()
    
    # ========= Class Functions =========
    pass

class RoleAllocationEngine:
    # Role engine rough idea
    # States of differing factors
    
    def __init__(self):
        self.__cfrCount = 0
        self.__AEDCollectedBy = []
        self.__roles = ["cpr_hero", "aed_buddy", "assistant"]
        self.__roles_taken = {} # e.g. key = roles | value = device_id 
        self.__listOfResponders = []
        self.lock = threading.Lock()
        self.__AEDTag = None #Keep track of main person collecting AED
        
    # ========Getters========
    def get_cfrCount(self):
        return self.__cfrCount
    
    def get_AEDTag(self):
        return self.__AEDTag

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
    def add_responder(self, responder):
        responder.set_case_acceptance_time()
        self.__listOfResponders.append(responder)
        self.__cfrCount += 1
    
    def set_roles_taken(self, responderId, role):
        try:
            self.__roles_taken[role] = responderId
            return True
        except Exception as e:
            print(f"Unable to assign role: {role} to user: {responderId}")
            return False

    def set_AEDTag(self, responder_id):
        self.__AEDTag = responder_id
    
    # ========Class Functions========
    def is_role_no_change(self, responder) -> bool:
        return responder.get_isInNoChangeRadius()
        
    def is_within_distance(self, responder, incident, threshold_m) -> bool:
        # this will work hand in hand with assign_roles_to_responder
        if geodesic(responder.get_location(), incident.get_location()).meters <= threshold_m:
            return True
        return False
    
    # TODO: I put this here i later check again
    def check_and_assign_role(self, responder, incident, role):
        if self.is_within_distance(responder, incident, 50):  # 50 meters as example
            responder.set_role(role)
            # You can also update any state or notify the frontend here
    
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

        non_CPR_AED_roles = ["hearing_impairment", "mobility_impairment", "limb_differences_waist_down", "limb_differences_above_waist"]

        # 0 -> Capable of CPR & AED
        # 1 -> Not capable of CPR & AED
        if not disability:
            return 0 
        else:
            if disability in non_CPR_AED_roles:
                return 1
            return 0
    
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
            "AED_Buddy": {
                "hearing_impairment",
                "speech_impairment",
            },
            "AED_Buddy": {
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
        
    def isAEDCollectedStateChecker(self, AED_State) -> bool:
    # this check is for the delegation of the AED role (e.g. if we still need to give out AED buddy role)
    # also if we want to make the second CFR collect the AED (if uncollected) or go to the scene if the AED is already collected
        pass
        
    def isMaxResponderCount(self) -> bool:
        # a check to make sure that there are less than 6 responders
        return self.__cfrCount == 6
    
    # TODO: Come back and amend the logic if the time variable is wrong


    def compare_acceptance_times(self):
        with self.lock:
            responders = self.get_listOfResponders()
            print(f"No. of responder: {len(responders)}")
            for responder in responders:
                print(responder)
            # Sort responders by acceptance time
            sorted_responders = sorted(
                responders, 
                key=lambda r: r.get_case_acceptance_time()
            )
            # Example: print time differences and group those within threshold
            threshold = 5  # seconds
            grouped = []
            group = [sorted_responders[0]]
            for i in range(1, len(sorted_responders)):
                prev = sorted_responders[i-1]
                curr = sorted_responders[i]
                time_diff = abs(
                    (curr.get_case_acceptance_time() - prev.get_case_acceptance_time()).total_seconds()
                )
                if time_diff < threshold:
                    group.append(curr)
                else:
                    grouped.append(group)
                    group = [curr]
            grouped.append(group)  # add last group

            # Now, grouped contains lists of responders who accepted at (almost) the same time
            for idx, group in enumerate(grouped):
                print(f"Group {idx+1}: {[r.get_emulatorId() for r in group]}")

            return grouped  # or use this grouping for your role allocation logic
            # btw this returns like something like this
            # [ResponderA, ResponderB],   # Group 1: accepted at almost the same time
            # [ResponderC, ResponderD],   # Group 2: accepted at almost the same time
            # [ResponderE]                # Group 3: accepted alone

    # TODO: Kaibao
    def compare_acceptance_times2(self):
        # user comes in
        # If anyone accept before this user within 0.5s
        # Yes: user added to temp[]
        # No: user added to new temp[]
        # every 0.1s loop to wait for new thread
        # If new thread comes in, repeat loop
        # Once loop complete, return temp[] # temp[] with 1 means diff time, temp[] with >1 means within 0.5s
        pass
    
    # Main function
    def role_engine(self, responder_id, incident, responder=None):
        # Case broadcast close
        print(f"Starting flow chart checks... CFR Count= {self.get_cfrCount()}")
        if self.isMaxResponderCount() and True: # Placeholder to check if broadcast system is still up 
            # TODO: Placeholder: Close broadcast
            print("RoEgn::: :::Max CFR, closing broadcast...")
            return("Max CFR, closing broadcast...")
        
        # TODO: Kaibao: check if responder response time is 0.5sec after call, then no need to comapre acceptance time
        # grouped_responders = self.compare_acceptance_times() # Need to fix
        # grouped_responders = self.compare_acceptance_times2()
        grouped_responders = [[responder]]
        
        print("Big Checker")
        if self.get_cfrCount() > 0: #TODO:  max two disability
            print(f"CFR Attending Count = {self.get_cfrCount()}")
            for group in grouped_responders:
                currResponder : Responder = Responder()
                # Acceptance time check (Same/Diff.)
                if len(group) > 1: # 2 or more CFR accepted same time
                    # print(f"Group with multiple responders: {[r.get_emulatorId() for r in group]}") # (Same time responders)Handle logic for groups with more than one responder
                    for currResponder in group: # Now slowly send each responder in the isolated group further down the role engine
                        pass
                else: # CFR accepting diff. time
                    # print(f"Single responder in group: {group[0].get_emulatorId()}") # (Individual different time responders) Handle logic for single responders
                    for currResponder in group: # Now slowly send each responder in the isolated group further down the role engine
                        print(f"RoEgn::: :::Checking responder {currResponder.get_emulatorId()}")
                        ### Check user disability
                        if self.disabilityChecker(currResponder, currResponder.get_disabilities()) == 0: # Can do CPR & AED
                            ### Check if user entered No-Change radius before
                            if self.is_role_no_change(currResponder) == True:
                                # CONTINUE ROLE/TASK OR IF WE WANT TO DO TASK CHECK/UPDATE
                                print("RoEgn::: :::Continue ROLE/TASK")
                                return("Continue ROLE/TASK")
                            else:
                                # User no role & never entered radius
                                ### Check if user position is in/out of No-Change Radius to determine next step
                                if self.is_within_distance(currResponder, incident, 50): 
                                    # User just entered No-Change Radius
                                    ### Check what role has been taken
                                    if self.get_roles()[0] not in self.get_roles_taken(): ######################## First: Check if CPR HERO open
                                        # ASSIGN RESPONDER WITH CPR HERO
                                        self.set_roles_taken(currResponder, self.get_roles()[0]) 
                                        currResponder.set_isInNoChangeArea(True)
                                        print("RoEgn::: :::ASSIGNED TO CPR HERO")
                                        return("ASSIGNED TO CPR HERO")
                                    elif self.get_roles()[1] not in self.get_roles_taken(): ###################### Second: Check if AED BUDDY open
                                        ### Second part 1: Check if user has Collected AED
                                        taggedAEDResponder = self.get_AEDTag()
                                        if currResponder.get_emulatorId() in self.get_isAEDCollectedBy(): 
                                            # ASSIGN RESPONDER WITH AED BUDDY
                                            self.set_roles_taken(currResponder, self.get_roles()[1])
                                            currResponder.set_isInNoChangeArea(True)
                                            print("RoEgn::: :::ASSIGNED TO AED BUDDY")
                                            return("ASSIGNED TO AED BUDDY")
                                        ### Second part 2.1: If nobody is collecting AED
                                        elif taggedAEDResponder is None:
                                            # TAG RESPONDER TO COLLECT AED
                                            self.set_AEDTag(currResponder.get_emulatorId())
                                            print("RoEgn::: :::Responder tagged to COLLECT AED")
                                            return("Responder tagged to COLLECT AED")
                                        ### Second part 2.2: If somebody is collecting AED
                                        elif taggedAEDResponder is not None: 
                                            ### Check if current user is Tagged Responder else compare who is closer to AED
                                            if taggedAEDResponder == currResponder.get_emulatorId():
                                                # CONTINUE GETTING AED
                                                print("RoEgn::: :::Responder already tagged, continue to COLLECT AED")
                                                return("Responder already tagged, continue to COLLECT AED")
                                            else:
                                                ### Check if current user is closer to AED by 100m with Person Tagged with AED
                                                if True:
                                                    # Shorter by 100m
                                                    # GIVE currResponder TASK TO GET AED & UPDATE AEDTag
                                                    # UPDATE other original AEDTagged to go to scene
                                                    print("RoEgn::: :::TASK UPDATE currResponder to get AED, original AEDTagged to go Scene")
                                                    return("TASK UPDATE currResponder to get AED, original AEDTagged to go Scene")
                                                else:
                                                    # Not Shorter by 100m
                                                    print("RoEgn::: :::Proceed to SCENE p1")
                                                    return("Proceed to SCENE p1")
                                    else: ######################################################################### Third: ASSISTANCE
                                        # Never check how many assistan are taken
                                        # ASSIGN RESPONDER WITH ASSISTANCE
                                        self.set_roles_taken(currResponder, self.get_roles()[3]) 
                                        currResponder.set_isInNoChangeArea(True)
                                        print("RoEgn::: :::ASSIGNED TO ASSISTANCE")
                                        return("ASSIGNED TO ASSISTANCE")
                                else:
                                    # User still outside No-Change Radius
                                    ### Check if AED Collected
                                    if len(self.get_isAEDCollectedBy()) > 0:
                                        # AED Collected by at least 1 CFR already
                                        # GO TO SCENE
                                        print("RoEgn::: :::Proceed to SCENE p2")
                                        return("Proceed to SCENE p2")
                                    else:
                                        # No AED Collected
                                        ### Check how many CFRs are attending to case
                                        CFR_count = self.get_cfrCount()
                                        responder_list = self.get_listOfResponders()
                                        responder: Responder = Responder()
                                        match CFR_count:
                                            case 1: # 1 CFR attending
                                                # GO SCENE + GET AED ALONG THE WAY
                                                print("RoEgn::: :::Proceed to SCENE and GET AED ALONG THE WAY")
                                                return("Proceed to SCENE and GET AED ALONG THE WAY")
                                            case 2: # 2 CFR attending
                                                # Loop through other CFRs to do checks
                                                # TODO: Get current user's distance to AED then to Scene
                                                for responder in responder_list:
                                                    if responder_id != responder.get_emulatorId():
                                                        ### Check if other responder is in No-Change radius
                                                        if self.is_role_no_change(responder):
                                                            # Other Responder in No-Change Radius
                                                            # GIVE currResponder TASK TO GET AED & ADD TO AEDTag
                                                            print("RoEgn::: :::currResponder get AED & ADD TO AEDTag p1")
                                                            return("Go get AED & ADD TO AEDTag p1")
                                                            break # Stop loop since task given
                                                        else:
                                                            # Other Responder outside No-Change Radius
                                                            ### Compare if anyone tagged to collect AED
                                                            print(f"RoEgn::: :::AED Tag >>>>>>>>>>>>>>>> {self.get_AEDTag()}")
                                                            if self.get_AEDTag() is not None:
                                                                # CONTINUE ROLE/TASK OR IF WE WANT TO DO TASK CHECK/UPDATE
                                                                print("RoEgn::: :::Continue AED/Scene Task")
                                                                return("Continue AED/Scene Task")
                                                            else:
                                                                ### Compare if currResponder distance to AED then to Scene is shorter by 100m to other responder.
                                                                if True:
                                                                    # Shorter by 100m
                                                                    # GIVE currResponder TASK TO GET AED & ADD TO AEDTag
                                                                    self.set_AEDTag(responder_id)
                                                                    print(f"RoEgn::: :::AED Tag set to -> {responder_id}")
                                                                    print("RoEgn::: :::currResponder get AED & ADD TO AEDTag p2")
                                                                    return("Go get AED & ADD TO AEDTag p2")
                                                                    break # Stop loop since task given
                                                                else:
                                                                    # Not Shorter by 100m
                                                                    # LET FIRST RESPONDER TASK TO GET AED & ADD TO AEDTag ONCE HE ACCEPT FROM FRONTEND
                                                                    self.set_AEDTag(responder.get_emulatorId)
                                                                    print(f"RoEgn::: :::AED Tag set to -> {responder.get_emulatorId()}")
                                                                    print("RoEgn::: :::LET FIRST RESPONDER TASK TO GET AED & ADD TO AEDTag ONCE HE ACCEPT FROM FRONTEND")
                                                                    return("LET FIRST RESPONDER TASK TO GET AED & ADD TO AEDTag ONCE HE ACCEPT FROM FRONTEND")
                                                                    break # Stop loop since task given
                                            case 3,4,5: # 3-5 CFR attending
                                                # Loop through other CFRs to do checks
                                                print("RoEgn::: :::Loop through other CFRs to do checks")
                                                for responder in responder_list:
                                                    if responder_id != responder.get_emulatorId():
                                                        print("RoEgn::: :::3-5 CFR attending")
                                                        return("3-5 CFR attending")
                        else: # Cannot do CPR & AED
                            print("RoEgn::: :::Cannot do CPR & AED")
                            return("Cannot do CPR & AED")







# ==================================================================
# ROLE Engine v2.0 (Closed)
# ==================================================================
'''
                        #     if len(self.get_roles_taken()) == 0: # First Responder (No roles taken)
                                
                        #         # this assigns the user a tag but still not the roles (rmb that the roles are given when he/she is in the radius)
                        #         currResponder.get_objectivesClass().set_tag(self.__roles[0])
                        #         # set the current objective for UI
                        #         currResponder.set_current_objectives(currResponder.get_objectivesClass().get_currentObjectives())
                                
                        #         # TODO: THIS IS ALREADY THE END OF THE FIRST RESPONDER FLOW DO 
                        #         # MAKE SURE THAT WE ALSO ADD A CHECKER FOR RADIUS AND THEN ADD THE ROLE ALLOCATION LOGIC
                        #         # ALSO REMEMBER TO UPDATE THE STATE OF THE AED BUT I THINK THAT IS FRONT ENDD SO NO ISSUE HERE
                            
                        # else: # Cannot do CPR & AED
                        #     # ROUTE TO SCENE w/ ROLE RELATED OBJECTIVE
                        #     pass
'''

# ==================================================================
# ROLE Engine v1.0 (Closed)
# ==================================================================
'''
                    # # Check user disabilities
                    # match roleEngine.disabilityChecker(group[0].get_disabilities()):
                    #     case 1: # Can do CPR & AED
                    #         # Check if AED collected
                    #         if len(roleEngine.get_isAEDCollectedBy()) > 0: # AED Collected
                    #             # Check how many Responder
                    #             match self.get_cfrCount():
                    #                 case 1:
                    #                     # TODO: Kaibao can be checked outside, if have role, continue task, no role then normal checks
                    #                     # Check if user has Role
                    #                     if group[0].get_role() == None:
                    #                         # Check if user within No-Change radius
                    #                         if not roleEngine.is_within_distance(group[0], incident, 50): 
                    #                             # Route to Scene w/ AED
                    #                             pass
                    #                         else:
                    #                             # Assign Role: CPR HERO w/ AED
                    #                             pass
                    #                     else:
                    #                         # Already Assigned Role, continue task
                    #                         pass
                    #                 case 2:
                    #                     # Check if user has Role
                    #                     if group[0].get_role() == None:
                    #                         # Check if user within No-Change radius
                    #                         if not roleEngine.is_within_distance(group[0], incident, 50): 
                    #                             # Route to Scene
                    #                             pass
                    #                         else:
                    #                             # Check if other user has role
                    #                             if len(roleEngine.get_roles_taken()) == 0:
                    #                                 # Assign Role: CPR HERO
                    #                                 pass
                    #                             else:
                    #                                 # Assign Role: AED Buddy
                    #                                 pass
                    #                     else:
                    #                         # Already Assigned Role, continue task
                    #                         pass

                    #         else: # No AED Collected
                    #             # Check how many Responder
                    #             match self.get_cfrCount():
                    #                 case 1:
                    #                     # Route to Scene, get AED along the way
                    #                     pass
                    #                 case 2:
                    #                     pass
                    #     case 0: # Cannot do CPR & AED
                    #         # Check if user's No-Change radius status
                    #         match group[0].get_isInNoChangeRadius():
                    #             case True:
                    #                 # User should have role
                    #                 pass
                    #             case False:
                    #                 # Check if user within No-Change radius
                    #                 if not roleEngine.is_within_distance(group[0], incident, 50):
                    #                     # Direct them to go Scene
                    #                     return 0
                    #                 else:
                    #                     # User just enter radius
                    #                     group[0].set_isInNoChangeArea() = True
                    #                     # Assign Role: Assistance
# 0 -> Direct to Scene
# 
'''                   


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

screen_id_used = [] # hold the screen that has been assigned
joined_users = {} # hold the users/emulators that joined
# E.g.
# device_id : Responder

# TODO: Save user disabilities from disability page
@app.route('/join-session', methods=['POST'])
def join_session():
    data = request.json
    device_id = data.get('device_id')
    print(f"Received device_id: {device_id}")
    print("Current assigned screen:", joined_users)

    if device_id in joined_users:
        device = joined_users.get(device_id)
        if device is None:
            print("No device found")
            pass
        else:
            screen = device.get_screenId()
    elif "A" not in screen_id_used:
        print("Screen A CFR")
        screen = "A"
        responder = Responder()
        responder.set_emulatorId(device_id) # responder object need to add emulator_id
        responder.set_screenId(screen) # responder object need to add screen data
        # Sean: do you also want these below
        responder_lat = data.get('latitude')
        responder_lon = data.get('longitude')
        responder.set_location(responder_lat, responder_lon)
        joined_users[device_id] = responder # responder object
        screen_id_used.append("A")
        # responderA.update_disabilities(tsreathsirahthraothoaht) # idk how you pulling disabilities yet
    elif "B" not in screen_id_used:
        print("Screen B CFR")
        screen = "B"
        responder = Responder()
        responder.set_emulatorId(device_id) # responder object need to add emulator_id
        responder.set_screenId(screen) # responder object need to add screen data
        # Sean: do you also want these below
        responder_lat = data.get('latitude')
        responder_lon = data.get('longitude')
        responder.set_location(responder_lat, responder_lon)
        joined_users[device_id] = responder # responder object
        screen_id_used.append("B")
        # responderA.update_disabilities(tsreathsirahthraothoaht) # idk how you pulling disabilities yet
    else:
        screen = "None"

    print(f"Assigned Screen for {device_id}: {screen}")
    return jsonify({"screen": screen, "given_at": datetime.utcnow().isoformat()})

@app.route('/accept-case', methods=['POST'])
def accept_case():
    data = request.json
    device_id = data.get('device_id')

    try:
        # Add Responder responding to case in Role Engine
        responder = joined_users.get(device_id)
        roleEngine.add_responder(responder)
        # Send Responder to Role Engine
        roleEngineStatus = "RoEgn::: :::Success" 
        roleEngineStatus = roleEngine.role_engine(device_id, incidents[0], responder)
    except Exception as e:
        roleEngineStatus = "RoEgn::: :::Failed" 
        print (f"Error: {e}")
    
    print(f"Responder {device_id} joined incident")
    return jsonify({"role_engine_status": roleEngineStatus, "given_at": datetime.utcnow().isoformat()})

# Everytime user move, this will update backend for Role Engine to check
@app.route('/next-step', methods=['POST'])
def next_step():
    data = request.json
    device_id = data.get('device_id')

    try:
        responder = joined_users.get(device_id)
        # Send Responder to Role Engine
        roleEngineStatus = "RoEgn::: :::Success" 
        roleEngineStatus = roleEngine.role_engine(device_id, incidents[0], responder)
    except Exception as e:
        roleEngineStatus = "RoEgn::: :::Failed" 
        print (f"Error: {e}")

    return jsonify({"role_engine_status": roleEngineStatus, "given_at": datetime.utcnow().isoformat()})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)