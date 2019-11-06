const shell = require('shelljs')

function clone(githubUrl) {
    if(shell.exec(`git clone ${githubUrl}`).code !== 0) {
        console.log('Something went wrong while cloning...')
        shell.exit(1)
    }
}

function pull() {
    if(shell.exec('git pull').code !== 0) {
        console.log('Something went wrong while attempting to pull...')
        shell.exit(1)
    }
}

function cd(projectName) {
    shell.cd(projectName)
}

function gitLog(cb) {
    shell.exec('git log', function(code, stdout, stderr) {
        if(code !== 0) {
            console.log('Something went wrong while logging commit history')
            shell.exit(1)
        } else {
            cb(stdout)
        }
    })
}

module.exports = {clone, pull, cd, gitLog}