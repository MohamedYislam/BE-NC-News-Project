const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const request = require('supertest')
const app = require('../app')
const testData = require('../db/data/test-data');

afterAll(() => {
    return db.end()
})
beforeEach(() => {
    return seed(testData)
})

describe('GET /api/topics', () => {
    test('status 200: responds with an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            const { topics } = body
            expect(topics).toBeInstanceOf(Array);
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                );
            });
        });
    });
})

describe('GET /api/articles/:article_id', () => {
    describe('/api/articles/:article_id', () => {
        test('status:200, responds with a single matching article', () => {
            return request(app)
            .get(`/api/articles/1`)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toEqual({
                    'article_id': 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    'body': 'I find this existence challenging',
                    created_at: '2020-07-09T17:11:00.000Z',
                    votes : 100,
                    comment_count: 11
                })
            })
        })
        test('status:200, more tests', () => {
            return request(app)
            .get(`/api/articles/3`)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: '2020-11-03T05:12:00.000Z',
                    votes: 0,
                    comment_count: 2
                })
            })
        })
    })
    describe('ERROR Handling', () => {
        test('status: 400 when user tries to request invalid article id', () => {
            return request(app)
            .get(`/api/articles/seven`)
            .expect(400)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('invalid id, check if numbers are used');
            });
        })
        test('status: 404 when user tries to request an article that does not exist', () => {
            return request(app)
            .get(`/api/articles/77777`)
            .expect(404)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('Article not found');
            });
        })
    })
})

describe('GET /api/users', () => {
    test('status 200: responds with an array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
        const { users } = body
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                );
            });
        });
    });
})

describe('PATCH /api/articles/:article_id', () => {
    describe('testing updates if successfully sent', () => {
        test('status: 200 responds with an increased article vote count', () => {
            const articleUpdates = { inc_votes : 5 };
            return request(app)
            .patch(`/api/articles/1`)
            .send(articleUpdates)
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T17:11:00.000Z',
                    votes: 105
                })
            })
        })
        test('status: 200 responds with a decreased article vote count', () => {
            return request(app)
            .patch(`/api/articles/3`)
            .send({inc_votes : -5})
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: '2020-11-03T05:12:00.000Z',
                    votes: -5
                })
            })
        })
    })
    describe('ERROR Handling', () => {
        test('status: 400 bad request when invalid body is sent', () => {
            return request(app)
            .patch(`/api/articles/1`)
            .send({increase_votes: 7})
            .expect(400)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('bad request, object sent may be invalid');
            });
        });
        test('status: 400 bad request when invalid body is sent', () => {
            return request(app)
            .patch(`/api/articles/1`)
            .send({inc_votes: 'seven'})
            .expect(400)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('bad request, object sent may be invalid');
            });
        });
        test('status: 400 when user tries to patch invalid article id', () => {
            return request(app)
            .patch(`/api/articles/seven`)
            .send({inc_votes: 1})
            .expect(400)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('invalid id, check if numbers are used');
            });
        })
        test('status: 404 when user tries to patch an article that does not exist', () => {
            return request(app)
            .patch(`/api/articles/77777`)
            .send({inc_votes: 1})
            .expect(404)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('Article not found');
            });
        })
    });
})

describe('GET', () => {
    describe('/api/articles', () => {
        test('status 200: responds with an array of topic objects', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: {articles} }) => {
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(12);
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    );
                });
            });
        });
    })
    describe('QUERY SortBy', () => {
        test("Default order is by date descending", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('created_at', { descending: true })
            });
        })
        test("Can be sorteded by article_id , default descending", () => {
            return request(app)
            .get('/api/articles?sortBy=article_id')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('article_id', { descending: true })
            });
        })
        test("Can be sorteded by title, default descending", () => {
            return request(app)
            .get('/api/articles?sortBy=title')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('title', { descending: true })
            });
        })
        test("Can be sorteded by topic, default descending", () => {
            return request(app)
            .get('/api/articles?sortBy=topic')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('topic', { descending: true })
            });
        })
        test("Can be sorteded by author, default descending", () => {
            return request(app)
            .get('/api/articles?sortBy=author')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('author', { descending: true })
            });
        })
        test("Can be sorteded by comment_count, default descending", () => {
            return request(app)
            .get('/api/articles?sortBy=comment_count')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('comment_count', { descending: true })
            });
        })
        test('Can also be sorted according to order criteria ascending ', () => {
            return request(app)
            .get('/api/articles?sortBy=article_id&&order=asc')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('article_id')
            });
        })
        test("Can be sorteded by votes , default descending", () => {
            return request(app)
            .get('/api/articles?sortBy=votes')
            .expect(200)
                .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('votes', { descending: true })
            });
        })
        test("Query filter by topic 'mitch' ", () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(11)
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: 'mitch',
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    );
                });
            })
        })
        test("Query filter by topic 'cats' ", () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeInstanceOf(Array);
                articles.forEach((article) => {
                    expect(articles).toHaveLength(1)
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: 'cats',
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    );
                });
            })
        })
        test("Query filter by topic, returns empty array for topic that exists with no article", () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(0)
            })
        })
    })
    describe('ERROR Handling', () => {
        test('Invalid topic filter', () => {
            return request(app)
            .get('/api/articles?topic=RANDOM')
            .expect(404)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('topic not found');
            });
        })
        test("can not be sorted by  items which are not columns in the table", () => {
            return request(app)
            .get('/api/articles?sortBy=username')
            .expect(400)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe("can not sort by this critera");
            });  
        })
        test("can not be sorted by  items which are not columns in the table", () => {
            return request(app)
            .get('/api/articles?sortBy=article_id&&order=DELETE')
            .expect(400)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe("order must be either asc or desc");
            });  
        })
    })
})

