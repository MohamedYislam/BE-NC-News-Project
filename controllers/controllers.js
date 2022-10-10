const { selectTopics } = require('../models/models.js')

exports.getTopics = (req, res) => {

    selectTopics().then(() => {
        console.log("inside selectTopics")
    })
}