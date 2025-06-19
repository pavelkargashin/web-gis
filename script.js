// Инициализация карты
var map = L.map('map').setView([-8.687122389556546, 115.223512696913645], 15);
// Добавление базового слоя
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Пример стилей для слоев
var style1 = { color: 'red', weight: 2 };
var style2 = {
    color: 'blue',
    weight: 2,
    opacity: 0.7,
    dashArray: '5, 5' // Dashed line
};

// Создание объекта для управления слоями
var overlays = {};

// Функция для добавления GeoJSON слоев
function addGeoJsonLayer(url, style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
           var geoJsonLayer = L.geoJSON(data, { style: style }).addTo(map);
            overlays[url] = geoJsonLayer; // Добавляем слой в объект overlays
        L.control.layers(null, overlays).addTo(map);
        })
        .catch(error => console.error("Ошибка загрузки GeoJSON:", error));
}

// Добавление слоев
Promise.all([
addGeoJsonLayer('data/layer1.geojson', style1),
addGeoJsonLayer('data/layer2.geojson', style2)
]).then(() => {
            // Добавление управления слоями после загрузки всех слоев
            L.control.layers(null, overlays).addTo(map);
});
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
