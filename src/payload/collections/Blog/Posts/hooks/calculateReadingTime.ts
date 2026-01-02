import type { FieldHook } from "payload";

export const calculateReadingTime: FieldHook = async ({ siblingData }) => {
  // If there is no content, reading time is 0
  if (!siblingData.content || !siblingData.content.root) {
    return 0;
  }

  // Recursive function to extract text from Lexical nodes
  function getTextFromNodes(nodes: any[]): string {
    let text = "";
    for (const node of nodes) {
      // 1. Get direct text
      if (node.text) {
        text += node.text + " ";
      }
      // 2. Recursively get text from children (e.g. links, bold, paragraphs)
      if (node.children && Array.isArray(node.children)) {
        text += getTextFromNodes(node.children);
      }
    }
    return text;
  }

  const allText = getTextFromNodes(siblingData.content.root.children || []);

  // Clean up whitespace and split
  const wordCount = allText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes;
};
