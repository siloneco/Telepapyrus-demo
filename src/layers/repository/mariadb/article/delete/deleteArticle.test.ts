jest.mock('./query')

import { PublishableDraft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { createArticle } from '../create/createArticle'
import { deleteArticle } from './deleteArticle'
import { deleteArticleQuery as dummyDeleteArticleQuery } from './query'
import { getTestUsername } from '@/layers/constant/databaseConstants'

const { deleteArticleQuery } = jest.requireActual('./query')

const user = getTestUsername()

const milliSec = () => {
  return new Date().getTime()
}

describe('deleteArticle', () => {
  beforeEach(() => {
    const deleteArticleQueryMock = dummyDeleteArticleQuery as jest.Mock
    deleteArticleQueryMock.mockReturnValue(deleteArticleQuery())
  })

  it('deletes an article correctly', async () => {
    const id = `tmp-test-article-delete-success-${milliSec()}`

    const createData: PublishableDraft = {
      id: id,
      title: 'title',
      description: 'description',
      content: 'content',
      tags: [],
      isPublic: true,
    }

    await createArticle(user, createData)

    expect(await deleteArticle(user, id)).toMatchObject({
      success: true,
    })
  })

  it('rejects when the article is not exists', async () => {
    const id = `tmp-test-article-delete-fail-id-not-exists-${milliSec()}`

    expect(await deleteArticle(user, id)).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when 2 or more articles deleted', async () => {
    const baseId = 'test-article-delete-fail-too-many-deleted'
    const deleteArticleQueryMock = dummyDeleteArticleQuery as jest.Mock
    deleteArticleQueryMock.mockReturnValue(
      `DELETE FROM articles WHERE id LIKE '${baseId}-%';`,
    )

    expect(await deleteArticle(user, baseId)).toMatchObject({
      success: false,
      error: {
        id: 'too-many-rows-affected',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})
