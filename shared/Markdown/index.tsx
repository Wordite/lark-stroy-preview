'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const makeAbsoluteUrl = (url?: string): string | undefined => {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`
  return `${BACKEND_URL}/${url}`
}

interface MarkdownProps {
  content: string | null
  className?: string
}

const Markdown = ({ content, className = '' }: MarkdownProps) => {
  if (!content) return null

  return (
    <PhotoProvider>
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className='text-[2.25rem] font-semibold mt-[2.5rem] mb-[1.25rem] text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] first:mt-0'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='text-[1.5rem] font-semibold mt-[2rem] mb-[.875rem] text-text-white first:mt-0'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='text-[1.25rem] font-medium mt-[1.5rem] mb-[.625rem] text-text-white first:mt-0'>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className='text-[1.125rem] font-medium mt-[1.25rem] mb-[.5rem] text-text-white first:mt-0'>
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className='text-[1rem] font-medium mt-[1rem] mb-[.5rem] text-text-white first:mt-0'>
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className='text-[.938rem] font-medium mt-[1rem] mb-[.5rem] text-subtext first:mt-0'>
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className='text-subtext text-[1.125rem] leading-[1.5em] mb-[.75rem]'>{children}</p>
          ),
          a: ({ href, children }) => {
            const url = href ?? '#'
            const isExternal = url.startsWith('http://') || url.startsWith('https://')
            return (
              <a
                href={url}
                className='text-accent hover:underline underline-offset-2'
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {children}
              </a>
            )
          },
          strong: ({ children }) => <strong className='text-text-white font-semibold'>{children}</strong>,
          em: ({ children }) => <em className='italic text-text-white/90'>{children}</em>,
          del: ({ children }) => <del className='line-through text-subtext/60'>{children}</del>,
          ul: ({ children }) => (
            <ul className='list-disc marker:text-accent mb-[1rem] pl-[1.5rem] space-y-[.25rem] text-subtext text-[1.125rem]'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='list-decimal marker:text-accent marker:font-medium mb-[1rem] pl-[1.5rem] space-y-[.25rem] text-subtext text-[1.125rem]'>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className='leading-[1.5em]'>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className='mb-[1rem] pl-[1rem] border-l-4 border-accent/50 text-subtext/80 italic'>
              {children}
            </blockquote>
          ),
          code: ({ children, className: cls }) => {
            const isBlock = /language-/.test(cls ?? '')
            if (isBlock) {
              return <code className={cls}>{children}</code>
            }
            return (
              <code className='px-[.375rem] py-[.125rem] rounded-md bg-black-light text-accent font-mono text-[.938em]'>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className='mb-[1rem] p-[1rem] rounded-md bg-black-light overflow-x-auto text-[.938rem] leading-[1.5em] text-text-white font-mono [&_code]:!bg-transparent [&_code]:!text-text-white [&_code]:!p-0'>
              {children}
            </pre>
          ),
          hr: () => <hr className='my-[2rem] border-t border-light-gray-tranpsparent-40' />,
          img: ({ src, alt }) => {
            const url = makeAbsoluteUrl(typeof src === 'string' ? src : undefined)
            return (
              <PhotoView src={url}>
                <img
                  src={url}
                  alt={alt ?? ''}
                  loading='lazy'
                  className='max-w-full h-auto cursor-pointer my-[1.5rem]'
                />
              </PhotoView>
            )
          },
          table: ({ children }) => (
            <div className='my-[1.5rem] overflow-x-auto'>
              <table className='w-full border-collapse border border-light-gray-tranpsparent-40'>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className='bg-black-light'>{children}</thead>,
          th: ({ children }) => (
            <th className='px-[1rem] py-[.75rem] text-left text-[1rem] font-semibold text-text-white border border-light-gray-tranpsparent-40'>
              {children}
            </th>
          ),
          tr: ({ children }) => <tr className='hover:bg-black-light/40 transition-colors'>{children}</tr>,
          td: ({ children }) => (
            <td className='px-[1rem] py-[.75rem] text-[1rem] text-subtext border border-light-gray-tranpsparent-40'>
              {children}
            </td>
          ),
          input: ({ type, checked, disabled }) => {
            // GFM task list checkbox
            if (type === 'checkbox') {
              return (
                <input
                  type='checkbox'
                  checked={!!checked}
                  disabled={disabled}
                  readOnly
                  className='mr-[.375rem] accent-accent'
                />
              )
            }
            return null
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
    </PhotoProvider>
  )
}

export { Markdown }
