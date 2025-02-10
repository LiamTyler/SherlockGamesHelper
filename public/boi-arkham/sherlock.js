BLINK_SPEED = 0.002;
IW = 2989;
IH = 2997;
IRADIUS = 16;

TYPE_MARKED_LOCATION = 0
TYPE_PERSON = 1

const canvas = document.getElementById("mapCanvas");
const mapImage = document.getElementById("mapImage");
const ctx = canvas.getContext("2d");

canvas.width = mapImage.width;
canvas.height = mapImage.height;

class MapLocation
{
    constructor( streetNumber, region, relMapX, relMapY )
    {
        this.streetNumber = streetNumber;
        this.region = region;
        this.relMapX = relMapX;
        this.relMapY = relMapY;
        this.id = String( streetNumber ) + region;
    }
}

class Person
{
    constructor( lastName, firstName, streetNumber, region )
    {
        this.lastName = lastName;
        this.firstName = firstName;
        this.streetNumber = streetNumber;
        this.region = region;
        this.id = String( streetNumber ) + region;
        this.loc = null;
    }
}

FUSE_INDEX = null;

function GetDisplayableResult( res )
{
    s = "UNDEFINED";
    if ( res.type == TYPE_MARKED_LOCATION )
    {
        s = res.searchName;
    }
    else if ( res.type == TYPE_PERSON )
    {
        s = res.searchName + " - " + String( res.streetNumber ) + res.region;
    }
    
    return s;
}

function UpdateSearchBar()
{
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    
    val = searchBar.value;
    if ( val == "" )
    {
        searchResults.innerHTML = "";
        return;
    }
    
    const results = FUSE_INDEX.search( val );
    if ( results.length == 0 )
    {
        searchResults.innerHTML = "<li>NO ENTRIES FOUND</li>";
        return;
    }
    
    searchResults.innerHTML = "";
    for ( let i = 0; i < results.length; ++i )
    {
        let res = results[i].item;
        searchResults.innerHTML += "<li>" + GetDisplayableResult( res ) + "</li>";
    }
}

function UpdateSearchThreshold()
{
    const searchThreshold = document.getElementById("searchThreshold");
    
    const options =
    {
      includeScore: true,
      ignoreLocation: true,
      threshold: searchThreshold.value,
      keys: ['searchName']
    }

    FUSE_INDEX = new Fuse( SEARCHABLES, options );
    
    UpdateSearchBar();
}

UpdateSearchThreshold();


currentAlpha = 0;
currentRatio = 1.0;

function HightlightLocation( loc )
{
    radius = currentRatio * IRADIUS;
    x = loc.relMapX * canvas.width;
    y = loc.relMapY * canvas.height;
    ctx.beginPath();
    ctx.arc( x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function Animate( now )
{
    currentAlpha = 0.5 * (1 + Math.sin( BLINK_SPEED * now ));
    currentRatio = canvas.width / IW;
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    ctx.fillStyle = `rgb(255, 0, 0, ${currentAlpha})`;
    ctx.strokeStyle = "rgba(1, 1, 1, 0)";
    //for ( let i = 0; i < highlightedLocations.length; ++i )
    //{
    //    HightlightLocation( highlightedLocations[i] );
    //}
    requestAnimationFrame( Animate );
}

window.addEventListener( 'resize', function( event )
{
    canvas.width = mapImage.width;
    canvas.height = mapImage.height;

}, true);
Animate();