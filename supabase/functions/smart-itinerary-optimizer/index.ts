import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TripData {
  selectedActivities: any[];
  selectedHotels: any[];
  selectedGuestHouses: any[];
  selectedAirports: any[];
  arrivalAirportId?: string;
  departureAirportId?: string;
  days: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const tripData: TripData = await req.json();
    console.log('📊 Trip data received:', {
      activities: tripData.selectedActivities.length,
      hotels: tripData.selectedHotels.length,
      guestHouses: tripData.selectedGuestHouses.length,
      airports: tripData.selectedAirports.length,
      days: tripData.days
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Préparer le contexte pour OpenAI
    const activitiesContext = tripData.selectedActivities.map(a => ({
      id: a.id,
      name: a.title || a.name,
      location: a.location,
      region: a.region || determineRegion(a.latitude, a.longitude),
      latitude: a.latitude,
      longitude: a.longitude,
      category: a.category
    }));

    const accommodationsContext = [...tripData.selectedHotels, ...tripData.selectedGuestHouses].map(acc => ({
      id: acc.id,
      name: acc.name,
      location: acc.location,
      region: acc.region || determineRegion(acc.latitude, acc.longitude),
      latitude: acc.latitude,
      longitude: acc.longitude,
      type: acc.style ? 'hotel' : 'guesthouse'
    }));

    const arrivalAirport = tripData.selectedAirports.find(a => a.id === tripData.arrivalAirportId) || 
                          tripData.selectedAirports.find(a => a.name?.includes('Tunis')) ||
                          tripData.selectedAirports[0];

    const prompt = `Tu es un expert en voyages en Tunisie. Crée un programme cohérent et logique pour un voyage de ${tripData.days} jours.

DONNÉES DU VOYAGE:
Aéroport d'arrivée: ${arrivalAirport?.name} (${arrivalAirport?.location})
Activités sélectionnées: ${JSON.stringify(activitiesContext, null, 2)}
Hébergements disponibles: ${JSON.stringify(accommodationsContext, null, 2)}

CONTRAINTES IMPORTANTES:
1. Maximum 6 heures de route par jour
2. Grouper les activités par région pour minimiser les déplacements
3. Si ${tripData.days} jours ne suffisent pas pour ${activitiesContext.length} activités, suggérer plus de jours
4. Utiliser le nom des activités principales dans les titres des jours

RÈGLES DE COHÉRENCE OBLIGATOIRES:
1. JOUR 1: Arrivée à ${arrivalAirport?.location} → Hébergement dans la même région/ville
2. Respecter l'ordre logique: Nord → Centre → Sud (ou inverse selon l'itinéraire)
3. Changer d'hébergement seulement si les activités sont dans une région différente
4. DERNIER JOUR: Retour vers l'aéroport de départ

RÉGIONS TUNISIENNES et DISTANCES:
- Nord: Tunis, Carthage, Sidi Bou Said, Bizerte, Tabarka (250km max entre points)
- Centre: Kairouan, Sousse, Monastir, Mahdia, El Jem, Sfax (180km max entre points)  
- Sud: Tozeur, Douz, Tataouine, Matmata, Sahara (300km max entre points)
- Distance Nord-Centre: ~200km (3-4h route)
- Distance Centre-Sud: ~250km (4-5h route)
- Distance Nord-Sud: ~450km (6-7h route - À ÉVITER en une journée)

CALCUL DU NOMBRE DE JOURS OPTIMAL:
- 1-2 activités par jour maximum selon les distances
- Si plus de ${tripData.days * 2} activités, recommander ${Math.ceil(activitiesContext.length / 2)} jours

Réponds UNIQUEMENT avec un JSON structuré comme suit:
{
  "recommendedDays": ${Math.max(tripData.days, Math.ceil(activitiesContext.length / 2))},
  "itinerary": [
    {
      "day": 1,
      "title": "Arrivée à Tunis",
      "region": "nord",
      "accommodation": {
        "id": "hotel_id",
        "name": "nom_hotel",
        "justification": "Proche de l'aéroport d'arrivée"
      },
      "activities": [
        {
          "id": "activity_id",
          "name": "nom_activité",
          "time": "14:00",
          "justification": "Première activité après arrivée"
        }
      ],
      "totalTravelTime": "2h",
      "maxDistance": "50km"
    }
  ],
  "coherence": {
    "geographical": "Explication de l'optimisation géographique",
    "logical": "Justification de l'ordre des activités", 
    "practical": "Considérations pratiques (temps de transport, etc.)",
    "timeOptimization": "Respect de la limite de 6h de route par jour"
  }
}`;

    console.log('🤖 Calling OpenAI for itinerary optimization...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en planification de voyages en Tunisie. Tu optimises les itinéraires pour la cohérence géographique et logique. Réponds TOUJOURS avec un JSON valide et complet.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Vérifier que le contenu n'est pas vide
    if (!content || content.trim() === '') {
      throw new Error('OpenAI returned empty response');
    }
    
    console.log('📝 OpenAI response content:', content);
    
    let optimizedItinerary;
    try {
      optimizedItinerary = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      console.error('📝 Raw content:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    console.log('✅ Optimized itinerary generated successfully');
    
    return new Response(JSON.stringify(optimizedItinerary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in smart-itinerary-optimizer:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to optimize itinerary with AI'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Fonction utilitaire pour déterminer la région
function determineRegion(lat: number, lng: number): string {
  if (!lat || !lng) return 'centre';
  
  // Nord de la Tunisie (au-dessus de 36°N)
  if (lat > 36.0) return 'nord';
  
  // Sud de la Tunisie (en dessous de 34°N)
  if (lat < 34.0) return 'sud';
  
  // Centre (entre 34°N et 36°N)
  return 'centre';
}