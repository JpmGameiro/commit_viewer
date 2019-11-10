const shellService = require('./shellService')
const cacheService = require('./cacheService')
const remoteService = require('./remoteService')

const main = require('../main')
const parser = require('../domain/parser')
const mapper = require('../domain/mapper')

async function validateArgs(args) {
    const [url, updateCache] = args.split(' ')
    await delegateTasks(url, updateCache)
}

async function delegateTasks(url, updateCache) {

    const owner = url.split('/')[3]
    const projectName = url.split('/')[4]

    if (!cacheService.hasCommitList(url) || (cacheService.hasCommitList(url) && updateCache === 'true')) {
        try {
            const commits = await remoteService.getCommitList(owner, projectName)
            commits.forEach(elem => console.log(elem))
            cacheService.saveCommitList(githubUrl, commits)

        } catch (e) {
            console.log('Error API')
            shellService.clone(githubUrl)
            shellService.cd(projectName)
            const stdout = await shellService.gitLog()
            cacheService.saveCommitList(githubUrl, parser.parseToJson(stdout))
            shellService.rmDir(`${process.cwd()}`)
            //todo passar troço para shellservice e print
        }
    } else {
        cacheService.getCommitList(githubUrl).forEach(elem => console.log(elem))
    }
}

module.exports.validateArgs = validateArgs