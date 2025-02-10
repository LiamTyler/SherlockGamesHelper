+++
title = 'Bureau of Investigation: Arkham'
date = 2025-02-10T16:38:48-06:00
draft = false
+++

{{< rawhtml >}}
    <link href="/sherlock/sherlock.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <!--
    <script src="/jquery-3.7.1.min.js" type="text/javascript"></script>
    <script src="/jquery.csv.min.js"></script>
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
    <div id="mapContainer">
        <img id="mapImage" src="/sherlock/map2.jpg"/>
        <canvas id="mapCanvas"></canvas>
    </div>
{{< /rawhtml >}}



{{< rawhtml >}}
    <script src="/sherlock/searchables.js"></script>
    <script src="/sherlock/sherlock.js"></script>
{{< /rawhtml >}}