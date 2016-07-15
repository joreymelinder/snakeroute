function Location(name, location, address, image){
  this.name = name;
  this.location = location;
  this.address = address.split(',')[0];
  this.image = image;
  this.marker = new google.maps.Marker({
    map: map,
    //icon: icon,
    title: this.name,
    position: this.location,

    //label:""+(i+1)
  });

  this.initDivs = function(){
    this.searchDiv=$('.search-item:first').clone();
    this.routeDiv=$('.route-item:first').clone();
    this.searchDiv.find('.item-name').html(this.name.replace(/\(.*\)/,''));
    this.routeDiv.find('.item-name').html(this.name.replace(/\(.*\)/,''));
    if(this.address!=""){
      this.searchDiv.find('.item-address').html(this.address);
      this.routeDiv.find('.item-address').html(this.address);
    }
  }

  this.select=function(){
    selected=this;
    $('#name-d').html(this.name);
    $('#address-d').html(this.address);
    if(this.image!=null){
      $('#image-d').html('<img src=\''+this.image.getUrl({maxHeight:350})+'\'>');
    }
    else{
      $('#image-d').empty();
    }
    $('#schools-d').click(function(){
      this.getSchoolsInDistrict();
    }.bind(this));
    $('#details').show();
    map.setCenter(this.location);
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

  this.initDivs();
}
