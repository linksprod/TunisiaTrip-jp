import React from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { ContentBlock, convertMarkdownToBlocks } from '@/types/content-blocks';
import { renderMarkdownToHTML } from '@/components/admin/richtext/markdownUtils';

interface ContentRendererProps {
  content: string;
  className?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ 
  content, 
  className = ""
}) => {
  // Convert markdown to blocks for rendering
  const blocks = convertMarkdownToBlocks(content);

  return (
    <div className={`prose max-w-none ${className}`}>
      <style>{`
        .content-renderer img {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin: 2rem 0 !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .content-renderer .image-caption {
          text-align: center;
          font-style: italic;
          color: var(--muted-foreground);
          margin-top: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.9em;
        }
        .content-renderer {
          --tw-prose-body: var(--foreground);
          --tw-prose-headings: var(--foreground);
          --tw-prose-links: var(--primary);
          --tw-prose-bold: var(--foreground);
          --tw-prose-code: var(--foreground);
          --tw-prose-pre-code: var(--foreground);
          --tw-prose-pre-bg: var(--muted);
          --tw-prose-quotes: var(--muted-foreground);
          --tw-prose-quote-borders: var(--border);
          --tw-prose-hr: var(--border);
        }
      `}</style>
      
      <div className="content-renderer">
        {blocks.map((block, index) => (
          <div key={`${block.type}-${index}`} className="mb-6">
            {block.type === 'text' ? (
              <div 
                dangerouslySetInnerHTML={renderMarkdownToHTML(block.content)}
              />
            ) : (
              <div className="w-full">
                <OptimizedImage
                  src={block.url}
                  alt={block.alt}
                  className="w-full rounded-lg shadow-lg"
                  loading="lazy"
                />
                {block.caption && (
                  <p className="image-caption text-center">{block.caption}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        {blocks.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Aucun contenu disponible
          </p>
        )}
      </div>
    </div>
  );
};