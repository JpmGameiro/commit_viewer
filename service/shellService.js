const shell = require('shelljs')

function clone(githubUrl) {
    if(shell.exec(`git clone ${githubUrl}`, {silent:true}).code !== 0) {
        console.log('Something went wrong while cloning...')
        shell.exit(1)
    }
}

function cd(projectName) {
    shell.cd(projectName)
}

function gitLog() {
    return new Promise((resolve, reject) => {
        const properties = '{\\"hash\\":\\"%H\\",\\"author\\":\\"%aN\\",\\"author_email\\":\\"%aE\\",\\"date\\":\\"%ad\\",\\"message\\":\\"%f\\"}'
        const logCommand = 'git log --pretty=' + properties
        shell.exec(logCommand, {silent:true},function(code, stdout, stderr) {
            if(code !== 0) {
                reject('Something went wrong while logging commit history')
            } else {
                resolve(stdout)
            }
        })
    })


}

function rmDir(dir) {
    cd('..')
    if(shell.exec(`rmdir /Q /S ${dir}`).code !== 0) {
        console.log('Something went wrong while deleting directory...')
        shell.exit(1)
    }
}

module.exports = {clone, pull, cd, gitLog, rmDir}