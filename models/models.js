const { ensureNoExpected } = require('jest-matcher-utils')
const db = require('../db/connection.js')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows : article}) => {
        return article[0]
    })
}

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.updateArticleById = (article_id, inc_votes) => {
    
    if (!inc_votes || typeof inc_votes !== "number") {
         return Promise.reject({ status: 400, msg: 'bad request, object sent may be invalid'});
    }
    return db.query(`
    UPDATE articles
    SET votes = votes + $2  WHERE article_id = $1
    RETURNING *;`, [article_id, inc_votes])
    .then(({rows : updatedArticle}) => {
        if(updatedArticle.length == 0) {
            return Promise.reject({ status : 404, msg: 'Article does not exist'})
        } 
        return updatedArticle[0];
    })
}