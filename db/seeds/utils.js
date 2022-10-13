const db = require('../connection.js')

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};
exports.addCountToArticle = (articleArray) => {

  newVal = articleArray.map((article) => {
  return db.query(`SELECT COUNT(*)::INTEGER FROM comments
  WHERE article_id = ${article.article_id};`)
  .then(({rows:count}) => {
      return {...article, ...count[0]}
    })
  })
  
  return Promise.all(newVal)
}