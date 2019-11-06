const commandService = require('./service/commandService')

function init() {

    const args = process.argv

    if(args.lenght < 3) {
        console.error('You need to provide the Github URL!');
    } else {
        commandService.verifyCommands(args)
    }
    
}

init()
