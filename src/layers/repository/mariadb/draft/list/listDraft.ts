import withConnection from '../../connection/withConnection'
import { DraftOverview } from '@/layers/entity/types'
import { listAllQuery, listAllWithPageQuery } from './query'
import { PoolConnection } from 'mysql2/promise'

export type ListDraftReturnProps = {
  success: boolean
  data?: DraftOverview[]
  error?: {
    id: 'unknown'
    message: string
  }
}

const createError = (message?: string): ListDraftReturnProps => {
  const data: ListDraftReturnProps = {
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
  const offset = (page - 1) * 10
  return await connection.query(listAllWithPageQuery, [userId, offset])
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  userId: string,
  page?: number,
): Promise<any[]> => {
  if (page === undefined) {
    return await queryAll(connection, userId)
  }

  return await queryWithPage(connection, userId, page)
}

export const listDraft = async (
  userId: string,
  page?: number,
): Promise<ListDraftReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        userId,
        page,
      )

      const rawResults = resultsWithColumnData[0]
      const results: DraftOverview[] = []

      for (const data of rawResults) {
        const draft: DraftOverview = {
          id: data.id,
          title: data.title,
        }

        results.push(draft)
      }

      const returnValue: ListDraftReturnProps = {
        success: true,
        data: results,
      }

      return returnValue
    } catch (error: any) {
      return createError(error.message)
    }
  })
}
