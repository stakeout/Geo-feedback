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
        zoom: 7

    });
//show popup on map click
    myMap.events.add('click', function (e) {
        //При клике на карте открываем форму добавления нового отзыва
        var coords = e.get('coords');
        reviewForm.classList.remove('display-none');
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