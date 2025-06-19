// Инициализация карты
var map = L.map('map').setView([-8.687122389556546, 115.223512696913645], 15);
// Добавление базового слоя
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Функция для добавления GeoJSON слоев
function addGeoJsonLayer(url, style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: style }).addTo(map);
        });
}

// Пример стилей для слоев
var style1 = { color: 'red', weight: 2 };
var style2 = {
    color: 'blue',
    weight: 2,
    opacity: 0.7,
    dashArray: '5, 5' // Dashed line
};
var style3 = { color: 'green', weight: 2 };
var style4 = { color: 'orange', weight: 2 };
var style5 = { color: 'purple', weight: 2 };

// Добавление слоев
addGeoJsonLayer('data/layer1.geojson', style1);
addGeoJsonLayer('data/layer2.geojson', style2);
addGeoJsonLayer('data/layer3.geojson', style3);
addGeoJsonLayer('data/layer4.geojson', style4);
addGeoJsonLayer('data/layer5.geojson', style5);

// Создание объекта для управления слоями
var overlays = {
    "слой1": 'data/layer1.geojson',
    "слой2": 'data/layer2.geojson'}

// Добавление управления слоями
L.control.layers(null, overlays).addTo(map);

// Пример использования Turf.js для анализа
function analyzeData() {
    // Здесь можно добавить код для анализа данных с помощью Turf.js
    // Например, расчет площади первого слоя
    fetch('data/layer1.geojson')
        .then(response => response.json())
        .then(data => {
            var area = turf.area(data);
            console.log('Площадь первого слоя:', area);
        });
}

// Вызов функции анализа
analyzeData();

// Сохранение карты в виде изображения
document.getElementById('save').addEventListener('click', function() {
    html2canvas(document.querySelector("#map")).then(canvas => {
        var link = document.createElement('a');
        link.download = 'map.png';
        link.href = canvas.toDataURL();
        link.click();
        }).catch(error => {
        console.error("Error capturing the map:", error);
    });
});
