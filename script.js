// script.js

// Инициализация карты
const map = L.map('map').setView([55.7558, 37.6173], 10); // Координаты Москвы

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

// Управление слоями
const baseMaps = {
    "OSM": osmLayer,
    "Спутник": satelliteLayer
};

const layerControl = L.control.layers(baseMaps).addTo(map);

// Функция для сохранения карты в PNG
document.getElementById('saveMap').addEventListener('click', function() {
    html2canvas(document.querySelector("#map")).then(canvas => {
        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
