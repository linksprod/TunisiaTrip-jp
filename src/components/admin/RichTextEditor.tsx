
import React, { useState, useRef, useEffect } from "react";
import EditorToolbar from "./richtext/EditorToolbar";
import { EditorContent } from "./richtext/EditorContent";
import { renderMarkdownToHTML } from "./richtext/markdownUtils";
import { ImageUploader } from "./richtext/ImageUploader";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content..."
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle text selection
  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selected = value.substring(start, end);
      setSelectedText(selected);
    }
  };

  // Handle formatting
  const handleFormat = (formatTag: string) => {
    if (formatTag === 'image') {
      // Trigger the file input
      const trigger = document.getElementById('image-uploader-trigger');
      trigger?.click();
      return;
    }

    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = "";
    
    switch (formatTag) {
      case 'bold':
        formattedText = `**${selectedText || 'Bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'Italic text'}*`;
        break;
      case 'h1':
        formattedText = `\n# ${selectedText || 'Heading 1'}\n\n`;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText || 'Heading 2'}\n\n`;
        break;
      case 'h3':
        formattedText = `\n### ${selectedText || 'Heading 3'}\n\n`;
        break;
      case 'list':
        formattedText = selectedText ? 
          `\n- ${selectedText.split('\n').join('\n- ')}\n\n` : 
          `\n- List item\n\n`;
        break;
      case 'ordered-list':
        formattedText = selectedText ? 
          `\n1. ${selectedText.split('\n').join('\n1. ')}\n\n` : 
          `\n1. List item\n\n`;
        break;
      case 'quote':
        formattedText = selectedText ? 
          `\n> ${selectedText.split('\n').join('\n> ')}\n\n` : 
          `\n> Blockquote\n\n`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'Link text'}](https://example.com)`;
        break;
      case 'line-break':
        formattedText = '\n\n';
        break;
      default:
        formattedText = selectedText;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    // Restore focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageInserted = (imageUrl: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const imageMarkdown = `\n![${selectedText || 'Image description'}](${imageUrl})\n\n`;
    const newValue = value.substring(0, start) + imageMarkdown + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the image
    setTimeout(() => {
      const newCursorPos = start + imageMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // Handle key shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'Enter':
          e.preventDefault();
          handleFormat('line-break');
          break;
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <EditorToolbar
        onFormatClick={handleFormat}
        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
        isPreviewMode={isPreviewMode}
      />
      
      <EditorContent
        value={value}
        onChange={onChange}
        onSelect={handleTextSelection}
        onKeyDown={handleKeyDown}
        isPreviewMode={isPreviewMode}
        placeholder={placeholder}
        textareaRef={textareaRef}
        renderHTML={renderMarkdownToHTML}
      />
      
      <ImageUploader onImageInserted={handleImageInserted} />
      
      <div className="px-3 py-2 bg-gray-50 border-t text-xs text-gray-500">
        {isPreviewMode ? (
          <span>Preview mode - Click "Edit" to continue writing</span>
        ) : (
          <span>
            {value.length} characters | Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+Enter for line break
          </span>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
