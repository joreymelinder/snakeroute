function Location(name, location, address){
  this.name = name;
  this.location = location;
  this.address = address.split(',')[0];
  this.search=null;
  this.route=null;
  this.marker = new google.maps.Marker({
    map: map,
    //icon: icon,
    title: this.name,
    position: this.location,

    //label:""+(i+1)
  });

  //this.searchDiv = $('<div class=\"list-item\"><div class=\"list_address\">'+this.name+'</div><button class=\'start-button\'>start</button><button class=\'end-button\'>end</button><button class=\'remove-button\'>remove</button></div>');
  //console.log($('.list-item')[0]);
  this.searchDiv=$('.search-item:first').clone();
  this.routeDiv=$('.route-item:first').clone();
  this.searchDiv.find('.item-name').html(this.name.replace(/\(.*\)/,''));
  this.routeDiv.find('.item-name').html(this.name.replace(/\(.*\)/,''));
  if(this.address!=""){
    this.searchDiv.find('.item-address').html(this.address);
    this.routeDiv.find('.item-address').html(this.address);
  }

  this.routeButton = this.searchDiv.find('.route-button');
  this.removeSearch = this.searchDiv.find('.remove-button');

  //this.removeRoute = this.routeDiv.find('.remove-button');
  //this.startButton = this.routeDiv.find('.start-button');
  //this.endButton = this.routeDiv.find('.end-button');
  //this.directions = this.routeDiv.find('.item-directions');

  this.bindEvents=function(){
    /*
    if(this!=startLocation){
      this.startButton.click(function(){
        this.setStart();
      }.bind(this));
    }

    if(this!=endLocation){
      this.endButton.click(function(){
        this.setEnd();
      }.bind(this));
    }
    */
    google.maps.event.addListener(this.marker, 'rightclick', function () {
      if(this.search!=null){
        console.log(this.search);
        console.log(this.search.locations.indexOf(this));
        console.log(this.search.div.children().index(this.searchDiv));
      }
    }.bind(this));

    this.removeSearch.click(function(ev){
      ev.stopImmediatePropagation();
      this.marker.setMap(null);
      this.search.locations.splice(this.search.locations.indexOf(this),1);
      this.searchDiv.hide(200,function(){
        this.remove();
      });
    }.bind(this));

    this.routeButton.click(function(ev){
      ev.stopImmediatePropagation();
      if(routes.length==0){
        routes.push(new Route('route'));
        $('#route-tabs').show();
        routes[0].show();
      }
      routes[0].add(this);
    }.bind(this));

    this.searchDiv.click(function(ev){
      ev.stopImmediatePropagation();
      //var disp =
      //this.directions.css('display',this.directions.css('display')=='none'?'block':'none');
      this.getSchoolDistrict();
      this.getSchoolsInDistrict();

    }.bind(this));
    this.searchDiv.hover(function(){

    }.bind(this),function(){

    }.bind(this));
  }

  this.addToRoute = function(leg){
    this.marker.setLabel(letters[$('#list-div .list-item').length]);
    this.directions.empty();
    if(leg){
      leg.steps.forEach(function(step){
        this.directions.append($('<p>'+step.instructions+'</p>'));
      }.bind(this));
    }

    this.startButton.find('i').css('color','');
    if(this==startLocation){
      this.startButton.find('i').css('color','green');
    }
    this.endButton.find('i').css('color','');
    if(this==endLocation){
      this.endButton.find('i').css('color','red');
    }

    $('#list-div').append(this.searchDiv);
    this.searchDiv.show();
    this.bindEvents();
  }

  this.delete = function(){
    this.marker.setMap(null);
    locations.splice(locations.indexOf(this),1);
    if(startLocation==this){
      //console.log('delete start');
      startLocation=null;
    }
    if(endLocation==this){
      //console.log('delete end');
      endLocation=null;
    }
    //getDirections();
  }

  this.setStart = function(){
    startLocation=this;
    getDirections();
  }

  this.setEnd = function(){
    endLocation=this;
    getDirections();
  }

  this.getSchoolDistrict = function(){
    $.get('/map/get_school_district', {lat:this.location.lat(),lng:this.location.lng()}, function(data){
      //console.log(data);
      district = map.data.addGeoJson(data);
    });
  }

  this.getSchoolsInDistrict = function(){
    $.get('/map/get_schools', {lat:this.location.lat(),lng:this.location.lng()}, function(data){
      console.log(data);

      data['features'].forEach(function(school){
        console.log(school);
        $.get('/map/get_school_rating', {name:school.properties.name,state:school.properties.state}, function(rating){
          console.log(rating);
          var rColor = 255;
          var gColor = 255;

          if(rating>5){
            rColor=Math.round(rColor*((10-rating)/5));
          }
          else if(rating<5){
            gColor=Math.round(gColor*(rating/5));
          }

          var color = ('rgb('+rColor.toString()+','+gColor.toString()+',0)');

          new google.maps.Marker({
            map: map,
            icon: {
              path: 'M 20.675506,10.573233 A 10.10101,9.9747477 0 0 1 10.574495,20.547981 10.10101,9.9747477 0 0 1 0.47348503,10.573233 10.10101,9.9747477 0 0 1 10.574495,0.59848521 10.10101,9.9747477 0 0 1 20.675506,10.573233 Z',
              fillColor: color,
              strokeColor: '#000000',
              fillOpacity: 1,
              scale: .5,
              strokeWeight: 0.5,
              anchor: new google.maps.Point(11,11),
            },
            title: school.properties.name,
            position: new google.maps.LatLng({lat:school.geometry.coordinates[1],lng:school.geometry.coordinates[0]}),
          });
        });
      });
    });
  }

  this.getSchoolsInDistrict2 = function(){
    $.get('/map/get_schools', {lat:this.location.lat(),lng:this.location.lng()}, function(data){
      var schools = map.data.addGeoJson(data);
      console.log(data);
      schools.forEach(function(school){

        $.get('/map/get_school_rating', {name:school.f.name,state:school.f.state}, function(rating){
          console.log(rating);
          var rColor = 255;
          var gColor = 255;

          if(rating>5){
            rColor=Math.round(rColor*((10-rating)/5));
          }
          else if(rating<5){
            gColor=Math.round(gColor*(rating/5));
          }

          var color = ('rgb('+rColor.toString()+','+gColor.toString()+',0)');

          map.data.overrideStyle(school,{icon: {
            path: 'M 20.675506,10.573233 A 10.10101,9.9747477 0 0 1 10.574495,20.547981 10.10101,9.9747477 0 0 1 0.47348503,10.573233 10.10101,9.9747477 0 0 1 10.574495,0.59848521 10.10101,9.9747477 0 0 1 20.675506,10.573233 Z',
            fillColor: color,
            strokeColor: '#000000',
            fillOpacity: 1,
            scale: .5,
            strokeWeight: 0.5,
            anchor: new google.maps.Point(11,11),
          },title:school.f.name});
        });
      });
    });
  }
  //this.getSchoolDistrict();
  //this.getSchoolsInDistrict();
}
