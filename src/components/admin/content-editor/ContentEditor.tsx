import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Plus, Type, Image } from 'lucide-react';
import { ContentBlock } from './ContentBlock';
import { ContentPreview } from './ContentPreview';
import { ContentBlock as ContentBlockType, convertMarkdownToBlocks, convertBlocksToMarkdown } from '@/types/content-blocks';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  placeholder = "Commencez à écrire votre article..."
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlockType[]>(() => {
    if (!value) {
      // Start with one empty text block
      return [{
        id: `block-${Date.now()}`,
        type: 'text',
        content: ''
      }];
    }
    return convertMarkdownToBlocks(value);
  });

  // Update parent when blocks change
  const updateParent = useCallback((newBlocks: ContentBlockType[]) => {
    const markdown = convertBlocksToMarkdown(newBlocks);
    onChange(markdown);
  }, [onChange]);

  const handleBlockUpdate = (blockId: string, updatedBlock: ContentBlockType) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId ? updatedBlock : block
    );
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  const handleBlockDelete = (blockId: string) => {
    if (blocks.length === 1) return; // Don't delete the last block
    const newBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  const handleAddBlockAfter = (blockId: string, type: 'text' | 'image') => {
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    const newBlock: ContentBlockType = type === 'text' 
      ? {
          id: `block-${Date.now()}`,
          type: 'text',
          content: ''
        }
      : {
          id: `block-${Date.now()}`,
          type: 'image',
          url: '',
          alt: '',
          caption: ''
        };
    
    const newBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      newBlock,
      ...blocks.slice(blockIndex + 1)
    ];
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  const handleAddInitialBlock = (type: 'text' | 'image') => {
    const newBlock: ContentBlockType = type === 'text'
      ? {
          id: `block-${Date.now()}`,
          type: 'text',
          content: ''
        }
      : {
          id: `block-${Date.now()}`,
          type: 'image',
          url: '',
          alt: '',
          caption: ''
        };
    
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          <span className="font-medium">Éditeur de contenu</span>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {isPreviewMode ? 'Éditer' : 'Aperçu'}
        </Button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {isPreviewMode ? (
          <ContentPreview blocks={blocks} />
        ) : (
          <div className="space-y-4">
            {blocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">{placeholder}</p>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAddInitialBlock('text')}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <Type className="h-4 w-4 mr-1" />
                    Ajouter un paragraphe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAddInitialBlock('image')}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <Image className="h-4 w-4 mr-1" />
                    Ajouter une image
                  </Button>
                </div>
              </div>
            )}
            
            {blocks.map((block, index) => (
              <ContentBlock
                key={block.id}
                block={block}
                onUpdate={(updatedBlock) => handleBlockUpdate(block.id, updatedBlock)}
                onDelete={() => handleBlockDelete(block.id)}
                onAddBlockAfter={(type) => handleAddBlockAfter(block.id, type)}
                isLast={index === blocks.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
        {blocks.length} bloc{blocks.length > 1 ? 's' : ''} • 
        Mode {isPreviewMode ? 'aperçu' : 'édition'}
      </div>
    </div>
  );
};