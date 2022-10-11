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
    return db.query(`
    UPDATE articles
    SET votes = votes + $2  WHERE article_id = $1
    RETURNING *;`, [article_id, inc_votes])
    .then(({rows : updatedArticle}) => {
        return updatedArticle[0];
    })

}