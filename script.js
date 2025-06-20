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
    // Сначала создаем временный элемент canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Устанавливаем размеры canvas
    canvas.width = map.getSize().x;
    canvas.height = map.getSize().y;

    // Получаем изображение карты
    map.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) {
            const bounds = map.getBounds();
            const topLeft = map.latLngToContainerPoint(bounds.getNorthWest());
            const bottomRight = map.latLngToContainerPoint(bounds.getSouthEast());
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Для кросс-доменных изображений
            img.src = layer._url.replace('{s}', 'a').replace('{z}', map.getZoom()).replace('{x}', Math.floor((bounds.getWest() + 180) / 360 * Math.pow(2, map.getZoom()))).replace('{y}', Math.floor((1 - (bounds.getNorth() + 90) / 180) / 2 * Math.pow(2, map.getZoom())));
            img.onload = function() {
                context.drawImage(img, topLeft.x, topLeft.y);
                // Сохраняем изображение
                const link = document.createElement('a');
                link.download = 'map.png';
                link.href = canvas.toDataURL();
                link.click();
            };
        }
    });
});
