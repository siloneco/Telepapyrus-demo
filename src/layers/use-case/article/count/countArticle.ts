import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import {
  ArticleExcessiveScopeError,
  ArticleUnexpectedReturnValueError,
} from '../errors'
import { FlushCacheFunction } from '../ArticleUseCase'
import NodeCache from 'node-cache'

const cacheMap = new Map<string, NodeCache>()
const cacheTTL = 60

export const countArticle = async (
  repo: ArticleRepository,
  userId: string,
  tags?: string[],
): Promise<
  Result<
    number,
    ArticleExcessiveScopeError | ArticleUnexpectedReturnValueError | Error
  >
> => {
  const cacheKey = tags ? JSON.stringify(tags?.sort()) : 'all'

  const cache: NodeCache = cacheMap.has(userId)
    ? cacheMap.get(userId)!
    : new NodeCache()

  cacheMap.set(userId, cache)

  const cached = cacheMap.get(userId)!.get<number>(cacheKey)
  if (cached) {
    return new Success(cached)
  }

  const result = await repo.countArticle(userId, tags)
  if (result.success) {
    const data = result.data!
    cache.set(cacheKey, data, cacheTTL)
    return new Success(data)
  }

  const errorId = result.error?.id

  if (errorId === 'too-many-rows-selected') {
    return new Failure(
      new ArticleExcessiveScopeError(`Too many rows selected.`),
    )
  } else if (errorId === 'invalid-data-queried') {
    return new Failure(
      new ArticleUnexpectedReturnValueError(`Invalid data returned.`),
    )
  }

  return new Failure(
    new Error(`Failed to count articles: ${result.error?.message}`),
  )
}

export const flushCountCache: FlushCacheFunction = async (
  userId: string,
  _id: string,
) => {
  cacheMap.delete(userId)
}
