// Инициализация карты
const map = L.map('map').setView([-8.688489, 115.214290], 10);

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
            return L.geoJSON(data);
        })
        .catch(error => {
            console.error(`Ошибка при загрузке GeoJSON: ${error}`);
            return null;
        });
}

// Загрузка GeoJSON файлов
Promise.all([
    loadGeoJSON('data/layer3.geojson').then(layer => {
        if (layer) {
            layer.addTo(map);
            console.log('Слой 1 добавлен:', layer);
        }
    }),
    loadGeoJSON('data/layer4.geojson').then(layer => {
        if (layer) {
            layer.addTo(map);
            console.log('Слой 2 добавлен:', layer);
        }
    })
]).then(() => {
    console.log('Все слои добавлены на карту');
});

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
    leafletImage(map, { background: true }, function(err, canvas) {
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
