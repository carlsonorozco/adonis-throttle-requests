## Registering provider

Make sure you register the provider inside `start/app.js` file before making use throttle request.

```js
const providers = [
  'adonis-throttle-requests/providers/ThrottleRequestsProvider'
]
```

After that enable the throttle middleware inside `start/kernel.js` file.

```javascript
const namedMiddleware = {
  ...,
  throttle: 'Adonis/Middleware/ThrottleRequests'
}

If you want to use it as a Global Middleware

```javascript
const globalMiddleware = [
  ...,
  'Adonis/Middleware/ThrottleRequests'
]
```

## Usage

### Throttle Request into specific route

Use the `throttle` middleware to limit request for a given route (eg. Login Route)

The following example throttle request be limiting the number of login attempts for 5 requests every 3 minutes.

```javascript
// app/Http/routes.js

Route.post('login', 'Auth/LoginController.postLogin').middleware('throttle:5,3')
```

Throttle 5 request per minute

```javascript
// app/Http/routes.js

Route.post('login', 'Auth/LoginController.postLogin').middleware('throttle:5')
```

Default Throttle 60 request per minute

```javascript
// app/Http/routes.js

Route.post('login', 'Auth/LoginController.postLogin').middleware('throttle')
```

Throttle All Routes in Route Group

```javascript
// app/Http/routes.js

Route.group('auth', () => {
  ...
}).prefix('/v1').middleware('auth', 'throttle')
```

If the subject exceeds the maximum number of requests, it will return `Too Many Attempts.` with status code of 429.
