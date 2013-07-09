if (Meteor.isClient) {
	Meteor.Router.add({
		'/': 'index',
		'/a': 'a',
		'/b': function() {
			Spiderable.httpHeaders['X-Foo'] = 'bar';
			return 'b';
		},
		'*': function() {
			Spiderable.httpStatusCode = 404;
			return 'notFound';
		}
	});
}
