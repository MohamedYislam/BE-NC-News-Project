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
                votes : 100
            })
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
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('bad request, object sent may be invalid');
            });
        });
        test('status: 400 bad request when invalid body is sent', () => {
            return request(app)
            .patch(`/api/articles/1`)
            .send({inc_votes: 'seven'})
            .expect(400)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('bad request, object sent may be invalid');
            });
        });
        test('status: 404 when user tries to patch invalid article', () => {
            return request(app)
            .patch(`/api/articles/seven`)
            .send({inc_votes: 1})
            .expect(400)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('Invalid article id');
            });
        })
        test('status: 404 when user tries to patch invalid article', () => {
            return request(app)
            .patch(`/api/articles/77777`)
            .send({inc_votes: 1})
            .expect(404)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('Article does not exist');
            });
        })
    });
})