// Инициализация карты с preferCanvas
const map = L.map('map', {
    preferCanvas: true // Устанавливаем preferCanvas в true
}).setView([-8.688489, 115.214290], 10);

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

// Создание OSM слоя
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Функция для загрузки GeoJSON
function loadGeoJSON(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Указываем рендерер для GeoJSON
            return L.geoJSON(data, {
                renderer: L.canvas() // Устанавливаем рендерер
            });
        })
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
            layer.addTo(map);
            console.log('Слой 1 добавлен:', layer);
        }
    }),
    loadGeoJSON('data/layer4.geojson').then(layer => {
        if (layer) {
            layer2 = layer;
            layer.addTo(map);
            console.log('Слой 2 добавлен:', layer);
        }
    })
]).then(() => {
    console.log('Все слои добавлены на карту');
    // Теперь можно вызывать saveMapAsImage
});

// Функция для сохранения карты в PNG
function saveMapAsImage() {
    leafletImage(map, { 
        // Убедитесь, что вы передаете правильные параметры
        background: true 
    }, function(err, canvas) {
        if (err) {
            console.error('Ошибка при сохранении карты:', err);
            return;
        }
        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Обработчик события для кнопки сохранения карты
document.getElementById('saveMap').addEventListener('click', function() {
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
