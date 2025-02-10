import csv
import json

MAP_WIDTH = 2989
MAP_HEIGHT = 2997

TYPE_MARKED_LOCATION = "0"
TYPE_PERSON = "1"

def ReadCSV( filename ):
    rows = []
    with open( filename, mode ='r' ) as file:    
        reader = csv.reader( file, delimiter=',' )
        for row in reader:
            rows.append( row )

    rowLen = len( rows[0] )
    for row in rows:
        if len( row ) != rowLen:
            print( "Not all rows were same len! Bad row '", row, "'" )
    
    return rows

def InsertColToCSVData( colName, val, csvData ):
    csvData[0] = [colName] + csvData[0]
    for i in range( 1, len( csvData ) ):
        csvData[i] = [val] + csvData[i]

    return csvData

def CSVToJSON( data ):
    columnNames = data[0]
    data = data[1:]
    numCols = len( columnNames )
    jsonData = []
    for row in data:
        rowJson = {}
        for i in range( numCols ):
            if not row[i]:
                continue

            x = row[i]
            if x.isdigit():
                x = int( x )
            if columnNames[i] == "mapX":
                x = x / MAP_WIDTH
            elif columnNames[i] == "mapY":
                x = x / MAP_HEIGHT
            
            rowJson[columnNames[i]] = x
        jsonData.append( rowJson )

    return jsonData

def WriteJSONToJSFile( jsonData, filename ):
    writeableData = json.dumps( jsonData, indent=2 )
    f = open( filename, 'w' )
    f.write( "const SEARCHABLES = " )
    f.write( writeableData )
    f.close()

def ProcessMapLocations( fname, cityName ):
    csvData = ReadCSV( fname )
    csvData = InsertColToCSVData( "type", TYPE_MARKED_LOCATION, csvData )
    csvData = InsertColToCSVData( "city", "Arkham", csvData )
    csvData = InsertColToCSVData( "searchName", "", csvData )
    for i in range( 1, len( csvData ) ):
        streetNumber = csvData[i][3]
        region = csvData[i][4]
        csvData[i][0] = str( streetNumber ) + region
    
    return CSVToJSON( csvData )

def ProcessDirectory( fname ):
    csvData = ReadCSV( fname )
    csvData = InsertColToCSVData( "type", TYPE_PERSON, csvData )
    csvData = InsertColToCSVData( "searchName", "", csvData )
    for i in range( 1, len( csvData ) ):
        lastName = csvData[i][2]
        firstName = csvData[i][3]
        title = csvData[i][4]
        searchable = firstName + " " + lastName
        if title:
            searchable = title + " " + searchable
        csvData[i][0] = searchable
    
    return CSVToJSON( csvData )

d = "C:/Users/Liam/Documents/Blog/static/sherlock/"

jsonData = ProcessMapLocations( d + "arkhamMapLocations.csv", "Arkham" )
jsonData += ProcessDirectory( d + "directory.csv" )

WriteJSONToJSFile( jsonData, d + "searchables.js" )
