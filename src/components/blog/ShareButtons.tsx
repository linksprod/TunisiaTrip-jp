import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { TranslateText } from '@/components/translation/TranslateText';
import { BlogArticle } from '@/types/blog';
import { getCurrentProductionUrl } from '@/utils/urlUtils';

interface ShareButtonsProps {
  article: BlogArticle;
  currentLanguage: string;
}

export function ShareButtons({ article, currentLanguage }: ShareButtonsProps) {
  const { toast } = useToast();
  const productionUrl = getCurrentProductionUrl();

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || '',
          url: productionUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productionUrl);
    toast({
      title: currentLanguage === 'JP' ? 'リンクがコピーされました' : 'Link copied',
      description: currentLanguage === 'JP' ? 'URLがクリップボードにコピーされました' : 'URL copied to clipboard',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">
        <TranslateText text="Share this article" language={currentLanguage} />
      </h3>
      
      <Button 
        variant="default"
        size="sm"
        onClick={handleNativeShare} 
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        <TranslateText text="Share Article" language={currentLanguage} />
      </Button>
    </div>
  );
}