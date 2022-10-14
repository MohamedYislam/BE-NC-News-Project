const { selectTopics, selectArticleById, selectUsers, updateArticleById, selectArticles, selectArticleIdComments, insertArticleIdComment } = require('../models/models.js')

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
    .catch((err) =>  next(err))

}

exports.getUsers = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) =>  next(err))
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body;
    updateArticleById(article_id, inc_votes).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) =>  next(err))
}

exports.getArticles = (req, res, next) => {
    selectArticles(req.query).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) =>  next(err))
}

exports.getArticleIdComments = (req, res, next) => {
    const { article_id } = req.params

    selectArticleIdComments(article_id).then((comments) => {
        res.status(200).send(comments)
    })
    .catch((err) =>  next(err))
}

exports.postArticleIdComment = (req, res, next) => {
    const { body: comment } = req.body 
    const { article_id } = req.params;
    const { username } = req.body

    insertArticleIdComment(comment, article_id, username).then((comment) => {
        res.status(201).send(comment);
    })
    .catch((err) =>  {
        next(err)
    })
}