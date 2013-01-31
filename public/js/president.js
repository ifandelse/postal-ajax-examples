define([
  'app',
  'knockout',
  'postal',
  'underscore',
  'presenter'
], function(app, ko, postal, _, Presenter) {

  var PresidentVM = function() {
    this.name = ko.observable();
    this.id = ko.observable();
    this.term = ko.observable();
    this.isVisible = ko.computed(function(){
      return this.id() >= 0;
    }, this);
  };

  return Presenter.extend({
    namespace: "president",
    initialize: function(options) {
      this.vm = new PresidentVM();
      this.vm.id.subscribe(_.bind(this.setUpDataSync, this));
      this.subscriptions["item.selected"] = postal.subscribe({
        channel  : "presidentList",
        topic    : "item.selected",
        callback : function(d,e) {
          this.vm.id(d.id);
          this.load.call(this);
        }
      }).withContext(this);
      ko.applyBindings(this.vm, options.target);
    },
    resources: [{
      resourceId : "president",
      transport  : [
        {
          name       : "amplify",
          operations : {
            "read" : {
              type    : "read",
              options : {
                url      : "/president/{id}",
                type     : "GET",
                dataType : "json"
              }
            }
          }
        }
      ]
    }],
    load: function() {
      var id = this.vm.id();
      this.channel.publish({
        topic          : id + ".read",
        data           : { id: id },
        successReplyTo : id + ".readSuccess",
        errorReplyTo   : id + ".readError"
      });
    },
    readSuccess : function(data, envelope) {
      if(data.id === this.vm.id()) {
        this.vm.name(data.name);
        this.vm.term(data.term);
      }
    }
  });
});