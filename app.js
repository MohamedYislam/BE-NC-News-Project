const express = require('express')
const app = express();
app.use(express.json())
const { getTopics, getArticleById, getUsers, patchArticleById } = require('./controllers/controllers.js')

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers);
app.patch('/api/articles/:article_id', patchArticleById);

module.exports = app;