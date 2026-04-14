import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TripPDFGenerator } from '@/utils/pdfGenerator';
import { EnhancedDayItinerary } from '@/components/travel/itinerary/enhancedTypes';

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (itinerary: EnhancedDayItinerary[], title: string = "Mon Voyage en Tunisie") => {
    if (!itinerary || itinerary.length === 0) {
      toast.error('Aucun itinéraire à exporter');
      return;
    }

    setIsGenerating(true);
    
    try {
      toast.info('Génération du PDF en cours...');
      
      // Try client-side generation first (faster)
      const pdfGenerator = new TripPDFGenerator();
      const pdfBlob = await pdfGenerator.generatePDF(itinerary, title);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success('PDF généré avec succès !');
    } catch (error) {
      console.error('Client-side PDF generation failed, trying server-side:', error);
      
      try {
        // Fallback to server-side generation
        const { data, error: serverError } = await supabase.functions.invoke('generate-trip-pdf', {
          body: { itinerary, title }
        });
        
        if (serverError) throw serverError;
        
        // Handle server response (should be a blob)
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
        link.click();
        
        URL.revokeObjectURL(url);
        toast.success('PDF généré avec succès !');
      } catch (serverError) {
        console.error('Server-side PDF generation failed:', serverError);
        toast.error('Erreur lors de la génération du PDF');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating
  };
};