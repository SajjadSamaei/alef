import slugify from "@/payload/utilities/slugify"; // Ensure you have a slugify utility or simple string replacement

export interface TOCItem {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3
}

export function extractHeadings(content: any): TOCItem[] {
  const headings: TOCItem[] = [];

  if (!content || !content.root || !content.root.children) return headings;

  const traverse = (node: any) => {
    if (node.type === "heading" && (node.tag === "h2" || node.tag === "h3")) {
      const text = node.children?.map((c: any) => c.text).join("") || "";
      if (text) {
        headings.push({
          id: slugify(text), // You must ensure your RichText renderer adds these IDs to the H tags!
          text,
          level: parseInt(node.tag.replace("h", "")),
        });
      }
    }
    // Recursive check if needed (though headings are usually top level in Lexical)
    if (node.children) {
      node.children.forEach(traverse);
    }
  };

  content.root.children.forEach(traverse);
  return headings;
}
