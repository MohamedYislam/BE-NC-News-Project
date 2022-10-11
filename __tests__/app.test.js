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
        const article_id = 1
        return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body }) => {
            const { article } = body;
            expect(article).toEqual({
                'article_id': article_id,
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
    test('status:200 responds with an updated article', () => {
        const articleUpdates = { inc_votes : 5 };
        ArticleID = 1
        return request(app)
        .patch(`/api/articles/${ArticleID}`)
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
})