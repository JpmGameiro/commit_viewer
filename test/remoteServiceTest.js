const nock = require('nock')
const fs = require('fs')
const assert = require('assert')

const remoteService = require('../service/remoteService')

describe('Remote Service Tests', () => {
    const owner = 'JpmGameiro'
    const repo = 'OTRA'
    const jsonFile = fs.readFileSync('./test/files/otraJsonResp.json')
    it('Should return a model if API returns 200', async () => {
        const res = nock('https://api.github.com')
            .get(`/repos/${owner}/${repo}/commits`)
            .reply(200, JSON.parse(jsonFile))
        
        try {
            const result = await remoteService.getCommitList(owner, repo)
            assert.deepEqual(res.interceptors[0].body, JSON.stringify(result.data))
        } catch (error) {
            console.error(error)
        }
    })
})