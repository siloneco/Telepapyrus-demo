import { Draft } from '../entity/types'
import {
  DeleteDraftReturnProps,
  deleteDraft,
} from './mariadb/draft/delete/deleteDraft'
import { GetDraftReturnProps, getDraft } from './mariadb/draft/get/getDraft'
import { SaveDraftReturnProps, saveDraft } from './mariadb/draft/save/saveDraft'
import {
  GetDraftForPreviewReturnProps,
  getDraftForPreview,
} from './ram/draft/getPreview/getDraftForPreview'
import {
  SetDraftForPreviewReturnProps,
  setDraftForPreview,
} from './ram/draft/setPreview/setDraftForPreview'

export interface DraftRepository {
  saveDraft(_user: string, _draft: Draft): Promise<SaveDraftReturnProps>
  getDraft(_user: string, _id: string): Promise<GetDraftReturnProps>
  deleteDraft(_user: string, _id: string): Promise<DeleteDraftReturnProps>

  setDraftForPreview(
    _user: string,
    _draft: Draft,
  ): Promise<SetDraftForPreviewReturnProps>
  getDraftForPreview(
    _user: string,
    _id: string,
  ): Promise<GetDraftForPreviewReturnProps>
}

export const getRepository = (): DraftRepository => {
  return {
    saveDraft,
    getDraft,
    deleteDraft,

    setDraftForPreview,
    getDraftForPreview,
  }
}
