window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

var map = L.map("map").setView([43.614806, 7.055019], 10); // Initialisation de la carte avec Ynov Sophia Campus

// Fond de carte
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Coordonnées des stations
var stations = {
  isola2000: {
    name: "Isola 2000",
    coordinates: [44.1489, 7.0586],
    popup: "Isola 2000",
  },
  valberg: {
    name: "Valberg",
    coordinates: [44.09528, 6.92889],
    popup: "Valberg",
  },
  auron: {
    name: "Auron",
    coordinates: [44.225, 6.9308333],
    popup: "Auron",
  },
};

// Marqueur pour Ynov Sophia Campus
var ynovMarker = L.marker([43.614806, 7.055019])
  .addTo(map)
  .bindPopup("<b>Ynov Campus!</b>")
  .openPopup();

// Variable pour stocker l'itinéraire et les marqueurs des stations
var currentRoute;
var currentStationMarker;

// Fonction pour calculer la distance en km entre deux points
function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Rayon de la Terre en km
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance en km
  return distance.toFixed(1); // Retourne la distance arrondie à une décimale
}

// Fonction pour mettre à jour la carte, l'itinéraire et les marqueurs
function updateMap(stationKey) {
  var station = stations[stationKey];

  // Supprimer l'itinéraire actuel s'il existe
  if (currentRoute) {
    map.removeControl(currentRoute);
  }

  // Supprimer le marqueur précédent de la station si elle existe
  if (currentStationMarker) {
    map.removeLayer(currentStationMarker);
  }

  // Mettre à jour la vue de la carte
  map.setView(station.coordinates, 12);

  // Ajouter un nouveau marqueur pour la station choisie
  currentStationMarker = L.marker(station.coordinates)
    .addTo(map)
    .bindPopup(station.popup)
    .openPopup();

  // Calculer la distance entre Ynov et la station sélectionnée
  var distance = calculateDistance(
    43.614806,
    7.055019,
    station.coordinates[0],
    station.coordinates[1]
  );

  // Afficher la distance sur l'interface
  document.getElementById("distance-text").textContent =
    "Distance: " + distance + " km";

  // Ajouter l'itinéraire vers la station choisie
  currentRoute = L.Routing.control({
    waypoints: [
      L.latLng(43.614806, 7.055019), // Ynov Sophia Campus
      L.latLng(station.coordinates[0], station.coordinates[1]), // Station choisie
    ],
    routeWhileDragging: true, // Permet de tracer l'itinéraire pendant que l'on déplace les points
    markers: false,
    lineOptions: {
      styles: [
        { color: "#ff0000", weight: 5, opacity: 0.7 }, // Personnalisation de la couleur et épaisseur de la ligne
      ],
    },
  }).addTo(map);
}

// Événement sur la sélection
document
  .getElementById("station-select")
  .addEventListener("change", function (event) {
    updateMap(event.target.value);
  });

// Initialiser la carte avec Isola 2000 par défaut
updateMap("isola2000");
