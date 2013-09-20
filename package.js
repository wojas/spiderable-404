Package.describe({
  summary: "Replacement for the core spiderable package, with support for status codes like 404"
});

Package.on_use(function (api) {
	api.use('webapp', 'server');
  api.use(['templating'], 'client');
  api.use(['underscore'], ['client', 'server']);

  api.export('Spiderable', 'server');

  api.add_files(['spiderable.html', 'client.js'], 'client');
  api.add_files('spiderable.js', 'server');
});
