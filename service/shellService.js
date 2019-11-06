const shell = require('shelljs')
const cacheService = require('./cacheService')

function invokeShell(githubUrl, projectName, updateCommitHistory) {

    if(shell.exec(`git clone ${githubUrl}`).code !== 0) {
        console.log('Something went wrong while cloning...')
        shell.exit(1)
    }

    shell.cd(projectName)

    shell.exec('git log', function(code, stdout, stderr) {
        if(code !== 0) {
            console.log('Something went wrong while logging commit history')
            shell.exit(1)
        } else {
            cacheService.set(githubUrl, stdout)
        }

    })

}

module.exports = invokeShell