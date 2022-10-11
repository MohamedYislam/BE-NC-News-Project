const { selectTopics, selectArticleById, selectUsers } = require('../models/models.js')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticleById = (req, res) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
}

exports.getUsers = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })    
}