const express = require('express')
const app = express();
app.use(express.json())
const { getTopics, getArticleById, getUsers, patchArticleById, getArticles, getArticleIdComments, postArticleIdComment } = require('./controllers/controllers.js')

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers);
app.patch('/api/articles/:article_id', patchArticleById);
app.get('/api/articles/', getArticles)
app.get('/api/articles/:article_id/comments', getArticleIdComments)
app.post('/api/articles/:article_id/comments', postArticleIdComment )

app.use((err, req, res , next) => {
    if(err.status === 400) {
        res.status(400).send({msg: err.msg})
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid article id'})
    }
    if (err.code === '23502') {
        res.status(400).send({msg: 'Invalid object, check object key'})
    }
    if (err.code === '23503') {
        res.status(404).send({msg: 'invalid object sent, username may not exist'})
    }
    if (err.status === 404){
        res.status(404).send({msg: err.msg})
    } else {
        next(err)
    }
})


module.exports = app;