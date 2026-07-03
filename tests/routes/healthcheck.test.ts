import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

describe('GET /healthcheck', () => {
  it('checks the health of the server', async () => {
    const res = await request(app).get('/healthcheck').expect(200)

    expect(res.body.message).toBe('OK')
  })
})
