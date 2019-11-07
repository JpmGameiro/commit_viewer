const shellService = require('./shellService')
const cacheService = require('./cacheService')
const mapper = require('../domain/mapper')
const parser = require('../domain/parser')

function verifyCommands(args) {
    const githubUrl = args[2]
    const projectName = args[2].split('/')[4]

    if (!cacheService.has(githubUrl)) {
        shellService.clone(githubUrl)
        shellService.cd(projectName)
        shellService.gitLog((stdout) => {
            cacheService.set(githubUrl, mapper.MapToCommit(parser.parseToJson(stdout)))
        } )
    } else {
        if((args.lenght > 3 && args[3] === 'true')) {
            shellService.cd(projectName)
            shellService.pull()
            shellService.gitLog((stdout) => {
                cacheService.set(githubUrl, mapper(JSON.parse(stdout)))
            } )
        } else {
            cacheService.get(githubUrl)
        }
    }

}

module.exports.verifyCommands = verifyCommands