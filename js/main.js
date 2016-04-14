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

    myMap = new ymaps.Map("map", {//вызываем карту
        center: [53.8928, 27.5469],//Минск
        zoom: 14

    });
    var clusterer = new ymaps.Clusterer({
        preset: 'islands#greenDotIcon',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        clusterBalloonContentLayout: 'cluster#balloonCarousel'
    });


    //show popup on map click
    myMap.events.add('click', popupShow);

    function popupShow(e) {
        //show popup onclick
        coord = e.get('coords');
        var pagePixels = e.get('pagePixels');
        reviewForm.style.left = pagePixels[0] + 'px';
        reviewForm.style.top = pagePixels[1] + 'px';
        reviewForm.classList.remove('display-none');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            var address = firstGeoObject.properties.get('name') + ',' + ' ' + firstGeoObject.properties.get('description');
            //set address in popup head
            reviewFormAddress.innerText = address;
        });
    }

    // Создание метки
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            preset: 'islands#violetStretchyIcon'
        });
    }

    //send data to server with ajax
    addReview.addEventListener('click', sendDataAjax);
        function sendDataAjax (coords) {
            var address = reviewFormAddress.innerText;
            var name = userName;
            var place = userPlace;
            var text = userMessage;
            var date = new Date();

            //add mark
            createPlacemark();
            //data obj to send
            var userData = {
                "op": "add",
                "review": {
                    "coords": {'x': coords[0], 'y': coords[1]},
                    "address": address,
                    "name": userName,
                    "place": userPlace,
                    "text": userMessage,
                    "date": date
                }
            };
            //ajax send data
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:3000/', true);
            xhr.onreadystatechange = function(){  // Формируем функцию срабатывания на успешный ответ от сервера
                if (xhr.readyState == 4) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(JSON.stringify(userData));



            clusterer.add(new ymaps.Placemark(coords[0], coords[1]));
        }



        //add clasterer
        myMap.geoObjects.add(clusterer);
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



