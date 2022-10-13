const db = require('../db/connection.js')
const { addCountToArticle } = require('../db/seeds/utils.js')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {  
    const promiseOne = db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    const promiseTwo = db.query(`SELECT COUNT(*)::INTEGER FROM comments
    WHERE article_id = $1;`, [article_id])
    
    return Promise.all([promiseOne, promiseTwo])
    .then(([{rows: article}, {rows: count}]) => {
        if(article.length === 0) {
            return Promise.reject({ status : 404, msg: 'Article does not exist'}) 
        }
        return {...article[0], ...count[0]}
    })
}


exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.updateArticleById = (article_id, inc_votes) => {
    if (typeof inc_votes !== "number") {
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
// what im thinking
exports.selectArticles = (articleQuery) => {
    validTopic = ['mitch', 'cats']

    if (articleQuery.topic){
        WHERE = ` WHERE topic = '${articleQuery.topic}'`
    } else {
        WHERE = ``
    }

    if(!validTopic.includes(articleQuery.topic) && articleQuery.topic !=undefined){
        return Promise.reject({ status: 404, msg: "topic not found" })
    }

    let defaultQuery = `SELECT * FROM articles  ${WHERE} ORDER BY created_at DESC;`

    return db.query(defaultQuery)
    .then(({ rows: articleArray }) => {
        return addCountToArticle(articleArray)
    })
}