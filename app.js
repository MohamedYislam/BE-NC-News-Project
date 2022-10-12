const express = require('express')
const app = express();
app.use(express.json())
const { getTopics, getArticleById, getUsers, patchArticleById } = require('./controllers/controllers.js')

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers);
app.patch('/api/articles/:article_id', patchArticleById);

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
    if (err.status === 404){
        res.status(404).send({msg: err.msg})
    } else {
        next(err)
    }
})


module.exports = app;