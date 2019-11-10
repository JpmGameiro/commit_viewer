const nock = require('nock')

const fs = require('fs')
const assert = require('assert')

const remoteService = require('../service/remoteService')

describe('Remote Service Tests', () => {
    const gitHubAPI = 'https://api.github.com'
    const owner = 'JpmGameiro'
    const repo = 'OTRA'
    const dummyRepo = 'OTR'
    const gitHubURL = `https://github.com/${owner}/${repo}`

    const jsonFile = fs.readFileSync('./test/files/otraJsonResp.json')

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