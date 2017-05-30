'use strict'

/**
 * adonis-throttle-requests
 *
 * (c) Carlson Orozco <carlsonorozco@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const ServiceProvider = require('adonis-fold').ServiceProvider

class ThrottleRequestsProvider extends ServiceProvider {
  * register () {
    this._bindMiddleware()
  }

  _bindMiddleware () {
    this.app.bind('Adonis/Middleware/ThrottleRequests', function (app) {
      const Cache = app.use('Adonis/Addons/Cache')
      const RateLimiter = require('../src/RateLimiter')
      const ThrottleRequests = require('../middleware/ThrottleRequests')
      return new ThrottleRequests(new RateLimiter(Cache))
    })
  }
}

module.exports = ThrottleRequestsProvider
