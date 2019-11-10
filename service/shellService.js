const shell = require('shelljs')

const cacheService = require('./cacheService')
const mapper = require('../domain/mapper')
const parser = require('../domain/parser')

/**
 * Git clone command equivalent.
 * Clones a valid GitHub repository, given the GitHub URL.
 * @param githubUrl
 */
function clone(githubUrl) {
    if (shell.exec(`git clone ${githubUrl}`, {silent: true}).code !== 0) {
        console.log('Something went wrong while cloning...')
    }
}

/**
 * Shell cd command equivalent
 * It steps into a given directory
 * @param projectName
 */
function cd(projectName) {
    shell.cd(projectName)
}

/**
 * Shell rmdir command equivalent.
 * It removes a given directory.
 * @param dir
 */
function rmDir(dir) {
    cd('..')
    if (shell.exec(`rmdir /Q /S ${dir}`).code !== 0) {
        console.log('Something went wrong while deleting directory...')
    }
}

/**
 * It clones, steps into a given directory and logs the commit list
 * of a given GitHub repository. Also saves the list in cache and prints it.
 * @param url
 * @param repo
 * @returns {Promise<void>}
 */
async function log(url, repo) {
    clone(url)
    cd(repo)
    try {
        const stdout = await gitLog()
        cacheService.saveAndPrintCommitList(url, mapper.bulkMapToCommitFromShell(parser.parseToJson(stdout)))
    } catch (e) {
        console.log(e.code + ': ' + e.message + '\n' + 'Something went wrong while logging commit list...')
    } finally {
        rmDir(`${process.cwd()}`)
    }
}

/**
 * Invokes the git log shell command equivalent, with a defined pretty format
 * @returns {Promise<unknown>}
 */
function gitLog() {

    return new Promise((resolve, reject) => {
        const properties = '{\\"hash\\":\\"%H\\",\\"author\\":\\"%aN\\",\\"author_email\\":\\"%aE\\",\\"date\\":\\"%ad\\",\\"message\\":\\"%f\\"}'
        const logCommand = 'git log --pretty=' + properties
        shell.exec(logCommand, {silent: true}, function (code, stdout, stderr) {
            if (code !== 0) {
                reject({code: code, message: stderr})
            } else {
                resolve(stdout)
            }
        })
    })
}

module.exports.log = log