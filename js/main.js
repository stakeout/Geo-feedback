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


    myMap = new ymaps.Map("map", {//вызываем карту
        center: [53.8828, 27.7188],//Минск
        zoom: 14

    });

    var clusterer = new ymaps.Clusterer({
        preset: 'islands#greenDotIcon',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
    });
//show popup on map click
    myMap.events.add('click', function (e) {
        //show popup onclick
        reviewForm.classList.remove('display-none');
        //coords for popup appearance
        var pagePixels = e.get('pagePixels');
        reviewForm.style.left = pagePixels[0] + 'px';
        reviewForm.style.top = pagePixels[1] + 'px';
        //map click coords
        var coords = e.get('coords');
        var coordX = coords[0];
        var coordY = coords[1];
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            var address = firstGeoObject.properties.get('text');

            //set address in popup head
            reviewFormAddress.innerText = address;
        });
        //создаем метку
        myMap.geoObjects
            .add(new ymaps.Placemark([coordX, coordY],
            {
                preset: 'islands#greenDotIcon'

            }));
    });



    //popup close listener
    btnClose.addEventListener('click', function(e){
        e.preventDefault();
        closePopup();
    });
    function closePopup() {
        reviewForm.classList.add('display-none');
        reviewFormAddress.innerText = '';
        userName.value = '';
        userPlace.value = '';
        userMessage.value = '';
    }

//end init func
}