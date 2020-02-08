$(document).ready(function () {
    let longitude = "";
    let latitude = "";
    var credentials = {
        'x-app-id': "545cccc3",
        'x-app-key': "2003e4528f7c4e040df53390634b6755"
    };
    // button event listener
    $("#currentLocationbtn, #currentLocationbtnMobile").on("click", function(){
        setAsync(false);
        getGeolocation(handleResponse, "18c79131f678477194c154a8c5d56f76")
    });
    // grabs long/lat from api
    function handleResponse(response) {
        setAsync(false);
        longitude = response.longitude;
        latitude = response.latitude;
        console.log(latitude, longitude, credentials);
        getRestaurants(latitude, longitude, credentials);
    }
    // setAsync(false);
    // getGeolocation(handleResponse, "18c79131f678477194c154a8c5d56f76");
    // grabs restaurant from api
    function getRestaurants(latitude, longitude, credentials) {
        $.ajax({
            url: 'https://trackapi.nutritionix.com/v2/locations',
            headers: Object.assign({}, credentials),
            method: 'GET',
            contentType: 'application/json',
            data: {
                ll: latitude + ',' + longitude,
                distance: '3mi',
                limit: 10
            }
        }).then(function (response) {
            let newUl = $("<ul>");
            newUl.addClass("collapsible");

            for (let i = 0; i < response.locations.length; i++) {

                let restaurantName = response.locations[i].name;
                let restaurantAddress = response.locations[i].address;
                let restaurantWebsite = response.locations[i].website;
                let newLi = $("<li>");
                $(newLi).append(`<div class = "collapsible-header"> ${restaurantName} </div>`);
                // adding map to callapsible
                $(newLi).append(`<div class = "collapsible-body"><span> ${restaurantAddress} </span><br><a href="${restaurantWebsite}" target="_blank"> ${restaurantWebsite} </a><br><iframe class="float-right" width="250" height="300" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAgD5uDC_bT26Vq6q_7XUAuGMeAwDPqMw0&origin=${latitude},${longitude}&destination=${restaurantName}&zoom=14" allowfullscreen>
                </iframe></div>`);
                $(newUl).append(newLi);
                let newA = $("<a>");
                $(newA).addClass("carousel-item");
                $(newA).append(`<a class="restaurantInfo">${restaurantName}</a><br><a class="restaurantInfo">${restaurantAddress}</a><br><a class="restaurantInfo" href="${restaurantWebsite}" target="_blank">${restaurantWebsite}</a>`);
                // addding map to carousel
                $(newA).append(`<br><iframe class="float" width="700" height="700" align="right" frameborder="1px" style="border:1" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAgD5uDC_bT26Vq6q_7XUAuGMeAwDPqMw0&origin=${latitude},${longitude}&destination=${restaurantName}&zoom=15" allowfullscreen>
                </iframe>`);
                $("#results").append(newUl);
                $("#desktop").append(newA);
            };
            $('.collapsible').collapsible({ accordion: true });
            $('.carousel.carousel-slider').carousel({ fullWidth: true });
        });  
    };
});