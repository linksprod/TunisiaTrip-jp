import React, { useState, useRef } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { TripPlannerSidebar } from "@/components/start-my-trip/TripPlannerSidebar";
import { TripPlannerMap } from "@/components/start-my-trip/TripPlannerMap";
import { PhotoBanner } from "@/components/start-my-trip/PhotoBanner";
import { AirbnbStyleSearchBar } from "@/components/start-my-trip/AirbnbStyleSearchBar";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { UnifiedSearchComponent } from "@/components/tag-bar/UnifiedSearchComponent";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { Sparkles } from "lucide-react";
import { PageSEO } from "@/components/common/PageSEO";

export const StartMyTripNewPage = () => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedGuestHouses, setSelectedGuestHouses] = useState<string[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<'tunis' | 'djerba' | null>(null);
  const [currentStep, setCurrentStep] = useState<'activities' | 'accommodations'>('activities');
  const [selectedDay, setSelectedDay] = useState(1);
  const [activitiesByDay, setActivitiesByDay] = useState<Record<number, string[]>>({});
  const [accommodationsByDay, setAccommodationsByDay] = useState<Record<number, string>>({});
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<'activities' | 'accommodations' | 'dates' | 'generation'>('activities');
  const [selectedTheme, setSelectedTheme] = useState("all");

  const { currentLanguage } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);

  const { activities = [], isLoading: activitiesLoading } = useActivities();
  const { hotels = [], isLoading: hotelsLoading } = useHotels();
  const { guestHouses = [], isLoading: guestHousesLoading } = useGuestHouses();

  const handleActivityToggle = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(prev => prev.filter(id => id !== activityId));
    } else {
      setSelectedActivities(prev => [...prev, activityId]);
    }
  };

  const handleActivitySelect = (activityId: string, day: number) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [day]: prev[day] ? [...prev[day], activityId] : [activityId]
    }));

    if (!selectedActivities.includes(activityId)) {
      setSelectedActivities(prev => [...prev, activityId]);
    }
  };

  const handleActivityRemove = (activityId: string, day: number) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [day]: prev[day]?.filter(id => id !== activityId) || []
    }));

    // Check if activity is used in other days
    const stillUsed = Object.values(activitiesByDay).some(dayActivities =>
      dayActivities?.includes(activityId)
    );

    if (!stillUsed) {
      setSelectedActivities(prev => prev.filter(id => id !== activityId));
    }
  };

  const handleAccommodationSelect = (accommodationId: string, day: number) => {
    setAccommodationsByDay(prev => ({
      ...prev,
      [day]: accommodationId
    }));
  };

  const handleArrivalDateSelect = (date: Date) => {
    setArrivalDate(date);
    setCurrentWorkflowStep('generation');
  };

  const handleNextStep = () => {
    setCurrentStep('accommodations');
  };

  const handleSearch = (criteria: any) => {
    setSelectedTheme(criteria.theme);
    setCheckInDate(criteria.checkIn);
    setCheckOutDate(criteria.checkOut);
  };

  // Calculate number of days between check-in and check-out
  const numberOfDays = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 7; // Default to 7 days if no dates selected

  const isLoading = activitiesLoading || hotelsLoading || guestHousesLoading;

  if (isLoading) {
    return (
      <MainLayout showTagBar={false}>
        <div className="w-full bg-gradient-to-b from-background to-muted/30">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading trip options...</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showTagBar={false}>
      <PageSEO
        title="チュニジア旅行プランナー｜カスタム旅行を作成 | TunisiaTrip"
        description="あなただけのチュニジア旅行プランを作成。アクティビティ選択、ホテル・ゲストハウス予約、出発空港設定まで、ワンストップで旅程を組み立てられます。"
        canonicalPath="/start-my-trip"
        keywords="チュニジア旅行プラン, チュニジア旅程作成, チュニジアツアー予約, チュニジア旅行計画, オーダーメイド旅行"
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Page Title Section */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                <TranslateText text="Plan Your Perfect Trip to Tunisia" language={currentLanguage} />
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              <TranslateText text="Select activities and accommodations that interest you, and we'll create an optimized itinerary for your Tunisian adventure." language={currentLanguage} />
            </p>
          </div>
        </div>

        {/* Photo Banner - Same height as old page */}
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
          <PhotoBanner />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />
        </div>

        {/* Header Section */}
        <div className="bg-background border-b border-border shadow-sm">
          {/* Trip Style Selection Section */}
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                <TranslateText text="Choose Your Trip Style" language={currentLanguage} />
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                <TranslateText text="Select a theme to get personalized recommendations, or browse all activities below." language={currentLanguage} />
              </p>
            </div>
          </div>

          {/* Airbnb Style Search Bar Section */}
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pb-8">
            <AirbnbStyleSearchBar
              onSearch={handleSearch}
              selectedTheme={selectedTheme}
              onThemeChange={setSelectedTheme}
              initialCheckIn={checkInDate}
              initialCheckOut={checkOutDate}
            />
          </div>
        </div>

        {/* Main content area - 40/60 Split Layout */}
        <div className="flex bg-background mb-8 lg:flex-row flex-col gap-0">
          {/* Left Sidebar - 40% width */}
          <div className="w-full lg:w-[40%] flex-shrink-0 border-r-2 border-primary bg-card overflow-y-auto max-h-screen">
            <TripPlannerSidebar
              activities={activities}
              hotels={hotels}
              guestHouses={guestHouses}
              selectedActivities={selectedActivities}
              selectedHotels={selectedHotels}
              selectedGuestHouses={selectedGuestHouses}
              selectedAirport={selectedAirport}
              currentStep={currentStep}
              selectedDay={selectedDay}
              activitiesByDay={activitiesByDay}
              accommodationsByDay={accommodationsByDay}
              numberOfDays={numberOfDays}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              arrivalDate={arrivalDate}
              currentWorkflowStep={currentWorkflowStep}
              onActivityToggle={handleActivityToggle}
              onActivitySelect={handleActivitySelect}
              onActivityRemove={handleActivityRemove}
              onDaySelect={setSelectedDay}
              onNextStep={handleNextStep}
              onAirportSelect={setSelectedAirport}
              onHotelSelect={(hotelId) => setSelectedHotels(prev =>
                prev.includes(hotelId) ? prev.filter(id => id !== hotelId) : [...prev, hotelId]
              )}
              onGuestHouseSelect={(guestHouseId) => setSelectedGuestHouses(prev =>
                prev.includes(guestHouseId) ? prev.filter(id => id !== guestHouseId) : [...prev, guestHouseId]
              )}
              onAccommodationSelect={handleAccommodationSelect}
              onArrivalDateSelect={handleArrivalDateSelect}
              onClearDates={() => {
                setCheckInDate(undefined);
                setCheckOutDate(undefined);
                setSelectedActivities([]);
                setSelectedHotels([]);
                setSelectedGuestHouses([]);
                setSelectedAirport(null);
                setActivitiesByDay({});
                setAccommodationsByDay({});
                setArrivalDate(undefined);
                setCurrentWorkflowStep('activities');
                setSelectedDay(1);
                setCurrentStep('activities');
              }}
              onDaysChange={(days) => {
                // Clear existing activities assignment when days change
                setActivitiesByDay({});
                setSelectedDay(1);
                // You may want to trigger a re-calculation of numberOfDays here
                // For now, this will just handle the prop requirement
              }}
            />
          </div>

          {/* Right Map - 60% width */}
          <div className="w-full lg:w-[60%] relative">
            <TripPlannerMap
              ref={mapRef}
              activities={activities}
              hotels={hotels}
              guestHouses={guestHouses}
              selectedActivities={selectedActivities}
              selectedHotels={selectedHotels}
              selectedGuestHouses={selectedGuestHouses}
              activitiesByDay={activitiesByDay}
              selectedDay={selectedDay}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};