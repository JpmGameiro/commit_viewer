const nock = require('nock')

const fs = require('fs')
const assert = require('assert')

const remoteService = require('../service/remoteService')
const cacheService = require('../service/cacheService')

describe('Test Class for Commit Viewer App', () => {

    const gitHubAPI = 'https://api.github.com'
    const owner = 'JpmGameiro'
    const repo = 'OTRA'
    const dummyRepo = 'OTR'
    const gitHubURL = `https://github.com/${owner}/${repo}`

    const jsonFile = fs.readFileSync('./test/files/otraJsonResp.json')

    it('Testing remoteService. Should return a JSON object if API returns 200', async () => {
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

    it('Testing remoteService. Should return 404', async () => {
        const res = nock(gitHubAPI)
            .get(`/repos/${owner}/${dummyRepo}/commits`)
            .reply(404)

        try {
            await remoteService.getCommitList(gitHubURL, owner, dummyRepo)
        } catch (error) {
            assert.equal(404, error.response.status)
        }
    })

    it('Testing cacheService get and set functions.', () => {
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

    it('Testing cacheService has function.', () => {
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

    it('Testing cacheService count function.', () => {
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

    it('Testing cacheService clear function.', () => {
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