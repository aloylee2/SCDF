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
        # self.__location = location
        self.__datetime = datetime.now() # Example output: 2025-06-29 14:23:45.123456
        # now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    def get_incident_Id(self):
        return self.__id
    
    def get_latitude(self):
        return self.__latitude
    
    def get_longitude(self):
        return self.__longitude
    
    # def get_location(self):
    #     return self.__location
    
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
        
    def set_aed_collected_index(self):
        self.__currentIndex = 2
        
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
    
    def set_case_acceptance_time(self) -> None:
        self.__case_acceptance_time = datetime.now()
    
    # ========= Class Functions =========
class RoleAllocationEngine:
    # Role engine rough idea
    # States of differing factors
    
    def __init__(self, incidentClass):
        self.__cfrCount = 0
        self.__AEDCollectedBy = []
        self.__roles = ["cpr_hero", "aed_buddy", "assistant"]
        self.__roles_taken = []
        self.__listOfResponders = [] # objects of responders with subset class of objectives
        self.lock = threading.Lock()
        self.__incidentClass = incidentClass
        
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
    
    def get_incidentClass(self):
        return self.__incidentClass
    
    # ========Setters========
    def add_responder(self, responder: Responder) -> None:
        self.__listOfResponders.append(responder)
        self.__cfrCount += 1
        
    def set_aed_collected(self, responder):
        self.__AEDCollectedBy.append(responder)
    
    # ========Class Functions========
    def is_role_no_change(self, responders, incident, roles) -> bool:
        # return True if this responder stays in the same role
        return False
    
    def get_best_distance_AED(self, aed_locations):
            """
            Returns a sorted list of tuples: (Responder, best_aed, total_distance)
            Sorted by total_distance ascending.
            """
            responder_distances = []
            for responder in self.get_listOfResponders():
                responder_loc = responder.get_location()
                min_total_distance = float('inf')
                best_aed = None
                for aed in aed_locations:
                    aed_loc = (aed["latitude"], aed["longitude"])
                    dist_to_aed = geodesic(responder_loc, aed_loc).meters
                    dist_aed_to_incident = geodesic(aed_loc,self.get_incidentClass().get_location()).meters
                    total_dist = dist_to_aed + dist_aed_to_incident
                    if total_dist < min_total_distance:
                        min_total_distance = total_dist
                        best_aed = aed
                responder_distances.append((responder, best_aed, round(min_total_distance, 1)))
            # Sort by total distance ascending
            responder_distances.sort(key=lambda x: x[2])
            return responder_distances
        
            # """
            # Returns the responder with the lowest (responder→AED + AED→incident) distance,
            # along with the AED and the total distance.
            # """
            # best_responder = None
            # best_aed = None
            # min_total_distance = float('inf')

            # for responder in self.get_listOfResponders():
            #     responder_loc = responder.get_location()
            #     for aed in aed_locations:
            #         aed_loc = (aed["latitude"], aed["longitude"])
            #         dist_to_aed = geodesic(responder_loc, aed_loc).meters
            #         dist_aed_to_incident = geodesic(aed_loc, self.get_incidentClass().get_location()).meters
            #         total_dist = dist_to_aed + dist_aed_to_incident
            #         if total_dist < min_total_distance:
            #             min_total_distance = total_dist
            #             best_responder = responder
            #             best_aed = aed
            # return best_responder, best_aed, round(min_total_distance, 1)
        
        # closest_aed_dict = {}
        # for responder in self.get_listOfResponders():
        #     responder_loc = responder.get_location()
        #     min_dist = float('inf')
        #     closest_aed = None
        #     for aed in aed_locations:
        #         aed_loc = (aed["latitude"], aed["longitude"])
        #         dist = geodesic(responder_loc, aed_loc).meters
        #         if dist < min_dist:
        #             min_dist = dist
        #             closest_aed = aed
        #     if closest_aed:
        #         closest_aed_dict[responder] = {
        #             "aed": closest_aed,
        #             "distance_m": round(min_dist, 1)
        #         }
        # # Sort responders by their closest AED distance
        # sorted_responders = sorted(
        #     closest_aed_dict.items(),
        #     key=lambda item: item[1]["distance_m"]
        # )
        # return sorted_responders  # List of (Responder, {"aed":..., "distance_m":...})
                    
    def get_best_distance_Incident(self):
        """
        Returns a sorted list of tuples: (Responder, distance_to_scene)
        Sorted by distance_to_scene ascending.
        """
        responder_distances = []
        for responder in self.get_listOfResponders():
            responder_loc = responder.get_location()
            scene_loc = self.get_incidentClass().get_location()
            distance = geodesic(responder_loc, scene_loc).meters
            responder_distances.append((responder, round(distance, 1)))
        responder_distances.sort(key=lambda x: x[1])
        return responder_distances
    
    def is_within_distance(self, responder, incident, threshold_m) -> bool:
        # this will work hand in hand with assign_roles_to_responder
        if geodesic(responder.get_location(), incident.get_location()).meters <= threshold_m:
            return True
        return False
    
    def is_aed_collected(self):
        return len(self.__AEDCollectedBy) > 0
    
    # TODO: I put this here i later check again
    def check_and_assign_role(self, responder, incident, role):
        if self.is_within_distance(responder, incident, 50):  # 50 meters as example
            responder.set_role(role)
            # You can also update any state or notify the frontend here
        
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

    def disabilityChecker(self, responder, disabilities):
        # backend/services/role_service.py

        non_CPR_AED_roles = ["hearing_impairment", "mobility_impairment", "limb_differences_waist_down", "limb_differences_above_waist"]

        # 0 -> Capable of CPR & AED
        # 1 -> Not capable of CPR & AED
        if not disabilities:
            return 0 
        for disability in disabilities:
            if disability in non_CPR_AED_roles:
                return 1
            return 0
                
    def isMaxResponderCount(self) -> bool:
        # a check to make sure that there are less than 6 responders
        return self.__cfrCount < 6
    
    # TODO: Come back and amend the logic if the time variable is wrong


    def compare_acceptance_times(self):
        with self.lock:
            responders = self.get_listOfResponders()
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
    def role_engine(self, responder_id, incident):
        # Case broadcast close
        if self.isMaxResponderCount() and True: # Placeholder to check if broadcast system is still up 
            return # TODO: Placeholder: Close broadcast
        
        # TODO: Kaibao: check if responder response time is 0.5sec after call, then no need to comapre acceptance time
        grouped_responders = self.compare_acceptance_times()
        # grouped_responders = self.compare_acceptance_times2()
        
        if self.get_cfrCount() > 0: #TODO:  max two disability
            for group in grouped_responders:
                # Acceptance time check (Same/Diff.)
                if len(group) > 1: # 2 or more CFR accepted same time
                    print(f"Group with multiple responders: {[r.get_emulatorId() for r in group]}") # (Same time responders)Handle logic for groups with more than one responder
                    for currResponder in group: # Now slowly send each responder in the isolated group further down the role engine
                        pass
                else: # CFR accepting diff. time
                    print(f"Single responder in group: {group[0].get_emulatorId()}") # (Individual different time responders) Handle logic for single responders
                    for currResponder in group: # Now slowly send each responder in the isolated group further down the role engine
                        if self.disabilityChecker(currResponder, currResponder.get_disabilities()) == 0: # Disability Check: Can do CPR & AED
                            if len(self.get_roles_taken()) == 0 and self.get_cfrCount() == 1: # First Responder (No roles taken) and only one responder in case
                                
                                # this assigns the user a tag but still not the roles (rmb that the roles are given when he/she is in the radius)
                                currResponder.get_objectivesClass().set_tag(self.get_roles()[0])
                                # set the current objective for UI
                                currResponder.set_current_objectives(currResponder.get_objectivesClass().get_currentObjectives())
                                
                                # No role assignment here Don't assignment role but objectives given already right above
                                
                                # TODO: THIS IS ALREADY THE END OF THE FIRST RESPONDER FLOW DO 
                                # MAKE SURE THAT WE ALSO ADD A CHECKER FOR RADIUS AND THEN ADD THE ROLE ALLOCATION LOGIC
                                # ALSO REMEMBER TO UPDATE THE STATE OF THE AED BUT I THINK THAT IS FRONT ENDD SO NO ISSUE HERE
                                # CHECK IF THERE IS AT LEAST TWO RESPONDERS
                                     
                            elif len(self.get_roles_taken()) == 0 and self.get_cfrCount() == 2: # 2nd responder
                                if self.is_aed_collected() and currResponder.get_objectivesClass().get_tag() == None: # check if AED has been collected
                                    print("AED already collected by", self.get_isAEDCollectedBy)
                                    currResponder.get_objectivesClass().set_tag(self.get_roles()[1])
                                    currResponder.get_objectivesClass().set_aed_collected_index() # this helps me to set the index of the objective to skip the responders' task requesting him/her to retrieve aed
                                    # set the current objective for UI
                                    currResponder.set_current_objectives(currResponder.get_objectivesClass().get_currentObjectives())
                                    
                                    # Check position of currResponder if he is in the radius
                                    
                                    # if inside start role assignm (might need to build helper function)
                                    
                                    # do also allocate for the first responder too as current responder refers to the second person
                                
                                # TODO: THIS IS ALREADY THE END OF THE SECOND RESPONDER FLOW (LEFT SIDE) DO 
                                # MAKE SURE THAT WE ALSO ADD A CHECKER FOR RADIUS AND THEN ADD THE ROLE ALLOCATION LOGIC
                                # ALSO REMEMBER TO UPDATE THE STATE OF THE AED BUT I THINK THAT IS FRONT ENDD SO NO ISSUE HERE
                                # CHECK IF THERE IS AT LEAST TWO RESPONDERS
                                else: # AED has not been collected
                                    print("No one collected the AED")
                                    # Compare the distance between scene and cfr1
                                                 
                                    """
                                    # I accidentally coded the part for the responder -> aed -> incident
                                                       
                                    aed_locations = locations  # your AED list

                                    all_responder_distances = self.get_all_responders_aed_distances(aed_locations)

                                    # Assign roles based on sorted order
                                    if all_responder_distances:
                                        # Assign AED Buddy to the closest
                                        aed_buddy_responder, aed_buddy_aed, _ = all_responder_distances[0]
                                        aed_buddy_responder.get_objectivesClass().set_tag("aed_buddy")
                                        # Assign CPR Hero to the next closest (if you want)
                                        if len(all_responder_distances) > 1:
                                            cpr_hero_responder, _, _ = all_responder_distances[1]
                                            cpr_hero_responder.get_objectivesClass().set_tag("cpr_hero")
                                        # Assign Assistant to the rest
                                        for responder_tuple in all_responder_distances[2:]:
                                            responder = responder_tuple[0]
                                            responder.get_objectivesClass().set_tag("assistant")
                                    """
                                    
                                    # set tag and correct objectives for the responders
                                    currResponder.get_objectivesClass().set_tag(self.get_roles()[1])
                                    # set the current objective for UI
                                    currResponder.set_current_objectives(currResponder.get_objectivesClass().get_currentObjectives())
                                        
                                    scene_distances = roleEngine.get_best_distance_Incident()
                                    for responder, dist in scene_distances:
                                        print(f"{responder.get_emulatorId()} is {dist} meters from the scene")
                                        # TODO: Allocate the roles
                                        # Factors to take note:
                                        # responders' no change flag
                                        # how many times has responders swapped roles
                                        # is he in the no-change radius
                                        
                                        # now allocate the role and add the taken roles to the roles_taken array
                                        # if cpr_hero != allocate
                                        # if aed buddy != allocate
                                        # if assistant != allocate
                                    
                            else: # Following responders condition
                                # Take note for the third case that if there are three or more users
                                # There could be the situation roles have not been given out yet or not
                                pass
                                    
                            
                        else: # Disability Check: Cannot do CPR & AED
                            # ROUTE TO SCENE w/ ROLE RELATED OBJECTIVE
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
# incidents.append(Incident(1.3513, 103.8443))
roleEngine = RoleAllocationEngine(Incident(1.3513, 103.8443))

