+++
title = 'Bureau of Investigation: Arkham'
date = 2025-02-10T16:38:48-06:00
draft = false
+++

{{< rawhtml >}}
    <link href="/SherlockGamesHelper/boi-arkham/sherlock.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="/SherlockGamesHelper/jquery-3.7.1.min.js" type="text/javascript"></script>
    <!--
    <script src="/SherlockGamesHelper/jquery.csv.min.js"></script>
    -->
{{< /rawhtml >}}

{{< rawhtml >}}
    
    <br>
     
    <label for="searchBar">Search:</label>
    <input type="text" id="searchBar" name="searchBar"
        autocomplete="off"
        style="border: 1px solid black"
        onChange="UpdateSearchBar();">
        
    <label for="searchThreshold" class="padLeft">Fuzzy Search Threshold:</label>
    <input type="number" id="searchThreshold" name="searchThreshold"
        min="0.0" max="1.0" value="0.1" step="0.1"
        style="border: 1px solid black"
        onChange="UpdateSearchThreshold();">
    <br>
    <ul id="searchResults"></ul>
    <br>
    <select name="mapSelect" id="mapSelect" onchange="OnMapSelectChange(this);">
        <option value="Arkham">Arkham</option>
        <option value="Boston">Boston</option>
    </select>
    <div id="mapContainer" onresize="OnResize();">
        <img id="mapImage" src="/SherlockGamesHelper/boi-arkham/arkham_map.jpg"/>
        <canvas id="mapCanvas"></canvas>
    </div>
    
    <label for="distFrom">Approx Distance From:</label>
    <input type="text" id="distFrom" name="distFrom"
        autocomplete="off"
        style="border: 1px solid black"
        onChange="UpdateDistanceCalc();">
    <label for="distFrom" class="padLeft">To:</label>
        <input type="text" id="distTo" name="distTo"
        autocomplete="off"
        style="border: 1px solid black"
        onChange="UpdateDistanceCalc();">
    <br>
    <p id="distResult"></p>
{{< /rawhtml >}}



{{< rawhtml >}}
    <script src="/SherlockGamesHelper/boi-arkham/arkham_markers.js"></script>
    <script src="/SherlockGamesHelper/boi-arkham/arkham_streets.js"></script>
    <script src="/SherlockGamesHelper/boi-arkham/searchables.js"></script>
    <script src="/SherlockGamesHelper/boi-arkham/sherlock.js"></script>
{{< /rawhtml >}}