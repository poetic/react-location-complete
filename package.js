Package.describe({
  name: 'poetic:react-location-complete',
  version: '0.0.1',
  summary: 'A react component for auto complete with locations in a material ui input field',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/poetic/react-location-complete',
  documentation: 'README.md'
});


Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('react');
  api.use('reactive-var');
  api.use('poetic:material-ui-components');
  api.use('dburles:google-maps');
  api.use('universe:modules');
  api.addFiles('index.import.jsx');
  api.export('GoogleMaps');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('poetic:react-location-complete');
  api.addFiles('modules-tests.js');
});