describe('GET', () => {
    describe('/api/articles/:article_id/comments', () => {
        test('status: 200 responds with an array of al the comments of the article_id', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({ body: comments }) => {
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toEqual([
                    {
                        comment_id: 10,
                        body: 'git push origin master',
                        article_id: 3,
                        author: 'icellusedkars',
                        votes: 0,
                        created_at: '2020-06-20T04:24:00.000Z'
                    },
                    {
                        comment_id: 11,
                        body: 'Ambidextrous marsupial',
                        article_id: 3,
                        author: 'icellusedkars',
                        votes: 0,
                        created_at: '2020-09-19T20:10:00.000Z'
                    }
                ])
            })
        })
        test('status: 200, more Tests', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: comments }) => {
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(11)
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            article_id: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String)
                        })
                    )
                })
            })
        })
        test('status: 200 when the article has no comments returns empty array', () => {
            return request(app)
            .get('/api/articles/4/comments')            
            .expect(200)
            .then(({ body: comments }) => {
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(0)
            });
        })
    })
    describe('ERROR Handling', () => {
        test('status: 400 when user tries to find comments of an invalid article id', () => {
            return request(app)
            .get('/api/articles/One/comments')            
            .expect(400)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('invalid id, check if numbers are used');
            });
        })
        test('status: 404 when user tries to request an article that does not exist', () => {
            return request(app)
            .get('/api/articles/77777/comments')            
            .expect(404)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('Article not found');
            });
        })
    })
})

describe('POST', () => {
    describe('/api/articles/:article_id/comments', () => {
        test('status: 201, responds with the posted comment', () => {
            const newComment =   {
                username: "icellusedkars",
                body: "From God we came and to Him we return",
            }
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then(({body : responseComment}) => {
                expect(responseComment).toEqual(
                    expect.objectContaining({
                        comment_id: 19,
                        body: 'From God we came and to Him we return',
                        article_id: 1,
                        author: "icellusedkars",
                        votes: 0,
                        created_at: expect.any(String),
                    })  
                )
            })
        })
        describe('ERROR handling', () => {
            test('status 400 when user tries to post a comment to an invalid article_id', () =>{
                const newComment =   {
                    username: "icellusedkars",
                    body: "There are more stars in the heaven thann grains of sand on the planet",
                }
                return request(app)
                .post('/api/articles/One/comments')
                .send(newComment)
                .expect(400)
                .then(({ body: {msg} }) => {
                    expect(msg).toBe('invalid id, check if numbers are used');
                });           
            })
            test('status 400, invalid object', () => {
                const newComment =   {
                    invalidKey: "icellusedkars",
                    body: "The moon is 4.5 billion years old",
                }
                return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(400)
                .then(({ body: {msg} }) => {
                    expect(msg).toBe('Invalid object, check object key');
                });        
            });        
            test('status 404 when user tries to post a comment to an article which does not exist', () =>{
                const newComment =   {
                    username: "icellusedkars",
                    body: "The sun is 330000 heavier than the earth",
                }
                return request(app)
                .post('/api/articles/7777/comments')
                .send(newComment)
                .expect(404)
                .then(({ body: {msg} }) => {
                    expect(msg).toBe('Article not found');
                });           
            })
            test('status 404 invalid username', () => {
                const newComment =   {
                    username: "usernameNotinDatabase",
                    body: "The moon is 4.5 billion years old",
                }
                return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(404)
                .then(({ body: {msg} }) => {
                    expect(msg).toBe('invalid object sent, username may not exist');
                });        
            })
        })
    })
})


describe('DELETE', () => {
    describe('/api/comments/:comment_id', () => {
        test('responds with a 204 status and an empty body', () => {
            return request(app)
            .delete('/api/comments/3')
            .expect(204)
            .then(({body }) => {
                expect(body).toEqual({})
            })
        })
        test('responds with a 400 error when given invalid comment_id', () => {
            return request(app)
            .delete('/api/comments/three')
            .expect(400)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('invalid id, check if numbers are used');
            });        
        })
        test('responds with a 404 error when given invalid comment_id', () => {
            return request(app)
            .delete('/api/comments/7777')
            .expect(404)
            .then(({ body: {msg} }) => {
                expect(msg).toBe('comment not found');
            });        
        })
    })
})