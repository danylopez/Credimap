var placemarkers=[];
var finalEntities= [];
var refresh_onlyMap=0;
var map,myLocation;
var infoWindow;
var service,directionsService,directionsDisplay;
var markers=[];
var done=0;
var resultsLimit;
var countPlaces=0;
var mapEntities = {};
var homeMarker,destinationMarker,routeResult;




function changeBest(id){

    markers[id].setMap(null);
    markers[id].icon = {url: 'http://imgur.com/unLktSj.png'};
    markers[id].setMap(map);
}

//remove this solution and find the bug
function fixBugDivCircular(){
	$("#map").children().children().css('border-radius','50%');
	$("#map").children().children().children().css('border-radius','50%');
}

function zoomMarker(id){
	fixBugDivCircular();
    map.setZoom(17);
    map.panTo( markers[id].position);
    new google.maps.event.trigger( markers[id], 'click' );

}

function loadMap(){
    refresh_onlyMap = 0;
	
    initialize();
}


function initialize()
{
	
    var location = new google.maps.LatLng(19.3202176, -99.224016);
        $('#map').height($('#calculatorDiv').width());
        $('#map').width($('#calculatorDiv').width());
        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: location,
            zoom: 14,
            scrollwheel        : false,
            mapTypeControl     : true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT,
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            panControl         : false,
            rotateControl      : false,
            streetViewControl  : false,
            zoomControl        : true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            }
    });
    infoWindow = new google.maps.InfoWindow();
		
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (place) {
            myLocation = new google.maps.LatLng(place.coords.latitude, place.coords.longitude);
            service = new google.maps.places.PlacesService(map);
            directionsService = new google.maps.DirectionsService;
            directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setOptions({suppressMarkers: true,preserveViewport:true})
            directionsDisplay.setMap(map);

            homeMarker = new google.maps.Marker({
                map: map,
                position: myLocation,
                icon: { url: 'http://i.imgur.com/w3liXa6.png'}
            });

            homeMarker.addListener('click', function() {
                new google.maps.InfoWindow({
                    content: '¡Aquí te encuentras.!'
                }).open(map,homeMarker);
            });
            map.setCenter(myLocation);
            map.setZoom(14);
            map.panTo(myLocation);

            new google.maps.event.trigger( homeMarker, 'click' );
            google.maps.event.addListenerOnce(map, 'idle', performSearch);
        },  function (error){
            if (error.code == error.PERMISSION_DENIED ||
                error.code == error.POSITION_UNAVAILABLE ||
                error.code == error.TIMEOUT ||
                error.code == error.UNKNOWN_ERROR) {
                handleError();
            }
        });
    }


    createCustomIcon();
}



function performSearch() {
    var request = {
        bounds: map.getBounds(),
        location : myLocation,
        types: ['bank'],
        radius : 25000
    };
    service.nearbySearch(request, callback);
}


function callback(results, status) {

    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }

    (results.length<=20)  ? resultsLimit= results.length : resultsLimit = 20;

    for (var i = 0, result; result = results[i]; i++) {

        addMarker(result);
        saveResult(result);
        if(i==resultsLimit) break; //restrict to 20 places
    }
    saveEntitiesToLS(); //by this time we use need names of places not details
    initCalculator();


    for (var i = 0, result; result = results[i]; i++) {
        getPlaceInfo(result);
        if (i == resultsLimit) break;
    }
}


function getPlaceInfo(place){

    service.getDetails({
        placeId: place.place_id
    }, function(result, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            saveResult(result);
            countPlaces++;
            if(countPlaces==resultsLimit ){
                saveEntitiesToLS();
                writeExtraInfoPlaces();
                countPlaces=0;
            }
        }
        else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            setTimeout(function (){
                getPlaceInfo(place);
            },200);
        }
    });
}

function calculateAndDisplayRoute( ) {
    directionsService.route({
        origin: homeMarker.position,
        destination:destinationMarker.position,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            infoWindow.close();
            map.setCenter(destinationMarker.position);
            map.setZoom(14);
            routeResult ={'distance':response.routes[0].legs[0].distance.text,'time':response.routes[0].legs[0].duration.text};
            infoWindow.setContent('<div><strong>Distancia: </strong>'+routeResult.distance+'<br>'+
            '<strong>Tiempo: </strong>'+routeResult.time+
            '</div>');
            infoWindow.open(map,destinationMarker);
			fixBugDivCircular();//remove this
            //new google.maps.event.trigger( controlDiv, 'click' );
        } else {
            window.alert('No fue posible obtener la ruta' + status);
        }
    });
	
}

