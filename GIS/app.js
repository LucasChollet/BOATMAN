function createRealtimeLayer(url, container) {
  return L.realtime(url, {
    interval: 10 * 60 * 1000, // milliseconds
    getFeatureId: function (f) {
      return f.properties.id;
    },
    cache: true,
    container: container,
    onEachFeature(f, l) {
      l.bindPopup(function () {
        return (
          "<h2 style='text-align: center;'><strong>Detection " +
          f.properties.id +
          "</strong></h2>" +
          "<p><img src='/images/cargo_ship.jpg' alt='Picture of a cargo' width='100%' height='150'/></p>" +
          "<h3><strong>Position:</strong></h3>" +
          "<p style='text-align: center;'><strong>Longitude: </strong>" +
          f.geometry.coordinates[0].toFixed(2) +
          " deg&nbsp;&nbsp;&nbsp;&nbsp; <strong>Latitude: </strong>" +
          f.geometry.coordinates[1].toFixed(2) +
          " deg</p>" +
          "<h3 style='text-align: left;'><strong>Characteristics:</strong></h3>" +
          "<p style='text-align: center;'><strong>Width: </strong>" +
          f.properties.det_w +
          " meters &nbsp;&nbsp;&nbsp; <strong>Length: </strong>" +
          f.properties.det_l +
          " meters</p>"
        );
      });
    },
  });
}

// Initialize date form -----------------------------------------------------------------

// Get the input elements
var fromInput = document.getElementById("from");
var toInput = document.getElementById("to");

// Get today's date or local storage
var endDate = new Date(localStorage.getItem("endDate")) || new Date();
var startDate =
  new Date(localStorage.getItem("startDate")) ||
  new Date().setDate(new Date().getDate() - 4);

// Format the date as a string in the "yyyy-mm-dd" format
var endDateString =
  endDate.getFullYear() +
  "-" +
  (endDate.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  endDate.getDate().toString().padStart(2, "0");
var startDateString =
  startDate.getFullYear() +
  "-" +
  (startDate.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  startDate.getDate().toString().padStart(2, "0");

// Set the value of the input elements to the formatted date string
fromInput.value = startDateString;
toInput.value = endDateString;

// Save data between reload

window.onbeforeunload = function () {
  localStorage.setItem("startDate", document.getElementById("from").value);
  localStorage.setItem("endDate", document.getElementById("to").value);
};

// Create url for server query ----------------------------------------------------------

var searchParams = new URLSearchParams();
searchParams.set("startDate", startDateString);
searchParams.set("endDate", endDateString);
var searchString = searchParams.toString();

// Create the URL object
var url = new URL("http://localhost:8000/ships.geojson");

// Append the search string to the URL
url.search = searchString;

// Initialize the map -------------------------------------------------------------------

var map = L.map("map", { center: [0, 0], zoom: 2.5, maxZoom: 18 }),
  clusterGroup = L.markerClusterGroup().addTo(map),
  realtime = createRealtimeLayer(url, clusterGroup).addTo(map);

// Initialize the base layer
L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
  attribution: "Google Satellite Hybrid",
}).addTo(map);

L.control
  .coordinates({
    position: "bottomleft",
    decimals: 2,
    decimalSeparator: ",",
    labelTemplateLat: "Latitude: {y}",
    labelTemplateLng: "Longitude: {x}",
  })
  .addTo(map);

L.control
  .scale({
    position: "bottomleft",
    metrics: true,
    imperial: false,
  })
  .addTo(map);

L.control
  .worldMiniMap({
    position: "bottomright",
    style: {
      opacity: 0.9,
      borderRadius: "0px",
      backgroundColor: "lightblue",
    },
  })
  .addTo(map);

// Draw ---------------------------------------------------------------------------------

// FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
map.addControl(
  new L.Control.Draw({
    draw: {
      marker: false,
      polygon: true,
      polyline: false,
      rectangle: true,
      circle: true,
    },
    edit: { featureGroup: drawnItems },
  }),
);

map.on("draw:created", function (e) {
  // Each time a feaute is created, delete previously existing features
  drawnItems.clearLayers();
  drawnItems.addLayer(e.layer);
});

// Export -------------------------------------------------------------------------------

document.getElementById("export").onclick = function (e) {
  // Extract GeoJson from featureGroup
  var data = drawnItems.toGeoJSON();
  $.ajax({
    url: "http://127.0.0.1:8000/polygon",
    async: true,
    type: "post",
    dataType: "json",
    data: JSON.stringify(data),
    success: function (result) {
      console.log(result);
    },
    error: function (xhr, resp, text) {
      console.log(xhr, resp, text);
    },
  });
};
