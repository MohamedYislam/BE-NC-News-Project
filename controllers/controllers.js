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

exports.getArticles = (req, res, next) => {
    selectArticles(req.query).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleIdComments = (req, res, next) => {
    const { article_id } = req.params

    selectArticleIdComments(article_id).then((comments) => {
        res.status(200).send(comments)
    })
    .catch((err) => {
        next(err)
    })
}

exports.postArticleIdComment = (req, res, next) => {
    // const { body : comment } = req.body
    // const { username : author } = req.body
    const postComment =req.body
    console.log(req.body, "<--req.body")
    // console.log(comment, "<<body")
    // console.log(author, "<---author")
    // console.log("inside controllers of postCommentByArticleId")
    // console.log(req.body, "<--req.body")
    insertArticleIdComment(req.params, req.body)

}