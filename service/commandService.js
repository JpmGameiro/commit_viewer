const shellService = require('./shellService')
const cacheService = require('./cacheService')
const remoteService = require('./remoteService')

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
            let commits = (await remoteService.getCommitList(owner, projectName)).data
            let a = commits.map(elem => mapper.mapToCommit(
                    elem.sha,
                    elem.commit.author.name,
                    elem.commit.author.email,
                    elem.commit.author.date,
                    elem.commit.message
                ))
            a.forEach(elem => console.log(elem))
            cacheService.saveCommitList(url, a)
        } catch (e) {
            console.log('Error API')
            shellService.clone(url)
            shellService.cd(projectName)
            const stdout = await shellService.gitLog()
            cacheService.saveCommitList(url, parser.parseToJson(stdout))
            shellService.rmDir(`${process.cwd()}`)
            //todo passar troço para shellservice e print
        }
    } else {
        cacheService.getCommitList(url).forEach(elem => console.log(elem))
    }
}

module.exports.validateArgs = validateArgs