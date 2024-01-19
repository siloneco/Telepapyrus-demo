import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import {
  ListArticleProps,
  PresentationArticleOverview,
} from '../ArticleUseCase'
import NodeCache from 'node-cache'
import { concatErrorMessages, formatDate } from '@/lib/utils'

const cacheMap = new Map<string, NodeCache>()
const cacheTTL = 60

export const listArticle = async (
  repo: ArticleRepository,
  userId: string,
  { page, tags }: ListArticleProps,
): Promise<Result<PresentationArticleOverview[], Error>> => {
  const cacheKeyObject = {
    page,
    tags: tags ? tags.sort() : [],
  }
  const cacheKey = JSON.stringify(cacheKeyObject)

  const cache: NodeCache = cacheMap.has(userId)
    ? cacheMap.get(userId)!
    : new NodeCache()

  cacheMap.set(userId, cache)

  const cached = cache.get<PresentationArticleOverview[]>(cacheKey)
  if (cached) {
    return new Success(cached)
  }

  const result = await repo.listArticle(userId, { page, tags })
  if (result.success) {
    const resultData: PresentationArticleOverview[] = result.data!.map(
      (article) => ({
        ...article,
        date: formatDate(article.date),
        last_updated: article.last_updated
          ? formatDate(article.last_updated)
          : undefined,
      }),
    )

    cache.set(cacheKey, resultData, cacheTTL)
    return new Success(resultData)
  }

  const errorMsg = result.error?.message

  return new Failure(
    new Error(concatErrorMessages(`Failed to list articles`, errorMsg)),
  )
}

export const flushListCache = async (userId: string, _id: string) => {
  cacheMap.delete(userId)
}
