const commandService = require('./service/commandService')
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function runApp() {
    rl.question('Provide us a valid GitHub Url or type -help...\n', async (args) => {
        await commandService.validateArgs(args)
        runApp()
    })
}

module.exports.runApp = runApp
