
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, AlertTriangle, Info, Globe, Calendar, Wallet, CreditCard, Umbrella, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDeviceSize } from "@/hooks/use-mobile";
import { TipBeforeTrip } from "./TipBeforeTrip";
import { TravelRoutes } from "./TravelRoutes";
import { TransportationSection } from "./TransportationSection";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

// Pre-departure checklist data
const essentialItems = [
  { item: "Valid passport (minimum 6 months validity from return date)", critical: true },
  { item: "Tunisia visa (if required for your nationality)", critical: true },
  { item: "Travel insurance covering medical emergencies", critical: true },
  { item: "Flight tickets and itinerary", critical: true },
  { item: "Hotel/accommodation confirmations", critical: true },
  { item: "Credit/debit cards and some cash (Tunisian Dinar)", critical: true },
  { item: "Emergency contact information", critical: true },
  { item: "Prescribed medications with doctor's note", critical: true },
  { item: "Power adapters (European Type C/E plugs)", critical: false },
  { item: "Sunscreen and hat", critical: false },
  { item: "Light, modest clothing (covering shoulders and knees for religious sites)", critical: false },
  { item: "Comfortable walking shoes", critical: false },
  { item: "Basic first aid kit", critical: false },
  { item: "Photocopy of passport (stored separately)", critical: false },
  { item: "Arabic phrasebook or translation app", critical: false }
];

// Updated Health & Safety information
const healthInfo = [
  { title: "Vaccinations", content: "No mandatory vaccinations are required for Tunisia, but it's recommended to be up-to-date with routine vaccines (MMR, diphtheria-tetanus-pertussis, etc.). Consider Hepatitis A and Typhoid vaccines. Consult your doctor before travel." },
  { 
    title: "Water Safety", 
    content: "While tap water is generally treated, tourists are recommended to drink bottled water. Most restaurants and hotels serve filtered or bottled water. When in doubt, choose sealed bottled water, which is widely available and inexpensive. Ice cubes in tourist areas are usually made from purified water." 
  },
  { 
    title: "Food Safety", 
    content: "Tunisian cuisine is delicious and generally safe. Most restaurants, especially those in tourist areas, maintain good hygiene standards. Street food can be enjoyable, but choose vendors with high turnover and good cleanliness. Opt for hot, freshly prepared foods, and be mindful of raw vegetables. If you have a sensitive stomach, stick to cooked dishes and peelable fruits." 
  },
  { title: "Sun Protection", content: "Tunisia's sun can be intense, especially in summer. Wear sunscreen (minimum SPF 30), a hat, and sunglasses. Stay hydrated and seek shade during the hottest part of the day (11am-3pm)." },
  { title: "Medical Facilities", content: "Major cities have adequate medical facilities, but quality can vary. Private clinics generally offer better service than public hospitals. Ensure your travel insurance covers medical evacuation if necessary." }
];

