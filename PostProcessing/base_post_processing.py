#!/usr/bin/env python3
import os
import psycopg2
import json
from datetime import datetime
import uuid
from twilio.rest import Client

#connect to the postgres database
def dBConnect():
    #connect to db (ensure password is same as what was used in setting up server and db)
    connection = psycopg2.connect("dbname=roi user=postgres password=senior host=127.0.0.1 port=5432")

    connection.autocommit = True
    cursor = connection.cursor()

    #get data. Format: location:"inside|Outside", top:yy, left:xx, height:hh, width:ww, detect:"hardhat|no_hardhat"
    cursor.execute('SELECT * FROM "models" ORDER BY id DESC LIMIT 1')

    roi = cursor.fetchall()
    connection.commit()
    connection.close()
    return roi

#connect to database and store contents
roi = dBConnect()

#parse contents to obtain dictionary of roi coordinates
temp = roi[0][2]
temp = temp[2:-2]
temp = temp.split(',')
temp = [j.strip() for j in temp]
temp = [j.split(':') for j in temp]

for i in range(len(temp)):
    for j in range(len(temp[i])):
        temp[i][j] = temp[i][j].strip()
    temp[i][1] = int(temp[i][1])

roi_coords = dict(temp)

# dict to save data of roi
roi = {"location": roi[0][1], "roi_coords": roi_coords, "detect": roi[0][3]}

# starting script once all roi data has been stored
uuid_str = str(uuid.uuid4())[:4]
print(f"{uuid_str}: starting script at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}")

# check if there is an alarm condition
def check_alarm_condition(roi, object):  
    overlap = check_overlap(roi, object)

    #inside and hardhat detected
    if overlap != "none" and roi['location'] == "inside" and roi['detect'] == 'hardhat' and object['label'] == 'hardhat':
        send_alert(object['label'] + " detected inside ROI!")

    #inside and no_hardhat detected
    if overlap != "none" and roi['location'] == "inside" and roi['detect'] == 'no_hardhat' and object['label'] == 'no_hardhat':
        send_alert(object['label'] + " detected inside ROI!")

    #outside and hardhat detected
    if overlap != "full" and roi['location'] == "outside" and roi['detect'] == 'hardhat' and object['label'] == 'hardhat':
        send_alert(object['label'] + " detected outside ROI!")

    #outside and no_hardhat detected
    if overlap != "full" and roi['location'] == "outside" and roi['detect'] == 'no_hardhat' and object['label'] == 'no_hardhat':
        send_alert(object['label'] + " detected outside ROI!")

# AABB collision detection to check overlap
def check_overlap(roi, object):
    overlap = not(object['left'] > roi['roi_coords']['left'] + roi['roi_coords']['width'] or
        object['left'] + object['width'] < roi['roi_coords']['left'] or
        object['top'] > roi['roi_coords']['top'] + roi['roi_coords']['height'] or
        object['top'] + object['height'] < roi['roi_coords']['top'])
    
    if overlap == False:
        overlap = "none"
    
    elif ((roi['roi_coords']['left'] < object['left'] and roi['roi_coords']['top'] < object['top']) and
        ((object['left'] + object['width'] < roi['roi_coords']['left'] + roi['roi_coords']['width']) and
        (object['top'] + object['height'] < roi['roi_coords']['top'] + roi['roi_coords']['height']))):
            overlap = "full"

    else:
        overlap = "partial"
    
    return overlap

# send alert to phone via SMS
def send_alert(alert_message):
    account_sid = os.environ.get("TWIILIO_ACCOUNT_SID")
    auth_token  = os.environ.get("TWILIO_AUTH_TOKEN")
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        to="+17273705915", 
        from_="+14342859160",
        body=alert_message)

# loop for pulling json objects from ML model
#while True:
    #try:
        #data = input()
        #print(data)
    #except EOFError:
        #continue
    #data = json.loads(data)
    #for x in range(len(data)):
        #object = data[x]['data'][0]
        #check_alarm_condition(roi, object)

# parse data and run geometry for each object
with open('data.json') as f:
    data = json.load(f)
f.close()

for x in range(len(data)):
    object = data[x]['data'][0]
    check_alarm_condition(roi, object)

print("Exiting...")