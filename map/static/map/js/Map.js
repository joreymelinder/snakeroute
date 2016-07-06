var map, geocoder, searchBox, directionsService, directionsDisplay;

var locations=[];
var points = [];
var pointLocs = [];

var startLocation, endLocation;
var opt=true;
var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function init() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.7604, lng: -95.3698},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    rotateControl: false,
    mapTypeControl:true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
  });

  initSearch();
  initDirections();

  getLocation(function(loc){
    if(loc){
      //found user's city. setting viewport to city bounds
      geocoder.geocode(
        {'location':new google.maps.LatLng({lat:loc.coords.latitude,lng:loc.coords.longitude})},
        function(results,status){
          var city = results.filter(function(result){
            return result.types.indexOf('locality')!=-1;
          })[0];
          map.fitBounds(city.geometry.bounds);
      });
    }
    else{
      //could not find user's city. default to Houston
      geocoder.geocode({'address':'Houston,TX'},function(results,status){
        //console.log(results[0]);
        map.fitBounds(results[0].geometry.bounds);
      });
    }
  });
}

function initSearch(){
  geocoder = new google.maps.Geocoder();

  var $input = $('#search-bar');
  var $menu = $('#menu');
  var $searchDiv = $('#search-div');

  $input.width('300px');
  searchBox = new google.maps.places.SearchBox(document.getElementById('search-bar'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('search-div'));
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('list-div'));
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('opt-button'));
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('loc-button'));

  $('#opt-button').click(function(){
    opt=!opt;
    getDirections();
  });

  $('#loc-button').click(function(){
    getLocation(function(loc){
      if(loc){
        //console.log(loc.constructor==google.maps.Geoposition);
        locations.push(new Location("my location",new google.maps.LatLng({lat:loc.coords.latitude,lng:loc.coords.longitude}),""));
        getDirections();
      }
      else{
        //cannot get location
      }
    });
  });

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    search();
  });
}

function initDirections(){
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});
  directionsDisplay.setMap(map);

  directionsService = new google.maps.DirectionsService();
}



function search(){
  var places=searchBox.getPlaces()
  for(i=0;i<9&&i<places.length;i++){
    var place = places[i];
    var loc = new Location(place.name,place.geometry.location,place.formatted_address);
    locations.push(loc);

    if(locations.length>9){
      locations[0].delete();
    }
  };
  getDirections();
}

function getDirections(){
  if(locations.length>1){
    $('#list-div').empty();
    if(!startLocation){
      startLocation=locations[0];
    }
    if(!endLocation){
      endLocation=startLocation;
    }

    points = [];
    pointLocs = [];

    locations.forEach(function(loc){
      if(loc!=startLocation&&loc!=endLocation&&points.length<8){
        points.push({location: loc.location, stopover:true});
        pointLocs.push(loc);
      }
    });

    var request = {
      origin:startLocation.location,
      destination:endLocation.location,
      optimizeWaypoints:opt,
      waypoints: points,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        var route = response.routes[0];
        var legs = route.legs;
        var distance=0;
        startLocation.addToRoute(legs[0]);
        startLocation.div.find('.start-button i').css('color','green');
        distance+=legs[0].distance.value;
        for(i=1;i<legs.length;i++){
          pointLocs[route.waypoint_order[i-1]].addToRoute(legs[i]);
          distance+=legs[i].distance.value;
        }

        directionsDisplay.setDirections(response);

        //console.log('routed');
        if(startLocation!=endLocation){
          //console.log('not loop');
          endLocation.addToRoute(null);
          endLocation.div.find('.end-button i').css('color','red');
        }
        else{
          //console.log('loop');
          var endDiv = endLocation.div.clone();
          endDiv.remove('.item-directions');
          endDiv.find('.end-button i').css('color','red');
          startLocation.div.find('.end-button i').css('color','red');
          $('#list-div').append(endDiv);
        }
        distDiv = $('<div class=\'totals\'>'+'Total distance: <b>'+(Math.round(distance*0.000621371*100)/100)+' miles.</b>'+'</div>');

        $('#list-div').append(distDiv);
      }
    });
  }
}

function getLocation(callback){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(location) {
        callback(location);
      },
      function() {
        //cannot has
        callback(null);
      });
  }
  else {
    //incompatible
    callback(null);
  }
}