export function DepartureContent() {
  const { isMobile, isTablet } = useDeviceSize();
  const { currentLanguage } = useTranslation();

  const getCardColumnClass = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="w-full">
      {/* Tips Before Trips Section */}
      <TipBeforeTrip />
      
      {/* Travel Routes Section */}
      <TravelRoutes />
      
      {/* Transportation Section */}
      <div className="mb-10">
        <TransportationSection />
      </div>
      
      {/* Travel Documents Section */}
      <div className="mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Wallet className="w-6 h-6 mr-2 text-blue-500" />
          <TranslateText text="Travel Documents & Entry Requirements" language={currentLanguage} />
        </h2>
        
        <Card className="mb-6">
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              <TranslateText text="Passport & Visa" language={currentLanguage} />
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Your passport must be valid for at least 6 months beyond your planned departure date from Tunisia." language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Many nationalities, including those from the US, Canada, EU, UK, and Australia, can visit Tunisia without a visa for stays up to 90 days." language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Always verify the latest visa requirements for your specific nationality on your government's travel website or the" language={currentLanguage} />{" "}
                  <a href="http://www.diplomatie.gov.tn" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    <TranslateText text="Tunisian Ministry of Foreign Affairs website" language={currentLanguage} />
                  </a>.
                </span>
              </li>
              <li className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="You may need to complete a white immigration card upon arrival. Keep your portion until departure." language={currentLanguage} />
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              <TranslateText text="Currency & Money" language={currentLanguage} />
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="The local currency is the Tunisian Dinar (TND), which is a closed currency (cannot be obtained outside Tunisia)." language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Exchange currency at the airport, banks, or official exchange offices. Keep receipts as you'll need them to convert dinars back when leaving." language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="ATMs are widely available in cities and tourist areas. Inform your bank about your travel plans to prevent card blocking." language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="It's illegal to import or export Tunisian Dinars. Convert remaining dinars before leaving the country." language={currentLanguage} />
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Departure Checklist */}
      <div className="mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Check className="w-6 h-6 mr-2 text-blue-500" />
          <TranslateText text="Pre-Departure Checklist" language={currentLanguage} />
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-5 sm:p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            <TranslateText text="Essential Items" language={currentLanguage} />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {essentialItems.map((item, index) => (
              <div key={index} className="flex items-start">
                <span className={`flex-shrink-0 w-5 h-5 rounded-full ${item.critical ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'} flex items-center justify-center mr-2 mt-0.5`}>
                  {item.critical ? '!' : 'i'}
                </span>
                <span className={item.critical ? 'font-medium' : ''}>
                  <TranslateText text={item.item} language={currentLanguage} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health & Safety */}
      <div className="mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <ShieldCheck className="w-6 h-6 mr-2 text-blue-500" />
          <TranslateText text="Health & Safety" language={currentLanguage} />
        </h2>
        
        <Accordion type="single" collapsible className="mb-6">
          {healthInfo.map((info, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                <TranslateText text={info.title} language={currentLanguage} />
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700">
                  <TranslateText text={info.content} language={currentLanguage} />
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              <TranslateText text="Travel Insurance" language={currentLanguage} />
            </h3>
            <p className="text-gray-700 mb-4">
              <TranslateText text="Comprehensive travel insurance is strongly recommended for all visitors to Tunisia. Ensure your policy covers:" language={currentLanguage} />
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Medical emergencies and hospitalization" language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Emergency evacuation" language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Trip cancellation/interruption" language={currentLanguage} />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <TranslateText text="Lost luggage and personal belongings" language={currentLanguage} />
                </span>
              </li>
            </ul>
            <p className="text-gray-700">
              <TranslateText text="Keep digital and physical copies of your insurance policy details and emergency contact numbers." language={currentLanguage} />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cultural Etiquette */}
      <div className="mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-500" />
          <TranslateText text="Cultural Etiquette" language={currentLanguage} />
        </h2>
        
        <div className={`grid ${getCardColumnClass()} gap-4 sm:gap-6`}>
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                <TranslateText text="Dress Code" language={currentLanguage} />
              </h3>
              <p className="text-gray-700 mb-3">
                <TranslateText text="Tunisia is a moderate Muslim country. While there's no strict dress code for tourists, modest clothing is appreciated, especially in rural areas and religious sites." language={currentLanguage} />
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Cover shoulders, chest, and knees when visiting mosques or religious sites" language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Women should bring a scarf to cover their hair when entering mosques" language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Beach attire is acceptable at resorts and beaches only" language={currentLanguage} />
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                <TranslateText text="Social Customs" language={currentLanguage} />
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text='Greet people with "Salam Alaikum" (peace be upon you)' language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Shake hands when meeting people (same gender)" language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Wait for women to extend their hand first when greeting" language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Remove shoes when entering someone's home" language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Avoid public displays of affection" language={currentLanguage} />
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                <TranslateText text="Photography" language={currentLanguage} />
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Always ask permission before photographing people" language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Avoid photographing military installations, airports, or government buildings" language={currentLanguage} />
                  </span>
                </li>
                <li className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <TranslateText text="Some sites charge a small fee for photography or have restrictions" language={currentLanguage} />
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/travel" onClick={() => {
            window.scrollTo(0, 0);
            // Update the tab to itinerary
            const event = new CustomEvent('changeTab', { detail: { tab: 'itinerary' } });
            window.dispatchEvent(event);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/>
            </svg>
            <TranslateText text="Atlantis Itinerary & Tours" language={currentLanguage} />
          </Link>
        </Button>
        
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/travel" onClick={() => {
            window.scrollTo(0, 0);
            // Update the tab to activities
            const event = new CustomEvent('changeTab', { detail: { tab: 'activities' } });
            window.dispatchEvent(event);
          }}>
            <TranslateText text="Activities in Tunisia" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
