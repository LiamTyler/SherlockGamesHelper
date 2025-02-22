const BLINK_SPEED = 0.002;
const ARKHAM_IW = 2989;
const ARKHAM_IH = 2997;
const BOSTON_IW = 3350;
const BOSTON_IH = 3374;
const IRADIUS = 16;
const ARKHAM_PIXELS_PER_MILE = 218;
const BOSTON_PIXELS_PER_MILE = 123;

const TYPE_MARKED_LOCATION = 0;
const TYPE_PERSON =1;
const TYPE_STREET = 2;

const mapImage = document.getElementById( "mapImage" );
const canvas = document.getElementById( "mapCanvas" );
const ctx = canvas.getContext( "2d" );

arkhamSelected = true; // two maps: arkham and boston
SEARCH_INDEX = null;
currentAlpha = 0;
currentRatio = 1.0;
highlightedMarkers = [];
highlightedStreets = [];
ALL_SEARCHABLES = [];

function GetDisplayableResult( res )
{
    return res.searchName;
}

function GetMarker( streetNumber, region )
{
    if ( arkhamSelected )
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
    else
    {
        for ( let i = 0; i < BOSTON_MARKERS.length; ++i )
        {
            let m = BOSTON_MARKERS[i];
            if ( m.streetNumber == streetNumber && m.region == region )
            {
                return m;
            }
        }
    }
}

function UpdateSearchBar()
{
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    
    highlightedMarkers = [];
    highlightedStreets = [];
    let val = searchBar.value;
    if ( val == "" )
    {
        searchResults.innerHTML = "";
        return;
    }
    
    const results = SEARCH_INDEX.search( val );
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
        if ( res.type == TYPE_STREET )
        {
            highlightedStreets.push( res );
        }
        else
        {
            let marker = GetMarker( res.streetNumber, res.region );
            if ( marker )
                highlightedMarkers.push( marker );
        }
    }
}

function UpdateSearchThreshold()
{
    const searchThreshold = document.getElementById( "searchThreshold" );
    
    let options =
    {
        includeScore: true,
        ignoreLocation: true,
        threshold: searchThreshold.value,
        keys: ['searchName']
    };
    ALL_SEARCHABLES = SEARCHABLES;
    if ( arkhamSelected )
        ALL_SEARCHABLES = ALL_SEARCHABLES.concat( ARKHAM_STREETS );
    else
        ALL_SEARCHABLES = ALL_SEARCHABLES.concat( BOSTON_STREETS );
    
    SEARCH_INDEX = new Fuse( ALL_SEARCHABLES, options );
    
    UpdateSearchBar();
}

function HighlightMarkers()
{
    if ( highlightedMarkers.length == 0 )
        return;
    
    ctx.fillStyle = `rgb(255, 0, 0, ${currentAlpha})`;
    ctx.strokeStyle = "rgba(1, 1, 1, 0)";
    let radius = currentRatio * IRADIUS;
    for ( let i = 0; i < highlightedMarkers.length; ++i )
    {
        let loc = highlightedMarkers[i];
        let x = loc.mapX * canvas.width;
        let y = loc.mapY * canvas.height;
        ctx.beginPath();
        ctx.arc( x, y, radius, 0, 2 * Math.PI );
        ctx.fill();
        ctx.stroke();
    }
}

function HighlightStreets( now )
{
    if ( highlightedStreets.length == 0 )
        return;
    
    let canvasFontSize = 0.5 + 0.5 * (1 + Math.sin( BLINK_SPEED * now ));
    canvasFontSize *= currentRatio;
    ctx.fillStyle = `rgb(0, 0, 0, ${currentAlpha})`;
    ctx.strokeStyle = "rgba(1, 1, 1, 1)";
    ctx.textAlign = "center";
    for ( let i = 0; i < highlightedStreets.length; ++i )
    {
        let street = highlightedStreets[i];
        let x = street.mapX * canvas.width;
        let y = street.mapY * canvas.height;
        let fontSize = street.size * canvasFontSize;
        let theta = street.rotation * Math.PI / 180.0;
        
        ctx.save();
        ctx.font = `${fontSize}px monospace`;
        ctx.translate( x, y );
        ctx.rotate( theta );
        ctx.fillText( street.searchName, 0, 0 );
        ctx.restore();
    }
}

function Animate( now )
{
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    currentAlpha = 0.5 * (1 + Math.sin( BLINK_SPEED * now ));
    currentRatio = canvas.width;
    if ( arkhamSelected )
        currentRatio /= ARKHAM_IW;
    else
        currentRatio /= BOSTON_IW;
    HighlightMarkers();
    HighlightStreets( now );
    
    requestAnimationFrame( Animate );
}

function GetFirstAlphaChar( s )
{
    for ( let i = 0; i < s.length; ++i )
    {
        if ( !('0' <= s[i] && s[i] <= '9') )
            return i;
    }
}

function UpdateDistanceResult( s )
{
    const distResult = document.getElementById( "distResult" );
    distResult.innerText = s;
}

function UpdateDistanceCalc()
{
    UpdateDistanceResult( "" );
    const fromBox = document.getElementById( "distFrom" );
    const toBox = document.getElementById( "distTo" );
    if ( !fromBox.value.length || !toBox.value.length )
        return;
    
    let fromIdx = GetFirstAlphaChar( fromBox.value );    
    let fromStreetNum = Number( fromBox.value.substr( 0, fromIdx ) );
    let fromRegion = fromBox.value.substr( fromIdx );
    
    let toIdx = GetFirstAlphaChar( toBox.value );    
    let toStreetNum = Number( toBox.value.substr( 0, toIdx ) );
    let toRegion = toBox.value.substr( toIdx );
    
    let fromMarker = GetMarker( fromStreetNum, fromRegion );
    let toMarker = GetMarker( toStreetNum, toRegion );
    
    if ( !fromMarker )
    {
        UpdateDistanceResult( "'From' location not found" );
    }
    else if ( !toMarker )
    {
        UpdateDistanceResult( "'To' location not found" );
    }
    else
    {
        let scale = ARKHAM_PIXELS_PER_MILE / ARKHAM_IW;
        if ( !arkhamSelected )
            scale = BOSTON_PIXELS_PER_MILE / BOSTON_IW;
        let dx = Math.abs( toMarker.mapX - fromMarker.mapX );
        let dy = Math.abs( toMarker.mapY - fromMarker.mapY );
        let dist = (dx/scale + dy/scale).toFixed( 2 );
        UpdateDistanceResult( String( dist ) + " miles" );
    }
}

function OnMapSelectChange( obj )
{
    arkhamSelected = (obj.value == "Arkham");
    if ( arkhamSelected )
        mapImage.src = "/SherlockGamesHelper/boi-arkham/arkham_map.jpg";
    else
        mapImage.src = "/SherlockGamesHelper/boi-arkham/boston_map.jpg";
    
    UpdateSearchThreshold();
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

mapImage.addEventListener( "load", function ()
{
    canvas.width = mapImage.width;
    canvas.height = mapImage.height;
});

Animate();
