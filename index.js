const main = require('./main')

/**
 * Application entry point
 */
function init() {
    console.log('Welcome to the Commit Viewer App! Here you\'ll be able to see the commit list of any public GitHub repository!\n')
    main.runApp()
}

init()