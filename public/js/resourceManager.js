define([
  'underscore',
  'postal'
], function(_, postal) {
  var resourceMgr = {
    transports  : { roles: {} },
    resources   : {},
    addResource : function(def) {
      var res = this.resources, trans;
      res[def.resourceId] = res[def.resourceId] || {};
      _.each(def.transport, function(transport){
        var trans = this.transports[transport.name];
        _.each(transport.operations, function(op, opName){
          op.resourceId = def.resourceId;
          op.name = opName;
          if(!res[def.resourceId][opName]) {
            res[def.resourceId][opName] = { currentTransport: transport.name };
          }
          if(!res[def.resourceId][opName][transport.name]){
            res[def.resourceId][opName][transport.name] = trans.configure(op);
          }
          this.subscriptions[def.resourceId] = this.subscriptions[def.resourceId] || {};
          if(!this.subscriptions[def.resourceId][opName]) {
            this.subscriptions[def.resourceId][opName] = postal.subscribe({
              channel  : def.resourceId,
              topic    : "#." + opName,
              callback : this.routeRequest
            }).withContext( this );
          }
        }, this);
      }, this);
    },
    addTransport: function(transport) {
      if(!this.transports[transport.name]) {
        this.transports[transport.name] = transport;
      }
      if(transport.role) {
        this.transports.roles[transport.role] = transport.name;
      }
    },
    routeRequest : function ( data, envelope ) {
      var meta = envelope.topic.split('.' ),
        operation = meta[meta.length-1], // last segment of topic should be the operation
        resource = envelope.channel;     // channel name should be the resource
      this.runOperation(resource, operation, envelope);
    },
    runOperation: function(resource, operation, env) {
      var resourceObj = this.resources[resource],
        op = resourceObj[operation],
        resourceTransport = op ? op.currentTransport : undefined;
      env = env || {};
      if(env.options && env.options.requestType && this.transports.roles[env.options.requestType]) {
        resourceTransport = this.transports.roles[env.options.requestType];
      }
      if(op && op[resourceTransport]) {
        try {
          op[resourceTransport](env);
        } catch(ex) {
          // NOTE: You could implement logic covering at least one or more of these concerns:
          // 1.) Reply on the envelope's "errorReplyTo" with the exception data
          // 2.) have this error inform an FSM managing connectivity, so that it can
          //     potentially alter the state/behavior of requests on this transport
        }
      } else {
        var msg = "Error running data module operation for resource: " + resource + ", operation: " + operation + ".  Options: " + JSON.stringify(env || {});
        throw new Error(msg);
      }
    },
    subscriptions: {}
  };

  return resourceMgr;
});