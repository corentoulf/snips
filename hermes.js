const { withHermes } = require('hermes-javascript');
withHermes(hermes => {
    const dialog = hermes.dialog();
    dialog.flow('corentoulf:play-flow', (msg,flow) => {
        console.log(msg)
        flow.end()
        return 'C\'est parti, on met les Watt'
    })
})