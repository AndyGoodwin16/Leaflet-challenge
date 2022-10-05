//General flow of code:
//1) Accessed data via d3.json.
//2) Ran data through function to create markers for each earthquake event, styling color/size by depth/magnitude.
//3) Ran markers through function to place markers on map display and created legend to show color assignment meaning.  

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//Created function to generate maps and legend given geoJSON data of earthquakes.
function createMaps(earthquakeMarkers) {
    
    //Created maps using "boiler plate" code from class example.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "Street Map": streetmap,
        "Topographic Map": topomap
    };
    
    let overlayMaps = {
        "Earthquakes": earthquakeMarkers
    };
    
    let myMap = L.map("map", {
        center: [37, -96],
        zoom: 4,
        layers: [streetmap, earthquakeMarkers]
    });
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //Created legend with color matching group. Found this code by googling leaflet legends.
    let legend = L.control({position:"bottomleft"});

    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "legend")
        div.innerHTML += "<h4>Depth</h4>";
        div.innerHTML += '<i style="background: #800080"></i><span><10</span><br>';
        div.innerHTML += '<i style="background: #0000FF"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #008000"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #FFFF00"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #FFA500"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #FF0000"></i><span>90<</span><br>';
        return div
    };
    legend.addTo(myMap);
};

//Created function to generate markers for each earthquake event.
//Then, assigned colors based on depth, sizes based on magnitude, and generated pop up for more info.
//Methodology for this function from https://leafletjs.com/examples/geojson/. 
function createMarkers(data) {
    //Created separate function to assign color based on depth.        
    function depthColor(depthCoord) {
        let color = ""
        if (depthCoord < 10) {color = "#800080"}
        else if (depthCoord < 30) {color = "#0000FF"}
        else if (depthCoord < 50) {color = "#008000"}
        else if (depthCoord < 70) {color = "#FFFF00"}
        else if (depthCoord < 90) {color = "#FFA500"}
        else {color = "#FF0000"}
        return color
    };
    //Created pop up from "boiler plate" code from class example.
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h3>Location: ${feature.properties.place}</h3>
            <hr><p>Date: ${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Latitude: ${feature.geometry.coordinates[0]}</p>
            <p>Longitude: ${feature.geometry.coordinates[1]}</p>
            <p>Depth: ${feature.geometry.coordinates[2]}</p>`
            )
    };
    //Read in data and created marker for each event with color/size attributes.
    let earthquakeMarkers = L.geoJSON(data.features, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 2,
                fillOpacity: 0.8
            })
        }
    });
    //Called createMaps function with markers generated from earthquake geoJSON data.
    createMaps(earthquakeMarkers);
};

//Read in url containing geoJSON data, then called createMarkers function on said data.
d3.json(url).then(function(data) {
    createMarkers(data);
});