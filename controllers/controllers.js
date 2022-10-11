const { selectTopics, selectArticleById } = require('../models/models.js')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.send({topics})
    })
}

exports.getArticleById = (req, res) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.send({article})
    })
}

exports.getUsers = (req, res) => {
    
}