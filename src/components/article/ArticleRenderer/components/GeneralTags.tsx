import { FC } from 'react'
import CodeBlockFigure from './codeblock/CodeBlockFigure'
import CodeBlockTitle from './codeblock/CodeBlockTitle'
import { cn } from '@/lib/utils'

export const Figure: FC<any> = (props) => {
  if (props['data-rehype-pretty-code-figure'] !== undefined) {
    return <CodeBlockFigure {...props} />
  }
  return <figure {...props} />
}

export const FigCaption: FC<any> = (props) => {
  if (props['data-rehype-pretty-code-title'] !== undefined) {
    return <CodeBlockTitle {...props} />
  }
  return <figcaption {...props} />
}

export const A: FC<any> = (props) => {
  if (
    props['data-footnote-ref'] == true ||
    props['data-footnote-backref'] == true
  ) {
    return <a className="text-link" {...props} />
  }
  return (
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-link"
      {...props}
    />
  )
}

export const Ul: FC<any> = (props) => {
  {
    if (props.className === 'contains-task-list') {
      return <ul {...props} className={cn(props.className, 'list-none pl-0')} />
    }
    return <ul {...props} />
  }
}

export const CompiledInput: FC<any> = (props) => {
  if (props.type === 'checkbox') {
    return (
      <input
        {...props}
        disabled={false}
        className={cn(props.className, 'accent-primary pointer-events-none')}
      />
    )
  }
  return <input {...props} />
}

export const OptimizedImage: FC<any> = (props) => {
  // デモサイトでは next/Image を使用しない

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={props} alt={props.alt} className="max-h-[400px] my-0" />
}
