const { selectTopics } = require('../models/models.js')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.send(topics)
    })
}