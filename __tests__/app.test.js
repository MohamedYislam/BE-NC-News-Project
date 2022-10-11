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

describe(' GET /api/topics', () => {
    test('returns a status 200 and an array of topics', () => {
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

