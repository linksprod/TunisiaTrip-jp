import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Hotel {
  id?: string;
  name: string;
  location: string;
  price_per_night?: string;
  description?: string;
  image?: string;
  images?: string[];
  amenities?: string[];
  rating?: number;
  breakfast?: boolean;
  latitude?: number;
  longitude?: number;
}

export const useHotels = () => {
  const queryClient = useQueryClient();

  // Fetch all hotels
  const { data: hotels = [], isLoading, error } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Hotel[];
    },
  });

  // Create hotel
  const createHotel = useMutation({
    mutationFn: async (hotel: Omit<Hotel, 'id'>) => {
      const { data, error } = await supabase
        .from('hotels')
        .insert([hotel])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hôtel créé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de l\'hôtel');
      console.error('Create hotel error:', error);
    },
  });

  // Update hotel
  const updateHotel = useMutation({
    mutationFn: async ({ id, ...hotel }: Hotel) => {
      const { data, error } = await supabase
        .from('hotels')
        .update(hotel)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hôtel mis à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour de l\'hôtel');
      console.error('Update hotel error:', error);
    },
  });

  // Delete hotel
  const deleteHotel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hôtel supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de l\'hôtel');
      console.error('Delete hotel error:', error);
    },
  });

  return {
    hotels,
    isLoading,
    error,
    createHotel: createHotel.mutate,
    updateHotel: updateHotel.mutate,
    deleteHotel: deleteHotel.mutate,
    isCreating: createHotel.isPending,
    isUpdating: updateHotel.isPending,
    isDeleting: deleteHotel.isPending,
  };
};