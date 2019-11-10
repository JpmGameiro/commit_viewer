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

function saveAndPrintCommitList(key, value) {
    value.forEach((elem) => console.log(elem))
    saveCommitList(key, value)
}

function getAndPrintCommitList(key) {
    const commits = getCommitList(key)
    commits.forEach(elem => console.log(elem))
    return commits
}

module.exports = {getAndPrintCommitList, saveAndPrintCommitList, hasCommitList}