const delegateService = require('./delegateService')

async function validateArgs(args) {

    if(args === 'exit') {
        process.exit()
    } else if(args === '-help') {
        listCommands()
        return
    }

    const [url, updateCache] = args.split(' ')

    if (url !== '') {
        const owner = url.split('/')[3]
        const repo = url.split('/')[4]
        await delegateService.delegateTasks(url, owner, repo, updateCache)
    } else {
        console.log('Invalid GitHub URL!\n')
    }
}

function listCommands() {
    console.log(
        'List of commands available:\n' +
        '[-help] - Lists all the available commands.\n' +
        '[Github URL] - Lists the commits for the GitHub URL provided.\n' +
        '[Github URL] [nocache] - Lists the commits for the GitHub URL provided, ignoring cached values.\n' +
        '[exit] - Ends Application\n'
    )
}

module.exports.validateArgs = validateArgs