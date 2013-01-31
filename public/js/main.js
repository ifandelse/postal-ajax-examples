require.config({
  paths: {
    knockout    : "lib/ko/knockout-2.2.1",
    underscore  : "lib/underscore/underscore",
    postal      : "lib/postal/postal",
    postalDiags : "lib/postal/postal.diagnostics",
    amplify     : "lib/amplify/amplify",
    mockjax     : "lib/amplify/jquery.mockjax-1.5.1",
    riveter     : "lib/riveter/riveter"
  },

  shim : {
    underscore: {
      "exports" : "_"
    },
    amplify: {
      "deps"    : [ "jquery"],
      "exports" : "amplify"
    },
    mockjax: {
      "deps" : [ "jquery" ]
    }
  }
});

require([
  'jquery',
  'app',
  'presidentList',
  'president',
  'postal',
  'postalDiags',
  'mocks'
], function($, app, PresidentListPresenter, PresidentPresenter, postal, DiagnosticWireTap){
  window.postalAjaxApp = app;

  app.wireTap = new DiagnosticWireTap();
  app.president = new PresidentPresenter({ target: $("#results")[0] });
  app.presidentList = new PresidentListPresenter({ target: $("#picker")[0] });

  app.presidentList.load();
});