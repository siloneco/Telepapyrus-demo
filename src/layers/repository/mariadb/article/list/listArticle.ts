import withConnection from '../../connection/withConnection'
import { ArticleOverview } from '@/layers/entity/types'
import {
  listAllQuery,
  listAllWithPageQuery,
  listAllWithTagsAndPageQuery,
} from './query'
import { PoolConnection } from 'mysql2/promise'

export type ListArticleProps = {
  tags?: string[]
  page?: number
}

export type ListArticleReturnProps = {
  success: boolean
  data?: ArticleOverview[]
  error?: {
    id: 'unknown'
    message: string
  }
}

const createError = (message?: string): ListArticleReturnProps => {
  const data: ListArticleReturnProps = {
    success: false,
    error: {
      id: 'unknown',
      message: 'Unknown error',
    },
  }

  if (message !== undefined) {
    data.error!.message = message
  }

  return data
}

const queryAll = async (
  connection: PoolConnection,
  userId: string,
): Promise<any[]> => {
  return await connection.query(listAllQuery, [userId])
}

const queryWithPage = async (
  connection: PoolConnection,
  userId: string,
  page: number,
): Promise<any[]> => {
  return await connection.query(listAllWithPageQuery, [userId, 10 * (page - 1)])
}

const queryWithTags = async (
  connection: PoolConnection,
  userId: string,
  tags: string[],
  page: number,
): Promise<any[]> => {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  return await connection.query(listAllWithTagsAndPageQuery, [
    userId,
    distinctTags,
    distinctTags.length,
    10 * (page - 1),
  ])
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  userId: string,
  tags?: string[],
  page?: number,
): Promise<any[]> => {
  const havePage = page !== undefined
  const haveTags = tags !== undefined && tags.length > 0

  if (!havePage && !haveTags) {
    return await queryAll(connection, userId)
  } else if (havePage && !haveTags) {
    return await queryWithPage(connection, userId, page!)
  } else if (havePage && haveTags) {
    return await queryWithTags(connection, userId, tags!, page!)
  } else {
    // !havePage && haveTags
    throw new Error('Not implemented yet.')
  }
}

export const listArticle = async (
  userId: string,
  { tags, page }: ListArticleProps,
): Promise<ListArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        userId,
        tags,
        page,
      )

      const rawResults = resultsWithColumnData[0]
      const results: ArticleOverview[] = []

      for (const data of rawResults) {
        const rawTags: string | null = data.tags
        const overview: ArticleOverview = {
          id: data.id,
          title: data.title,
          description: data.description,
          tags: rawTags ? rawTags.split(',') : [],
          date: data.date,
          last_updated: data.last_updated,
          isPublic: true, // Edit this when you implement private article
        }

        results.push(overview)
      }

      const returnValue: ListArticleReturnProps = {
        success: true,
        data: results,
      }

      return returnValue
    } catch (error: any) {
      return createError(error.message)
    }
  })
}
