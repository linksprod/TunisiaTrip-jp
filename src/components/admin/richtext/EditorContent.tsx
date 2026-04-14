
import React from "react";

interface EditorContentProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isPreviewMode: boolean;
  placeholder: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  renderHTML: (markdown: string) => { __html: string };
}

export const EditorContent: React.FC<EditorContentProps> = ({
  value,
  onChange,
  onSelect,
  onKeyDown,
  isPreviewMode,
  placeholder,
  textareaRef,
  renderHTML
}) => {
  return (
    <div className="relative">
      {isPreviewMode ? (
        <div 
          className="min-h-[300px] p-4 prose max-w-none overflow-auto editor-preview"
          style={{ maxHeight: '500px' }}
        >
          <style>{`
            .editor-preview .formatted-content .editor-image,
            .editor-preview .formatted-content img {
              display: block !important;
              max-width: 100% !important;
              height: auto !important;
              margin: 1rem auto !important;
              border-radius: 0.5rem !important;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
            }
            .editor-preview .formatted-content {
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
          <div 
            className="formatted-content"
            dangerouslySetInnerHTML={renderHTML(value)}
          />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onSelect={onSelect}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full min-h-[300px] max-h-[500px] p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed"
          style={{
            lineHeight: '1.6',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
          }}
        />
      )}
    </div>
  );
};