function saveResult(result){

    fe = {};
    fe.id = result.place_id;
    fe.name = result.name;
    fe.address = result.formatted_address;
    fe.phone= result.formatted_phone_number;
    fe.website = result.website;
    mapEntities[result.place_id]=fe;
}



function saveEntitiesToLS(){
    finalEntities.length=0;
    for(var placeId in mapEntities){
        finalEntities.push(mapEntities[placeId])
    }
    localStorage['financial_entities'] = JSON.stringify(finalEntities);
}

function getFormatedContent(place){

    var content ='<div><strong>' + place.name + '</strong><br>' +
        place.formatted_address + '<br>Tel&#233fono: ' +
        place.formatted_phone_number + '<br>P&#225gina Web: <a target="_blank" style="color: blue;" href="' +
        place.website + '">' + place.website + '</a> <br/><button type="button" onclick="setEntity(placeName)" '+
        'class="btn  btn-default" aria-label="Left Align"><i class="fa fa-envelope"> Contactar</i></button>' +
        '<button align="left" type="button" class="btn  btn-default" onclick="calculateAndDisplayRoute()"><i class="fa fa-car" > Ruta</i>' +
        '</buttton>' +
        '</div>'

    return content;
}

function createCustomIcon(){
    var controlDiv = document.createElement('div');
    var iconZoom = document.createElement('input');
    iconZoom.type='image';
    iconZoom.src = 'http://imgur.com/0C2rmAA.png';
    iconZoom.style.alt= '';
    iconZoom.style.height='35px';
    iconZoom.style.width='35px';
    controlDiv.appendChild(iconZoom);
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(controlDiv);
    controlDiv =  $(controlDiv);
    controlDiv.click(function(){
        infoWindow.setContent('<div><strong>Distancia: </strong>'+routeResult.distance+'<br>'+
        '<strong>Tiempo: </strong>'+routeResult.time+
        '</div>');
        infoWindow.open(map,destinationMarker);
    });


}


function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            url: 'http://imgur.com/m1oQR3K.png'
        }
    });

    markers[place.place_id]=marker;

    google.maps.event.addListener(marker, 'click', function() {
        service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                console.error(status);
                return;
            }
            placeName= result.name;
            destinationMarker = markers[result.place_id];
            infoWindow.setContent(getFormatedContent(result));
            infoWindow.open(map, marker);

        });
    });
}


function handleError() {
    $('#errorModal').modal({backdrop: 'static', keyboard: false});
    createStates();
    $('#errorModal').modal('show');
    $('#stateSelect').change(function(){
        createMuni();
    });
}

function createStates() {
    var states ;
    $.getJSON( "./other/estados.json", function( data ) {
        states=data;
        states = $(states);
    }).done(function() {
        var $select = $('#stateSelect');
        states.each(function (index, obj) {
            var $option = $("<option/>").attr("value", obj.StateCode).text(obj.StateName);
            $select.append($option);
        });
    });
}

function createMuni() {

    var cities;
      $.getJSON( "./other/municipios.json", function( data ) {
            cities=data;
            cities=$(cities);
    }).done(function() {
          var $select = $('#muniSelect');
          $('#muniSelect')
              .find('option')
              .remove()
              .end()
              .append('<option value="notSelected" disabled>Seleccione el Municipio</option>')
              .val('notSelected');
          cities.each(function (index, obj) {
              if ($('#stateSelect').val() == obj.StateCode) {
                  var $option = $("<option/>").attr("value", obj.MunCode).text(obj.MunName);
                  $select.append($option);
              }
          });
      });

    $('#muniSelect').change(function(){
        $(cities).each(function (index, obj) {
            if ($('#stateSelect').val() == obj.StateCode && $('#muniSelect').val() == obj.MunCode) {
                $('#errorModal').modal('hide');
                drawMap(obj.Latitude, obj.Longitude);
            }
        });
    });
}

function drawMap(latitude, longitude){
    myLocation = new google.maps.LatLng(latitude, longitude);
    service = new google.maps.places.PlacesService(map);
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setOptions({suppressMarkers: true,preserveViewport:true})
    directionsDisplay.setMap(map);

    homeMarker = new google.maps.Marker({
        map: map,
        position: myLocation,
        icon: { url: 'http://imgur.com/ybJJ8Za.png',
            scaledSize :new google.maps.Size(35, 43),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        }
    });

    homeMarker.addListener('click', function() {
        new google.maps.InfoWindow({
            content: '¡Aquí te encuentras!'
        }).open(map,homeMarker);
    });
    map.setZoom(15);
    map.panTo(myLocation);
    new google.maps.event.trigger( homeMarker, 'click' );
    google.maps.event.addListenerOnce(map, 'idle', performSearch);
}