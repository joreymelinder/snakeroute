function Search(name){
  this.name = name;
  this.locations = [];
  this.active = true;
  this.div=$('.search-list:first').clone();
  this.tabDiv=$('.tab:first').clone();
  this.tabDiv.html(this.name);
  this.tabDiv.css('display','inline-block');
  $('#search-tabs').append(this.tabDiv);

  this.bindEvents=function(){

    this.tabDiv.click(function(){
      this.show();
    }.bind(this));

    this.tabDiv.hover(function(){
      //increase marker size
    }.bind(this),function(){
      //reset marker
    }.bind(this));
  }

  this.add = function(location){
    if(this.locations.indexOf(location)==-1){
      this.locations.push(location);
      var locDiv = location.searchDiv.clone();
      this.div.append(locDiv);
      locDiv.show();
      this.bindLocation(location);
    }
  }

  this.bindLocation = function(location){
    var locDiv=this.getDiv(location);
    locDiv.find('.route-button').click(function(){
      if(routes.length==0){
        routes.push(new Route('route'));
        $('#route-tabs').show();
        routes[0].show();
      }
      routes[0].add(location);
    }.bind(this));

    locDiv.find('.remove-button').click(function(){
      this.locations.splice(this.locations.indexOf(location),1);
      locDiv.hide(200,function(){
        locDiv.remove();
      });
    }.bind(this));

    locDiv.click(function(){
      this.select();
    }.bind(location));
  }

  this.getDiv= function(location){
    return this.div.children().eq(this.locations.indexOf(location));
  }

  this.show = function(){
    var bounds=new google.maps.LatLngBounds();
    $('#search-content').empty();
    $('#search-content').append(this.div);
    this.bindEvents();
    this.locations.forEach(function(location){
      bounds.extend(location.location);
    });
    this.locations[0].select();
    map.fitBounds(bounds);
  }
}
