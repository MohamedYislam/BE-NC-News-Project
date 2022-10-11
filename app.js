const express = require('express')
const app = express();

const { getTopics, getArticleById, getUsers } = require('./controllers/controllers.js')

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/users', getUsers)


module.exports = app;