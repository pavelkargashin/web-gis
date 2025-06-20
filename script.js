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

// Сохранение карты в виде изображения
document.getElementById('saveMap').addEventListener('click', function() {
    // Убедитесь, что все тайлы загружены
    map.whenReady(function() {
        html2canvas(document.querySelector("#map"), {
            useCORS: true, // Включаем кросс-доменные запросы
            allowTaint: true, // Разрешаем использование изображений с других доменов
            backgroundColor: null // Установите фон в прозрачный
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'map.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            console.error("Ошибка при захвате карты:", error);
        });
    });
});
