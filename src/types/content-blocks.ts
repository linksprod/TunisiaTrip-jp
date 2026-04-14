export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export type ContentBlock = TextBlock | ImageBlock;

export interface BlockContent {
  blocks: ContentBlock[];
}

// Helper function to convert legacy markdown content to blocks
export function convertMarkdownToBlocks(markdown: string): ContentBlock[] {
  if (!markdown) return [];
  
  // Split by double newlines to get potential blocks
  const parts = markdown.split('\n\n').filter(p => p.trim());
  
  return parts.map((part, index) => {
    const trimmedPart = part.trim();
    
    // Check if it's an image markdown: ![alt](url) or ![alt](url)*caption*
    const imageMatch = trimmedPart.match(/^!\[([^\]]*)\]\(([^)]+)\)(\*([^*]+)\*)?$/);
    
    if (imageMatch) {
      const [, alt, url, , caption] = imageMatch;
      return {
        id: `block-${Date.now()}-${index}`,
        type: 'image' as const,
        url: url.trim(),
        alt: alt.trim(),
        caption: caption?.trim() || ''
      };
    }
    
    // Otherwise it's a text block
    return {
      id: `block-${Date.now()}-${index}`,
      type: 'text' as const,
      content: trimmedPart
    };
  });
}

// Helper function to convert blocks back to markdown for compatibility
export function convertBlocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks
    .filter(block => {
      // Filter out empty text blocks and image blocks without URL
      if (block.type === 'text') {
        return block.content.trim() !== '';
      } else if (block.type === 'image') {
        return block.url !== '';
      }
      return true;
    })
    .map(block => {
      if (block.type === 'text') {
        return block.content;
      } else if (block.type === 'image') {
        const caption = block.caption ? `\n*${block.caption}*` : '';
        return `![${block.alt}](${block.url})${caption}`;
      }
      return '';
    }).join('\n\n');
}