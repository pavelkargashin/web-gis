// script.js

// Инициализация карты
const map = L.map('map').setView([-8.688489, 115.214290], 10);

// Добавление слоя OpenStreetMap
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

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

leafletImage(map, function(err, canvas) {
    // Создание ссылки для скачивания
    const link = document.createElement('a');
    link.download = 'map.png';
    link.href = canvas.toDataURL();
    link.click();
});


//document.getElementById('saveMap').addEventListener('click', function() {
  //  domtoimage.toPng(document.getElementById('map'))
    //    .then(function (dataUrl) {
      //      const link = document.createElement('a');
        //    link.download = 'map.png';
          //  link.href = dataUrl;
          //  link.click();
        //})
       // .catch(function (error) {
         //   console.error('Ошибка при сохранении карты:', error);
       // });
//});


