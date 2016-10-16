'use strict'

/**
 * adonis-throttle-requests
 *
 * (c) Carlson Orozco <carlsonorozco@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const config = require('./config')
const fold = require('adonis-fold')
const path = require('path')

module.exports = done => {
  const providers = [
    'adonis-cache/providers/CacheProvider'
  ]
  providers.push(path.join(__dirname, '../../providers/ThrottleRequestsProvider'))

  fold.Registrar
    .register(providers)
    .then(() => {
      fold.Ioc.aliases({ ThrottleRequests: 'Adonis/Addons/ThrottleRequestsProvider' })

      fold.Ioc.fake('Adonis/Src/Config', () => {
        return {
          get: function (key, defaultValue) {
            return config[ key ] || defaultValue
          }
        }
      })

      done()
    })
}
