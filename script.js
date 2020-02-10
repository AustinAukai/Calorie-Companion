$(document).ready(function () {
    let longitude = "";
    let latitude = "";
    var credentials = {
        'x-app-id': "545cccc3",
        'x-app-key': "2003e4528f7c4e040df53390634b6755"
    };
    // button event listener
    $("#currentLocationbtn, #currentLocationbtnMobile").on("click", function () {
        setAsync(false);
        getGeolocation(handleResponse, "b508c6912b3e46f5a1b0011e062903d6")
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
                limit: 15
            }
        }).then(function (response) {
            let newUl = $("<ul>");
            newUl.addClass("collapsible");
            $('#results').empty('');
            $('#desktop-buttons').empty('');
            $('#desktop-modals').empty('');
            let restaurantsArray = [];
            for (let i = 0; i < response.locations.length; i++) {

                let restaurantName = response.locations[i].name;
                let restaurantAddress = response.locations[i].address;
                let restaurantWebsite = response.locations[i].website;
                let newLi = $("<li>");

                // check for duplicates
                if(restaurantsArray.indexOf(restaurantName) === -1) {
                    restaurantsArray.push(restaurantName);
                    createElements (restaurantName,restaurantAddress,restaurantWebsite,longitude,latitude,newLi,newUl,i);
                } 
                // end of checking duplicates
            };

            $('.collapsible').collapsible({ accordion: true });
            $('.modal').modal();
        });
    };

    function createElements (restaurantName,restaurantAddress,restaurantWebsite,longitude,latitude,newLi,newUl,i){
        $(newLi).append(`<div id="collRestName" class = "collapsible-header"> ${restaurantName} </div>`);
                // adding map to callapsible
                $(newLi).append(`<div class = "collapsible-body row"><span class="fontStyle center-align" id="collRestAdd"> ${restaurantAddress} </span><br><a class="fontStyle center-align btn-small #cddc39 lime" id="collRestWeb" href="${restaurantWebsite}" target="_blank"> ${restaurantWebsite} </a><br><iframe id="collRestMap" align="center" width="100%" height="300" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAgD5uDC_bT26Vq6q_7XUAuGMeAwDPqMw0&origin=${latitude},${longitude}&destination=${restaurantAddress}&zoom=14" allowfullscreen>
                </iframe></div>`);
                $(newUl).append(newLi);
                $("#results").append(newUl);

                // MODAL DESKTOP DESIGN
                let newModalButton = `<a class="waves-effect waves-light btn modal-trigger col s4 offset-s1 modalBtnStyle" href="#modal${i}">${restaurantName}</a>`;
                $("#desktop-buttons").append(newModalButton);
                let newDivModalContent = `<div id="modal${i}" class="modal">
                     <div class="modal-content">
                     <h4 id="styleName">${restaurantName}</h4>
                     <h5 id="styleAddress">${restaurantAddress}</h5>
                     <a id="styleWeb" class="#cddc39 lime" href="${restaurantWebsite}" target="_blank">${restaurantWebsite}</a>
                     <br>
                     <iframe id="mapStyle" class="float" align="center" width="90%" height="300" frameborder="0" style="border:0" 
                     src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyD1zhxzhzGwy2tJOxpaTUh2Q34KvkygRIo
                     &origin=${latitude},${longitude}&destination=${restaurantAddress}&zoom=14" allowfullscreen></iframe>
                     </div>
                     <div class="modal-footer><a class="modal-close waves-effect waves-green btn-flat"></a></div></div>`;

                $("#desktop-modals").append(newDivModalContent);
    };


    // START OF CALORIE COUNTER
    // initializes modal
    $('.modal').modal();

    let calories = "";
    let addCalories = "";
    // checks if there are any saved calorie consumption in localStorage 
    renderLocalStorage();
    function renderLocalStorage() {
        let test = localStorage.getItem("savedCalories");
        if (!test) {
            return calories = 0;
        }
        calories = JSON.parse(localStorage.getItem("savedCalories"));
        console.log(calories);
        $(".display-calories-count").text(`${calories} Cals`)
    }
    console.log(calories);
    // takes input and add on to calories consumed 
    $("#add-calories").on("click", function () {
        addCalories = $("#calories-consumed").val();
        console.log(addCalories);
        calories = Number(calories) + Number(addCalories);
        console.log(calories);
        $(".display-calories-count").text(`${calories} Cals`);

        localStorage.setItem("savedCalories", JSON.stringify(calories));
        $("#calories-consumed").val("");
    });
    // deletes all previous data
    $("#clear-calories").on("click", function () {
        confirm("This will delete all previous input data!");
        $(".display-calories-count").html("0 Cals");
        calories = 0;
        addCalories = 0;
        $("#calories-consumed").val("");
        localStorage.removeItem("savedCalories");
    });
    // END OF CALORIE COUNTER
});