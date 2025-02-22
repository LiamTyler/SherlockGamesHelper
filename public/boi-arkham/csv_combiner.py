import csv
import json

ARKHAM_MAP_WIDTH = 2989
ARKHAM_MAP_HEIGHT = 2997

BOSTON_MAP_WIDTH = 3350
BOSTON_MAP_HEIGHT = 3374

TYPE_MARKED_LOCATION = "0"
TYPE_PERSON = "1"
TYPE_STREET = "2"

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

def CSVToJSON( data, isArkham ):
    columnNames = data[0]
    data = data[1:]
    numCols = len( columnNames )
    jsonData = []
    mapWidth = ARKHAM_MAP_WIDTH
    mapHeight = ARKHAM_MAP_HEIGHT
    if not isArkham:
        mapWidth = BOSTON_MAP_WIDTH
        mapHeight = BOSTON_MAP_HEIGHT
    
    for row in data:
        rowJson = {}
        for i in range( numCols ):
            if not row[i]:
                continue

            x = row[i]
            try:
                x = int( x )
            except:
                pass
            
            if columnNames[i] == "mapX":
                x = x / mapWidth
            elif columnNames[i] == "mapY":
                x = x / mapHeight
            
            rowJson[columnNames[i]] = x
        jsonData.append( rowJson )

    return jsonData

def WriteJSONToJSFile( jsonData, filename, firstLine ):
    writeableData = json.dumps( jsonData, indent=2 )
    f = open( filename, 'w' )
    f.write( firstLine )
    f.write( writeableData )
    f.close()

def ProcessMarkers( fname, cityName ):
    csvData = ReadCSV( fname )
    csvData = InsertColToCSVData( "city", cityName, csvData )
    csvData = InsertColToCSVData( "searchName", "", csvData )
    for i in range( 1, len( csvData ) ):
        streetNumber = csvData[i][2]
        region = csvData[i][3]
        csvData[i][0] = str( streetNumber ) + region
    
    return CSVToJSON( csvData, cityName == "Arkham" )

def ProcessStreets( fname, cityName ):
    csvData = ReadCSV( fname )
    csvData = InsertColToCSVData( "type", TYPE_STREET, csvData )
    return CSVToJSON( csvData, cityName == "Arkham" )

def ProcessDirectory( fname ):
    csvData = ReadCSV( fname )
    csvData = InsertColToCSVData( "type", TYPE_PERSON, csvData )
    csvData = InsertColToCSVData( "searchName", "", csvData )
    for i in range( 1, len( csvData ) ):
        lastName = csvData[i][2]
        firstName = csvData[i][3]
        title = csvData[i][4]
        searchable = firstName + " " + lastName
        searchable += " " + csvData[i][5] + csvData[i][6]
        if title:
            searchable = title + " " + searchable
        csvData[i][0] = searchable.strip()
    
    return CSVToJSON( csvData, True )

jsonData = ProcessMarkers( "arkham_markers.csv", "Arkham" )
WriteJSONToJSFile( jsonData, "arkham_markers.js", "const ARKHAM_MARKERS = " )

jsonData = ProcessStreets( "arkham_streets.csv", "Arkham" )
WriteJSONToJSFile( jsonData, "arkham_streets.js", "const ARKHAM_STREETS = " )

jsonData = ProcessDirectory( "directory.csv" )
WriteJSONToJSFile( jsonData, "searchables.js", "const SEARCHABLES = " )

jsonData = ProcessMarkers( "boston_markers.csv", "Boston" )
WriteJSONToJSFile( jsonData, "boston_markers.js", "const BOSTON_MARKERS = " )

jsonData = ProcessStreets( "boston_streets.csv", "Boston" )
WriteJSONToJSFile( jsonData, "boston_streets.js", "const BOSTON_STREETS = " )
