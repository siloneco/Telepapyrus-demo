import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { FlushCacheFunction } from '../ArticleUseCase'
import NodeCache from 'node-cache'
import { UnexpectedBehaviorDetectedError } from '@/layers/entity/errors'
import { concatErrorMessages } from '@/lib/utils'

const cacheMap = new Map<string, NodeCache>()
const cacheTTL = 60

export const countArticle = async (
  repo: ArticleRepository,
  userId: string,
  tags?: string[],
): Promise<Result<number, UnexpectedBehaviorDetectedError | Error>> => {
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
  const errorMsg = result.error?.message

  if (errorId === 'too-many-rows-selected') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(
        concatErrorMessages('Too many rows selected', errorMsg),
      ),
    )
  } else if (errorId === 'invalid-data-queried') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(
        concatErrorMessages('Invalid data queried', errorMsg),
      ),
    )
  }

  return new Failure(
    new Error(concatErrorMessages('Failed to count article', errorMsg)),
  )
}

export const flushCountCache: FlushCacheFunction = async (
  userId: string,
  _id: string,
) => {
  cacheMap.delete(userId)
}
