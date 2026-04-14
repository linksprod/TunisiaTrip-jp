import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ItineraryEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itinerary: {
    day: number;
    activities: Array<{
      name: string;
      location: string;
      description?: string;
    }>;
    accommodation?: {
      name: string;
      location: string;
      type: 'hotel' | 'guesthouse';
    };
    description?: string;
  }[];
  totalDays: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      itinerary, 
      totalDays 
    }: ItineraryEmailRequest = await req.json();

    // Generate HTML content for the itinerary
    const itineraryHtml = itinerary.map(day => `
      <div style="margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 18px;">Jour ${day.day}</h3>
        ${day.description ? `<p style="margin-bottom: 15px; font-style: italic; color: #666;">${day.description}</p>` : ''}
        
        <h4 style="color: #059669; margin-bottom: 10px;">Activités:</h4>
        <ul style="margin-bottom: 15px;">
          ${day.activities.map(activity => `
            <li style="margin-bottom: 8px;">
              <strong>${activity.name}</strong> - ${activity.location}
              ${activity.description ? `<br><em style="color: #666; font-size: 14px;">${activity.description}</em>` : ''}
            </li>
          `).join('')}
        </ul>
        
        ${day.accommodation ? `
          <h4 style="color: #dc2626; margin-bottom: 10px;">Hébergement:</h4>
          <p><strong>${day.accommodation.name}</strong> (${day.accommodation.type}) - ${day.accommodation.location}</p>
        ` : ''}
      </div>
    `).join('');

    // Send email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Atlantis Tunisia <noreply@atlantis.tn>",
      to: [customerEmail],
      subject: `Votre itinéraire personnalisé en Tunisie - ${totalDays} jours`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">
            Votre Itinéraire Personnalisé en Tunisie
          </h1>
          
          <p style="margin-bottom: 20px;">Cher/Chère ${customerName},</p>
          
          <p style="margin-bottom: 20px;">
            Merci pour votre intérêt pour nos services ! Voici votre itinéraire personnalisé pour 
            votre voyage de ${totalDays} jours en Tunisie.
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            ${itineraryHtml}
          </div>
          
          <p style="margin-bottom: 20px;">
            Notre équipe va examiner votre demande et vous contacter dans les plus brefs délais 
            pour finaliser les détails de votre voyage.
          </p>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2563eb; margin-bottom: 15px;">Prochaines étapes:</h3>
            <ul>
              <li>Notre équipe va analyser votre itinéraire</li>
              <li>Nous vous contacterons sous 24h pour discuter des détails</li>
              <li>Nous ajusterons l'itinéraire selon vos préférences</li>
              <li>Nous vous fournirons un devis personnalisé</li>
            </ul>
          </div>
          
          <p style="margin-bottom: 20px;">
            Si vous avez des questions, n'hésitez pas à nous contacter.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin-bottom: 10px;"><strong>Atlantis Tunisia</strong></p>
            <p style="color: #666; margin-bottom: 5px;">Email: atlantis@atlantis.tn</p>
            <p style="color: #666;">Votre partenaire pour découvrir la Tunisie</p>
          </div>
        </div>
      `,
    });

    // Send notification email to Atlantis
    const atlantisEmailResponse = await resend.emails.send({
      from: "Système Atlantis <noreply@atlantis.tn>",
      to: ["atlantis@atlantis.tn"],
      subject: `Nouvelle demande d'itinéraire - ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; margin-bottom: 30px;">Nouvelle Demande d'Itinéraire</h1>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #dc2626; margin-bottom: 15px;">Informations Client:</h3>
            <p><strong>Nom:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Téléphone:</strong> ${customerPhone}</p>
            <p><strong>Durée du voyage:</strong> ${totalDays} jours</p>
          </div>
          
          <h2 style="color: #2563eb; margin-bottom: 20px;">Itinéraire Demandé:</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
            ${itineraryHtml}
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #fffbeb; border-radius: 8px;">
            <h3 style="color: #d97706; margin-bottom: 15px;">Actions requises:</h3>
            <ul>
              <li>Contacter le client dans les 24h</li>
              <li>Préparer un devis personnalisé</li>
              <li>Vérifier la disponibilité des hébergements</li>
              <li>Confirmer les activités et horaires</li>
            </ul>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { customerEmailResponse, atlantisEmailResponse });

    return new Response(JSON.stringify({ 
      success: true,
      customerEmailId: customerEmailResponse.data?.id,
      atlantisEmailId: atlantisEmailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-itinerary-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);