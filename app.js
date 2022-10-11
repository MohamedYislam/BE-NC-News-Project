const express = require('express')
const app = express();

const { getTopics, getArticleById } = require('./controllers/controllers.js')

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)

module.exports = app;