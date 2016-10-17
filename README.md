# adonis-throttle-requests

[![npm version](https://badge.fury.io/js/adonis-throttle-requests.svg)](https://badge.fury.io/js/adonis-throttle-requests)
[![npm](https://img.shields.io/npm/dt/adonis-throttle-requests.svg)](https://www.npmjs.com/package/adonis-throttle-requests)
[![Build Status](https://travis-ci.org/carlsonorozco/adonis-throttle-requests.svg?branch=master)](https://travis-ci.org/carlsonorozco/adonis-throttle-requests)
[![dependencies Status](https://david-dm.org/carlsonorozco/adonis-throttle-requests/status.svg)](https://david-dm.org/carlsonorozco/adonis-throttle-requests)
[![devDependencies Status](https://david-dm.org/carlsonorozco/adonis-throttle-requests/dev-status.svg)](https://david-dm.org/carlsonorozco/adonis-throttle-requests?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Throttle Request Middleware for AdonisJs framework.

## Installation

In order to use adonis-throttle-requests you need to have [adonis-cache](https://github.com/helnokaly/adonis-cache) installed and configured.

```
npm install adonis-throttle-requests --save
```

After installation, you need to register the provider inside `bootstrap/app.js` file.

```javascript
// bootstrap/app.js

const providers = [
  ...,
  'adonis-throttle-requests/providers/ThrottleRequestsProvider',
]
```

After that enable the throttle middleware inside `app/Http/kernel.js` file.

```javascript
// app/Http/kernel.js

const namedMiddleware = {
  ...,
  throttle: 'Adonis/Middleware/ThrottleRequests'
}
```

If you want to use it as a Global Middleware

```javascript
// app/Http/kernel.js

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

## Changelog

[CHANGELOG](CHANGELOG.md)

## Credits

Thanks to the community of [AdonisJs](http://www.adonisjs.com/).

## Copyright and License

Copyright (c) 2016 [Carlson Orozco](http://carlsonorozco.com/), [MIT](LICENSE.md) License