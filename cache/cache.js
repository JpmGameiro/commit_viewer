class Cache {

    cache = new Map()

    get(key) {
        return this.cache.get(key)
    }

    set(key, value) {
        this.cache.set(key, value)
    }

    has(key) {
        return !(this.cache.size === 0 || !this.cache.has(key))
    }

    count () {
        return this.cache.size
    }

}

module.exports = Cache