import { TagUseCase } from './interface'
import { TagRepository, getRepository } from '@/layers/repository/TagRepository'
import { createTag } from './create/createTag'
import { deleteTag } from './delete/deleteTag'
import { flushListCache, listTags } from './list/listTags'
import { Result } from '@/lib/utils/Result'
import { sha256 } from '@/lib/utils'

type FlushCacheFunction = (_tag: string) => Promise<void>

const flushCacheIfSuccess = async (
  result: Result<any, any>,
  fns: FlushCacheFunction[],
  tag: string,
): Promise<void> => {
  if (result.isSuccess()) {
    // no await
    Promise.all(fns.map((fn) => fn(tag)))
  }
}

const createUseCase = (repo: TagRepository): TagUseCase => {
  const flushCacheFunctions: FlushCacheFunction[] = [flushListCache]

  return {
    createTag: async (username: string, tag: string) => {
      const hashedUsername = sha256(username)
      const result = await createTag(repo, hashedUsername, tag)
      await flushCacheIfSuccess(result, flushCacheFunctions, tag)
      return result
    },
    deleteTag: async (username: string, tag: string) => {
      const hashedUsername = sha256(username)
      const result = await deleteTag(repo, hashedUsername, tag)
      await flushCacheIfSuccess(result, flushCacheFunctions, tag)
      return result
    },
    listTags: async (username: string) => {
      const hashedUsername = sha256(username)
      return listTags(repo, hashedUsername)
    },
  }
}

export const getTagUseCase = (): TagUseCase => {
  const repository: TagRepository = getRepository()

  return createUseCase(repository)
}
