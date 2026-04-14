
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, PenLine } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface AIRewritingToolProps {
  onRewrittenContent: (rewrittenContent: string) => void;
}

export const AIRewritingTool: React.FC<AIRewritingToolProps> = ({ onRewrittenContent }) => {
  const [isRewriting, setIsRewriting] = useState(false);
  const [textToRewrite, setTextToRewrite] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  const handleRewriteWithAI = async () => {
    if (!textToRewrite.trim()) {
      toast({
        title: "No content to rewrite",
        description: "Please add some content before using the AI rewriting tool.",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);

    try {
      console.log("Sending content for rewriting:", textToRewrite.substring(0, 100) + "...");
      
      // Call the rewrite-content edge function
      const { data, error } = await supabase.functions.invoke('rewrite-content', {
        body: { content: textToRewrite }
      });

      if (error) {
        console.error("Error from edge function:", error);
        throw new Error(`Failed to rewrite content: ${error.message}`);
      }

      console.log("Response from edge function:", data);
      
      // Check if we have the rewrittenContent in the response
      if (data && data.rewrittenContent) {
        console.log("Received rewritten content:", data.rewrittenContent.substring(0, 100) + "...");
        
        // Pass the rewritten content to the parent component
        onRewrittenContent(data.rewrittenContent);
        
        // Clear the textarea
        setTextToRewrite('');
        
        // Collapse the section
        setIsExpanded(false);
        
        toast({
          title: "Content rewritten successfully",
          description: "The AI has created a new version of your content.",
        });
      } else {
        console.error("No rewritten content received in response:", data);
        throw new Error('No rewritten content received from the AI service');
      }
    } catch (error: any) {
      console.error('Error rewriting with AI:', error);
      toast({
        title: "Rewriting failed",
        description: error.message || "There was a problem connecting to the AI service. Please ensure your OpenAI API key is configured in Supabase Edge Function Secrets.",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="w-full mb-4">
      <Button 
        variant="outline"
        className="flex items-center gap-2 mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <PenLine className="h-4 w-4 text-blue-500" />
        <span>{isExpanded ? "Hide Rewriting Tool" : "Rewrite with AI"}</span>
      </Button>
      
      {isExpanded && (
        <Card className="p-4 border-blue-200 mb-4 bg-blue-50/50">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Paste your text below and the AI will rewrite it while preserving the core meaning.
              Useful for improving clarity, tone, or style of your content.
            </p>
            
            <Textarea
              value={textToRewrite}
              onChange={(e) => setTextToRewrite(e.target.value)}
              placeholder="Paste the content you want to rewrite here..."
              className="min-h-[200px] bg-white border-blue-200"
            />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsExpanded(false);
                  setTextToRewrite('');
                }}
                disabled={isRewriting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRewriteWithAI}
                disabled={isRewriting || !textToRewrite.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRewriting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Rewriting...</span>
                  </>
                ) : (
                  <>
                    <PenLine className="h-4 w-4 mr-2" />
                    <span>Rewrite Content</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
