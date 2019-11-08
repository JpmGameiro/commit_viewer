const commandService = require('./service/commandService')

function init() {
    console.log('Welcome to the Commit Viewer App! Here you\'ll be able to see the commit list of any public GitHub repository! \n' +
        'Provide us the GitHub URL and we\'ll do the rest for you!\n')

    commandService.validateArgs(process.argv)
}

init()
