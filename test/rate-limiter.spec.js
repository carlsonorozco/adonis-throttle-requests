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
const { ioc } = require('@adonisjs/fold')
const { Config } = require('@adonisjs/sink')
const CacheManager = require('../node_modules/adonis-cache/src/Stores/CacheManager')
const Repository = require('../node_modules/adonis-cache/src/Stores/Repository')
const RateLimiter = require('../src/RateLimiter')

test.group('Throttle Requests | RateLimiter', group => {
  group.beforeEach(async () => {
    ioc.singleton('Adonis/Src/Config', () => {
      const config = new Config()
      config.set('cache.default', 'object')
      config.set('cache.stores.object.driver', 'object')
      return config
    })
    ioc.singleton('Adonis/Addons/Cache', app => {
      CacheManager.prototype.repository = store => {
        return new Repository(store)
      }
      return new CacheManager(app)
    })
    ioc.alias('Adonis/Addons/Cache', 'Cache')
  })

  test('should return true when already locked out', async (assert) => {
    const Cache = ioc.use('Cache')
    await Cache.put('key', 1, 1)
    assert.strictEqual(await Cache.get('key', 0), 1)
    assert.isFalse(await Cache.has('key:timer'))
    assert.isTrue(await Cache.add('key:timer', 1, 1))
    const rateLimiter = new RateLimiter(Cache)
    assert.isTrue(await rateLimiter.tooManyAttempts('key', 1))
  })

  test('should hit properly increments attempt count', async (assert) => {
    const Cache = ioc.use('Cache')
    assert.isTrue(await Cache.add('key:timer', 1, 1))
    assert.isTrue(await Cache.add('key', 0, 1))
    assert.strictEqual(await Cache.increment('key'), 1)
    const rateLimiter = new RateLimiter(Cache)
    assert.strictEqual(await rateLimiter.hit('key', 1), 2)
  })

  test('should hit has no memory leak', async (assert) => {
    const Cache = ioc.use('Cache')
    assert.isTrue(await Cache.add('key:timer', 1, 1))
    assert.isTrue(await Cache.add('key', 0, 1))
    assert.strictEqual(await Cache.increment('key'), 1)
    await Cache.put('key', 1, 1)
    const rateLimiter = new RateLimiter(Cache)
    assert.strictEqual(await rateLimiter.hit('key', 1), 2)
  })

  test('should return correct count of retries left', async (assert) => {
    const Cache = ioc.use('Cache')
    await Cache.put('key', 3, 1)
    const rateLimiter = new RateLimiter(Cache)
    assert.strictEqual(await rateLimiter.retriesLeft('key', 5), 2)
  })

  test('should clear the cache keys', async (assert) => {
    const Cache = ioc.use('Cache')
    await Cache.forget('key')
    await Cache.forget('key:timer')
    const rateLimiter = new RateLimiter(Cache)
    await rateLimiter.clear('key')
  })
})
