import React from 'react';
import { ContentBlock } from '@/types/content-blocks';
import { renderMarkdownToHTML } from '../richtext/markdownUtils';

interface ContentPreviewProps {
  blocks: ContentBlock[];
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ blocks }) => {
  return (
    <div className="prose max-w-none p-6 bg-background border border-border rounded-lg">
      <style>{`
        .content-preview img {
          display: block !important;
          max-width: 100% !important;
          height: auto !important;
          margin: 2rem auto !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .content-preview .image-caption {
          text-align: center;
          font-style: italic;
          color: var(--muted-foreground);
          margin-top: 0.5rem;
          margin-bottom: 2rem;
        }
        .content-preview {
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
      
      <div className="content-preview">
        {blocks.map((block, index) => (
          <div key={block.id} className="mb-6">
            {block.type === 'text' ? (
              <div 
                dangerouslySetInnerHTML={renderMarkdownToHTML(block.content)}
              />
            ) : (
              <div className="text-center">
                <img
                  src={block.url}
                  alt={block.alt}
                  className="mx-auto"
                />
                {block.caption && (
                  <p className="image-caption">{block.caption}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        {blocks.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Aucun contenu à afficher
          </p>
        )}
      </div>
    </div>
  );
};