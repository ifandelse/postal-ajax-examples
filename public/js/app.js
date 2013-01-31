define([
  'resourceManager',
  'amplify',
  'amplifyTransport'
], function(resourceMgr, amplify, AmplifyTransport) {

  resourceMgr.addTransport(new AmplifyTransport(amplify));

  return {
    version   : "0.0.1",
    resourceMgr : resourceMgr
  }

});