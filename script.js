// script.js

// Инициализация карты
const map = L.map('map').setView([-8.688489, 115.214290], 10); // Координаты Москвы

// Добавление слоя OpenStreetMap
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Добавление дополнительных слоев (например, спутниковый)
const satelliteLayer = L.tileLayer('https://{s}.satellite.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
});

// Создание объектов для GeoJSON слоев
let layer1, layer2;

// Функция для загрузки GeoJSON
function loadGeoJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => L.geoJSON(data));
}

// Загрузка GeoJSON файлов
Promise.all([
    loadGeoJSON('data/layer1.geojson').then(layer => {
        layer1 = layer;
        layer.addTo(map); // Добавляем слой на карту
    }),
    loadGeoJSON('data/layer2.geojson').then(layer => {
        layer2 = layer;
        layer.addTo(map); // Добавляем слой на карту
    })
]).then(() => {
    // Управление слоями
    const baseMaps = {
        "OSM": osmLayer,
        "Спутник": satelliteLayer
    };

    const overlayMaps = {
        "Слой 1": layer1,
        "Слой 2": layer2
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);
});

// Сохранение карты в виде изображения
document.getElementById('saveMap').addEventListener('click', function() {
    domtoimage.toPng(document.getElementById('map'))
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = 'map.png';
            link.href = dataUrl;
            link.click();
        })
        .catch(function (error) {
            console.error('Ошибка при сохранении карты:', error);
        });
});
