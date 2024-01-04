import { getTestUsername } from '@/layers/constant/databaseConstants'
import getConnectionPool from '../../connection/getConnectionPool'
import { listTags } from './listTag'

const user = getTestUsername()

describe('listTags', () => {
  it('fetches tag list correctly', async () => {
    const result = await listTags(user)

    expect(result).toMatchObject({
      success: true,
    })

    for (const tag of result.data!) {
      expect(typeof tag).toBe('string')
    }
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})
