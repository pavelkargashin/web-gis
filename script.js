// Инициализация карты
const map = L.map('map').setView([-8.675946, 115.204820], 10); // Координаты для Бали

// Добавление слоя OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Загрузка GeoJSON слоев
let geojsonLayer1, geojsonLayer2;

const overlayMaps = {}; // Инициализация объекта для слоев

// Функция для загрузки GeoJSON
function loadGeoJSON(url, layerName, color) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const layer = L.geoJSON(data, { style: { color: color } });
            layer.addTo(map);
            overlayMaps[layerName] = layer; // Добавляем слой в overlayMaps
        });
}

// Загрузка слоев
Promise.all([
    loadGeoJSON('data/layer3.geojson', 'Слой 1', 'blue'),
    loadGeoJSON('data/layer4.geojson', 'Слой 2', 'red')
]).then(() => {
    // Добавление контроллера слоев после загрузки
    L.control.layers(null, overlayMaps).addTo(map);
}).catch(error => {
    console.error("Ошибка загрузки GeoJSON:", error);
});

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
map.addControl(drawControl); // Добавление контроллера рисования на карту

// Событие для добавления нарисованных объектов
map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
});

// Функция сохранения карты
document.getElementById('saveMap').onclick = function() {
    html2canvas(document.querySelector("#map"), {
        useCORS: true,
        onrendered: function(canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'map.png';
            link.click();
        }
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
