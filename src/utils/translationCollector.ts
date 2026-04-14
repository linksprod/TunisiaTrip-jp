
import fs from 'fs';
import path from 'path';

// Collection de tous les textes à traduire
const textsToTranslate = [
  // Navigation
  "Home",
  "About Tunisia",
  "Travel Information",
  "Blog",
  "Contact",
  "Atlantis",
  "Learn about Tunisia",
  
  // Common texts
  "Learn more",
  "View highlights",
  "Full day experience",
  "Next",
  "Previous",
  "Contact Us",
  "Find More Articles",
  
  // Blog related
  "Latest Articles",
  "Read More",
  "Popular Posts",
  "Categories",
  "Travel Tips",
  "Culture",
  "Destinations",
  "Share this article",
  
  // Weather related
  "Weather",
  "Weather Information",
  "Weather by Region",
  "Summer",
  "Winter",
  "Annual Rainfall",
  "Best time to visit",
  "Summer Temperatures",
  "Winter Temperatures",
  "5-Day Forecast",
  "Today's Weather",
  "Tunisian Weather",
  "Tunisia's Climate Overview",
  
  // Atlantis specific
  "Welcome to Atlantis",
  "Book Your Trip",
  "About Us",
  "Our Services",
  "Message from CEO",
  "Team Members",
  "Our Partners",
  "Contact & Inquiry",
  "Enriching The Quality Of Your Trips Through Our Services And Guidance",
  "Atlantis Agency",
  "Representative & CEO",
  "Learn More About Atlantis Services",
  "Experience Authentic Tunisian Hospitality in Handpicked Guesthouses",
  "Select Guest Houses in Tunisia's Historic Districts",
  "Guest Houses & Riads",
  
  // Travel related
  "Mediterranean",
  "Best time: Apr-Jun, Sep-Nov",
  "Bestselling Tour",
  "8-Day Atlantis Tour Itinerary",
  "Discover the wonders of Tunisia through our 8-day journey",
  "Learn more about lifestyle in Tunisia",
  "Top Attractions",
  "FAQ",
  "Frequently Asked Questions about Atlantis Voyages",
  
  // Cities and Regions
  "Tunis",
  "Bizerte",
  "Kairouan",
  "Tozeur",
  "Sousse",
  "Djerba",
  "North",
  "Center",
  "South",
  "East Coast",
  "Island",
  "Capital",
  "Region",
  
  // Festivals
  "Winter Festival",
  "JCC Carthage Film Festival",
  "Douz Sahara International Festival",
  "Tozeur International Oasis Festival",
  "Festivals",
  "Winter Festivals in Tunisia",
  
  // Homepage elements
  "Discover Tunisia",
  "Plan your trip",
  "Weather overview",
  "Popular destinations",
  "Subscribe to our newsletter",
  "Stay updated with our latest offers",
  
  // About Tunisia content
  "Culture and Traditions",
  "Geography",
  "History",
  "Language",
  "Religion",
  "Economy",
  "Education",
  "Healthcare"
];

interface TranslationResult {
  [key: string]: string;
}

export async function generateTranslations() {
  const translations: TranslationResult = {};
  
  console.log("Création des traductions...");
  
  // Ensure the directories exist
  const dirPath = path.join('src', 'translations', 'japanese');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  for (const text of textsToTranslate) {
    // Pour cet exemple, nous allons simplement ajouter "JP: " devant chaque texte
    // Dans une vraie implémentation, vous utiliseriez un service de traduction
    translations[text] = `JP: ${text}`;
    console.log(`Traduit: ${text} -> JP: ${text}`);
  }
  
  // Create translation files with categorized content
  const categorizedTranslations = {
    common: {},
    navigation: {},
    blog: {},
    weather: {},
    atlantis: {},
    travel: {}
  };
  
  // Organize translations into categories
  for (const [key, value] of Object.entries(translations)) {
    if (key.toLowerCase().includes("weather") || key.includes("temperature") || key.includes("rainfall") || key.includes("forecast") || key.includes("climate")) {
      categorizedTranslations.weather[key] = value;
    } else if (key.toLowerCase().includes("blog") || key.includes("articles") || key.includes("posts") || key.includes("share")) {
      categorizedTranslations.blog[key] = value;
    } else if (key.toLowerCase().includes("atlantis") || key.includes("services") || key.includes("team") || key.includes("ceo") || key.includes("guest")) {
      categorizedTranslations.atlantis[key] = value;
    } else if (key.toLowerCase().includes("travel") || key.includes("tour") || key.includes("trip") || key.includes("attractions") || key.includes("festival") || key.includes("mediterranean")) {
      categorizedTranslations.travel[key] = value;
    } else if (key.toLowerCase().includes("home") || key.includes("about") || key.includes("contact") || key.includes("tunisia")) {
      categorizedTranslations.navigation[key] = value;
    } else {
      categorizedTranslations.common[key] = value;
    }
  }
  
  // Generate translation files
  for (const category in categorizedTranslations) {
    const content = `export const ${category}Translations = ${JSON.stringify(categorizedTranslations[category as keyof typeof categorizedTranslations], null, 2)};`;
    const filePath = path.join(dirPath, `${category}.ts`);
    fs.writeFileSync(filePath, content);
    console.log(`Fichier de traduction créé: ${filePath}`);
  }
}
