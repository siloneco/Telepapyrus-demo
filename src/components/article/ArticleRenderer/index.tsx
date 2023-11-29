import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import style from './style/style.module.css'
import './style/codeBlockStyle.css'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { A, CompiledInput, Div, Ul } from './components/GeneralTags'
import CodeBlockPre from './components/codeblock/CodeBlockPre'
import { reuseComponent } from '@/lib/cache/Cache'
import { FC } from 'react'

const rpcOptions = {
  defaultLang: 'plaintext',
  theme: 'slack-dark',
  keepBackground: false,
  grid: false,
}

const mdxOptions: any = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSanitize, [rehypePrettyCode, rpcOptions]],
  },
}

const components = {
  div: (props: any) => <Div {...props} />,
  pre: (props: any) => <CodeBlockPre {...props} />,
  a: (props: any) => <A {...props} />,
  ul: (props: any) => <Ul {...props} />,
  input: (props: any) => <CompiledInput {...props} />,
  hr: (props: any) => <Separator {...props} />,
}

type Props = {
  content: string
}

type CompiledMDXProps = {
  source: string
  components: any
  options: any
}

export default async function ArticleRenderer({ content }: Props) {
  const data: CompiledMDXProps = {
    source: content,
    components: components,
    options: mdxOptions,
  }

  const CompiledMDX: FC<{}> = await reuseComponent(
    'article',
    data,
    async ({ source, components, options }: CompiledMDXProps) => {
      return (
        <article className={cn(style.article, 'prose prose-invert max-w-none')}>
          <MDXRemote
            source={source}
            components={{ ...components }}
            options={{ ...options }}
          />
        </article>
      )
    },
    { revalidate: 60 },
  )

  return <CompiledMDX />
}
