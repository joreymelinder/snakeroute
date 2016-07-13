function Route(name){
  this.name = name;
  this.locations = [];
  this.startLocation=null;
  this.endLocation=null;
  this.active = true;
  this.div=$('.route-list:first').clone();
  this.tabDiv=$('.tab:first').clone();
  this.tabDiv.html(this.name);
  this.tabDiv.css('display','inline-block');
  $('#route-tabs').append(this.tabDiv);

  this.bindEvents=function(){

    this.tabDiv.click(function(){
      this.show();
    }.bind(this));

    this.tabDiv.hover(function(){

    }.bind(this),function(){

    }.bind(this));
  }

  this.add = function(location){
    if(this.locations.indexOf(location)==-1){
      this.div.find('.totals').remove();
      this.locations.push(location);
      var locDiv = location.routeDiv.clone();
      this.div.append(locDiv);
      locDiv.show();
      this.bindLocation(location);
      //location.bindEvents();
      console.log(this.div);
      this.getDirections();
    }
  }

  this.bindLocation = function(location){
    var locDiv=this.getDiv(location);
    console.log(locDiv);
    if(location!=this.startLocation){
      locDiv.find('.start-button').click(function(){
        this.startLocation=location;
        console.log(this);
      }.bind(this));
    }
    if(location!=this.endLocation){
      locDiv.find('.end-button').click(function(){
        this.endLocation=location;
        console.log(this);
      }.bind(this));
    }

    locDiv.find('.remove-button').click(function(){
      this.locations.splice(this.locations.indexOf(location),1);
      locDiv.hide(200,function(){
        locDiv.remove();
      });
    }.bind(this));
  }

  this.getDiv= function(location){
    console.log(this.locations.indexOf(location));
    return this.div.children().eq(this.locations.indexOf(location));
  }

  this.show = function(){
    //$('#route-content').empty();
    $('#route-content').append(this.div);
    this.bindEvents();
    /*
    this.locations.forEach(function(location){
      location.bindEvents();
    });*/
  }


  this.getDirections = function(){
    if(this.startLocation==null){
      this.startLocation=this.locations[0];
    }
    if(this.endLocation==null){
      this.endLocation=this.startLocation;
    }

    var points = [];
    var pointLocs = [];

    this.locations.forEach(function(loc){
      if(loc!=this.startLocation&&loc!=this.endLocation&&points.length<8){
        points.push({location: loc.location, stopover:true});
        pointLocs.push(loc);
      }
    });

    var request = {
      origin:this.startLocation.location,
      destination:this.endLocation.location,
      optimizeWaypoints:true,
      waypoints: points,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        var route = response.routes[0];
        var legs = route.legs;

        var distance=0;

        //startLocation.addToRoute(legs[0]);
        //startLocation.div.find('.start-button i').css('color','green');
        distance+=legs[0].distance.value;
        for(i=1;i<legs.length;i++){
          //pointLocs[route.waypoint_order[i-1]].addToRoute(legs[i]);
          distance+=legs[i].distance.value;
        }

        directionsDisplay.setDirections(response);

        //console.log('routed');
        if(startLocation!=endLocation){
          //console.log('not loop');
          //endLocation.addToRoute(null);
          //endLocation.div.find('.end-button i').css('color','red');
        }
        else{
          //console.log('loop');
          //var endDiv = endLocation.div.clone();
          //endDiv.remove('.item-directions');
          //endDiv.find('.end-button i').css('color','red');
          //startLocation.div.find('.end-button i').css('color','red');
          //$('#list-div').append(endDiv);
        }

        distDiv = $('<div class=\'totals\'>'+'Total distance: <b>'+(Math.round(distance*0.000621371*100)/100)+' miles.</b>'+'</div>');
        this.div.append(distDiv);
      }
    }.bind(this));
  }
}
