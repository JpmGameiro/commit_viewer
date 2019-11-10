const delegateService = require('./delegateService')

/**
 * Validates whether the args are well formed or not
 * @param args
 * @returns {Promise<void>}
 */
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

/**
 * Lists the commands available
 */
function listCommands() {
    console.log(
        'List of commands available:\n' +
        '[-help] - Lists all the available commands.\n' +
        '[Github URL] - Lists the commits for the provided GitHub URL.\n' +
        '[Github URL] [nocache] - Lists the commits for the provided GitHub URL, ignoring cached values.\n' +
        '[exit] - Ends Application\n'
    )
}

module.exports.validateArgs = validateArgs