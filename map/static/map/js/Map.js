var map, geocoder, searchBox, directionsService, directionsDisplay;

var searches=[];
var routes=[];
var points = [];
var pointLocs = [];
var selected=null;

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
    zoomControl: false,
    mapTypeControl:false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
  });

  map.data.setStyle({
    strokeWeight: 1,
    fillOpacity: 0.05,
    strokeWeight: 1,
    visible: true,
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
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('details'));

/*
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
*/

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    console.log('places changed');
    search();
  });

}

function initDirections(){
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});
  directionsDisplay.setMap(map);

  directionsService = new google.maps.DirectionsService();
}


function search(){
  $('#search-tabs').show();
  var search = new Search("search");
  searchBox.getPlaces().forEach(function(place){
    console.log(place);
    var image=null;
    if(place.photos!=null){
      image=place.photos[0];
    }
    search.add(new Location(place.name,place.geometry.location,place.formatted_address,image));
  });
  searches.push(search);
  search.show();
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
