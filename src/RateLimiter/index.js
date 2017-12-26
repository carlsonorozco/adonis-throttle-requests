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
   * @return  {Boolean}
   *
   * @public
   */
  async tooManyAttempts (key, maxAttempts) {
    const totalAttempts = await this.attempts(key)
    if (totalAttempts >= maxAttempts) {
      const hasKey = await this.Cache.has(`${key}:timer`)
      if (hasKey) {
        return true
      }

      await this.resetAttempts(key)
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
  async hit (key, decayMinutes = 1) {
    await this.Cache.add(`${key}:timer`, Math.floor(new Date() / 1000) + (decayMinutes * 60), decayMinutes)
    const added = await this.Cache.add(key, 0, decayMinutes)
    const hits = await this.Cache.increment(key)
    if (!added && hits === 1) {
      await this.Cache.put(key, 1, decayMinutes)
    }
    return hits
  }

  /**
   * Get the number of attempts for the given key.
   *
   * @param   {String}        key
   * @return  {Promise<mixed>}
   *
   * @public
   */
  attempts (key) {
    return this.Cache.get(key, 0)
  }

  /**
   * Reset the number of attempts for the given key.
   *
   * @param   {String}        key
   * @return  {Promise<boolean>}
   *
   * @public
   */
  resetAttempts (key) {
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
  async retriesLeft (key, maxAttempts) {
    const attempts = await this.attempts(key)
    return maxAttempts - attempts
  }

  /**
   * Clear the hits and lockout for the given key.
   *
   * @param   {String}        key
   * @return  {Promise<boolean>}
   *
   * @public
   */
  async clear (key) {
    await this.resetAttempts(key)
    await this.Cache.forget(`${key}:timer`)
  }

  /**
   * Clear the hits and lockout for the given key.
   *
   * @param   {String}        key
   * @return  {Number}
   *
   * @public
   */
  async availableIn (key) {
    const lockTime = await this.Cache.get(`${key}:timer`)
    return lockTime - Math.floor(new Date() / 1000)
  }
}

module.exports = RateLimiter
