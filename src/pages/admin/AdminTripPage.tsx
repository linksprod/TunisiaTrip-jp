import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Trash2, Plus, Upload, Calendar } from "lucide-react";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import { DayTimelineEditor } from "@/components/admin/DayTimelineEditor";
import { useActivities, Activity } from "@/hooks/useActivities";
import { useHotels, Hotel } from "@/hooks/useHotels";
import { useGuestHouses, GuestHouse } from "@/hooks/useGuestHouses";
import { useAirports, Airport } from "@/hooks/useAirports";
import { useAllPredefinedTrips, useCreatePredefinedTrip, useUpdatePredefinedTrip, useDeletePredefinedTrip, PredefinedTrip } from "@/hooks/usePredefinedTrips";
import { DetailedDayPlan, TimelineActivity } from "@/types/predefinedTripTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const AdminTripPage = () => {
  const { activities, createActivity, updateActivity, deleteActivity, isLoading: activitiesLoading } = useActivities();
  const { hotels, createHotel, updateHotel, deleteHotel, isLoading: hotelsLoading } = useHotels();
  const { guestHouses, createGuestHouse, updateGuestHouse, deleteGuestHouse, isLoading: guestHousesLoading } = useGuestHouses();
  const { airports, createAirport, updateAirport, deleteAirport, isLoading: airportsLoading } = useAirports();
  const { data: predefinedTrips = [], isLoading: tripsLoading } = useAllPredefinedTrips();
  const createTrip = useCreatePredefinedTrip();
  const updateTrip = useUpdatePredefinedTrip();
  const deleteTrip = useDeletePredefinedTrip();

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Current tab and editing states
  const [currentTab, setCurrentTab] = useState("activities");
  const [editingItem, setEditingItem] = useState<Activity | Hotel | GuestHouse | Airport | PredefinedTrip | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Form states
  const [newItem, setNewItem] = useState<Partial<Activity | Hotel | GuestHouse | Airport | PredefinedTrip>>({});
  
  // Day-by-day trip planning state - modified to support multiple activities per day
  const [daySelections, setDaySelections] = useState<{
    [day: number]: {
      activities: string[]; // Array of activity IDs
      accommodationId: string;
      accommodationType: 'hotel' | 'guesthouse' | 'none' | '';
    }
  }>({});

  // Detailed day planning state
  const [detailedDays, setDetailedDays] = useState<DetailedDayPlan[]>([]);
  const [useDetailedPlanning, setUseDetailedPlanning] = useState(false);

  const renderRatingStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const handleEditItem = (item: Activity | Hotel | GuestHouse | Airport | PredefinedTrip) => {
    setEditingItem(item);
    // Load trip data for editing
    if (currentTab === "predefined-trips") {
      const trip = item as PredefinedTrip;
      
      // Try to extract detailed planning data first
      extractDetailedDataFromTrip(trip);
      
      // Set up simple planning data as fallback
      const selections: typeof daySelections = {};
      for (let day = 1; day <= trip.duration_days; day++) {
        const activityId = trip.activity_ids?.[day - 1] || '';
        const hotelId = trip.hotel_ids?.[day - 1] || '';
        const guesthouseId = trip.guesthouse_ids?.[day - 1] || '';
        
        selections[day] = {
          activities: activityId ? [activityId] : [],
          accommodationId: hotelId || guesthouseId,
          accommodationType: hotelId ? 'hotel' : guesthouseId ? 'guesthouse' : 'none'
        };
      }
      setDaySelections(selections);
    }
    setEditDialogOpen(true);
  };

  const handleAddItem = () => {
    setNewItem({});
    setDaySelections({});
    setDetailedDays([]);
    setUseDetailedPlanning(false);
    setAddDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem?.id) return;

    if (currentTab === "activities") {
      updateActivity(editingItem as Activity);
    } else if (currentTab === "hotels") {
      updateHotel(editingItem as Hotel);
    } else if (currentTab === "guesthouses") {
      updateGuestHouse(editingItem as GuestHouse);
    } else if (currentTab === "airports") {
      updateAirport(editingItem as Airport);
    } else if (currentTab === "predefined-trips") {
      // Convert day selections to arrays before saving
      const tripData = convertDetailedDaysToTrip(editingItem as PredefinedTrip);
      updateTrip.mutate({ ...tripData, id: editingItem.id } as Partial<PredefinedTrip> & { id: string });
    }
    
    setEditDialogOpen(false);
    setEditingItem(null);
    setDaySelections({});
  };

  const handleAddNewItem = () => {
    if (currentTab === "activities") {
      createActivity(newItem as Omit<Activity, 'id'>);
    } else if (currentTab === "hotels") {
      createHotel(newItem as Omit<Hotel, 'id'>);
    } else if (currentTab === "guesthouses") {
      createGuestHouse(newItem as Omit<GuestHouse, 'id'>);
    } else if (currentTab === "airports") {
      createAirport(newItem as Omit<Airport, 'id' | 'created_at' | 'updated_at'>);
    } else if (currentTab === "predefined-trips") {
      // Convert day selections to arrays
      const tripData = convertDetailedDaysToTrip(newItem as Omit<PredefinedTrip, 'id' | 'created_at' | 'updated_at'>);
      createTrip.mutate({
        name: '',
        duration_days: 1,
        activity_ids: [],
        hotel_ids: [],
        guesthouse_ids: [],
        images: [],
        difficulty_level: 'medium',
        is_featured: false,
        is_active: true,
        ...tripData
      } as Omit<PredefinedTrip, 'id' | 'created_at' | 'updated_at'>);
    }
    
    setAddDialogOpen(false);
    setNewItem({});
    setDaySelections({});
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    if (currentTab === "activities") {
      deleteActivity(itemToDelete);
    } else if (currentTab === "hotels") {
      deleteHotel(itemToDelete);
    } else if (currentTab === "guesthouses") {
      deleteGuestHouse(itemToDelete);
    } else if (currentTab === "airports") {
      deleteAirport(itemToDelete);
    } else if (currentTab === "predefined-trips") {
      deleteTrip.mutate(itemToDelete);
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const updateEditingField = (field: string, value: any) => {
    setEditingItem(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateNewItemField = (field: string, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
    // Reset day selections if duration changes
    if (field === 'duration_days' && currentTab === "predefined-trips") {
      setDaySelections({});
    }
  };

  // Convert day selections to trip data arrays
  const convertDaySelectionsToTrip = (baseTrip: Partial<PredefinedTrip>): Partial<PredefinedTrip> => {
    const activityIds: string[] = [];
    const hotelIds: string[] = [];
    const guesthouseIds: string[] = [];

    for (let day = 1; day <= (baseTrip.duration_days || 0); day++) {
      const dayData = daySelections[day];
      if (dayData) {
        // Add all activities from this day
        activityIds.push(...dayData.activities);
        
        if (dayData.accommodationType === 'hotel') {
          hotelIds.push(dayData.accommodationId || '');
          guesthouseIds.push('');
        } else if (dayData.accommodationType === 'guesthouse') {
          guesthouseIds.push(dayData.accommodationId || '');
          hotelIds.push('');
        } else {
          hotelIds.push('');
          guesthouseIds.push('');
        }
      } else {
        hotelIds.push('');
        guesthouseIds.push('');
      }
    }

    return {
      ...baseTrip,
      activity_ids: activityIds.filter(Boolean),
      hotel_ids: hotelIds.filter(Boolean),
      guesthouse_ids: guesthouseIds.filter(Boolean)
    };
  };

  // Convert detailed days to trip data for storage
  const convertDetailedDaysToTrip = (baseTrip: Partial<PredefinedTrip>): Partial<PredefinedTrip> => {
    if (!useDetailedPlanning || detailedDays.length === 0) {
      return convertDaySelectionsToTrip(baseTrip);
    }

    // Store detailed days in the description for now (until we have a proper detailed trips table integration)
    const detailedData = {
      useDetailedPlanning: true,
      detailedDays: detailedDays
    };

    return {
      ...baseTrip,
      description: `${baseTrip.description || ''}\n\n<!-- DETAILED_PLANNING_DATA: ${JSON.stringify(detailedData)} -->`
    };
  };

  // Function to extract detailed data from description
  const extractDetailedDataFromTrip = (trip: PredefinedTrip) => {
    const match = trip.description?.match(/<!-- DETAILED_PLANNING_DATA: (.*?) -->/);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        if (data.useDetailedPlanning && data.detailedDays) {
          setUseDetailedPlanning(true);
          setDetailedDays(data.detailedDays);
          return;
        }
      } catch (e) {
        console.error('Error parsing detailed planning data:', e);
      }
    }
    
    // Fallback to simple planning
    setUseDetailedPlanning(false);
    setDetailedDays([]);
  };

  // Update day selection with support for multiple activities
  const updateDaySelection = (day: number, field: 'accommodationId' | 'accommodationType', value: string) => {
    setDaySelections(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        // Reset accommodation ID if type changes
        ...(field === 'accommodationType' ? { accommodationId: '' } : {})
      }
    }));
  };

  // Add activity to a specific day
  const addActivityToDay = (day: number, activityId: string) => {
    setDaySelections(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        activities: [...(prev[day]?.activities || []), activityId]
      }
    }));
  };

  // Remove activity from a specific day
  const removeActivityFromDay = (day: number, activityIndex: number) => {
    setDaySelections(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        activities: prev[day]?.activities?.filter((_, index) => index !== activityIndex) || []
      }
    }));
  };

  const renderActivityFields = (item: Partial<Activity>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={item.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Nom de l'activité"
            />
          </div>
          <div>
            <Label htmlFor="location">Lieu *</Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Lieu de l'activité"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Durée</Label>
            <Input
              id="duration"
              value={item.duration || ""}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder="Ex: 2 heures"
            />
          </div>
          <div>
            <Label htmlFor="price">Prix</Label>
            <Input
              id="price"
              value={item.price || ""}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="Ex: 50€ par personne"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={item.category || "activity"} onValueChange={(value) => updateField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Activité</SelectItem>
                <SelectItem value="cultural">Culturel</SelectItem>
                <SelectItem value="adventure">Aventure</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="gastronomy">Gastronomie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rating">Note</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={item.rating || ""}
              onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
              placeholder="Note sur 5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description de l'activité"
            className="min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
          <Input
            id="tags"
            value={Array.isArray(item.tags) ? item.tags.join(", ") : ""}
            onChange={(e) => updateField("tags", e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))}
            placeholder="nature, aventure, famille"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 35.8245"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 10.6447"
            />
          </div>
        </div>
        <div className="space-y-4">
          <Label>Options de visibilité</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_in_travel"
              checked={item.show_in_travel || false}
              onCheckedChange={(checked) => updateField("show_in_travel", checked)}
            />
            <Label htmlFor="show_in_travel">Afficher dans la page Travel</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_in_start_my_trip"
              checked={item.show_in_start_my_trip || false}
              onCheckedChange={(checked) => updateField("show_in_start_my_trip", checked)}
            />
            <Label htmlFor="show_in_start_my_trip">Afficher dans la page Start My Trip</Label>
          </div>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="activities"
          />
        </div>
      </>
    );
  };

  const renderHotelFields = (item: Partial<Hotel>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Nom de l'hôtel"
            />
          </div>
          <div>
            <Label htmlFor="location">Lieu *</Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Lieu de l'hôtel"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price_per_night">Prix par nuit</Label>
            <Input
              id="price_per_night"
              value={item.price_per_night || ""}
              onChange={(e) => updateField("price_per_night", e.target.value)}
              placeholder="Ex: 120€ par nuit"
            />
          </div>
          <div>
            <Label htmlFor="rating">Note</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={item.rating || ""}
              onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
              placeholder="Note sur 5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description de l'hôtel"
            className="min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="amenities">Équipements (séparés par des virgules)</Label>
          <Input
            id="amenities"
            value={Array.isArray(item.amenities) ? item.amenities.join(", ") : ""}
            onChange={(e) => updateField("amenities", e.target.value.split(",").map(amenity => amenity.trim()).filter(Boolean))}
            placeholder="wifi, piscine, restaurant"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 35.8245"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 10.6447"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="breakfast"
            checked={item.breakfast || false}
            onCheckedChange={(checked) => updateField("breakfast", checked)}
          />
          <Label htmlFor="breakfast">Petit-déjeuner inclus</Label>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="hotels"
          />
        </div>
      </>
    );
  };

  const renderGuestHouseFields = (item: Partial<GuestHouse>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Nom de la maison d'hôte"
            />
          </div>
          <div>
            <Label htmlFor="location">Lieu *</Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Lieu de la maison d'hôte"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price_per_night">Prix par nuit</Label>
            <Input
              id="price_per_night"
              value={item.price_per_night || ""}
              onChange={(e) => updateField("price_per_night", e.target.value)}
              placeholder="Ex: 80€ par nuit"
            />
          </div>
          <div>
            <Label htmlFor="rating">Note</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={item.rating || ""}
              onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
              placeholder="Note sur 5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description de la maison d'hôte"
            className="min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="amenities">Équipements (séparés par des virgules)</Label>
          <Input
            id="amenities"
            value={Array.isArray(item.amenities) ? item.amenities.join(", ") : ""}
            onChange={(e) => updateField("amenities", e.target.value.split(",").map(amenity => amenity.trim()).filter(Boolean))}
            placeholder="wifi, jardin, cuisine"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 35.8245"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 10.6447"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="breakfast"
            checked={item.breakfast || false}
            onCheckedChange={(checked) => updateField("breakfast", checked)}
          />
          <Label htmlFor="breakfast">Petit-déjeuner inclus</Label>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="guesthouses"
          />
        </div>
      </>
    );
  };

  const renderAirportFields = (item: Partial<Airport>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Nom de l'aéroport"
            />
          </div>
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={item.code || ""}
              onChange={(e) => updateField("code", e.target.value.toUpperCase())}
              placeholder="Ex: TUN"
              maxLength={3}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Lieu *</Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Ville de l'aéroport"
            />
          </div>
          <div>
            <Label htmlFor="region">Région</Label>
            <Select value={item.region || ""} onValueChange={(value) => updateField("region", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="North">Nord</SelectItem>
                <SelectItem value="South">Sud</SelectItem>
                <SelectItem value="Center">Centre</SelectItem>
                <SelectItem value="East">Est</SelectItem>
                <SelectItem value="West">Ouest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description de l'aéroport"
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude *</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 36.851033"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude *</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder="Ex: 10.227217"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="advantages">Avantages (séparés par des virgules)</Label>
          <Input
            id="advantages"
            value={Array.isArray(item.advantages) ? item.advantages.join(", ") : ""}
            onChange={(e) => updateField("advantages", e.target.value.split(",").map(advantage => advantage.trim()).filter(Boolean))}
            placeholder="Accès direct à la capitale, Installations modernes"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={item.is_active !== false}
            onCheckedChange={(checked) => updateField("is_active", checked)}
          />
          <Label htmlFor="is_active">Aéroport actif</Label>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="airports"
          />
        </div>
      </>
    );
  };

  const renderPredefinedTripFields = (item: Partial<PredefinedTrip>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom du voyage *</Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Ex: Aventure dans le Sud tunisien"
            />
          </div>
          <div>
            <Label htmlFor="duration_days">Durée en jours *</Label>
            <Input
              id="duration_days"
              type="number"
              min="1"
              max="30"
              value={item.duration_days || ""}
              onChange={(e) => updateField("duration_days", parseInt(e.target.value) || 1)}
              placeholder="Ex: 7"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description du voyage pré-configuré"
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target_airport_id">Aéroport de destination</Label>
            <Select value={item.target_airport_id || ""} onValueChange={(value) => updateField("target_airport_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un aéroport" />
              </SelectTrigger>
              <SelectContent>
                {airports.map((airport) => (
                  <SelectItem key={airport.id} value={airport.id}>
                    {airport.name} ({airport.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price_estimate">Prix estimé</Label>
            <Input
              id="price_estimate"
              value={item.price_estimate || ""}
              onChange={(e) => updateField("price_estimate", e.target.value)}
              placeholder="Ex: À partir de 1200€"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="difficulty_level">Niveau de difficulté</Label>
            <Select value={item.difficulty_level || "medium"} onValueChange={(value) => updateField("difficulty_level", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Facile</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="hard">Difficile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="theme">Thème</Label>
            <Input
              id="theme"
              value={item.theme || ""}
              onChange={(e) => updateField("theme", e.target.value)}
              placeholder="Ex: Aventure, Culture, Détente"
            />
          </div>
        </div>
        {/* Planning mode selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Mode de planification</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-detailed-planning"
                  checked={useDetailedPlanning}
                  onCheckedChange={(checked) => setUseDetailedPlanning(checked === true)}
                />
                <Label htmlFor="use-detailed-planning" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline détaillée
                </Label>
              </div>
            </div>
          </div>

          {useDetailedPlanning ? (
            /* Detailed planning with timeline */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Planification détaillée jour par jour</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const newDay: DetailedDayPlan = {
                      day: detailedDays.length + 1,
                      title: `Jour ${detailedDays.length + 1}`,
                      timeline: [],
                      accommodationType: 'none'
                    };
                    setDetailedDays(prev => [...prev, newDay]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un jour
                </Button>
              </div>

              {detailedDays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  Aucun jour planifié. Cliquez sur "Ajouter un jour" pour commencer.
                </div>
              ) : (
                <div className="space-y-6">
                  {detailedDays.map((dayPlan, index) => (
                    <DayTimelineEditor
                      key={dayPlan.day}
                      dayPlan={dayPlan}
                      onUpdate={(updatedPlan) => {
                        const newDetailedDays = [...detailedDays];
                        newDetailedDays[index] = updatedPlan;
                        setDetailedDays(newDetailedDays);
                      }}
                      onRemove={() => {
                        const newDetailedDays = detailedDays.filter((_, i) => i !== index);
                        // Reorder days
                        const reorderedDays = newDetailedDays.map((day, i) => ({
                          ...day,
                          day: i + 1,
                          title: day.title.replace(/Jour \d+/, `Jour ${i + 1}`)
                        }));
                        setDetailedDays(reorderedDays);
                      }}
                      activities={activities}
                      hotels={hotels}
                      guestHouses={guestHouses}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Simple planning */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Planification simple jour par jour</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const nextDay = Object.keys(daySelections).length + 1;
                    setDaySelections(prev => ({
                      ...prev,
                      [nextDay]: { activities: [], accommodationId: '', accommodationType: 'none' }
                    }));
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un jour
                </Button>
              </div>
              {Object.keys(daySelections).length > 0 && Object.keys(daySelections).sort((a, b) => parseInt(a) - parseInt(b)).map((dayKey) => {
                const day = parseInt(dayKey);
                const isLastDay = day === Object.keys(daySelections).length;
                const dayData = daySelections[day] || { activities: [], accommodationId: '', accommodationType: 'none' };
                  
                  return (
                    <div key={day} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-primary">Jour {day}</h3>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const newSelections = { ...daySelections };
                            delete newSelections[day];
                            
                            // Reorder days to fill gaps
                            const sortedDays = Object.keys(newSelections).sort((a, b) => parseInt(a) - parseInt(b));
                            const reorderedSelections: { [key: number]: any } = {};
                            sortedDays.forEach((oldDay, index) => {
                              reorderedSelections[index + 1] = newSelections[parseInt(oldDay)];
                            });
                            
                            setDaySelections(reorderedSelections);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                       {/* Activities selection - Multiple activities per day */}
                       <div className="space-y-3">
                         <div className="flex items-center justify-between">
                           <Label>Activités du jour *</Label>
                           <Button
                             type="button"
                             variant="outline"
                             size="sm"
                             onClick={() => {
                               // Show a select dialog to add activities
                               const firstAvailableActivity = activities.find(activity => 
                                 !dayData.activities.includes(activity.id!)
                               );
                               if (firstAvailableActivity) {
                                 addActivityToDay(day, firstAvailableActivity.id!);
                               }
                             }}
                           >
                             <Plus className="h-4 w-4 mr-1" />
                             Ajouter activité
                           </Button>
                         </div>

                         {dayData.activities.length === 0 ? (
                           <div className="text-sm text-muted-foreground border-2 border-dashed rounded p-4 text-center">
                             Aucune activité programmée. Cliquez sur "Ajouter activité".
                           </div>
                         ) : (
                           <div className="space-y-2">
                             {dayData.activities.map((activityId, activityIndex) => {
                               const activity = activities.find(a => a.id === activityId);
                               return (
                                 <div key={activityIndex} className="flex items-center gap-2 p-2 border rounded">
                                   <div className="flex-1">
                                     <Select 
                                       value={activityId} 
                                       onValueChange={(value) => {
                                         const newActivities = [...dayData.activities];
                                         newActivities[activityIndex] = value;
                                         setDaySelections(prev => ({
                                           ...prev,
                                           [day]: {
                                             ...prev[day],
                                             activities: newActivities
                                           }
                                         }));
                                       }}
                                     >
                                       <SelectTrigger className="text-sm">
                                         <SelectValue placeholder="Sélectionner une activité" />
                                       </SelectTrigger>
                                       <SelectContent>
                                         {activities.map((activity) => (
                                           <SelectItem key={activity.id} value={activity.id!}>
                                             {activity.title} - {activity.location}
                                           </SelectItem>
                                         ))}
                                       </SelectContent>
                                     </Select>
                                   </div>
                                   <Button
                                     type="button"
                                     variant="ghost"
                                     size="sm"
                                     onClick={() => removeActivityFromDay(day, activityIndex)}
                                   >
                                     <Trash2 className="h-4 w-4" />
                                   </Button>
                                 </div>
                               );
                             })}
                           </div>
                         )}
                       </div>

                      {/* Accommodation selection */}
                      {!isLastDay && (
                        <div className="space-y-2">
                          <Label>Hébergement pour la nuit</Label>
                          
                          {/* Accommodation type selection */}
                          <Select 
                            value={dayData.accommodationType} 
                            onValueChange={(value) => updateDaySelection(day, 'accommodationType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type d'hébergement" />
                            </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="none">Aucun hébergement</SelectItem>
                               <SelectItem value="hotel">Hôtel</SelectItem>
                               <SelectItem value="guesthouse">Maison d'hôte</SelectItem>
                             </SelectContent>
                          </Select>

                           {/* Specific accommodation selection */}
                           {dayData.accommodationType && dayData.accommodationType !== 'none' && (
                            <Select 
                              value={dayData.accommodationId} 
                              onValueChange={(value) => updateDaySelection(day, 'accommodationId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Sélectionner ${dayData.accommodationType === 'hotel' ? 'un hôtel' : 'une maison d\'hôte'}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {(dayData.accommodationType === 'hotel' ? hotels : guestHouses).map((accommodation) => (
                                  <SelectItem key={accommodation.id} value={accommodation.id!}>
                                    {accommodation.name} - {accommodation.location} (ID: {accommodation.id?.slice(0, 8)}...)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={item.is_featured || false}
              onCheckedChange={(checked) => updateField("is_featured", checked)}
            />
            <Label htmlFor="is_featured">Voyage en vedette</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={item.is_active !== false}
              onCheckedChange={(checked) => updateField("is_active", checked)}
            />
            <Label htmlFor="is_active">Voyage actif</Label>
          </div>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="predefined-trips"
          />
        </div>
      </>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Voyages</h1>
          <p className="text-muted-foreground">
            Gérez les activités, hôtels et maisons d'hôtes de votre plateforme.
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="hotels">Hôtels</TabsTrigger>
            <TabsTrigger value="guesthouses">Maisons d'hôtes</TabsTrigger>
            <TabsTrigger value="airports">Aéroports</TabsTrigger>
            <TabsTrigger value="predefined-trips">Voyages</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Activités</CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une activité
                </Button>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div>Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Visibilité</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.title}</TableCell>
                          <TableCell>{activity.location}</TableCell>
                          <TableCell>{activity.price || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {renderRatingStars(activity.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{activity.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {activity.show_in_travel && <Badge variant="outline" className="text-xs">Travel</Badge>}
                              {activity.show_in_start_my_trip && <Badge variant="outline" className="text-xs">Start Trip</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(activity)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(activity.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Hôtels</CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un hôtel
                </Button>
              </CardHeader>
              <CardContent>
                {hotelsLoading ? (
                  <div>Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Prix/nuit</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Petit-déjeuner</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotels.map((hotel) => (
                        <TableRow key={hotel.id}>
                          <TableCell className="font-medium">{hotel.name}</TableCell>
                          <TableCell>{hotel.location}</TableCell>
                          <TableCell>{hotel.price_per_night || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {renderRatingStars(hotel.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {hotel.breakfast ? (
                              <Badge variant="default">Inclus</Badge>
                            ) : (
                              <Badge variant="secondary">Non inclus</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(hotel)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(hotel.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guesthouses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Maisons d'hôtes</CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une maison d'hôte
                </Button>
              </CardHeader>
              <CardContent>
                {guestHousesLoading ? (
                  <div>Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Prix/nuit</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Petit-déjeuner</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestHouses.map((guestHouse) => (
                        <TableRow key={guestHouse.id}>
                          <TableCell className="font-medium">{guestHouse.name}</TableCell>
                          <TableCell>{guestHouse.location}</TableCell>
                          <TableCell>{guestHouse.price_per_night || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {renderRatingStars(guestHouse.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {guestHouse.breakfast ? (
                              <Badge variant="default">Inclus</Badge>
                            ) : (
                              <Badge variant="secondary">Non inclus</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(guestHouse)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(guestHouse.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="airports" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Aéroports</CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un aéroport
                </Button>
              </CardHeader>
              <CardContent>
                {airportsLoading ? (
                  <div>Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Région</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {airports.map((airport) => (
                        <TableRow key={airport.id}>
                          <TableCell className="font-medium">{airport.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{airport.code}</Badge>
                          </TableCell>
                          <TableCell>{airport.location}</TableCell>
                          <TableCell>{airport.region || "N/A"}</TableCell>
                          <TableCell>
                            {airport.is_active ? (
                              <Badge variant="default">Actif</Badge>
                            ) : (
                              <Badge variant="secondary">Inactif</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(airport)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(airport.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predefined-trips" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Voyages Pré-configurés</CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un voyage
                </Button>
              </CardHeader>
              <CardContent>
                {tripsLoading ? (
                  <div>Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Prix estimé</TableHead>
                        <TableHead>Difficulté</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predefinedTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              {trip.name}
                              {trip.is_featured && (
                                <Badge variant="outline" className="text-xs w-fit mt-1">
                                  Vedette
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{trip.duration_days} jours</TableCell>
                          <TableCell>{trip.price_estimate || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{trip.difficulty_level}</Badge>
                          </TableCell>
                          <TableCell>
                            {trip.is_active ? (
                              <Badge variant="default">Actif</Badge>
                            ) : (
                              <Badge variant="secondary">Inactif</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(trip)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(trip.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Modifier {currentTab === "activities" ? "l'activité" : 
                         currentTab === "hotels" ? "l'hôtel" : 
                         currentTab === "guesthouses" ? "la maison d'hôte" :
                         currentTab === "airports" ? "l'aéroport" : "le voyage"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingItem && (
                <>
                  {currentTab === "activities" && renderActivityFields(editingItem as Activity, true)}
                  {currentTab === "hotels" && renderHotelFields(editingItem as Hotel, true)}
                  {currentTab === "guesthouses" && renderGuestHouseFields(editingItem as GuestHouse, true)}
                  {currentTab === "airports" && renderAirportFields(editingItem as Airport, true)}
                  {currentTab === "predefined-trips" && renderPredefinedTripFields(editingItem as PredefinedTrip, true)}
                </>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveEdit}>
                Sauvegarder
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Ajouter {currentTab === "activities" ? "une activité" : 
                         currentTab === "hotels" ? "un hôtel" : 
                         currentTab === "guesthouses" ? "une maison d'hôte" :
                         currentTab === "airports" ? "un aéroport" : "un voyage"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {currentTab === "activities" && renderActivityFields(newItem as Activity)}
              {currentTab === "hotels" && renderHotelFields(newItem as Hotel)}
              {currentTab === "guesthouses" && renderGuestHouseFields(newItem as GuestHouse)}
              {currentTab === "airports" && renderAirportFields(newItem as Airport)}
              {currentTab === "predefined-trips" && renderPredefinedTripFields(newItem as PredefinedTrip)}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddNewItem}>
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera définitivement cet élément.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteItem}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTripPage;