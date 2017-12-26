'use strict'

/**
 * adonis-throttle-requests
 *
 * (c) Carlson Orozco <carlsonorozco@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

class ThrottleRequestsProvider extends ServiceProvider {
  /**
   * Register all the required providers
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Adonis/Middleware/ThrottleRequests', app => {
      const Cache = app.use('Adonis/Addons/Cache')
      const RateLimiter = require('../src/RateLimiter')
      const ThrottleRequests = require('../middleware/ThrottleRequests')
      return new ThrottleRequests(new RateLimiter(Cache))
    })
  }
}

module.exports = ThrottleRequestsProvider
