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
    const properties = '{\\"hash\\":\\"%H\\",\\"author\\":\\"%aN\\",\\"author_email\\":\\"<%aE>\\",\\"date\\":\\"%ad\\",\\"message\\":\\"%f\\"}'
    const logCommand = 'git log --pretty=' + properties
    shell.exec(logCommand, function(code, stdout, stderr) {
        if(code !== 0) {
            console.log('Something went wrong while logging commit history')
            shell.exit(1)
        } else {
            cb(stdout)
        }
    })
}

function rmDir(dir) {
    let x = dir
    cd('..')
    if(shell.exec(`rmdir /Q /S ${dir}`).code !== 0) {
        console.log('Something went wrong while deleting directory...')
        shell.exit(1)
    }
}

module.exports = {clone, pull, cd, gitLog, rmDir}