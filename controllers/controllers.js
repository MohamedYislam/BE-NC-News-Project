const { selectTopics, selectArticleById, selectUsers, updateArticleById, selectArticles } = require('../models/models.js')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })    
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body;
    updateArticleById(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    })
}

exports.getArticles = (req, res) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}