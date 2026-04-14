
import fs from 'fs';
import path from 'path';

// Function to ensure a directory exists
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Define categories and their texts
const translationCategories = {
  common: [
    "Learn more", "View highlights", "Full day experience", "Next", "Previous", "Contact Us", 
    "Find More Articles", "Translation Settings", "Cancel", "Reset API Key", "Translating...",
    "Select Language", "Switching language..."
    // ...more common texts
  ],
  
  navigation: [
    "Home", "About Tunisia", "Travel Information", "Blog", "Contact", "Atlantis", 
    "Learn about Tunisia", "Company Information", "Plan Your Trip", "Favorites"
    // ...more navigation texts
  ],
  
  blog: [
    "Latest Articles", "Read More", "Popular Posts", "Categories", "Travel Tips", 
    "Culture", "Destinations", "Share this article", "Travel Blog", "Discover Tunisia Through Our Stories"
    // ...more blog texts
  ],
  
  weather: [
    "Weather", "Weather Information", "Weather by Region", "Summer", "Winter", 
    "Annual Rainfall", "Best time to visit", "Summer Temperatures", "Winter Temperatures", 
    "5-Day Forecast", "Today's Weather", "Tunisian Weather", "Tunisia's Climate Overview"
    // ...more weather texts
  ],
  
  atlantis: [
    "Welcome to Atlantis", "Book Your Trip", "About Us", "Our Services", "Message from CEO", 
    "Team Members", "Our Partners", "Contact & Inquiry", "Enriching The Quality Of Your Trips Through Our Services And Guidance", 
    "Atlantis Agency", "Representative & CEO", "Learn More About Atlantis Services"
    // ...more atlantis texts
  ],
  
  travel: [
    "Mediterranean", "Best time: Apr-Jun, Sep-Nov", "Bestselling Tour", 
    "Learn more about lifestyle in Tunisia", "Top Attractions", "FAQ", 
    "Frequently Asked Questions about Atlantis Voyages", "Transportation in Tunisia"
    // ...more travel texts
  ],
  
  heroSection: [
    "Home Page", "Sahara Expedition: Star Wars Sites, Luxury Stay & Desert Adventure", 
    "Tunisian Desert", "Desert Adventure", "Experience the magic of the Sahara with traditional camel caravans", 
    "Explore More", "Your trusted travel partner in Tunisia since 1991", "Travel Tunisia", 
    "Unforgettable Experiences Await", "Plan your dream trip with Atlantis"
    // ...more hero section texts
  ],
  
  servicesSection: [
    "Hotels", "Flights", "Activities", "Car Services", "Cruises", "Museums",
    "Hotel", "Flight", "Activity", "Car Service", "Cruise", "Museum"
    // ...more services texts
  ],
  
  featuresSection: [
    "El Medina District", "Immerse yourself in the historical atmosphere", 
    "What's Waiting for You", "Cuisine", "Tunisian Food", "Tunisian cuisine is a mix", 
    "Sidi Bou Said", "Cultural Heritage", "Explore the colorful streets", 
    "El Jem Amphitheatre", "Historical Treasures"
    // ...more features texts
  ],
  
  statisticsSection: [
    "General Knowledge", "Learn About Tunisia in Numbers", "Discover Tunisia", 
    "Explore Tunisia's Beauty and Magic", "Population", "Tourists in 2024", 
    "Historic Sites", "University in History", "UNESCO Recognized", "Land Area"
    // ...more statistics texts
  ],
  
  videoSection: [
    "Video Summary", 
    "Tunisia is a one-of-a-kind country where each region tells its own story"
    // ...more video texts
  ],
  
  testimonialsSection: [
    "Testimonials", "What people are saying about their Tunisia trip with Atlantis", 
    "South Korean", "Ji-Won Park", "I felt so safe traveling alone here!", 
    "Japanese", "Takashi Ito", "The best history lesson I've ever had"
    // ...more testimonials texts
  ],
  
  contactSection: [
    "Do you have any more questions that weren't answered in this video?",
    "Don't hesitate to ask!", "Email Address", "Have a question about Tunisia?", "Submit"
    // ...more contact texts
  ],
  
  travelInfo: [
    "Atlantis Itinerary & Tours", "Pre-Departure Must Know", "Activities in Tunisia",
    "8-Day Atlantis Tour Itinerary", "Discover the wonders of Tunisia through our 8-day journey",
    "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8"
    // ...more tour info texts
  ],
  
  tipsSection: [
    "Tips Before Trips", "Check out our frequently asked questions to help you prepare for your trip.",
    "Or ask directly", "Travel", "Museum Visits on Weekends", "FAQ",
    "Essential Pre-Departure Information", "Passport & Visa"
    // ...more tips texts
  ],
  
  aboutPage: [
    "A Land of History and Culture", "Ancient Wonders", "Explore Tunisia's Historical Sites",
    "Tunisia's Official Name", "Tunis: The Capital of Tunisia", "Population Compared to Area",
    "Roman Heritage", "History", "Cultural Heritage"
    // ...more about page texts
  ]
};

export async function generateTranslations() {
  console.log("Creating translations...");
  
  // Ensure the directories exist
  const dirPath = path.join('src', 'translations', 'japanese');
  ensureDirectoryExists(dirPath);
  
  // Generate translation files for each category
  for (const [category, texts] of Object.entries(translationCategories)) {
    // Create an object to hold translations for this category
    const translations: Record<string, string> = {};
    
    // For each text in this category, add a placeholder translation
    // In a real implementation, you would use a translation service here
    for (const text of texts) {
      translations[text] = `JP: ${text}`;
      console.log(`Translated: ${text} -> JP: ${text}`);
    }
    
    // Write the category translations to a file
    const content = `export const ${category}Translations = ${JSON.stringify(translations, null, 2)};`;
    const filePath = path.join(dirPath, `${category}.ts`);
    fs.writeFileSync(filePath, content);
    console.log(`Translation file created: ${filePath}`);
  }
  
  // Create an index.ts file that exports all categories
  const indexContent = Object.keys(translationCategories)
    .map(category => `export * from './${category}';`)
    .join('\n');
  
  fs.writeFileSync(path.join(dirPath, 'index.ts'), indexContent);
  console.log(`Index file created: ${path.join(dirPath, 'index.ts')}`);
}

// If this script is run directly
if (require.main === module) {
  generateTranslations().catch(console.error);
}
