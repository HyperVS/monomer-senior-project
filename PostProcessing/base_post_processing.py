#!/usr/bin/env python3
#data.json details the data from the ml model, roi.json details the
#information retrieved about the roi from 
import os
import psycopg2
import json
from datetime import datetime
import uuid
from twilio.rest import Client

#connect to the postgres database
def dBConnect():
    #connect to database
    #password will change based on what password you chose to set up server and db
    connection = psycopg2.connect("dbname=roi user=postgres password=Password host=127.0.0.1 port=5432")

    connection.autocommit = True

    #create cursor object
    cursor = connection.cursor()

    #get data. Format: top:yy, left:xx, height:hh, width:ww, location:"insideOrOutside"
    cursor.execute('SELECT * FROM "models" WHERE ID = 4')

    #fetch data
    roi = cursor.fetchall()

    #insert
    insert = []
    column = [column[0] for column in cursor.description]

    for i in roi:
        insert.append(dict(zip(column, i)))
    #commit changes
    connection.commit()

    #close connection
    connection.close()

    return insert

#convert data to json and save to file
def convertToJson(data):
    with open('roi.json', 'w') as f:
        json.dump(data, f)

uuid_str = str(uuid.uuid4())[:4]
print(f"{uuid_str}: starting script at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}")

roi = dBConnect()
print(roi)
convertToJson(roi)

# retrieve ROI coordinates and region
with open('roi.json') as f:
    roi = json.load(f)
    roi = roi['data'][0]

    ## retrieve inside/outside region selection from database
    region_sel = roi['timestamp']#CHANGE TO LOCATION
f.close()


print(roi)
## check if there is an alarm condition
def check_alarm_condition(roi, object, region_sel):  
    overlap = check_overlap(roi, object)

    if (overlap == "partial" or overlap == "full") and region_sel == "inside":
        send_alert(object['label'] + " detected inside ROI!")

    if(overlap != "full" and region_sel == "outside"):
        send_alert(object['label'] + " detected outside ROI!")

## AABB collision detection to check overlap
def check_overlap(roi, object):
    overlap = not(object['left'] > roi['left'] + roi['width'] or
        object['left'] + object['width'] < roi['left'] or
        object['top'] > roi['top'] + roi['height'] or
        object['top'] + object['height'] < roi['top'])
    
    if overlap == False:
        overlap = "none"
    
    elif ((roi['left'] < object['left'] and roi['top'] < object['top']) and
        ((object['left'] + object['width'] < roi['left'] + roi['width']) and
        (object['top'] + object['height'] < roi['top'] + roi['height']))):
            overlap = "full"

    else:
        overlap = "partial"
    
    return overlap

## send alert to phone via SMS
def send_alert(alert_message):
    account_sid = os.environ.get("TWIILIO_ACCOUNT_SID")
    auth_token  = os.environ.get("TWILIO_AUTH_TOKEN")
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        to="+17273015814", 
        from_="+19409783430",
        body=alert_message)



## loop for pulling json objects from ML model
#while True:
    #try:
        #data = input()
        #print(data)
    #except EOFError:
        #continue
    #data = json.loads(data)

## parse data and run geometry for each object
with open('data.json') as f:
    data = json.load(f)
f.close()

for x in range(len(data)):
    object = data[x]['data'][0]
    check_alarm_condition(roi, object, region_sel)

print("Exiting...")