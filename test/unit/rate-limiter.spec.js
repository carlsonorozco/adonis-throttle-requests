'use strict'

/**
 * adonis-throttle-requests
 *
 * (c) Carlson Orozco <carlsonorozco@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')

test.group('RateLimiter', group => {
  test.skip('should return true when already locked out')
  test.skip('should return true when max attempts exceeded ')
  test.skip('should hit properly increments attempt count')
  test.skip('should clear the cache keys')
})
