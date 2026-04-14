
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    message: string, 
    conversationHistory: ChatMessage[], 
    language: string
  ): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('Sending message to Tunisia Trip expert chat-assistant:', message);
      
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message,
          conversationHistory,
          language
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get response from Tunisia Trip expert');
      }

      if (!data?.success) {
        console.error('AI response error:', data?.error);
        throw new Error(data?.error || 'Tunisia Trip expert service error');
      }

      console.log('Received Tunisia Trip expert response:', data.message);
      return data.message;

    } catch (error) {
      console.error('Tunisia Trip expert chat error:', error);
      
      // Enhanced fallback responses with emojis and HTML formatting
      const fallbackMessage = language === 'JP' 
        ? "申し訳ございませんが、現在AIサービスに接続できません 😅 でも心配しないでください！チュニジアについて何でも聞いてください。<b>美しいサハラ砂漠</b> 🐪、<b>地中海のビーチ</b> 🏖️、<b>歴史的な遺跡</b> 🏛️ など、お手伝いできます！ 🌟"
        : "I apologize, but I'm currently unable to connect to the Tunisia Trip expert service 😅 But don't worry! I'm still here to help with your <b>Tunisia adventure</b>! Ask me about our <b>amazing desert tours</b> 🐪, <b>beautiful beaches</b> 🏖️, or <b>historic sites</b> 🏛️! 🌟";
      
      toast.error(language === 'JP' 
        ? "一時的な接続問題です 😅 もう一度お試しください" 
        : "Temporary connection issue 😅 Please try again"
      );
      
      return fallbackMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};
