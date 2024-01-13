'use client'

import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function SigninPage() {
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const callbackUrl: string | null = searchParams.get('callbackUrl')

  const onClick = async () => {
    setLoading(true)

    const urlAfterSignin = callbackUrl ? callbackUrl : '/admin/dashboard'
    await signIn('github', { callbackUrl: urlAfterSignin })
  }

  return (
    <div className="h-[calc(100vh-170px)] flex items-center">
      <div className="max-w-3xl mx-3 md:mx-auto bg-card p-6 rounded-3xl">
        <h2 className="flex justify-center text-4xl mb-6">
          Telepapyrusデモサイト
        </h2>
        <p className="flex justify-center">
          記事の投稿や閲覧など、全機能をログイン後に行えます
        </p>
        <div className="w-fit mx-auto mt-4">
          <Button
            variant="outline"
            className="h-20 rounded-xl px-12 border-2"
            onClick={onClick}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" size={36} />}
            {!loading && <FaGithub className="text-4xl" />}
            <p className="text-xl ml-4">GitHubでログイン</p>
          </Button>
        </div>
        <p className="mt-4 flex justify-center text-card-foreground/60">
          ログインはユーザーを識別するために利用され、個人情報を収集することはありません
        </p>
        <p className="flex justify-center text-card-foreground/60">
          ユーザーの識別はGitHubのユーザー名を用いて行われます
        </p>
        <div className="w-fit mx-auto mt-4">
          <Button variant="outline" className="dark:text-link">
            <FaGithub className="text-xl mr-3 dark:text-card-foreground" />
            <a
              href="https://github.com/siloneco/Telepapyrus"
              target="_blank"
              rel="noopener"
            >
              GitHub Repository
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
