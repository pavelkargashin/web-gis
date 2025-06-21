// Инициализация карты
const map = L.map('map').setView([55.7558, 37.6173], 10); // Москва

// Добавление слоя OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Загрузка GeoJSON слоев
let geojsonLayer1, geojsonLayer2;

fetch('data/layer3.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonLayer1 = L.geoJSON(data, { style: { color: 'blue' } }).addTo(map);
    });

fetch('data/layer4.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonLayer2 = L.geoJSON(data, { style: { color: 'red' } }).addTo(map);
    });

// Управление слоями
const overlayMaps = {
    "Слой 1": geojsonLayer1,
    "Слой 2": geojsonLayer2
};

L.control.layers(null, overlayMaps).addTo(map);

// Инициализация Leaflet Draw
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: false,
        marker: true
    }
});
map.addControl(drawControl);

// Событие для добавления нарисованных объектов
map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
});

// Функция сохранения карты
document.getElementById('saveMap').onclick = function() {
    leafletImage(map, function(err, canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'map.png';
        link.click();
    });
};

// Функция сохранения пользовательских символов в GeoJSON
document.getElementById('saveGeoJSON').onclick = function() {
    const geojson = drawnItems.toGeoJSON();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "drawn_features.geojson");
    document.body.appendChild(downloadAnchorNode); // требуется для Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};
