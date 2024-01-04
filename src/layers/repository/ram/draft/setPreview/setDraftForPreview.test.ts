import { Draft } from '@/layers/entity/types'
import { setDraftForPreview } from './setDraftForPreview'
import { getTestUsername } from '@/layers/constant/databaseConstants'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
}

const user = getTestUsername()

describe('setDraftForPreview', () => {
  it('holds draft correctly', async () => {
    const result = await setDraftForPreview(user, baseData)
    expect(result).toMatchObject({
      success: true,
    })
  })
})
