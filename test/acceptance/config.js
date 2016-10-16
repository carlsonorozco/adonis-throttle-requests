'use strict'

/**
 * adonis-throttle-requests
 *
 * (c) Carlson Orozco <carlsonorozco@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const config = module.exports = {}

config[ 'cache.default' ] = 'object'
config[ 'cache.stores' ] = {
  driver: 'object'
}
config[ 'cache.prefix' ] = 'adonis'
