define([
  'riveter',
  'underscore',
  'app',
  'postal'
], function(riveter, _, app, postal) {

  var Presenter = function(options) {
    options = options || {};
    this.subscriptions = _.extend(this.subscriptions || {}, options.subscriptions);
    this.resources = _.union(this.resources || [], options.resources || []);
    this.namespace = this.namespace || options.namespace || _.uniqueId("presenter_");
    this.channel = postal.channel(this.namespace);
    if(this.resources && this.resources.length) {
      _.each(this.resources, function(resource){
        app.resourceMgr.addResource(resource);
      });
    }
    this.initialize.call(this, options);
  };
  _.extend(Presenter.prototype, {
    setUpDataSync : function(id) {
      if(this.subscriptions.sync) {
        this.subscriptions.sync.unsubscribe();
      }
      this.subscriptions.sync =
        this.channel.subscribe(id + ".#", this.routeSyncEvent).withContext(this);
    },
    routeSyncEvent: function(data, envelope){
      var segments = envelope.topic.split('.');
      var handler = segments[segments.length-1];
      if(this[handler]) {
        this[handler].call(this, data, envelope);
      }
    },
    initialize: function() {}
  });

  riveter(Presenter);

  return Presenter;
});