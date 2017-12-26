'use strict'

/**
 * adonis-throttle-requests
 *
 * (c) Carlson Orozco <carlsonorozco@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

class ThrottleRequests {
  /**
   * Create a new rate limiter instance.
   *
   * @param  {RateLimiter}  RateLimiter
   *
   */
  constructor (RateLimiter) {
    this.RateLimiter = RateLimiter
  }

  /**
   * Handle an incoming request.
   *
   * @param   {Request}     request
   * @param   {Response}    response
   * @param   {Function}    next
   * @param   {Number}      maxAttempts     [optional, default = 60]
   * @param   {Number}      decayMinutes    [optional, default = 1]
   * @return  {Response|Function}
   *
   * @public
   */
  async handle ({ request, response }, next, [maxAttempts = 60, decayMinutes = 1]) {
    const key = await this._resolveRequestSignature(request)
    if (await this.RateLimiter.tooManyAttempts(key, maxAttempts)) {
      return this._buildResponse(response, key, maxAttempts)
    }
    await this.RateLimiter.hit(key, decayMinutes)
    await this._addHeaders(
      response, maxAttempts,
      await this._calculateRemainingAttempts(key, maxAttempts)
    )
    await next()
  }

  /**
   * Resolve request signature.
   *
   * @param   {Request}     request
   * @return  {String}
   *
   * @private
   */
  _resolveRequestSignature (request) {
    const crypto = require('crypto')
    let generator = crypto.createHash('sha1')
    generator.update(`${request.method()}|${request.hostname()}|${request.url()}|${request.ip()}`)
    return generator.digest('hex')
  }

  /**
   * Create a 'too many attempts' response.
   *
   * @param   {Response}    response
   * @param   {String}      key
   * @param   {Number}      maxAttempts
   * @return  {Response}
   *
   * @private
   */
  async _buildResponse (response, key, maxAttempts) {
    const retryAfter = await this.RateLimiter.availableIn(key)
    const remainingAttempts = await this._calculateRemainingAttempts(
      key, maxAttempts, retryAfter
    )
    await this._addHeaders(
      response, maxAttempts,
      remainingAttempts,
      retryAfter)
    return response.tooManyRequests('Too Many Attempts.')
  }

  /**
   * Add the limit header information to the given response.
   *
   * @param   {Response}    response
   * @param   {Number}      maxAttempts
   * @param   {Number}      remainingAttempts
   * @param   {Number}      retryAfter      [optional, default = null]
   * @return  {void}
   *
   * @private
   */
  _addHeaders (response, maxAttempts, remainingAttempts, retryAfter = null) {
    response.header('X-RateLimit-Limit', maxAttempts)
    response.header('X-RateLimit-Remaining', remainingAttempts)
    if (retryAfter !== null) {
      response.header('Retry-After', retryAfter)
      response.header('X-RateLimit-Reset', Math.floor(new Date() / 1000) + retryAfter)
    }
  }

  /**
   * Calculate the number of remaining attempts.
   *
   * @param   {String}      key
   * @param   {Number}      maxAttempts
   * @param   {Number}      retryAfter      [optional, default = null]
   * @return  {Number}
   *
   * @private
   */
  _calculateRemainingAttempts (key, maxAttempts, retryAfter = null) {
    if (retryAfter !== null) {
      return 0
    }
    return this.RateLimiter.retriesLeft(key, maxAttempts)
  }
}

module.exports = ThrottleRequests
