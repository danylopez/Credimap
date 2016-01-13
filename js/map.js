var infowindow,
    placemarkers=[];

function placeSearch(map,request)
{
  var map=map;
  var service = new google.maps.places.PlacesService(map);
  service.search(request, 
                 function(results,status)
                 {
                  if (status == google.maps.places.PlacesServiceStatus.OK) 
                  {
                    var bounds=new google.maps.LatLngBounds();
                    for (var i = 0; i < results.length; ++i) 
                    { 
                      service.getDetails({
                        placeId: results[i].place_id
                      }, function(place, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                          var marker = new google.maps.Marker({
                            map: map,
                            icon: 'http://i.imgur.com/KWzGggP.png',
                            position: place.geometry.location
                          });
                          google.maps.event.addListener(marker, 'click', function() {
                            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                              place.formatted_address + '<br>Tel&#233fono: ' +
                              place.formatted_phone_number + '<br>P&#225gina Web: <a target="_blank"  href="' + 
                              place.website + '">' + place.website + '</a></div>');
                            infowindow.open(map, this);
                          });
                        }
                      });
                      bounds.extend(results[i].geometry.location);
                      placemarkers.push(createMarker(results[i].geometry.location,
                                   map,
                                   'http://i.imgur.com/KWzGggP.png',
                                   '<strong>'+results[i].name+'</strong></br>',
                                   false,
                                   {
                                    fnc:function() 
                                    {
                                      infowindow.open();
                                    }
                      
                                   }));
                    }
                    map.fitBounds(bounds);
                  }
                 }
                 );

}

function createMarker(latlng,map,icon,content,center,action) 
{
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    content:content
  });
  if(icon){marker.setIcon(icon);}
  
  if(center)
  {
    map.setCenter(latlng);
  }
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(this.content);
    infowindow.open(map, this);
  });
  
  if(action)
  {
    action.fnc(map,action.args);
  }
  return marker;
}

function initialize()
{
  
  var location = new google.maps.LatLng(19.3202176, -99.224016),
      map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: location,
                scrollwheel: false,
                zoom: 15
                });
   infowindow = new google.maps.InfoWindow();
   navigator.geolocation.getCurrentPosition(function(place)
   {           
      createMarker(
                    new google.maps.LatLng(place.coords.latitude,
                                          place.coords.longitude),
                    map,
                    null,
                    'Posici&#243n actual.',
                    true,
                    {
                     fnc:placeSearch,
                     args:{
                           radius: 5000,
                           types: ['bank'],
                           location:new google.maps.LatLng(place.coords.latitude,
                                                           place.coords.longitude)
                          }
                   }
                   );      
   });
}