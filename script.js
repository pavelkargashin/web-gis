// script.js

// Инициализация карты
const map = L.map('map').setView([-8.688489, 115.214290], 10);

// Создание объекта для хранения нарисованных слоев
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Инициализация Leaflet.draw
const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems // Группа для редактирования
    },
    draw: {
        polygon: true, // Включить рисование полигонов
        polyline: false, // Отключить рисование линий
        rectangle: false, // Отключить рисование прямоугольников
        circle: false, // Отключить рисование кругов
        marker: true // Включить рисование маркеров
    }
});
map.addControl(drawControl);

// Обработчик событий для добавления нарисованных объектов на карту
map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer); // Добавляем слой в группу
});

const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Создание объектов для GeoJSON слоев
let layer1, layer2;

// Функция для загрузки GeoJSON
function loadGeoJSON(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => L.geoJSON(data))
        .catch(error => {
            console.error(`Ошибка при загрузке GeoJSON: ${error}`);
            return null; // Возвращаем null в случае ошибки
        });
}

// Загрузка GeoJSON файлов
Promise.all([
    loadGeoJSON('data/layer3.geojson').then(layer => {
        if (layer) {
            layer1 = layer;
            layer.addTo(map); // Добавляем слой на карту
        }
    }),
    loadGeoJSON('data/layer4.geojson').then(layer => {
        if (layer) {
            layer2 = layer;
            layer.addTo(map); // Добавляем слой на карту
        }
    })
]).then(() => {
    // Управление слоями
    const baseMaps = {
        "OSM": osmLayer
    };

    const overlayMaps = {
        "Слой 1": layer1,
        "Слой 2": layer2
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);
});

// Функция для сохранения карты в PNG
function saveMapAsImage() {
    html2canvas(document.getElementById('map'), { useCORS: true, allowTaint: true }).then(function(canvas) {
        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = canvas.toDataURL();
        document.body.appendChild(link); // Добавляем ссылку в DOM
        link.click();
        document.body.removeChild(link); // Удаляем ссылку после клика
    }).catch(function(error) {
        console.error('Ошибка при сохранении карты:', error);
    });
}

// Добавление кнопки для сохранения карты
const saveButton = document.createElement('button');
saveButton.innerText = 'Сохранить карту как изображение';
document.body.appendChild(saveButton);

// Обработчик события для кнопки сохранения карты
saveButton.addEventListener('click', function() {
    saveMapAsImage();
});

// Сохранение нарисованных объектов в GeoJSON
document.getElementById('saveDrawings').addEventListener('click', function() {
    const geojson = drawnItems.toGeoJSON();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "drawings.geojson");
    link.click();
});
