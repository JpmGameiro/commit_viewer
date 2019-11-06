const shell = require('shelljs')

function clone(githubUrl) {
    if(shell.exec(`git clone ${githubUrl}`).code !== 0) {
        console.log('Something went wrong while cloning...')
        shell.exit(1)
    }
}

function cd(projectName) {
    shell.cd(projectName)
}

function gitLog() {
    shell.exec('git log', function(code, stdout, stderr) {
        if(code !== 0) {
            console.log('Something went wrong while logging commit history')
            shell.exit(1)
        } else {
            //cacheService.set(githubUrl, stdout)
        }
    })
}

module.exports.invokeShell = invokeShell