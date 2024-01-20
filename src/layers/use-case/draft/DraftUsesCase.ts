import {
  DraftRepository,
  getRepository,
} from '@/layers/repository/DraftRepository'
import { DraftUseCase } from './interface'
import { getDraft } from './get/getDraft'
import { saveDraft } from './save/saveDraft'
import { Draft } from '@/layers/entity/types'
import { setDraftForPreview } from './setForPreview/setDraftForPreview'
import { getDraftForPreview } from './getForPreview/getForPreview'
import { deleteDraft } from './delete/deleteDraft'
import { sha256 } from '@/lib/utils'
import { listDraft } from './list/listDraft'
import { changeDraftId } from './changeId/changeDraftId'

export type PresentationDraft = {
  id: string
  title: string
  content: string
}

const createUseCase = (repo: DraftRepository): DraftUseCase => {
  return {
    getDraft: async (username: string, id: string) => {
      const hashedUsername = sha256(username)
      return getDraft(repo, hashedUsername, id)
    },
    saveDraft: async (username: string, draft: Draft) => {
      const hashedUsername = sha256(username)
      return saveDraft(repo, hashedUsername, draft)
    },
    deleteDraft: async (username: string, id: string) => {
      const hashedUsername = sha256(username)
      return deleteDraft(repo, hashedUsername, id)
    },
    listDraft: async (username: string, page?: number) => {
      const hashedUsername = sha256(username)
      return listDraft(repo, hashedUsername, page)
    },
    changeDraftId: async (username: string, oldId: string, newId: string) => {
      const hashedUsername = sha256(username)
      return changeDraftId(repo, hashedUsername, oldId, newId)
    },
    setDraftForPreview: async (username: string, draft: Draft) => {
      const hashedUsername = sha256(username)
      return setDraftForPreview(repo, hashedUsername, draft)
    },
    getDraftForPreview: async (username: string, id: string) => {
      const hashedUsername = sha256(username)
      return getDraftForPreview(repo, hashedUsername, id)
    },
  }
}

export const getDraftUseCase = (): DraftUseCase => {
  const repository: DraftRepository = getRepository()

  return createUseCase(repository)
}
