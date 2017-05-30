'use strict'

/**
 * adonis-throttle-requests
 *
 * (c) Carlson Orozco <carlsonorozco@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

class RateLimiter {
  /**
   * Create a new rate limiter instance.
   *
   * @param  {Adonis/Addons/Cache}  Cache
   *
   */
  constructor (Cache) {
    this.Cache = Cache
  }

  /**
   * Determine if the given key has been "accessed" too many times.
   *
   * @param   {String}        key
   * @param   {Number}        maxAttempts
   * @param   {Number}        decayMinutes [optional, default = 1]
   * @return  {Boolean}
   *
   * @public
   */
  * tooManyAttempts (key, maxAttempts, decayMinutes = 1) {
    const hasKey = yield this.Cache.has(`${key}:lockout`)
    if (hasKey) {
      return true
    }
    const totalAttempts = yield this.attempts(key)
    if (totalAttempts > maxAttempts) {
      yield this.Cache.add(`${key}:lockout`, Math.floor(new Date() / 1000) + (decayMinutes * 60), decayMinutes)
      yield this.resetAttempts(key)
      return true
    }
    return false
  }

  /**
   * Increment the counter for a given key for a given decay time.
   *
   * @param   {String}        key
   * @param   {Number}        decayMinutes [optional, default = 1]
   * @return  {Number}
   *
   * @public
   */
  * hit (key, decayMinutes = 1) {
    yield this.Cache.add(key, 1, decayMinutes)
    return yield this.Cache.increment(key)
  }

  /**
   * Get the number of attempts for the given key.
   *
   * @param   {String}        key
   * @return  {Promise<mixed>}
   *
   * @public
   */
  * attempts (key) {
    return yield this.Cache.get(key, 0)
  }

  /**
   * Reset the number of attempts for the given key.
   *
   * @param   {String}        key
   * @return  {Promise<boolean>}
   *
   * @public
   */
  * resetAttempts (key) {
    return this.Cache.forget(key)
  }

  /**
   * Get the number of retries left for the given key.
   *
   * @param   {String}        key
   * @param   {Number}        maxAttempts
   * @return  {Number}
   *
   * @public
   */
  * retriesLeft (key, maxAttempts) {
    const attempts = yield this.attempts(key)
    return attempts === 0 ? maxAttempts : maxAttempts - attempts + 1
  }

  /**
   * Clear the hits and lockout for the given key.
   *
   * @param   {String}        key
   * @return  {Promise<boolean>}
   *
   * @public
   */
  * clear (key) {
    this.resetAttempts(key)
    yield this.Cache.forget(`${key}:lockout`)
  }

  /**
   * Clear the hits and lockout for the given key.
   *
   * @param   {String}        key
   * @return  {Number}
   *
   * @public
   */
  * availableIn (key) {
    const lockTime = yield this.Cache.get(`${key}:lockout`)
    return lockTime - Math.floor(new Date() / 1000)
  }
}

module.exports = RateLimiter
