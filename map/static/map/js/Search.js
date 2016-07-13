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
    this.locations.push(location);
    location.search=this;
    this.div.append(location.searchDiv);
    location.searchDiv.show();
    location.bindEvents();
  }

  this.show = function(){
    $('#search-content').empty();
    $('#search-content').append(this.div);
    this.bindEvents();
    this.locations.forEach(function(location){
      location.bindEvents();
    });
  }
}
