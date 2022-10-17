const db = require('../db/connection.js')
const { addCountToArticle } = require('../db/seeds/utils.js')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows: topics }) => {
        return topics
    })
}

exports.selectArticleById = (article_id) => {  
    return db.query(`
        SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id])
    .then(({rows : article}) => {
        if(article.length === 0){
            return Promise.reject({ status : 404, msg: 'Article not found'}) 
        }
        return article[0];
    })
}


exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then(({ rows : users }) => {
        return users
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
            return Promise.reject({ status : 404, msg: 'Article not found'})
        } 
        return updatedArticle[0];
    })
}


exports.selectArticles = (articleQuery) => {
    validTopic = ['mitch', 'cats', 'paper']
    validSortBy = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count']
    validOrder = ['asc', 'desc']

    if(articleQuery.sortBy) {
        sortBy = ` ORDER BY ${articleQuery.sortBy}`
    } else {
        sortBy = `ORDER BY created_at`;
    }
    if (articleQuery.topic){
        WHERE = ` WHERE topic = '${articleQuery.topic}'`
    } else {
        WHERE = ``
    }
    if (articleQuery.order){
        order = `${articleQuery.order}`
    } else {
        order = `DESC`
    }

    if(!validTopic.includes(articleQuery.topic) && articleQuery.topic !=undefined){
        return Promise.reject({ status: 404, msg: "topic not found" })
    }
    if(!validSortBy.includes(articleQuery.sortBy) && articleQuery.sortBy !=undefined){
        return Promise.reject({ status: 400, msg: "can not sort by this critera" })
    }
    if(!validOrder.includes(articleQuery.order) && articleQuery.order !=undefined){
        return Promise.reject({ status: 400, msg: "order must be either asc or desc" })
    }

    return db.query(`
        SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count    
        FROM articles LEFT JOIN comments
        ON articles.article_id = comments.article_id
        ${WHERE}    GROUP BY articles.article_id    ${sortBy}    ${order};`)
    .then(({rows : articles}) => {
        return articles;
    })
}

exports.selectArticleIdComments = (article_id) => {
    const promiseComments = db.query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    const promiseArticles = db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])

    return Promise.all([promiseComments, promiseArticles])
    .then(([{rows: comments}, {rows: articles}]) => {
        if(articles.length === 0){
            return Promise.reject({ status : 404, msg: 'Article not found'})
        }
        return comments
    })
}

exports.insertArticleIdComment = (comment, article_id, username) => {

    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows : article}) => {
    
        if(article.length === 0) {    
            return Promise.reject({ status : 404, msg: 'Article not found'})
        }

        return db.query(`INSERT INTO comments (body, article_id, author, votes) VALUES ($1, $2, $3, 0) RETURNING *;`,
        [comment, article_id, username])
        .then(({rows : comment}) => {
            return comment[0]
        })
    })
}
