import csv
import json

ARKHAM_MAP_WIDTH = 2989
ARKHAM_MAP_HEIGHT = 2997

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
                x = x / ARKHAM_MAP_WIDTH
            elif columnNames[i] == "mapY":
                x = x / ARKHAM_MAP_HEIGHT
            
            rowJson[columnNames[i]] = x
        jsonData.append( rowJson )

    return jsonData

def WriteJSONToJSFile( jsonData, filename, firstLine ):
    writeableData = json.dumps( jsonData, indent=2 )
    f = open( filename, 'w' )
    f.write( firstLine )
    f.write( writeableData )
    f.close()

def ProcessMapLocations( fname, cityName ):
    csvData = ReadCSV( fname )
    csvData = InsertColToCSVData( "city", cityName, csvData )
    csvData = InsertColToCSVData( "searchName", "", csvData )
    for i in range( 1, len( csvData ) ):
        streetNumber = csvData[i][2]
        region = csvData[i][3]
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
        searchable += " " + csvData[i][5] + csvData[i][6]
        if title:
            searchable = title + " " + searchable
        csvData[i][0] = searchable.strip()
    
    return CSVToJSON( csvData )

jsonData = ProcessMapLocations( "arkhamMarkers.csv", "Arkham" )
WriteJSONToJSFile( jsonData, "arkham_markers.js", "const ARKHAM_MARKERS = " )

jsonData = ProcessDirectory( "directory.csv" )
WriteJSONToJSFile( jsonData, "searchables.js", "const SEARCHABLES = " )
