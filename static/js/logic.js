// Get Request
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
d3.json(url, function(response) {
    createFeatures(response.features);
});

function markerSize(magnitude) {
    return magnitude * 30000;
};

function markerColor(depth) {
    if (depth < 10) {
        return '#bf00ff'
    } else if (depth >= 10 && depth < 30) {
        return '#0040ff'
    } else if (depth >= 30 && depth < 50) {
        return '#00ff40'
    } else if (depth >= 50 && depth < 70) {
        return '#ffff00'
    } else if (depth >= 70 && depth < 90) {
        return '#ffbf00'
    } else {
        return '#ff0000'
    }
};

function getColor(d) {
    if (d == '-10 to 10') {
        return '#bf00ff'
    } else if (d == '10 to 30') {
        return '#0040ff'
    } else if (d == '30 to 50') {
        return '#00ff40'
    } else if (d == '50 to 70') {
        return '#ffff00'
    } else if (d == '70 to 90') {
        return '#ffbf00'
    } else {
        return '#FF0000'
    }
}

function createFeatures(earthquakeData) {

    // Giving Features Popup Description
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h4>" + feature.properties.title + "</h3><hr><h4>" +
        new Date(feature.properties.time) + "</h4><hr><h4>" +
        "Depth (km): " + feature.geometry.coordinates[2] + "</h4>")
        }
    // Giving Features LatLng
    function pointToLayer(feature, latlng) {
        return L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.50,
        stroke: false,
    })
    }

    // Creating GeoJSON Layer with Features Array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    // Sending earthquakes Layer to createMap Function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Lightmap Layer
    const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Streetmap Layer
    const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

    // Defining BaseMap Objects to Hold Base Layers
    const baseMaps = {
    "Street Map": streetmap,
    "Dark Map": lightmap
    };

    // Creating Overlay Object to Hold Overlay Layer
    const overlayMaps = {
        Earthquakes: earthquakes
    };

    // Creating Map
    const myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 3,
    layers: [lightmap, earthquakes]
    });

    // Creating layer Control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend'),
        categories = ['-10 to 10', '10 to 30', '30 to 50', '50 to 70', '70 to 90', '90'];
        div.innerHTML += "<strong>Depth (km)</strong><br>";

        for (let i = 0; i < categories.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(categories[i]) + '"></i>'
                + categories[i] + (categories[i] ? '<br>':'+');
        }
        return div;
    };

    legend.addTo(myMap);
}
