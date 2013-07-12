This package is a fork of the official Meteor core spiderable package,
with added support for returning custom HTTP status codes and headers.

**IMPORTANT:** This is a **replacement** for the normal spiderable
package, not an add-on! Make sure to remove 'spiderable' from your
project!

The default Meteor spiderable package always returns a '200 OK' status
code, even if no client-side route exists for the requested URL. This 
is undesirable, because this will cause search engines to index all your
'not found' pages as they contain real content.

## Example using meteor-router

A demo of this package can be found at http://spiderable-404.meteor.com/

In order to set the HTTP response code to be returned by spiderable-404,
you have to assign it to the global `Spiderable.httpStatusCode` variable.
It's possible to add extra response headers by assigning them to
`Spiderable.httpHeaders`. This only has effect when the page is executed 
within PhantomJS, not when the page is executed in a normal browser.

```javascript
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
```

You can test the routes using curl:

```
$ curl --head 'http://localhost:3000/b?_escaped_fragment_='
HTTP/1.1 200 OK
vary: Accept-Encoding
x-foo: bar
content-type: text/html; charset=UTF-8
date: Wed, 03 Jul 2013 14:55:33 GMT
connection: keep-alive

$ curl --head 'http://localhost:3000/page-not-found?_escaped_fragment_='
HTTP/1.1 404 Not Found
vary: Accept-Encoding
content-type: text/html; charset=UTF-8
date: Wed, 03 Jul 2013 14:55:53 GMT
connection: keep-alive
```

## Implementation notes

This package adds a `Spiderable` object on the client side, on which
status codes and headers can be set.

If one of these is set, the PhantomJS driver code outputs an extra line 
before the actual HTML content, with the status code and a JSON 
serialized representation of the extra headers:

```html
<!-- HTTP-RESPONSE:404 {'X-Foo':'bar'} -->
```

The Meteor code executing PhantomJS parses this line, sets the appropriate
response code and headers, and strips it from the HTML content
returned to the search engine bot.
