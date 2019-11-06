const shellService = require('./shellService')
const cacheService = require('./cacheService')

function verifyCommands(args) {
    const githubUrl = args[2]
    const projectName = args[2].split('/')[4]

    if((args.lenght > 3 && args[3] === 'true') || !cacheService.has(githubUrl)) {
        //shellService.invokeShell(githubUrl, projectName)
    } else {
        cacheService.get(githubUrl)
    }
}

module.exports.verifyCommands = verifyCommands