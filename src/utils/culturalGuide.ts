
interface CulturalTip {
  tip: string;
  category: 'etiquette' | 'customs' | 'language' | 'food';
  importance: 'high' | 'medium' | 'low';
}

interface PracticalInfo {
  currency: string;
  tipping: string[];
  usefulPhrases: { english: string; arabic: string }[];
  emergency: string[];
  dressCode: string[];
}

const CULTURAL_TIPS: Record<string, CulturalTip[]> = {
  north: [
    { tip: "Respectez les codes vestimentaires dans les mosquées", category: 'etiquette', importance: 'high' },
    { tip: "Marchandage attendu dans les souks", category: 'customs', importance: 'medium' },
    { tip: "Salutation traditionnelle : 'As-salamu alaykum'", category: 'language', importance: 'medium' },
    { tip: "Goûtez le thé à la menthe, boisson nationale", category: 'food', importance: 'low' }
  ],
  center: [
    { tip: "Enlevez vos chaussures en entrant dans les maisons", category: 'etiquette', importance: 'high' },
    { tip: "Respectez les horaires de prière", category: 'customs', importance: 'high' },
    { tip: "Apprenez quelques mots d'arabe de base", category: 'language', importance: 'medium' },
    { tip: "Essayez le couscous, plat national du vendredi", category: 'food', importance: 'low' }
  ],
  south: [
    { tip: "Protégez-vous du soleil dans le désert", category: 'etiquette', importance: 'high' },
    { tip: "Respectez les traditions bédouines", category: 'customs', importance: 'high' },
    { tip: "Les bergers parlent souvent français", category: 'language', importance: 'medium' },
    { tip: "Dégustez les dattes fraîches des oasis", category: 'food', importance: 'low' }
  ]
};

const PRACTICAL_INFO: PracticalInfo = {
  currency: "The official currency is the Tunisian Dinar (TND). It's a closed currency, so you can only exchange money inside Tunisia.",
  tipping: [
    "Restaurants: 10-15% if service charge not included",
    "Hotels: 1-2 TND per night for housekeeping",
    "Taxis: Round up to nearest dinar",
    "Tour guides: 5-10 TND per day",
    "Hammam attendants: 2-5 TND"
  ],
  usefulPhrases: [
    { english: "Hello", arabic: "Ahlan / Marhaba" },
    { english: "Thank you", arabic: "Shukran" },
    { english: "Please", arabic: "Min fadlik" },
    { english: "Excuse me", arabic: "Ismahli" },
    { english: "How much?", arabic: "Qaddesh?" },
    { english: "I don't understand", arabic: "Ma nifhimsh" }
  ],
  emergency: [
    "Police: 197",
    "Ambulance: 190",
    "Fire Department: 198",
    "Tourist Police: +216 71 341 077"
  ],
  dressCode: [
    "Dress modestly when visiting religious sites",
    "Cover shoulders and knees in mosques",
    "Women should bring a scarf for mosque visits",
    "Beach attire is acceptable only at beaches and pools"
  ]
};

export function getCulturalTips(region: string = 'center'): CulturalTip[] {
  return CULTURAL_TIPS[region] || CULTURAL_TIPS.center;
}

export function getPracticalInfo(): PracticalInfo {
  return PRACTICAL_INFO;
}
