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
    test('returns a status 200', () => {
        return request(app)
        .get('/api/treasures')
        .expect(404)  
    })
})