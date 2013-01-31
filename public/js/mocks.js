define([
  'jquery',
  'mockjax'
], function($, mockjax){
  var data = {
    0: {
      id   : 0,
      name : "George Washington",
      term : "April 30, 1789 – March 4, 1797"
    },
    1: {
      id   : 1,
      name : "John Adams",
      term : "March 4, 1797 – March 4, 1801"
    },
    2: {
      id   : 2,
      name : "Thomas Jefferson",
      term : "March 4, 1801 – March 4, 1809"
    },
    3: {
      id   : 3,
      name : "James Madison",
      term : "March 4, 1809 – March 4, 1817"
    },
    4: {
      id: 4,
      name: "James Monroe",
      term: "March 4, 1817 – March 4, 1825"
    }
  };

  $.mockjax( {
    url : /president\/[0-9]{1,2}$/,
    type : "GET",
    response : function ( settings ) {
      var id = settings.url.substr( settings.url.lastIndexOf( "/" ) + 1 ),
        president = data[id];
      if ( president ) {
        this.status = 200;
        this.responseText = JSON.stringify( president );
      }
      else {
        this.status = 404;
      }
    }
  } );

  $.mockjax( {
    url : "/presidents",
    type : "GET",
    status : 200,
    response : function ( settings ) {
      this.responseText = JSON.stringify(
        _.toArray(
          _.map(data, function(pres){
            return { id: pres.id, name: pres.name }
          })
        )
      );
    }
  } );

});