function Location(name, location, address){
  this.name = name;
  this.location = location;
  this.address = address.split(',')[0];
  this.marker = new google.maps.Marker({
    map: map,
    //icon: icon,
    title: this.name,
    position: this.location,

    //label:""+(i+1)
  });

  google.maps.event.addListener(this.marker, 'rightclick', function () {
    this.delete();
  }.bind(this));


  //this.div = $('<div class=\"list-item\"><div class=\"list_address\">'+this.name+'</div><button class=\'start-button\'>start</button><button class=\'end-button\'>end</button><button class=\'remove-button\'>remove</button></div>');
  this.div=$('.list-item').clone();
  this.div.find('.item-name').html(this.name);
  if(this.address!=""){
    this.div.find('.item-address').html(this.address);
  }
  /*$.get('/map/get_directions', {}, function(data){
    this.div=$(data);
    //$('#list-div').append(this.div);

  });*/

  this.startButton = this.div.find('.start-button');
  this.endButton = this.div.find('.end-button');
  this.removeButton = this.div.find('.remove-button');
  this.directions = this.div.find('.item-directions');

  this.bindEvents=function(){
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

    this.removeButton.click(function(){
      this.delete();
    }.bind(this));
    this.div.click(function(){
      //var disp =
      this.directions.css('display',this.directions.css('display')=='none'?'block':'none');
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

    $('#list-div').append(this.div);
    this.div.show();
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
    getDirections();
  }

  this.setStart = function(){
    startLocation=this;
    getDirections();
  }

  this.setEnd = function(){
    endLocation=this;
    getDirections();
  }
}
