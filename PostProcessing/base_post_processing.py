#!/usr/bin/env python3

import os
import json
from datetime import datetime
import uuid
from twilio.rest import Client
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

uuid_str = str(uuid.uuid4())[:4]
print(f"{uuid_str}: starting script at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}")

## retrieve ROI coordinates from database (using testfile for now)
with open('roi.json') as f:
    roi = json.load(f)
    roi = roi['data'][0]
f.close()

## retrieve inside/outside region selection from database (using a variable for now)
region_sel = "outside"

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
        to="+17273705915", 
        from_="+14342859160",
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