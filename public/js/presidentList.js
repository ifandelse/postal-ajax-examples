define([
  'app',
  'knockout',
  'presenter',
  'underscore'
], function(app, ko, Presenter, _) {

  var PresidentList = function() {
    this.items = ko.observableArray([]);
    this.selectedItem = ko.observable();
    this.isVisible = ko.computed(function() {
      return !!this.items().length;
    }, this);
  };

  return Presenter.extend({
    namespace: "presidentList",
    initialize: function(options) {
      this.vm = new PresidentList();
      this.setUpDataSync();
      this.vm.selectedItem.subscribe(
        function(selected){
          var x = 1;
          this.channel.publish("item.selected", {
            id: selected
          });
        }, this
      );
      ko.applyBindings(this.vm, options.target);
    },
    resources: [
      {
        transport  : [
          {
            name       : "amplify",
            operations : {
              "read" : {
                type    : "read",
                options : {
                  url      : "/presidents",
                  type     : "GET",
                  dataType : "json"
                }
              }
            }
          }
        ]
      }
    ],
    setUpDataSync : function() {
      if(this.subscriptions.sync) {
        this.subscriptions.sync.unsubscribe();
      }
      this.subscriptions.sync =
        this.channel.subscribe("#", this.routeSyncEvent).withContext(this);
    },
    load: function() {
      this.channel.publish({
        topic          : "read",
        data           : {},
        successReplyTo : "readSuccess",
        errorReplyTo   : "readError"
      });
    },
    readSuccess : function(data, envelope) {
      this.vm.items(data);
    }
  });
});