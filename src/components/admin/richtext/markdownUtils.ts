
/**
 * Converts markdown text to HTML for the preview mode with improved paragraph and spacing handling
 */
export const renderMarkdownToHTML = (markdown: string): { __html: string } => {
  if (!markdown) return { __html: '' };
  
  // Basic markdown to HTML conversion with enhanced formatting
  let html = markdown;
  
  // Convert headings with proper spacing
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
  html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Convert quotes with better formatting
  html = html.replace(/^\> (.*$)/gm, '<blockquote><p>$1</p></blockquote>');
  
  // Convert links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Convert images with responsive styling and proper classes
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" class="editor-image max-w-full h-auto rounded-lg shadow-sm my-4 mx-auto block" loading="lazy">');
  
  // Convert unordered lists
  html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
  
  // Convert ordered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  
  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
    return `<ul>${match}</ul>`;
  });
  
  // Handle horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');
  
  // IMPROVED paragraph handling - preserve spacing and line breaks
  // First, normalize line endings
  html = html.replace(/\r\n/g, '\n');
  
  // Split content by double line breaks to identify paragraphs
  const sections = html.split(/\n\s*\n/);
  
  html = sections.map(section => {
    const trimmed = section.trim();
    if (!trimmed) return '';
    
    // Skip if already contains block elements
    if (trimmed.match(/<(h[1-6]|ul|ol|li|blockquote|img|div|hr)/)) {
      return trimmed;
    }
    
    // Convert single line breaks within sections to <br> tags for better spacing
    const withBreaks = trimmed.replace(/\n/g, '<br>');
    
    // Wrap text content in paragraph tags
    return `<p>${withBreaks}</p>`;
  }).filter(p => p).join('\n\n');
  
  // Additional processing for standalone line breaks (double enter for explicit breaks)
  html = html.replace(/\n\n/g, '<br><br>');
  
  return { __html: html };
};

/**
 * Formats selected text with the specified formatting tag
 */
export const formatSelectedText = (
  formatTag: string,
  selectedText: string,
): string => {
  switch (formatTag) {
    case 'bold':
      return `**${selectedText || 'Bold text'}**`;
    case 'italic':
      return `*${selectedText || 'Italic text'}*`;
    case 'underline':
      return `<u>${selectedText || 'Underlined text'}</u>`;
    case 'h1':
      return `\n# ${selectedText || 'Heading 1'}\n\n`;
    case 'h2':
      return `\n## ${selectedText || 'Heading 2'}\n\n`;
    case 'h3':
      return `\n### ${selectedText || 'Heading 3'}\n\n`;
    case 'list':
      return selectedText ? 
        `\n- ${selectedText.split('\n').join('\n- ')}\n\n` : 
        `\n- List item\n\n`;
    case 'ordered-list':
      return selectedText ? 
        `\n1. ${selectedText.split('\n').join('\n1. ')}\n\n` : 
        `\n1. List item\n\n`;
    case 'center':
      return `\n<div style="text-align: center;">${selectedText || 'Centered text'}</div>\n\n`;
    case 'right':
      return `\n<div style="text-align: right;">${selectedText || 'Right-aligned text'}</div>\n\n`;
    case 'quote':
      return selectedText ? 
        `\n> ${selectedText.split('\n').join('\n> ')}\n\n` : 
        `\n> Blockquote\n\n`;
    case 'link':
      return `[${selectedText || 'Link text'}](https://example.com)`;
    case 'image':
      // This will be handled by the ImageUploader component
      return selectedText;
    case 'line-break':
      return '\n\n';
    case 'horizontal-rule':
      return '\n\n---\n\n';
    default:
      return selectedText;
  }
}
