import { CreateTagReturnProps, createTag } from './mariadb/tag/create/createTag'
import { DeleteTagReturnProps, deleteTag } from './mariadb/tag/delete/deleteTag'
import { ListTagsReturnProps, listTags } from './mariadb/tag/list/listTag'

export interface TagRepository {
  createTag(_user: string, _tag: string): Promise<CreateTagReturnProps>
  deleteTag(_user: string, _tag: string): Promise<DeleteTagReturnProps>
  listTags(_user: string): Promise<ListTagsReturnProps>
}

export const getRepository = (): TagRepository => {
  return {
    createTag,
    deleteTag,
    listTags,
  }
}
