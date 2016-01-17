var placemarkers=[];
var finalEntities= [];
var refresh_onlyMap=0,bestMarker ;
var mapFE = [];
var map,myLocation;
var infoWindow;
var service;
var search_done=0;
var markers=[];
var countPlaces = 0;
var done=0;

function zoomTobest(map,marker){
    
    map.setZoom(17);
    map.panTo(marker.position);
}


function localizeBest(){
    
    refresh_onlyMap  =  1;    
    initialize();
}

function loadMap(){
    refresh_onlyMap = 0;
    initialize();    
}


function initialize()
{
  var location = new google.maps.LatLng(19.3202176, -99.224016);
  map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: location,
                scrollwheel: false,
                zoom: 15
                });
   infoWindow = new google.maps.InfoWindow();
   navigator.geolocation.getCurrentPosition(function(place)
   {    myLocation =  new google.maps.LatLng(place.coords.latitude, place.coords.longitude);
        service = new google.maps.places.PlacesService(map);
        
        var marker = new google.maps.Marker({
        map: map,
        position: myLocation
       
      });
      map.setZoom(14);
      map.panTo(myLocation);        
      google.maps.event.addListenerOnce(map, 'idle', performSearch);
   });
}

function performSearch() {
  var request = {
    bounds: map.getBounds(),
    location : myLocation,
    types: ['bank'],
    radius : 25000          
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
    
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  for (var i = 0, result; result = results[i]; i++) {
    addMarker(result);
  }
  
  for (var i = 0, result; result = results[i]; i++) {
    
     var request = {reference :result.reference}
      service.getDetails(request, function(result, status) {
   
      if (status === google.maps.places.PlacesServiceStatus.OK) {
      
        countPlaces++;
        if(countPlaces<10){
            fe = {};
            console.log(result.place_id);
            fe.name = result.name;
            fe.address = result.formatted_address;
            fe.phone= result.formatted_phone;
            fe.website = result.website;
            finalEntities.push(fe);
        }
        else{
            if(done==0){
                saveAndInit();
                done=1;
                return;
            }
        }          
      }
      else{
        if(countPlaces>5)
        {
            saveAndInit();return;
        }
      }
    });
  }    
}

function saveAndInit(){
 localStorage['financial_entities'] = JSON.stringify(finalEntities);
  initCalculator();    
}

function getFormatedContent(place){
    
    var content ='<div><strong>' + place.name + '</strong><br>' +
                  place.formatted_address + '<br>Tel&#233fono: ' +
                  place.formatted_phone_number + '<br>P&#225gina Web: <a target="_blank" style="color: blue;" href="' + 
                  place.website + '">' + place.website + '</a> <br><button type="button" onclick="location.href=&#39#contact&#39;"                              class="btn  btn-default" aria-label="Left Align"><i class="fa fa-envelope"> Contactar</i></button></div>'
    
    return content;
}

function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'http://i.imgur.com/KWzGggP.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(15, 15)
    }
  });
  
  markers[place.place_id]=marker;
    
  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(getFormatedContent(result));
      infoWindow.open(map, marker);
         
    });
  });
}

function addPlaceToJson(service,place_id){   
    
      service.getDetails({placeId:place_id}, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
        fe = {};
        fe.id = result.place_id;
        fe.name = result.name;
        fe.address = result.formatted_address;
        fe.phone= result.formatted_phone;
        fe.website = result.website;
        finalEntities.push(fe);   
    });
}