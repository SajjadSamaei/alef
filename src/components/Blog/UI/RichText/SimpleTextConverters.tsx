import Link from 'next/link'
import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import {
  SerializedHeadingNode,
  SerializedParagraphNode,
  SerializedAutoLinkNode,
} from '@payloadcms/richtext-lexical'

export const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    if (node.tag === 'h2') {
      const text = nodesToJSX({ nodes: node.children })

      const id = text
        .join('')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      return (
        <h2
          className="blog-section-title mt-12 mb-6 text-neutral-950 selection:bg-neutral-950 selection:text-white first:mt-0 last:mb-0"
          id={id}
        >
          {text}
        </h2>
      )
    } else if (node.tag === 'h1') {
      const text = nodesToJSX({ nodes: node.children })

      return <h1 className="title-style selection:bg-neutral-950 selection:text-white">{text}</h1>
    } else if (node.tag === 'h3') {
      const text = nodesToJSX({ nodes: node.children })

      return (
        <h3 className="subtitle-style mt-6 mb-3 text-neutral-950 selection:bg-neutral-950 selection:text-white first:mt-0 last:mb-0">
          {text}
        </h3>
      )
    } else {
      const text = nodesToJSX({ nodes: node.children }).join('')
      const Tag = node.tag
      return (
        <Tag className="dark:text-veryLightGray text-appleTextBlack selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900">
          {text}
        </Tag>
      )
    }
  },
}

export const paragraphConverter: JSXConverters<SerializedParagraphNode> = {
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })

    return (
      <p
        data-indent={node.indent}
        data-format={node.format}
        className="paragraph-style-pretty inline-block text-justify align-middle whitespace-nowrap dark:text-veryLightGray text-appleTextBlack selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900"
      >
        {children}
      </p>
    )
  },
}

export const captionConverter: JSXConverters<SerializedParagraphNode> = {
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })

    return (
      <p
        data-indent={node.indent}
        data-format={node.format}
        className="paragraph-style-caption my-2 inline-block text-justify align-middle whitespace-nowrap dark:text-veryLightGray text-appleTextBlack selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900"
      >
        {children}
      </p>
    )
  },
}

export const linkConverter: JSXConverters<SerializedAutoLinkNode> = {
  link: ({ node, nodesToJSX }) => {
    const { fields } = node
    const children = nodesToJSX({ nodes: node.children })

    let href: string | undefined = undefined

    // Handle custom (external or manual) links
    if (fields.linkType === 'custom' && fields.url) {
      href = fields.url
    }
    // Handle internal links (your case)
    else if (
      fields.linkType === 'internal' &&
      fields.doc &&
      fields.doc.value &&
      fields.doc.value.slug
    ) {
      href = `/blog/${fields.doc.value.slug}`
    }

    // You can keep your old reference logic if needed for other types

    if (!href) {
      return <span>{children}</span>
    }

    const newTabProps = fields.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    const commonProps = {
      ...newTabProps,
      className:
        ' text-sky-900 hover:bg-googleSkyBlue/80 cursor-pointer hover:rounded-full hover:overflow-hidden decoration-sky-900 hover:underline hover:underline-offset-2 selection:bg-neutral-950 selection:text-white',
    }

    // Internal links: starts with / or #
    if (href.startsWith('/') || href.startsWith('#')) {
      return (
        <Link href={href} {...commonProps}>
          {children}
        </Link>
      )
    }

    // External links
    return (
      <a href={href} {...commonProps}>
        {children}
      </a>
    )
  },
}
