const Cache = require('../cache/cache')
const cache = new Cache()

/**
 * Gets a list of commits from the cache
 * @param githubUrl
 * @returns {Commit[]}
 */
function getCommitList(githubUrl) {
    return cache.get(githubUrl)
}

/**
 * Sets a list of commits in cache,
 * associated with to a key which is the GitHub URL
 * @param key
 * @param value
 */
function saveCommitList(key, value) {
    cache.set(key, value)
}

/**
 * Checks if there's a value for the provided key
 * @param key
 * @returns {boolean}
 */
function hasCommitList(key) {
    return cache.has(key)
}

/**
 * Sets the commit list in cache and prints it
 * @param key
 * @param value
 */
function saveAndPrintCommitList(key, value) {
    value.forEach((elem) => console.log(elem))
    saveCommitList(key, value)
}

/**
 * Gets and prints the commit list for provided key
 * @param key
 * @returns {Commit[]}
 */
function getAndPrintCommitList(key) {
    const commits = getCommitList(key)
    commits.forEach(elem => console.log(elem))
    return commits
}

/**
 * Evaluates the cache size
 * @returns {Integer}
 */
function cacheSize() {
    return cache.count()
}

/**
 * Cleans the cache
 */
function clearCache() {
    cache.clear()
}

module.exports = {
    getCommitList,
    getAndPrintCommitList,
    saveCommitList,
    saveAndPrintCommitList,
    hasCommitList,
    cacheSize,
    clearCache
}