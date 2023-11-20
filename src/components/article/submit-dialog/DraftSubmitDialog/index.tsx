'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import TitleInput from '../form/TitleInput'
import TagSelector from '../form/TagSelector'
import VisibilitySelector from '../form/VisibilitySelector'
import ConfirmationCheckbox from '../form/ConfirmationCheckbox'
import { useEffect, useState } from 'react'

const formSchema = z.object({
  title: z
    .string({ errorMap: () => ({ message: 'タイトルは空にできません' }) })
    .min(1, {
      message: 'タイトルは空にできません',
    }),
  tags: z.string().array().optional(),
  visibility: z
    .enum(['public', 'private'], {
      required_error: '公開範囲を指定してください',
    })
    .default('private'),
  confirm: z.literal<boolean>(true),
})

async function getTags(): Promise<string[]> {
  const protocol = window.location.protocol
  const hostname = window.location.hostname

  const res = await fetch(`${protocol}//${hostname}/api/v1/tag/list`)
  const { tags } = await res.json()

  if (res.status !== 200 || !tags) {
    return []
  }

  return tags
}

type Props = {
  title: string
  setTitle: (_title: string) => void
  createArticle: (_title: string, _tags: string[] | undefined) => void
}

export default function DraftSubmitDialog({
  title,
  setTitle,
  createArticle,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createArticle(values.title, values.tags)
  }

  const onOpenChange = (open: boolean) => {
    if (open) {
      form.setValue('title', title)
    } else {
      setTitle(form.getValues('title'))
    }
  }

  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    getTags().then((tags) => setTags(tags))
  }, [])

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-auto mr-0 text-base">
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>投稿フォーム</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-[calc(512px-48px)]"
          >
            {/* >>> form items */}
            <TitleInput form={form} />
            <TagSelector form={form} tags={tags} />
            <VisibilitySelector form={form} />
            <ConfirmationCheckbox form={form} />
            {/* >>> form items */}
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button variant="secondary" className="mr-2 text-base">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="text-base">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
