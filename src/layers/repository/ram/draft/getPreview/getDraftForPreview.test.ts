import { getDraftForPreview } from './getDraftForPreview'
import { setDraftForPreview } from '../setPreview/setDraftForPreview'
import { Draft } from '@/layers/entity/types'
import { getTestUsername } from '@/layers/constant/databaseConstants'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
}

const user = getTestUsername()

describe('getDraftForPreview', () => {
  it('gets draft data correctly', async () => {
    await setDraftForPreview(user, baseData)

    const result = await getDraftForPreview(user, baseData.id)
    expect(result).toMatchObject({
      success: true,
      data: baseData,
    })
  })

  it('return not exists when there is no data found', async () => {
    const id = 'tmp-test-draft-preview-not-exists'
    const result = await getDraftForPreview(user, id)
    expect(result).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })
})
