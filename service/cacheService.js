const Cache = require('../cache/cache')
const cache = new Cache()

function getCommitList(githubUrl) {
    return cache.get(githubUrl)
}

function saveCommitList(key, value) {
    cache.set(key, value)
}

function hasCommitList(key) {
    return cache.has(key)
}

module.exports = {getCommitList, saveCommitList, hasCommitList}