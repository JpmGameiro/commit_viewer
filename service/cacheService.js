const Cache = require('../cache/cache')
const cache = new Cache()

function get(key) {
    return cache.get(key)
}

function set(key, value) {
    return cache.set(key, value)
}

function has(key) {
    return cache.has(key)
}

function count() {
    return cache.size
}

module.exports = {
    get,
    set,
    has,
    count
}