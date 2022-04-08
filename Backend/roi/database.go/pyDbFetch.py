import psycopg2

#connect to database
#password will change based on what password you chose to set up server and db
connection = psycopg2.connect(database ="localhost", user='postgres', password='Password',
 host='127.0.0.1', port='5432')

connection.autocommit = True

#create cursor object
cursor = connection.cursor()

#get data. Format: top:yy, left:xx, height:hh, width:ww, location:"insideOrOutside"
cursor.execute('''SELECT * FROM "models" WHERE ID = '1'"''')

#fetch data
data = cursor.fetchall()

#commit changes
connection.commit()

#close connection
connection.close()
