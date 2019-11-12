const nock = require('nock')
const sinon = require('sinon')
const shell = require('shelljs')
const fs = require('fs')
const assert = require('assert')

const remoteService = require('../service/remoteService')
const cacheService = require('../service/cacheService')
const shellService = require('../service/shellService')

const gitHubAPI = 'https://api.github.com'
const owner = 'JpmGameiro'
const repo = 'OTRA'
const dummyRepo = 'OTR'
const gitHubURL = `https://github.com/${owner}/${repo}`
const gitHubDummyURL = `https://github.com/${owner}/${dummyRepo}`
const jsonFile = fs.readFileSync('./test/files/otraJsonResp.json')

describe('Remote Service Tests', () => {

    it('Should return a JSON object if API returns 200', async () => {
        const res = nock(gitHubAPI)
            .get(`/repos/${owner}/${repo}/commits`)
            .reply(200, JSON.parse(jsonFile))

        try {
            const result = await remoteService.retrieveCommitListFromAPI(owner, repo)
            assert.deepEqual(res.interceptors[0].body, JSON.stringify(result.data))
        } catch (error) {
            console.error(error)
        }
    })

    it('Should return 404', async () => {
        const res = nock(gitHubAPI)
            .get(`/repos/${owner}/${dummyRepo}/commits`)
            .reply(404)

        try {
            await remoteService.getCommitList(gitHubURL, owner, dummyRepo)
        } catch (error) {
            assert.equal(404, error.response.status)
        }
    })

})

describe('Cache Service Tests', () => {

    it('Testing Get and Set functions.', () => {
        try {
            cacheService.saveCommitList('githubURL', 'commitX')
            const cached = cacheService.getCommitList('githubURL')
            assert.deepEqual('commitX', cached)
        } catch (error) {
            console.error(error)
        } finally {
            cacheService.clearCache()
        }
    })

    it('Testing has function.', () => {
        try {
            cacheService.saveCommitList('githubURL', 'commitY')
            const hasCommit = cacheService.hasCommitList('githubURL')
            assert.deepEqual(true, hasCommit)
        } catch (error) {
            console.error(error)
        } finally {
            cacheService.clearCache()
        }
    })

    it('Testing count function.', () => {
        try {
            cacheService.saveCommitList('githubURL1', 'commitX')
            cacheService.saveCommitList('githubURL2', 'commitY')
            const cacheSize = cacheService.cacheSize()
            assert.equal(2, cacheSize)
        } catch (error) {
            console.error(error)
        } finally {
            cacheService.clearCache()
        }
    })

    it('Testing clear function.', () => {
        try {
            cacheService.saveCommitList('githubURL1', 'commitX')
            cacheService.saveCommitList('githubURL2', 'commitY')
            let cacheSize = cacheService.cacheSize()
            assert.deepEqual(2, cacheSize)
            cacheService.clearCache()
            cacheSize = cacheService.cacheSize()
            assert.deepEqual(0, cacheSize)
        } catch (error) {
            console.error(error)
        } finally {
            cacheService.clearCache()
        }
    })
})

describe('Shell Service Tests', () => {

    it('Testing clone function working well.', () => {
        sinon.stub(shell, 'exec').callsFake( () => { return { code: 0 } })

        try {
            const cloned = shellService.clone(gitHubURL)
            assert.deepEqual(0, cloned.code)
        } catch (error) {
            console.error(error)
        } finally {
            shell.exec.restore()
        }
    })

    it('Testing clone function not working.', () => {
        sinon.stub(shell, 'exec').callsFake( () => { return { code: 128, stderr: 'Error'} })

        try {
            shellService.clone(gitHubDummyURL)
        } catch (error) {
            assert.deepEqual(128, error.code)
            assert.equal('Error', error.message)
        } finally {
            shell.exec.restore()
        }
    })

    it('Testing cd function working well.', () => {
        sinon.stub(shell, 'cd').callsFake( () => { return { code: 0 } })

        try {
            const cd = shellService.cd('..')
            assert.deepEqual(0, cd.code)
        } catch (error) {
            console.log(error)
        } finally {
            shell.cd.restore()
        }
    })

    it('Testing cd function not working.', () => {
        sinon.stub(shell, 'cd').callsFake( () => { return { code: 10, stderr: 'Error' } })

        try {
            const cd = shellService.cd('notAdirectory')
        } catch (error) {
            assert.deepEqual(10, error.code)
            assert.equal('Error', error.message)
        } finally {
            shell.cd.restore()
        }
    })

    it('Testing rmDir function working well.', () => {
        sinon.stub(shell, 'exec').callsFake( () => { return { code: 0 } })

        try {
            const rm = shellService.rmDir('dir')
            assert.deepEqual(0, rm.code)
        } catch (error) {
            console.log(error)
        } finally {
            shell.exec.restore()
        }
    })

    it('Testing rmDir function not working.', () => {
        sinon.stub(shell, 'exec').callsFake( () => { return { code: 150, stderr: 'Error' } })

        try {
            shellService.rmDir('badDir')
        } catch (error) {
            assert.deepEqual(150, error.code)
            assert.equal('Error', error.message)
        } finally {
            shell.exec.restore()
        }
    })
})