const BLINK_SPEED = 0.002;
const ARKHAM_IW = 2989;
const ARKHAM_IH = 2997;
const IRADIUS = 16;

const TYPE_MARKED_LOCATION = 0
const TYPE_PERSON = 1

const mapImage = document.getElementById( "mapImage" );
const canvas = document.getElementById( "mapCanvas" );
const ctx = canvas.getContext( "2d" );

FUSE_INDEX = null;
currentAlpha = 0;
currentRatio = 1.0;
highlightedMarkers = []

function GetDisplayableResult( res )
{
    return res.searchName;
}

function GetMarker( streetNumber, region )
{
    for ( let i = 0; i < ARKHAM_MARKERS.length; ++i )
    {
        let m = ARKHAM_MARKERS[i];
        if ( m.streetNumber == streetNumber && m.region == region )
        {
            return m;
        }
    }
}

function UpdateSearchBar()
{
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    
    highlightedMarkers = [];
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
        let marker = GetMarker( res.streetNumber, res.region );
        if ( marker )
            highlightedMarkers.push( marker );
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

function HighlightMarkers( loc )
{
    if ( highlightedMarkers.length == 0 )
        return;
    
    ctx.fillStyle = `rgb(255, 0, 0, ${currentAlpha})`;
    ctx.strokeStyle = "rgba(1, 1, 1, 0)";
    radius = currentRatio * IRADIUS;
    for ( let i = 0; i < highlightedMarkers.length; ++i )
    {
        let loc = highlightedMarkers[i];
        x = loc.mapX * canvas.width;
        y = loc.mapY * canvas.height;
        ctx.beginPath();
        ctx.arc( x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

function Animate( now )
{
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    currentAlpha = 0.5 * (1 + Math.sin( BLINK_SPEED * now ));
    currentRatio = canvas.width / ARKHAM_IW;
    HighlightMarkers();
    
    requestAnimationFrame( Animate );
}

window.addEventListener( 'resize', function( event )
{
    canvas.width = mapImage.width;
    canvas.height = mapImage.height;

}, true);

$( document ).ready(function() {
    canvas.width = mapImage.width;
    canvas.height = mapImage.height;
    UpdateSearchThreshold();
});

Animate();