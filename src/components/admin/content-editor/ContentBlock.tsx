import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image, Type, Trash2, GripVertical } from 'lucide-react';
import { ContentBlock as ContentBlockType } from '@/types/content-blocks';
import { ImageUploader } from '../richtext/ImageUploader';

interface ContentBlockProps {
  block: ContentBlockType;
  onUpdate: (block: ContentBlockType) => void;
  onDelete: () => void;
  onAddBlockAfter: (type: 'text' | 'image') => void;
  isLast: boolean;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onAddBlockAfter,
  isLast
}) => {
  const handleTextChange = (content: string) => {
    if (block.type === 'text') {
      onUpdate({ ...block, content });
    }
  };

  const handleImageUpdate = (field: string, value: string) => {
    if (block.type === 'image') {
      onUpdate({ ...block, [field]: value });
    }
  };

  const handleImageInserted = (imageUrl: string) => {
    if (block.type === 'image') {
      onUpdate({ ...block, url: imageUrl });
    }
  };

  return (
    <div className="group relative border border-border rounded-lg p-4 mb-4 bg-card">
      {/* Drag handle */}
      <div className="absolute left-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      </div>

      {/* Delete button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="ml-8 mr-8">
        {block.type === 'text' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Type className="h-4 w-4" />
              Paragraphe de texte
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Tapez votre texte ici... (Markdown supporté: **gras**, *italique*, etc.)"
              className="min-h-[120px] font-mono text-sm"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Image className="h-4 w-4" />
              Image
            </div>
            
            {block.url ? (
              <div className="space-y-2">
                <img
                  src={block.url}
                  alt={block.alt}
                  className="max-w-full h-auto rounded-lg shadow-sm border"
                />
                <Input
                  value={block.alt}
                  onChange={(e) => handleImageUpdate('alt', e.target.value)}
                  placeholder="Texte alternatif de l'image"
                />
                <Input
                  value={block.caption || ''}
                  onChange={(e) => handleImageUpdate('caption', e.target.value)}
                  placeholder="Légende (optionnel)"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Cliquez pour ajouter une image</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('#image-uploader-trigger-' + block.id) as HTMLButtonElement;
                    input?.click();
                  }}
                  className="mb-4"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Choisir une image
                </Button>
                <div className="hidden">
                  <ImageUploader 
                    onImageInserted={handleImageInserted} 
                    triggerId={`image-uploader-trigger-${block.id}`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Final add buttons if this is the last block */}
      {isLast && (
        <div className="flex justify-center gap-2 mt-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlockAfter('text')}
          >
            <Plus className="h-4 w-4 mr-1" />
            <Type className="h-4 w-4 mr-1" />
            Ajouter un paragraphe
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlockAfter('image')}
          >
            <Plus className="h-4 w-4 mr-1" />
            <Image className="h-4 w-4 mr-1" />
            Ajouter une image
          </Button>
        </div>
      )}
    </div>
  );
};