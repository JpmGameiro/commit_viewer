const shell = require('shelljs')
const cacheService = require('./cacheService')

function clone(githubUrl) {
    if (shell.exec(`git clone ${githubUrl}`, {silent: true}).code !== 0) {
        console.log('Something went wrong while cloning...')
    }
}

function cd(projectName) {
    shell.cd(projectName)
}

function rmDir(dir) {
    cd('..')
    if (shell.exec(`rmdir /Q /S ${dir}`).code !== 0) {
        console.log('Something went wrong while deleting directory...')
    }
}

async function log(url, repo) {
    clone(url)
    cd(repo)
    try {
        const stdout = await gitLog()
        cacheService.saveAndPrintCommitList(url, mapper.bulkMapToCommitFromShell(parser.parseToJson(stdout)))
    } catch (e) {
        console.log(e.code + ': ' + e.message + '\n' + 'Somenthig went wrong while logging commit list...')
    }
}

function gitLog() {

    return new Promise((resolve, reject) => {
        const properties = '{\\"hash\\":\\"%H\\",\\"author\\":\\"%aN\\",\\"author_email\\":\\"%aE\\",\\"date\\":\\"%ad\\",\\"message\\":\\"%f\\"}'
        const logCommand = 'git log --pretty=' + properties
        shell.exec(logCommand, {silent: true}, function (code, stdout, stderr) {
            if (code !== 0) {
                reject({code: code, message: stderr})
            } else {
                rmDir(`${process.cwd()}`)
                resolve(stdout)
            }
        })
    })
}

module.exports.log = log