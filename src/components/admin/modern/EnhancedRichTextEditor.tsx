import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image, 
  Eye, 
  Edit,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";
import { renderMarkdownToHTML } from "@/components/admin/richtext/markdownUtils";
import { ImageUploader } from "@/components/admin/richtext/ImageUploader";

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  className
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Handle text selection
  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selected = value.substring(start, end);
      setSelectedText(selected);
      setCursorPosition(start);
    }
  };

  // Enhanced formatting function
  const handleFormat = (formatTag: string) => {
    if (formatTag === 'image') {
      const trigger = document.getElementById('enhanced-image-uploader-trigger');
      trigger?.click();
      return;
    }

    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = "";
    let cursorOffset = 0;
    
    switch (formatTag) {
      case 'bold':
        formattedText = `**${selectedText || 'Bold text'}**`;
        cursorOffset = selectedText ? formattedText.length : 2;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'Italic text'}*`;
        cursorOffset = selectedText ? formattedText.length : 1;
        break;
      case 'h1':
        formattedText = `\n# ${selectedText || 'Heading 1'}\n\n`;
        cursorOffset = selectedText ? formattedText.length : 3;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText || 'Heading 2'}\n\n`;
        cursorOffset = selectedText ? formattedText.length : 4;
        break;
      case 'h3':
        formattedText = `\n### ${selectedText || 'Heading 3'}\n\n`;
        cursorOffset = selectedText ? formattedText.length : 5;
        break;
      case 'list':
        formattedText = selectedText ? 
          `\n${selectedText.split('\n').map(line => `- ${line}`).join('\n')}\n\n` : 
          `\n- List item\n\n`;
        cursorOffset = formattedText.length;
        break;
      case 'ordered-list':
        formattedText = selectedText ? 
          `\n${selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')}\n\n` : 
          `\n1. List item\n\n`;
        cursorOffset = formattedText.length;
        break;
      case 'quote':
        formattedText = selectedText ? 
          `\n> ${selectedText.split('\n').join('\n> ')}\n\n` : 
          `\n> Blockquote\n\n`;
        cursorOffset = formattedText.length;
        break;
      case 'link':
        formattedText = `[${selectedText || 'Link text'}](https://example.com)`;
        cursorOffset = selectedText ? formattedText.length : formattedText.indexOf('https://');
        break;
      case 'line-break':
        formattedText = '\n\n';
        cursorOffset = 2;
        break;
      default:
        formattedText = selectedText;
        cursorOffset = formattedText.length;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    // Restore focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + cursorOffset;
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
    
    setTimeout(() => {
      const newCursorPos = start + imageMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // Enhanced keyboard shortcuts
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
        case 'k':
          e.preventDefault();
          handleFormat('link');
          break;
        case '1':
          e.preventDefault();
          handleFormat('h1');
          break;
        case '2':
          e.preventDefault();
          handleFormat('h2');
          break;
        case '3':
          e.preventDefault();
          handleFormat('h3');
          break;
        case 'Enter':
          e.preventDefault();
          handleFormat('line-break');
          break;
      }
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: 'bold', label: 'Bold (Ctrl+B)', shortcut: 'Ctrl+B' },
    { icon: Italic, action: 'italic', label: 'Italic (Ctrl+I)', shortcut: 'Ctrl+I' },
    { icon: Heading1, action: 'h1', label: 'Heading 1 (Ctrl+1)', shortcut: 'Ctrl+1' },
    { icon: Heading2, action: 'h2', label: 'Heading 2 (Ctrl+2)', shortcut: 'Ctrl+2' },
    { icon: Heading3, action: 'h3', label: 'Heading 3 (Ctrl+3)', shortcut: 'Ctrl+3' },
    { icon: List, action: 'list', label: 'Bullet List', shortcut: '' },
    { icon: ListOrdered, action: 'ordered-list', label: 'Numbered List', shortcut: '' },
    { icon: Quote, action: 'quote', label: 'Blockquote', shortcut: '' },
    { icon: Link, action: 'link', label: 'Link (Ctrl+K)', shortcut: 'Ctrl+K' },
    { icon: Image, action: 'image', label: 'Insert Image', shortcut: '' },
  ];

  return (
    <div className={cn("w-full", className)}>
      <Card className="border-0 shadow-lg">
        <Tabs value={isPreviewMode ? "preview" : "edit"} className="w-full">
          {/* Enhanced Toolbar */}
          <div className="border-b bg-muted/30">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-1">
                {toolbarButtons.map((button) => (
                  <Button
                    key={button.action}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormat(button.action)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                    title={button.label}
                  >
                    <button.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
              
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger 
                  value="edit" 
                  onClick={() => setIsPreviewMode(false)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  onClick={() => setIsPreviewMode(true)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <CardContent className="p-0">
            <TabsContent value="edit" className="mt-0">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onSelect={handleTextSelection}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full min-h-[500px] p-6 resize-none border-0 focus:outline-none focus:ring-0 text-sm leading-relaxed font-mono"
                  style={{ 
                    fontFamily: '"JetBrains Mono", "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace'
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="p-6 min-h-[500px] max-w-none">
                {value ? (
                  <div 
                    className="prose prose-lg max-w-none [&_img]:w-full [&_img]:max-w-none [&_img]:rounded-lg [&_img]:shadow-sm [&_img]:my-8"
                    dangerouslySetInnerHTML={renderMarkdownToHTML(value)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nothing to preview yet. Start writing to see your content rendered.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Enhanced Image Uploader */}
      <ImageUploader 
        onImageInserted={handleImageInserted} 
        triggerId="enhanced-image-uploader-trigger"
      />

      {/* Status Bar */}
      <div className="mt-2 px-3 py-2 bg-muted/30 rounded-b-lg text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>{value.length} characters</span>
          <span>{value.split(/\s+/).filter(word => word.length > 0).length} words</span>
          <span>~{Math.ceil(value.split(/\s+/).filter(word => word.length > 0).length / 200)} min read</span>
        </div>
        
        <div className="text-xs">
          {isPreviewMode ? (
            <span>Preview mode - Switch to edit to continue writing</span>
          ) : (
            <span>
              Shortcuts: <strong>Ctrl+B</strong> Bold • <strong>Ctrl+I</strong> Italic • <strong>Ctrl+K</strong> Link
            </span>
          )}
        </div>
      </div>
    </div>
  );
};