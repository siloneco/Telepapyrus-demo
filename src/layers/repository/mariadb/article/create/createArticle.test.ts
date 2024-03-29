import { PublishableDraft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { createArticle } from './createArticle'
import { getTestUsername } from '@/layers/constant/databaseConstants'

const user = getTestUsername()

const baseData: PublishableDraft = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  tags: [],
  isPublic: true,
}

const milliSec = () => {
  return new Date().getTime()
}

describe('createArticle', () => {
  it('creates article correctly', async () => {
    const id = `tmp-test-article-create-success-${milliSec()}`

    expect(
      await createArticle(user, {
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
      success: true,
    })
  })

  it('rejects when id is too long', async () => {
    const longString = 'a'.repeat(256)
    const id = `tmp-test-article-create-fail-with-id-too-long-${longString}-${milliSec()}`

    expect(
      await createArticle(user, {
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
      success: false,
      error: {
        id: 'invalid-data',
      },
    })
  })

  it('rejects when tag is invalid', async () => {
    const id = `tmp-test-article-create-fail-invalid-tag-${milliSec()}`

    expect(
      await createArticle(user, {
        ...baseData,
        id: id,
        tags: [id],
      }),
    ).toMatchObject({
      success: false,
      error: {
        id: 'invalid-data',
      },
    })
  })

  it('rejects when article is already exists', async () => {
    const id = 'test-article-create-fail-already-exists'

    expect(
      await createArticle(user, {
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
      success: false,
      error: {
        id: 'already-exists',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})
