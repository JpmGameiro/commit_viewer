const shell = require('shelljs')

const cacheService = require('./cacheService')
const mapper = require('../domain/mapper')
const parser = require('../domain/parser')

/**
 * Executes shell's exec function with provided command
 * @param command
 * @returns {code, stdout, stderr}
 */
function callShellExec(command) {
    return shell.exec(command, {silent: true})
}

/**
 * Git clone command equivalent.
 * Clones a valid GitHub repository, given the GitHub URL.
 * @param githubUrl
 */
function clone(githubUrl) {
    const cloned = callShellExec(`git clone ${githubUrl}`)
    if (cloned.code !== 0) {
        throw {code: cloned.code, message: cloned.stderr}
    }
}

/**
 * Shell cd command equivalent
 * It steps into a given directory
 * @param projectName
 */
function cd(projectName) {
    const cd = shell.cd(projectName)
    if (cd.code !== 0) {
        throw {code: cd.code, message: cd.stderr}
    }
}

/**
 * Shell rmdir command equivalent.
 * It removes a given directory.
 * @param dir
 */
function rmDir(dir) {
    cd('..')
    const rm = callShellExec(`rmdir /Q /S ${dir}`)
    if (rm.code !== 0) {
        throw {code: rm.code, message: rm.stderr}
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
    try {
        clone(url)
        cd(repo)
        const stdout = await gitLog()
        rmDir(`${process.cwd()}`)
        cacheService.saveAndPrintCommitList(url, mapper.bulkMapToCommitFromShell(parser.parseToJson(stdout)))
    } catch (e) {
        console.log(e.code + ': ' + e.message + '\n')
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
        const res = callShellExec(logCommand)
        if (res.code !== 0) {
            reject({code: res.code, message: res.stderr})
        } else {
            resolve(res.stdout)
        }
    })
}

module.exports = {log}