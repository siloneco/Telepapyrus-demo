import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { countAllQuery, countWithTagsQuery } from './query'

export type CountArticleReturnProps = {
  success: boolean
  data?: number
  error?: {
    id: 'too-many-rows-selected' | 'invalid-data-queried' | 'unknown'
    message?: string
  }
}

const createError = (
  id: 'too-many-rows-selected' | 'invalid-data-queried' | 'unknown',
  message?: string,
): CountArticleReturnProps => {
  const data: CountArticleReturnProps = {
    success: false,
    error: {
      id,
      message,
    },
  }

  return data
}

const queryAll = async (
  connection: PoolConnection,
  userId: string,
): Promise<any[]> => {
  return await connection.query(countAllQuery, [userId])
}

const queryWithTags = async (
  connection: PoolConnection,
  userId: string,
  tags: string[],
): Promise<any[]> => {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  return await connection.query(countWithTagsQuery, [
    userId,
    distinctTags,
    distinctTags.length,
  ])
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  userId: string,
  tags?: string[],
): Promise<any[]> => {
  const haveTags = tags !== undefined && tags.length > 0

  if (!haveTags) {
    return await queryAll(connection, userId)
  } else {
    return await queryWithTags(connection, userId, tags!)
  }
}

export const countArticle = async (
  userId: string,
  tags?: string[],
): Promise<CountArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        userId,
        tags,
      )

      const resultRows = resultsWithColumnData[0]

      if (resultRows.length !== 1) {
        return createError('too-many-rows-selected')
      }

      const count: number = resultRows[0]['count']

      if (count === undefined || count < 0) {
        return createError('invalid-data-queried')
      }

      const returnValue: CountArticleReturnProps = {
        success: true,
        data: count,
      }

      return returnValue
    } catch (error: any) {
      return createError('unknown', error.message)
    }
  })
}
