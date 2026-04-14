
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link, Image as ImageIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EditorToolbarProps {
  onFormatClick: (format: string) => void;
  onPreviewToggle: () => void;
  isPreviewMode: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  onFormatClick, 
  onPreviewToggle,
  isPreviewMode 
}) => {
  // Simplified toolbar with essential formatting options
  return (
    <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-1">
      <div className="flex flex-wrap gap-1">
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('bold')}
          className="h-8 px-2 py-1"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('italic')}
          className="h-8 px-2 py-1"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('underline')}
          className="h-8 px-2 py-1"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <div className="flex flex-wrap gap-1">
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('h1')}
          className="h-8 px-2 py-1"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('h2')}
          className="h-8 px-2 py-1"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('h3')}
          className="h-8 px-2 py-1"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <div className="flex flex-wrap gap-1">
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('list')}
          className="h-8 px-2 py-1"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('ordered-list')}
          className="h-8 px-2 py-1"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <div className="flex flex-wrap gap-1">
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('quote')}
          className="h-8 px-2 py-1"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('link')}
          className="h-8 px-2 py-1"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={() => onFormatClick('image')}
          className="h-8 px-2 py-1"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-grow"></div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPreviewToggle}
        className="ml-auto h-8"
      >
        {isPreviewMode ? 'Edit' : 'Preview'}
      </Button>
    </div>
  );
};

export default EditorToolbar;
