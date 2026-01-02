import { MediaBlock } from "@/payload/blocks/MediaBlock/Blog/InLineComponent";
import {
  captionConverter,
  headingConverter,
  linkConverter,
} from "@/components/Blog/UI/RichText/SimpleTextConverters";

import {
  DefaultNodeTypes,
  SerializedBlockNode,
  type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

import type { BlogMediaBlock as MediaBlockProps } from "@/src/payload-types";

import { cn } from "@/utils/cn";
import { TypographyJSXConverters } from "payload-lexical-typography/converters";

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps>;

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...headingConverter,
  ...captionConverter,
  ...linkConverter,
  ...TypographyJSXConverters,

  blocks: {
    blogMediaBlock: ({ node }) => (
      <MediaBlock
        className="col-span-3 col-start-1"
        imgClassName="m-0"
        {...{
          ...node.fields,
          // blockType: 'mediaBlock', // Map blockType to expected value
        }}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
  },
});

type Props = {
  data: DefaultTypedEditorState;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props;
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
