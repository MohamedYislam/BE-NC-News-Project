const { selectTopics, selectArticleById } = require('../models/models.js')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticleById = (req, res) => {
    console.log(req.params, "<req.params")
    const { article_id } = req.params
    selectArticleById(article_id)
    res.send({msg: 'test'})
}
