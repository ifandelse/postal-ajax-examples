define([
  'postal'
], function( postal ) {

  var configSuccessCallback = function (operation, env) {
    return function (data) {
      var _data = data;
      if (operation && typeof operation.transformer === 'function') {
        _data = operation.transformer(data);
      }
      postal.publish({
        channel : env.channel,
        topic   : env.successReplyTo,
        data    : _data
      });
    };
  };

  var configErrorCallback = function (resDef, env) {
    return function (data) {
      postal.publish({
        channel : env.channel,
        topic   : env.errorReplyTo,
        data    : data
      });
    };
  };

  var AmplifyTransport = function (amplify, type, role) {
    this.name = type || "amplify";
    this.role = role || "pull";
    this.amplify = amplify;
  };

  AmplifyTransport.prototype.configure = function(operation) {
    var self = this;
    self.amplify.request.define(operation.resourceId + "-" + operation.name, "ajax", operation.options);

    return function (env) {
      self.amplify.request({
        resourceId : operation.resourceId + "-" + operation.name,
        data       : env.data,
        success    : configSuccessCallback(operation, env),
        error      : configErrorCallback(operation, env)
      });
    }
  };

  return AmplifyTransport;
});