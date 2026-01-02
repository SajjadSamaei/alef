import Link from 'next/link'
import React, { ReactNode } from 'react'
import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import {
  SerializedHeadingNode,
  SerializedParagraphNode,
  SerializedAutoLinkNode,
} from '@payloadcms/richtext-lexical'
import { digitsEnToFa } from '@persian-tools/persian-tools' // Or your own utility

// --- 1. Your Centralized Style "Theme" Object ---
const richTextStyles = {
  h1: 'title-style selection:bg-neutral-950 selection:text-white',
  h2: 'blog-section-title mt-12 mb-6 text-neutral-950 selection:bg-neutral-950 selection:text-white first:mt-0 last:mb-0',
  h3: 'subtitle-style mt-6 mb-3 text-neutral-950 selection:bg-neutral-950 selection:text-white first:mt-0 last:mb-0',
  h4: 'dark:text-veryLightGray text-appleTextBlack selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900',
  h5: 'dark:text-veryLightGray text-appleTextBlack selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900',
  h6: 'dark:text-veryLightGray text-appleTextBlack selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900',
  p: 'paragraph-style-pretty text-start dark:text-veryLightGray text-appleTextBlack selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900',
  caption:
    'paragraph-style-caption my-2 text-start text-sm text-gray-500 dark:text-gray-400 selection:bg-neutral-900 selection:text-appleBackgroundWhite dark:selection:bg-appleBackgroundWhite dark:selection:text-neutral-900',
  link: 'text-sky-900 hover:bg-googleSkyBlue/80 cursor-pointer hover:rounded-full hover:overflow-hidden decoration-sky-900 hover:underline hover:underline-offset-2 selection:bg-neutral-950 selection:text-white',
}

// --- 2. Helper function to localize numbers ---
function localizeNodes(nodes: ReactNode, locale: string): ReactNode {
  if (locale !== 'fa') {
    return nodes
  }

  return React.Children.map(nodes, (node) => {
    if (typeof node === 'string') {
      return digitsEnToFa(node)
    }

    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<any>
      if (element.props.children) {
        const newChildren = localizeNodes(element.props.children, locale)
        return React.cloneElement(element, { ...element.props, children: newChildren })
      }
    }
    return node
  })
}

// --- 3. Exportable Functions that Create Converters ---

export const createHeadingConverter = (locale: string): JSXConverters<SerializedHeadingNode> => ({
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag
    const className = richTextStyles[Tag]

    // Get text content for the ID
    const textContent = node.children.map((child: any) => child.text || '').join('')
    const id = textContent
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    return (
      <Tag className={className} id={id}>
        {localizeNodes(children, locale)}
      </Tag>
    )
  },
})

export const createParagraphConverter = (
  locale: string,
): JSXConverters<SerializedParagraphNode> => ({
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })

    // You can customize this logic, e.g., check for a specific format
    const isCaption = node.format === 'center'

    return (
      <p
        data-indent={node.indent}
        data-format={node.format}
        className={isCaption ? richTextStyles.caption : richTextStyles.p}
      >
        {localizeNodes(children, locale)}
      </p>
    )
  },
})

export const createLinkConverter = (locale: string): JSXConverters<SerializedAutoLinkNode> => ({
  link: ({ node, nodesToJSX }) => {
    const { fields } = node
    const children = nodesToJSX({ nodes: node.children })
    const localizedChildren = localizeNodes(children, locale)

    let href: string | undefined = undefined

    if (fields.linkType === 'custom' && fields.url) {
      href = fields.url
    } else if (
      fields.linkType === 'internal' &&
      fields.doc &&
      typeof fields.doc.value === 'object' &&
      fields.doc.value.slug
    ) {
      // Prepend locale to internal links
      const basePath = locale === 'fa' ? '/fa' : '' // Assuming 'en' is default and has no prefix
      const relationTo = fields.doc.relationTo
      const slug = fields.doc.value.slug

      href = relationTo === 'posts' ? `${basePath}/blog/${slug}` : `${basePath}/${slug}`
    }

    if (!href) {
      return <span>{localizedChildren}</span>
    }

    const newTabProps = fields.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    const commonProps = {
      ...newTabProps,
      className: richTextStyles.link,
    }

    if (href.startsWith('/') || href.startsWith('#')) {
      return (
        <Link href={href} {...commonProps}>
          {localizedChildren}
        </Link>
      )
    }

    return (
      <a href={href} {...commonProps}>
        {localizedChildren}
      </a>
    )
  },
})

// We no longer need the 'captionConverter' as that logic is now inside 'createParagraphConverter'