screen_id_used = [] # hold the screen that has been assigned
joined_users = {} # hold the users/emulators that joined
# E.g.
# device_id : Responder

# TODO: Save user disabilities from disability page
@app.route('/join-session', methods=['POST'])
def join_session():
    data = request.json
    device_id = data.get('device_id')
    # location lat and lon (if unable to get the location put the code here)
    print(f"Received device_id: {device_id}")
    print("Current assigned screen:", joined_users)

    if device_id in joined_users:
        device = joined_users.get(device_id)
        if device is None:
            print("No device found")
            pass
        else:
            device.get_screenId()
    elif "A" not in screen_id_used:
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
        # TODO: should we call it liddat
        # roleEngine.add_responder(responder)
        # responderA.update_disabilities(tsreathsirahthraothoaht) # idk how you pulling disabilities yet
    elif "B" not in screen_id_used:
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
        # TODO: should we call it liddat
        # roleEngine.add_responder(responder)
        # responderA.update_disabilities(tsreathsirahthraothoaht) # idk how you pulling disabilities yet
    else:
        screen = "None"
    
    roleEngine.add_responder(device_id)

    print(f"Assigned Screen for {device_id}: {screen}")
    return jsonify({"Assigned Screen": screen, "given at": datetime.utcnow().isoformat()})

@app.route('/accept-case', methods=['POST'])
def accept_case():
    data = request.json
    device_id = data.get('device_id')

    try:
        roleEngine.role_engine(device_id, incidents[0])
    except Exception as e:
        print (f"Error: {e}")
    
    print(f"Responder {device_id} joined incident")
    # return jsonify({"Assigned Screen": screen, "given at": datetime.utcnow().isoformat()})

# Everytime user move, this will update backend for Role Engine to check
@app.route('/next-step', methods=['GET'])
def next_step():
    data = request.json
    device_id = data.get('device_id')

    try:
        roleEngine.role_engine(device_id, incidents[0])
    except Exception as e:
        print (f"Error: {e}")