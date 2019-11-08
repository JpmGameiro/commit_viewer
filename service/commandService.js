const shellService = require('./shellService')
const cacheService = require('./cacheService')
const mapper = require('../domain/mapper')
const parser = require('../domain/parser')

function validateArgs(args) {

    if (args.length < 3) {
        console.error('Try again, Github URL was not given!!!');
    } else {
        delegateTasks(args)
    }
}

function delegateTasks(args) {

    const githubUrl = args[2]
    const projectName = githubUrl.split('/')[4]
    const updateCommitHistory = args[3]

    if (!cacheService.hasCommitList(githubUrl)) {
        shellService.clone(githubUrl)
        shellService.cd(projectName)
        shellService.gitLog((stdout) => {
            cacheService.saveCommitList(githubUrl, parser.parseToJson(stdout))
        })
        shellService.rmDir(`${process.cwd()}\\${projectName}`)
    } else if (cacheService.hasCommitList(githubUrl) && (updateCommitHistory === undefined || updateCommitHistory === 'false')) {
        console.log(cacheService.getCommitList(githubUrl))
    } else {
        shellService.cd(projectName)
        shellService.pull()
        shellService.gitLog((stdout) => {
            cacheService.saveCommitList(githubUrl, parser.parseToJson(stdout))
        })
    }
}

module.exports.validateArgs = validateArgs