ymaps.ready(init);

function init() {
    var myMap;
//popup
    var reviewForm = document.querySelector('.popup-wrapper');
//address in popup header
    var reviewFormAddress = document.querySelector('.current-address');
//user name
    var userName = document.querySelector('.user-name');
//user place
    var userPlace = document.querySelector('.user-place');
//user message
    var userMessage = document.querySelector('.user-message');
//popup close btn
    var btnClose = document.querySelector('.btn-close');
//submit btn
    var addReview = document.querySelector('.add-review');
//coords
    var coords;
    var coordX;
    var coordY;
//objects
    var places = [];

    myMap = new ymaps.Map("map", {//вызываем карту
        center: [53.8928, 27.5469],//Минск
        zoom: 14


    });
    // Создаем собственный макет с информацией о выбранном геообъекте.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );
    var clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPagerSize: 5
    });
    //отрисовываем точки после релоуда страницы
    renderMarks();

    //show popup on map click
    myMap.events.add('click', popupShow);

    function popupShow(e) {
        //show popup onclick
        var coord = e.get('coords');
        userName.value = '';
        userPlace.value = '';
        userMessage.value = '';
        coords = coord;
        coordX = coords[0];
        coordY = coords[1];
        var pagePixels = e.get('pagePixels');
        reviewForm.style.left = pagePixels[0] + 'px';
        reviewForm.style.top = pagePixels[1] + 'px';
        reviewForm.classList.remove('display-none');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            var address = firstGeoObject.properties.get('name') + ',' + ' ' + firstGeoObject.properties.get('description').split(', ')[1];
            //set address in popup head
            reviewFormAddress.innerText = address;
        });
    }

    //get marks from server & render
    function renderMarks() {
        var xhr  = new XMLHttpRequest();
        //запрос серверу какой именно кейс вернуть
        var reviewData = {'op': "all"};
        xhr.open('POST', 'http://localhost:3000/', true);
        xhr.send(JSON.stringify(reviewData));
        //событие "запрос завершен"
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            //получаем объект
            reviewsBase = JSON.parse(xhr.response);
            console.log(xhr.response);
            //перебираем ключи массива объектов
            for(var keys in reviewsBase){
                //получаем значения координат каждого ключа coords
                reviewsBase[keys].forEach(function(key) {
                    var X = key.coords.x;
                    var Y = key.coords.y;
                    //указываем, какие данные выводить для точки
                    var place = new ymaps.Placemark([X, Y], {
                        balloonContentHeader: key.name,
                        balloonContentBody: key.text,
                        balloonContentFooter: new Date(key.date).toLocaleDateString(),
                        // Задаем стиль метки (метка в виде круга).
                        preset: "islands#dotCircleIcon",
                        // Задаем цвет метки (в формате RGB).
                        iconColor: '#ff0000'
                    });
                    //добавляем готовую к рендеру точку в массив мест с отзывами
                    places.push(place);
                })
            }
            //передаем данные отзывов в попап
                var content = document.querySelector('.users-review');
                var source = usersReviewsTemplate.innerHTML;
                var templateFn = Handlebars.compile(source);
                var viewsTemplate = templateFn({
                list: reviewsBase
                });
                content.innerHTML = viewsTemplate;

            //добавляем массив точек к api кластеризации
            clusterer.add(places);
            //выводим кластеризацию на карту
            myMap.geoObjects.add(clusterer);
        };



    }

    //send data to server with ajax
    addReview.addEventListener('click', sendDataAjax);
        function sendDataAjax (e) {
            e.preventDefault();
            var mark = new ymaps.Placemark([coordX, coordY], {}, {
                 // Задаем стиль метки (метка в виде круга).
                preset: "islands#dotCircleIcon",
                // Задаем цвет метки (в формате RGB).
                iconColor: '#ff0000'
            });
            var address = reviewFormAddress.innerText;
            var name = userName.value;
            var place = userPlace.value;
            var text = userMessage.value;
            var date = new Date();

            //data obj to send
            var userData = {
                "op": "add",
                "review": {
                    "coords": {'x': coordX, 'y': coordY},
                    "address": address,
                    "name": name,
                    "place": place,
                    "text": text,
                    "date": date.toUTCString()
                }
            };

            //ajax send data
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:3000/', true);
            xhr.send(JSON.stringify(userData));
            xhr.onreadystatechange = function(){  // Формируем функцию срабатывания на успешный ответ от сервера
                if(xhr.readyState === 4){
                    //ставим метку только по OK от сервера
                    myMap.geoObjects.add(mark);
                    places.push(userData.review);
                    //кластеризация добавленных точек
                    clusterer.add(mark);

                    myMap.geoObjects.add(clusterer);
                }else {
                    return;
                }

            };

        }




        //popup close listener
        btnClose.addEventListener('click', closePopup);
        function closePopup() {
            reviewForm.classList.add('display-none');
            reviewFormAddress.innerText = '';
            userName.value = '';
            userPlace.value = '';
            userMessage.value = '';
        }

//end init func
    }



