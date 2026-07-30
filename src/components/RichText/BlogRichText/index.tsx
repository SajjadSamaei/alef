import { MediaBlock } from "@/payload/blocks/MediaBlock/Blog/InLineComponent";
import {
  createHeadingConverter,
  createParagraphConverter,
  createLinkConverter,
} from "@/components/Blog/UI/RichText/LocalizedTextConverter";
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";

import { CarouselBlockComponent } from "@/payload/blocks/BlogCarousel/Component";
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

// import { CodeBlock, CodeBlockProps } from "@/payload/blocks/Code/Component";

import type {
  // Blog Types
  BlogCarouselBlock,
  BlogMediaBlock,
  // Project Types (Add these imports!)
  ProjectCarouselBlock,
  ProjectMediaBlock,
} from "@/src/payload-types";
import { cn } from "@/utils/cn";
import { TypographyJSXConverters } from "payload-lexical-typography/converters";

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<BlogMediaBlock>
  | SerializedBlockNode<BlogCarouselBlock>
  | SerializedBlockNode<ProjectMediaBlock>
  | SerializedBlockNode<ProjectCarouselBlock>;

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!;
  if (typeof value !== "object") {
    throw new Error("Expected value to be an object");
  }
  const slug = value.slug;
  return relationTo === "posts" ? `/blog/${slug}` : `/${slug}`;
};

type Props = {
  locale: string;
  data: DefaultTypedEditorState;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const {
    className,
    locale,
    enableProse = true,
    enableGutter = true,
    ...rest
  } = props;

  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
    defaultConverters,
  }) => ({
    ...defaultConverters,
    ...createHeadingConverter(locale),
    ...createParagraphConverter(locale),
    ...createLinkConverter(locale),
    ...TypographyJSXConverters,
    // ...LinkJSXConverter({ internalDocToHref }),

    blocks: {
      blogMediaBlock: ({ node }) => (
        <MediaBlock
          className="col-span-3 col-start-1"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto flex justify-center items-center max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      "carousel-blog": ({ node }) => (
        <CarouselBlockComponent {...(node.fields as any)} />
      ),

      // code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      // cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
  });

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        "payload-richtext px-4 xl:max-w-2xl xl:px-0",
        {
          container: enableGutter,
          "max-w-none": !enableGutter,
          "prose md:prose-md dark:prose-invert mx-auto": enableProse,
        },
        className,
      )}
      {...rest}
    />
  );
}
