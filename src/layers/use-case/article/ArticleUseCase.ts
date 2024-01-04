import { Article, ArticleOverview, PublishableDraft } from '../../entity/types'
import {
  ArticleRepository,
  getRepository,
} from '../../repository/ArticleRepository'
import { createArticle } from './create/createArticle'
import { deleteArticle } from './delete/deleteArticle'
import { flushGetCache, getArticle } from './get/getArticle'
import { updateArticle } from './update/updateArticle'
import { flushListCache, listArticle } from './list/listArticle'
import { ArticleUseCase } from './interface'
import { countArticle, flushCountCache } from './count/countArticle'
import { Result } from '@/lib/utils/Result'
import { sha256 } from '@/lib/utils'

const flushCachesIfSuccess = (
  result: Result<any, any>,
  flushCacheFunctions: FlushCacheFunction[],
  userId: string,
  id: string,
) => {
  if (result.isSuccess()) {
    // no await
    Promise.all(flushCacheFunctions.map((fn) => fn(userId, id)))
  }
}

export type PresentationArticle = Omit<
  Article,
  'date' | 'last_updated' | 'isPublic'
> & {
  date: string
  last_updated?: string
}

export type PresentationArticleOverview = Omit<
  ArticleOverview,
  'date' | 'last_updated'
> & {
  date: string
  last_updated?: string
}

export type ListArticleProps = {
  tags?: string[]
  page?: number
}

export type FlushCacheFunction = (_userId: string, _id: string) => Promise<void>

const createUseCase = (repo: ArticleRepository): ArticleUseCase => {
  const flushCacheFunctions: FlushCacheFunction[] = [
    flushCountCache,
    flushListCache,
    flushGetCache,
  ]

  return {
    createArticle: async (username: string, draft: PublishableDraft) => {
      const hashedUsername = sha256(username)
      const result = await createArticle(repo, hashedUsername, draft)
      flushCachesIfSuccess(
        result,
        flushCacheFunctions,
        hashedUsername,
        draft.id,
      )
      return result
    },
    updateArticle: async (username: string, draft: PublishableDraft) => {
      const hashedUsername = sha256(username)
      const result = await updateArticle(repo, hashedUsername, draft)
      flushCachesIfSuccess(
        result,
        flushCacheFunctions,
        hashedUsername,
        draft.id,
      )
      return result
    },
    deleteArticle: async (username: string, id: string) => {
      const hashedUsername = sha256(username)
      const result = await deleteArticle(repo, hashedUsername, id)
      flushCachesIfSuccess(result, flushCacheFunctions, hashedUsername, id)
      return result
    },
    getArticle: async (username: string, id: string) => {
      const hashedUsername = sha256(username)
      return await getArticle(repo, hashedUsername, id)
    },
    countArticle: async (username: string, tags?: string[]) => {
      const hashedUsername = sha256(username)
      return await countArticle(repo, hashedUsername, tags)
    },
    listArticle: async (username: string, data: ListArticleProps) => {
      const hashedUsername = sha256(username)
      return await listArticle(repo, hashedUsername, data)
    },
  }
}

export const getArticleUseCase = (): ArticleUseCase => {
  const repository: ArticleRepository = getRepository()

  return createUseCase(repository)
}
